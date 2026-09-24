import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { guideLastModified, guidePages, guideUrls } from "../static-report/guides.mjs";
import { mnLastModified, mnPages, mnUrls } from "../static-report/mn.mjs";
import { tractorCostLastModified, tractorCostPages, tractorCostUrls } from "../static-report/tractor-cost.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "dist", "pages");
const html = await readFile(join(root, "static-report", "index.html"), "utf8");
const pages = { "/": html, ...guidePages, ...mnPages, ...tractorCostPages };

await mkdir(out, { recursive: true });
for (const [pagePath, body] of Object.entries(pages)) {
  const file = pagePath === "/" ? join(out, "index.html") : join(out, pagePath.replace(/\/$/, ""), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, body, "utf8");
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.reportools.com/</loc><lastmod>2026-08-10</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
${guideUrls.map((url) => `  <url><loc>https://www.reportools.com${url}</loc><lastmod>${guideLastModified[url]}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`).join("\n")}
${mnUrls.map((url) => `  <url><loc>https://www.reportools.com${url}</loc><lastmod>${mnLastModified[url]}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join("\n")}
${tractorCostUrls.map((url) => `  <url><loc>https://www.reportools.com${url}</loc><lastmod>${tractorCostLastModified[url]}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`).join("\n")}
</urlset>
`;
await writeFile(join(out, "sitemap.xml"), sitemap, "utf8");
await writeFile(join(out, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://www.reportools.com/sitemap.xml\n", "utf8");
await writeFile(join(out, "googleb6f1a59bf29a174e.html"), "google-site-verification: googleb6f1a59bf29a174e.html\n", "utf8");
await writeFile(join(out, "6d048fe0c10f47789f9b3a98ae4978ee.txt"), "6d048fe0c10f47789f9b3a98ae4978ee", "utf8");
const redirects = [
  "/guides /guides/ 308",
  "/mn /mn/ 308",
  ...guideUrls
    .filter((url) => url !== "/guides/")
    .map((url) => `${url.replace(/\/$/, "")} ${url} 308`),
  ...mnUrls.filter((url) => url !== "/mn/").map((url) => `${url.replace(/\/$/, "")} ${url} 308`),
  ...tractorCostUrls.map((url) => `${url.replace(/\/$/, "")} ${url} 308`),
].join("\n");
await writeFile(join(out, "_redirects"), `${redirects}\n`, "utf8");

const publicRoot = join(root, "public");
for (const [pagePath, body] of Object.entries({ ...guidePages, ...mnPages, ...tractorCostPages })) {
  const file = join(publicRoot, pagePath.replace(/\/$/, ""), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, body, "utf8");
}
await writeFile(join(publicRoot, "_redirects"), `${redirects}\n`, "utf8");
console.log(`exported ${Object.keys(pages).length} pages to dist/pages and public`);
