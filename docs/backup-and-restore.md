# Al Safwa Trading — encrypted database backups

## Current backup status

The Supabase project is on the Free plan. Supabase does not provide scheduled automatic database backups for Free projects, so this repository includes a separate GitHub Actions workflow for an encrypted logical backup.

**The workflow is not active until its two repository settings are supplied.** When either setting is missing, a scheduled run reports that no backup was made and skips the dump and upload.

## One-time owner setup

### 1. Create an age encryption identity

On a trusted computer, install the age tools and generate an identity:

```bash
age-keygen -o al-safwa-backup-identity.txt
age-keygen -y al-safwa-backup-identity.txt
```

The first command creates a private identity file. Keep that file offline in a secure password manager or encrypted storage and keep a second secure copy. Never commit it to this public repository and never put it in a public GitHub Actions artifact.

The second command prints the matching public recipient (it starts with `age1`). The recipient is safe to publish as a repository variable; the private identity is required to decrypt backups.

### 2. Add GitHub Actions settings

In the GitHub repository, open **Settings → Secrets and variables → Actions**.

Create:

| Type | Name | Value |
|---|---|---|
| Repository secret | `SUPABASE_DB_URL` | The PostgreSQL **Session Pooler** connection URI from Supabase Dashboard → Connect. Use port 5432 (session mode) and include `sslmode=require`. |
| Repository variable | `BACKUP_AGE_RECIPIENT` | The public `age1...` recipient from step 1. |

Use the Session Pooler URI because GitHub-hosted runners are IPv4-only; Supabase's direct database host may require IPv6 on projects without the IPv4 add-on. Never paste the connection URI into source files, workflow logs, chat, or a public issue.

### 3. Run a manual backup

Open **Actions → Encrypted Supabase database backup → Run workflow**. A configured run exports custom roles, the non-managed schema and table data, encrypts the archive with the public age recipient, then uploads **only the encrypted file and its SHA-256 checksum**. Artifacts are retained for 30 days.

The workflow also runs daily at 01:17 UTC. GitHub Actions run history and artifact retention should be checked regularly; do not treat a skipped run as a backup.

## What is and is not included

The archive contains three Supabase CLI dumps:

- `roles.sql` — custom database roles.
- `schema.sql` — the project schema, functions, policies, triggers and other non-managed schema objects.
- `data.sql` — table data from the non-managed schemas.

Supabase CLI intentionally excludes Supabase-managed schemas, including **Auth (`auth`)**, **Storage (`storage`)** and extension-managed schemas. Consequently, this workflow does **not** back up Auth user records or Storage API object files. It is a database application-schema/data backup, not a complete project image. Keep separate secure exports of required Storage objects and a documented Auth recovery plan. Supabase database backups also do not include Storage object files.

The repository is public. The workflow never commits dump files or uploads plaintext dumps. If encryption fails, the job fails before uploading an artifact.

## Decrypt and inspect a backup

Download the encrypted artifact from the successful GitHub Actions run to a trusted machine. Keep the downloaded archive private.

```bash
sha256sum -c al-safwa-db-backup-<RUN_ID>.tar.gz.age.sha256
age -d -i al-safwa-backup-identity.txt -o al-safwa-db-backup.tar.gz al-safwa-db-backup-<RUN_ID>.tar.gz.age
mkdir al-safwa-restore-review
tar -xzf al-safwa-db-backup.tar.gz -C al-safwa-restore-review
```

The checksum filename in the downloaded artifact matches the encrypted archive filename with `.sha256` appended. Review the SQL files before restoring.

## Restore precautions

Do not restore into the live production database as an experiment. First create a separate Supabase project, confirm its PostgreSQL version and required extensions, and rehearse restoration there. Review `roles.sql`, `schema.sql` and `data.sql` before running them. Restoring roles and grants into an existing project can conflict with roles and privileges managed by Supabase; restoration of schemas, extensions and grants may require project-specific adjustments.

After restoring, separately recover Auth users and Storage buckets/objects using the appropriate supported export/import process, and verify RLS policies, Storage access, Edge Functions, secrets, Auth providers, redirects and application sign-in before changing DNS or production traffic.

## Recommended improvement

For a business-critical production database, upgrade the Supabase project to a plan with managed daily backups and verify the retention period in the dashboard. Keep an independent encrypted off-site export as a second recovery path. A backup is not proven until a restore test has succeeded.
