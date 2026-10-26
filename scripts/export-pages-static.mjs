import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { adsTxt, googleVerification, googleVerificationPath, indexNowKey, notFoundHtml, pages, redirects, robots, sitemap, subPages } from "./site-files.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "dist", "pages");

await mkdir(out, { recursive: true });
for (const [pagePath, body] of Object.entries(pages)) {
  const file = pagePath === "/" ? join(out, "index.html") : join(out, pagePath.replace(/\/$/, ""), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, body, "utf8");
}

await writeFile(join(out, "sitemap.xml"), sitemap, "utf8");
await writeFile(join(out, "robots.txt"), robots, "utf8");
await writeFile(join(out, "404.html"), notFoundHtml, "utf8");
await writeFile(join(out, googleVerificationPath.slice(1)), googleVerification, "utf8");
await writeFile(join(out, `${indexNowKey}.txt`), indexNowKey, "utf8");
await writeFile(join(out, "ads.txt"), adsTxt, "utf8");
await writeFile(join(out, "_redirects"), `${redirects}\n`, "utf8");

const publicRoot = join(root, "public");
for (const [pagePath, body] of Object.entries(subPages)) {
  const file = join(publicRoot, pagePath.replace(/\/$/, ""), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, body, "utf8");
}
await writeFile(join(publicRoot, "_redirects"), `${redirects}\n`, "utf8");
console.log(`exported ${Object.keys(pages).length} pages to dist/pages and public`);
