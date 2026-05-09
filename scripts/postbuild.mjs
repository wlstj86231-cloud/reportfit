import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const index = await readFile(path.join(dist, "index.html"), "utf8");
const tools = [
  "pdf-compress",
  "pdf-edit",
  "image-convert",
  "image-compress",
  "file-name",
  "word-count",
  "citation-cleaner",
  "file-check",
  "zip-pack",
  "privacy-clean"
];
const pages = ["about", "privacy", "terms", "contact"];

await writeFile(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: https://reportfit.com/sitemap.xml\n", "utf8");
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["", ...tools.map((tool) => `tools/${tool}/`), ...pages.map((page) => `${page}/`)]
    .map((loc) => `  <url><loc>https://reportfit.com/${loc}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
  "utf8"
);

for (const tool of tools) {
  const dir = path.join(dist, "tools", tool);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), index, "utf8");
}

for (const page of pages) {
  const dir = path.join(dist, page);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), index, "utf8");
}
