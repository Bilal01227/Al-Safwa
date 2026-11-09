import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const rootHtml = await readFile(path.join(dist, "index.html"), "utf8");

function setMeta(html, selector, attributes, content) {
  const escaped = content.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const existing = html.match(selector);
  if (existing) return html.replace(selector, '<meta ' + attributes + ' content="' + escaped + '" />');
  return html.replace("</head>", '  <meta ' + attributes + ' content="' + escaped + '" />\n</head>');
}

function errorShell(title, description) {
  let html = rootHtml.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + title + '</title>');
  html = setMeta(html, /<meta[^>]*name="robots"[^>]*>/i, 'name="robots"', "noindex,nofollow");
  html = setMeta(html, /<meta[^>]*name="description"[^>]*>/i, 'name="description"', description);
  html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/i, "");
  html = html.replace(/<meta[^>]*property="og:url"[^>]*>\s*/i, "");
  return html;
}

await writeFile(path.join(dist, "404.html"), errorShell(
  "Page Not Found — Al Safwa Trading",
  "The requested page could not be found. Browse Al Safwa Trading's products, brands and services in Oman."
), "utf8");

const forbidden = errorShell(
  "Access Restricted — Al Safwa Trading",
  "You do not have permission to access this resource. Contact Al Safwa Trading if you believe this is an error."
);
const forbiddenDocument = \`<!doctype html>
<html lang="en-OM">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>403 Access Restricted — Al Safwa Trading</title>
  <meta name="robots" content="noindex,nofollow" />
  <meta name="description" content="You do not have permission to access this resource. Contact Al Safwa Trading if you believe this is an error." />
  <style>
    :root { color-scheme: light; font-family: Arial, Helvetica, sans-serif; background: #f5f3ee; color: #17191d; }
    * { box-sizing: border-box; }
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 32px 20px; }
    main { width: min(100%, 720px); text-align: center; border: 1px solid rgba(23,25,29,.16); background: #fff; padding: clamp(32px, 7vw, 72px); }
    .brand { font-size: 12px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; color: #e8491a; }
    h1 { margin: 28px 0 8px; font-size: clamp(76px, 17vw, 148px); line-height: .9; letter-spacing: -.06em; }
    h2 { margin: 20px 0 12px; font-size: clamp(22px, 4vw, 32px); text-transform: uppercase; }
    p { color: #62666d; line-height: 1.7; }
    nav { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    a { display: inline-block; padding: 13px 18px; background: #17191d; color: #fff; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    a.secondary { background: #e8491a; }
  </style>
</head>
<body>
  <main>
    <div class="brand">Al Safwa Trading · Oman</div>
    <h1>403</h1>
    <h2>Access restricted</h2>
    <p>You do not have permission to access this resource. If you believe this is an error, contact our team for assistance.</p>
    <nav>
      <a href="/">Return to home</a>
      <a class="secondary" href="/contact/">Contact us</a>
    </nav>
  </main>
</body>
</html>\`;
await writeFile(path.join(dist, "403.html"), forbiddenDocument, "utf8");
await mkdir(path.join(dist, "403"), { recursive: true });
await writeFile(path.join(dist, "403", "index.html"), forbidden, "utf8");

console.log("Prepared noindex 403 and 404 error documents without homepage canonicals.");
