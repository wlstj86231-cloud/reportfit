import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { adsTxt, googleVerification, googleVerificationPath, indexNowKey, notFoundHtml, pages, robots, sitemap } from "./site-files.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

// The apex Worker serves exactly the same pages and root files as the www Pages build.
const worker = `const PAGES=${JSON.stringify(pages)};
const SITEMAP=${JSON.stringify(sitemap)};
const ROBOTS=${JSON.stringify(robots)};
const GOOGLE_VERIFICATION=${JSON.stringify(googleVerification)};
const INDEX_NOW_KEY=${JSON.stringify(indexNowKey)};
const ADS_TXT=${JSON.stringify(adsTxt)};
const NOT_FOUND=${JSON.stringify(notFoundHtml)};
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
    if(request.method!=="GET"&&request.method!=="HEAD") return response("Method Not Allowed",405,{allow:"GET, HEAD","content-type":"text/plain; charset=utf-8"});
    const head=request.method==="HEAD";
    const pagePath=url.pathname==="/index.html"?"/":url.pathname;
    if(PAGES[pagePath]) return response(head?null:PAGES[pagePath]);
    if(!pagePath.endsWith("/")&&PAGES[pagePath+"/"]) return Response.redirect(url.origin+pagePath+"/",308);
    if(url.pathname==="/sitemap.xml") return response(head?null:SITEMAP,200,{"content-type":"application/xml; charset=utf-8","cache-control":"public, max-age=3600"});
    if(url.pathname==="/robots.txt") return response(head?null:ROBOTS,200,{"content-type":"text/plain; charset=utf-8","cache-control":"public, max-age=3600"});
    if(url.pathname==="/ads.txt") return response(head?null:ADS_TXT,200,{"content-type":"text/plain; charset=utf-8","cache-control":"public, max-age=3600"});
    if(url.pathname===${JSON.stringify(googleVerificationPath)}) return response(head?null:GOOGLE_VERIFICATION,200,{"content-type":"text/html; charset=utf-8","cache-control":"public, max-age=3600"});
    if(url.pathname==="/${indexNowKey}.txt") return response(head?null:INDEX_NOW_KEY,200,{"content-type":"text/plain; charset=utf-8","cache-control":"public, max-age=3600"});
    if(url.pathname==="/favicon.ico") return new Response(null,{status:204,headers:{"cache-control":"public, max-age=86400"}});
    return response(head?null:NOT_FOUND,404);
  }
};
`;

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "server"), { recursive: true });
await writeFile(join(dist, "server", "index.js"), worker, "utf8");
console.log(`Built dist/server/index.js with ${Object.keys(pages).length} pages`);
