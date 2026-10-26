// Shared page and root-file definitions for both hosts:
// www (Cloudflare Pages, scripts/export-pages-static.mjs) and the apex Worker (scripts/build-sites-static.mjs).
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { guideLastModified, guidePages, guideUrls } from "../static-report/guides.mjs";
import { mnPages, mnUrls } from "../static-report/mn.mjs";
import { tractorCostLastModified, tractorCostPages, tractorCostUrls } from "../static-report/tractor-cost.mjs";
import { infoLastModified, infoPages, infoUrls } from "../static-report/info-pages.mjs";
import { faviconLink } from "../static-report/favicon.mjs";
import { checkedDate, jsonLd, metaBlock, orgRef, sharedCss, siteFooter } from "../static-report/site-shared.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const origin = "https://www.reportools.com";
const homeLastModified = checkedDate;

// The home calculator source keeps placeholders for the parts every page shares.
const homeSchema = jsonLd({
  "@type": "WebApplication",
  "@id": `${origin}/#app`,
  name: "농가 손익 계산기",
  url: `${origin}/`,
  description: "직거래·도매시장 위탁·온라인 몰 판매의 예상 이익, 상자당·kg당 이익과 손익분기 판매가를 계산식과 함께 비교하는 무료 계산기",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  inLanguage: "ko-KR",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  isPartOf: { "@id": `${origin}/#website` },
  datePublished: "2026-08-10",
  dateModified: checkedDate,
  author: orgRef,
  publisher: orgRef,
});
const fill = (html, parts) => Object.entries(parts).reduce((out, [marker, value]) => {
  if (!out.includes(marker)) throw new Error(`home placeholder missing: ${marker}`);
  return out.replace(marker, () => value);
}, html);
export const homeHtml = fill(await readFile(join(root, "static-report", "index.html"), "utf8"), {
  "<!--SITE_JSONLD-->": homeSchema,
  "/*SHARED_CSS*/": sharedCss,
  "<!--PAGE_META-->": metaBlock({ published: "2026-08-10", sources: 3 }),
  "<!--SITE_FOOTER-->": siteFooter,
});
export const subPages = { ...guidePages, ...mnPages, ...tractorCostPages, ...infoPages };
export const pages = { "/": homeHtml, ...subPages };

const entry = (url, lastmod, priority) => `  <url><loc>${origin}${url}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
// /mn/ pages stay reachable but are noindex and left out: Mongolian is not an AdSense-supported language.
export const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
  entry("/", homeLastModified, "1.0"),
  ...guideUrls.map((url) => entry(url, guideLastModified[url], "0.8")),
  ...tractorCostUrls.map((url) => entry(url, tractorCostLastModified[url], "0.8")),
  ...infoUrls.map((url) => entry(url, infoLastModified[url], "0.4")),
].join("\n")}
</urlset>
`;

export const robots = `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n#DaumWebMasterTool:679af16e02c5553f59a120b34a05827cd82a939140179f13bcb93a519d9d0968:dSlZXvWuL7UAVoESNn1QCg==\n`;
export const adsTxt = "google.com, pub-5877883031077615, DIRECT, f08c47fec0942fa0\n";
export const googleVerificationPath = "/googleb6f1a59bf29a174e.html";
export const googleVerification = "google-site-verification: googleb6f1a59bf29a174e.html\n";
export const indexNowKey = "6d048fe0c10f47789f9b3a98ae4978ee";

// A real 404 page keeps unknown routes from returning the home page with HTTP 200.
export const notFoundHtml = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>페이지를 찾을 수 없습니다 | 농가 손익 계산기</title>${faviconLink}<style>body{margin:0;min-height:100vh;display:flex;flex-direction:column;background:#f7faf6;color:#183128;font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:17px}main{max-width:38rem;padding:2rem 1rem;margin:auto}h1{font-size:2rem}p{line-height:1.7}main a{color:#176144;font-weight:700;display:inline-block;min-height:44px;padding:8px 0}${sharedCss}</style></head><body><main><h1>페이지를 찾을 수 없습니다</h1><p>주소를 다시 확인하거나 아래에서 필요한 계산기와 안내를 찾아보세요.</p><p><a href="/">판매 손익 계산기</a> · <a href="/guides/">정산 가이드</a> · <a href="/tools/used-tractor-total-cost/">트랙터 총비용</a> · <a href="/about/">소개</a></p></main>${siteFooter}</body></html>`;

export const redirects = [
  "/guides /guides/ 308",
  "/mn /mn/ 308",
  ...guideUrls.filter((url) => url !== "/guides/").map((url) => `${url.replace(/\/$/, "")} ${url} 308`),
  ...mnUrls.filter((url) => url !== "/mn/").map((url) => `${url.replace(/\/$/, "")} ${url} 308`),
  ...tractorCostUrls.map((url) => `${url.replace(/\/$/, "")} ${url} 308`),
  ...infoUrls.map((url) => `${url.replace(/\/$/, "")} ${url} 308`),
].join("\n");
