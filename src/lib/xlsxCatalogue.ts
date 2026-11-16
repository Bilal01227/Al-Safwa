import { strFromU8, unzipSync } from "fflate";

export type ExcelCatalogueRow = {
  sheet: string;
  excelRow: number;
  values: Record<string, string>;
  image?: File;
  imageCount: number;
};

const relNs = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const imagePattern = /\.(png|jpe?g|gif|webp|bmp|tiff?)$/i;
const xml = (text: string) => new DOMParser().parseFromString(text, "application/xml");
const all = (node: ParentNode, name: string) =>
  Array.from(node.querySelectorAll("*")).filter((x) => x.localName === name);
const first = (node: ParentNode, name: string) => all(node, name)[0] || null;
const attr = (node: Element | null, name: string) => node?.getAttribute(name) || "";
const textContent = (node: Element | null) => node?.textContent || "";

function normalizePath(path: string) {
  const parts: string[] = [];
  for (const part of path.replace(/\\/g, "/").split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.join("/");
}
function resolveTarget(sourceFile: string, target: string) {
  return normalizePath(target.startsWith("/") ? target.slice(1) : sourceFile.split("/").slice(0, -1).concat(target).join("/"));
}
function relsPath(sourceFile: string) {
  const parts = sourceFile.split("/");
  const name = parts.pop() || "";
  return [...parts, "_rels", name + ".rels"].join("/");
}
function relationships(entries: Record<string, Uint8Array>, sourceFile: string) {
  const bytes = entries[relsPath(sourceFile)];
  if (!bytes) return new Map<string, string>();
  const doc = xml(strFromU8(bytes));
  return new Map<string, string>(all(doc, "Relationship").map((r) => [
    attr(r, "Id"),
    resolveTarget(sourceFile, attr(r, "Target")),
  ] as [string, string]));
}
function colIndex(reference: string) {
  const letters = reference.match(/^[A-Z]+/i)?.[0]?.toUpperCase() || "A";
  let value = 0;
  for (const char of letters) value = value * 26 + char.charCodeAt(0) - 64;
  return value - 1;
}
function mime(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  return ext === "png" ? "image/png" : ext === "gif" ? "image/gif" :
    ext === "webp" ? "image/webp" : ext === "bmp" ? "image/bmp" :
    ext === "tif" || ext === "tiff" ? "image/tiff" : "image/jpeg";
}
function sharedStrings(entries: Record<string, Uint8Array>) {
  const bytes = entries["xl/sharedStrings.xml"];
  if (!bytes) return [];
  const doc = xml(strFromU8(bytes));
  return all(doc, "si").map((si) => all(si, "t").map((t) => textContent(t)).join(""));
}
function cellValue(cell: Element, strings: string[]) {
  const type = attr(cell, "t");
  if (type === "inlineStr") return all(cell, "t").map((t) => textContent(t)).join("");
  const value = textContent(first(cell, "v"));
  return type === "s" ? (strings[Number(value)] || "") : value;
}

export async function parseExcelCatalogue(file: File): Promise<ExcelCatalogueRow[]> {
  const entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
  const workbookBytes = entries["xl/workbook.xml"];
  if (!workbookBytes) throw new Error("This file is not a readable .xlsx workbook.");
  const workbook = xml(strFromU8(workbookBytes));
  const workbookRels = relationships(entries, "xl/workbook.xml");
  const strings = sharedStrings(entries);
  const sheetNodes = all(workbook, "sheet");
  if (!sheetNodes.length) throw new Error("No worksheets were found in this workbook.");

  const output: ExcelCatalogueRow[] = [];
  for (const sheetNode of sheetNodes) {
    const sheetName = attr(sheetNode, "name") || "Sheet";
    const rid = sheetNode.getAttributeNS(relNs, "id") || attr(sheetNode, "r:id");
    const sheetPath = workbookRels.get(rid);
    if (!sheetPath || !entries[sheetPath]) continue;
    const sheetDoc = xml(strFromU8(entries[sheetPath]));
    const rowNodes = all(sheetDoc, "row");
    const parsedRows = rowNodes.map((row) => {
      const cells = all(row, "c");
      const values: string[] = [];
      for (const cell of cells) values[colIndex(attr(cell, "r"))] = cellValue(cell, strings);
      return { number: Number(attr(row, "r")) || 0, values };
    });
    const headerScore = (values: string[]) => {
      const h = values.map((v) => String(v || "").toLowerCase().replace(/[^a-z0-9]+/g, "_"));
      const hasName = h.some((v) => ["name", "product_name", "item_name", "equipment_name"].includes(v));
      const hasBrand = h.some((v) => ["brand", "brand_name", "manufacturer", "make"].includes(v));
      const hasCategory = h.some((v) => ["category", "category_name", "product_category"].includes(v));
      return Number(hasName) + Number(hasBrand) + Number(hasCategory);
    };
    const headerRow = parsedRows.find((r) => headerScore(r.values) === 3)
      || parsedRows.find((r) => r.values.filter((v) => String(v || "").trim()).length >= 3);
    if (!headerRow) continue;
    const headers = headerRow.values.map((v) => String(v || "").trim());
    const imageByRow = new Map<number, File[]>();

    const drawingNode = first(sheetDoc, "drawing");
    const drawingRid = drawingNode?.getAttributeNS(relNs, "id") || attr(drawingNode, "r:id");
    const sheetRels = relationships(entries, sheetPath);
    const drawingPath = sheetRels.get(drawingRid);
    if (drawingPath && entries[drawingPath]) {
      const drawingDoc = xml(strFromU8(entries[drawingPath]));
      const drawingRels = relationships(entries, drawingPath);
      for (const anchor of all(drawingDoc, "oneCellAnchor").concat(all(drawingDoc, "twoCellAnchor"))) {
        const from = first(anchor, "from");
        const rowNumber = Number(textContent(first(from || anchor, "row"))) + 1;
        const blip = first(anchor, "blip");
        const imageRid = blip?.getAttributeNS(relNs, "embed") || attr(blip, "r:embed");
        const imagePath = drawingRels.get(imageRid);
        if (!rowNumber || !imagePath || !entries[imagePath]) continue;
        const filename = imagePath.split("/").pop() || "embedded-image";
        if (!imagePattern.test(filename)) continue;
        const image = new File([entries[imagePath]], filename, { type: mime(filename) });
        imageByRow.set(rowNumber, [...(imageByRow.get(rowNumber) || []), image]);
      }
    }

    for (const row of parsedRows) {
      if (row.number <= headerRow.number) continue;
      const values: Record<string, string> = {};
      headers.forEach((header, index) => {
        if (header) values[header] = String(row.values[index] ?? "").trim();
      });
      if (!Object.values(values).some(Boolean)) continue;
      const images = imageByRow.get(row.number) || [];
      output.push({ sheet: sheetName, excelRow: row.number, values, image: images[0], imageCount: images.length });
    }
  }
  if (!output.length) throw new Error("No product rows were detected. Make sure the workbook has a header row and product data below it.");
  return output;
}
