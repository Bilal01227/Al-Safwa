/**
 * Submission adapter.
 * MVP: records are stored in browser localStorage and never leave the device.
 * Supabase phase: replace the body of saveSubmission() with
 *   await supabase.from("submissions").insert({ type, payload }).select().single()
 * — the forms do not need to change.
 *
 * SECURITY: never expose other customers' records; no list endpoints in MVP.
 */

export type SubmissionType = "quote" | "rental" | "repair";

export interface SubmissionRecord {
  id: string;
  type: SubmissionType;
  payload: Record<string, string>;
  createdAt: string;
}

const STORE_KEY = "al_safwa_trading_submissions_v1";

const prefix: Record<SubmissionType, string> = {
  quote: "Q",
  rental: "RT",
  repair: "R",
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function saveSubmission(
  type: SubmissionType,
  payload: Record<string, string>,
): Promise<SubmissionRecord> {
  await delay(450); // simulated network latency
  const record: SubmissionRecord = {
    id: `AST-${prefix[type]}-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    type,
    payload,
    createdAt: new Date().toISOString(),
  };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const list: SubmissionRecord[] = raw ? JSON.parse(raw) : [];
    list.push(record);
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable — record still returned so the UI can confirm receipt
  }
  return record;
}
