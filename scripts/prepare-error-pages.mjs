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
await writeFile(path.join(dist, "403.html"), forbidden, "utf8");
await mkdir(path.join(dist, "403"), { recursive: true });
await writeFile(path.join(dist, "403", "index.html"), forbidden, "utf8");

console.log("Prepared noindex 403 and 404 error documents without homepage canonicals.");
