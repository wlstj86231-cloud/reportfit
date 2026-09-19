import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { guidePages, guideUrls, guideLastModified } from "../static-report/guides.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const html = await readFile(join(root, "static-report", "index.html"), "utf8");
const pages = { "/": html, ...guidePages };
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.reportools.com/</loc><lastmod>2026-08-10</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
${guideUrls.map((url) => `  <url><loc>https://www.reportools.com${url}</loc><lastmod>${guideLastModified[url]}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`).join("\n")}
</urlset>`;
const robots = `User-agent: *
Allow: /
Sitemap: https://www.reportools.com/sitemap.xml
`;
const googleVerification = "google-site-verification: googleb6f1a59bf29a174e.html\n";
const indexNowKey = "6d048fe0c10f47789f9b3a98ae4978ee";

const worker = `const PAGES=${JSON.stringify(pages)};
const SITEMAP=${JSON.stringify(sitemap)};
const ROBOTS=${JSON.stringify(robots)};
const GOOGLE_VERIFICATION=${JSON.stringify(googleVerification)};
const INDEX_NOW_KEY=${JSON.stringify(indexNowKey)};
const headers={
  "content-type":"text/html; charset=utf-8",
  "cache-control":"public, max-age=300",
  "x-content-type-options":"nosniff",
  "referrer-policy":"strict-origin-when-cross-origin",
  "x-frame-options":"SAMEORIGIN"
};
function response(body,status=200,extra={}){
  return new Response(body,{status,headers:{...headers,...extra}});
}
export default {
  async fetch(request){
    const url=new URL(request.url);
    if(request.method!=="GET"&&request.method!=="HEAD") return response("Method Not Allowed",405,{allow:"GET, HEAD"});
    const pagePath=url.pathname==="/index.html"?"/":url.pathname;
    if(PAGES[pagePath]) return response(request.method==="HEAD"?null:PAGES[pagePath]);
    if(!pagePath.endsWith("/")&&PAGES[pagePath+"/"]) return Response.redirect(url.origin+pagePath+"/",308);
    if(url.pathname==="/sitemap.xml") return response(request.method==="HEAD"?null:SITEMAP,200,{"content-type":"application/xml; charset=utf-8","cache-control":"public, max-age=3600"});
    if(url.pathname==="/robots.txt") return response(request.method==="HEAD"?null:ROBOTS,200,{"content-type":"text/plain; charset=utf-8","cache-control":"public, max-age=3600"});
    if(url.pathname==="/googleb6f1a59bf29a174e.html") return response(request.method==="HEAD"?null:GOOGLE_VERIFICATION,200,{"content-type":"text/html; charset=utf-8","cache-control":"public, max-age=3600"});
    if(url.pathname==="/${indexNowKey}.txt") return response(request.method==="HEAD"?null:INDEX_NOW_KEY,200,{"content-type":"text/plain; charset=utf-8","cache-control":"public, max-age=3600"});
    if(url.pathname==="/favicon.ico") return new Response(null,{status:204,headers:{"cache-control":"public, max-age=86400"}});
    return response("Not Found",404,{"content-type":"text/plain; charset=utf-8"});
  }
};
`;

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "server"), { recursive: true });
await writeFile(join(dist, "server", "index.js"), worker, "utf8");
console.log("Built dist/server/index.js");
