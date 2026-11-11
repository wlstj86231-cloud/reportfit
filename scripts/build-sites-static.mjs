import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { adsTxt, googleVerification, googleVerificationPath, indexNowKey, movedPaths, notFoundHtml, origin, pages, retiredPaths, robots, sitemap } from "./site-files.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

// Every page lives on the www host. The apex Worker forwards page requests there
// (http and https alike) so each page has one address, and still answers the root
// files that crawlers and verification services read on the apex itself.
const worker = `const WWW=${JSON.stringify(origin)};
const PAGE_PATHS=new Set(${JSON.stringify(Object.keys(pages))});
const MOVED=${JSON.stringify(movedPaths)};
const RETIRED=new Set(${JSON.stringify(retiredPaths)});
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
    if(url.pathname==="/index.html") return Response.redirect(WWW+"/"+url.search,301);
    const pagePath=url.pathname;
    if(PAGE_PATHS.has(pagePath)) return Response.redirect(WWW+pagePath+url.search,301);
    if(!pagePath.endsWith("/")&&PAGE_PATHS.has(pagePath+"/")) return Response.redirect(WWW+pagePath+"/"+url.search,301);
    const slashPath=pagePath.endsWith("/")?pagePath:pagePath+"/";
    if(MOVED[slashPath]) return Response.redirect(WWW+MOVED[slashPath],301);
    if(RETIRED.has(slashPath)) return response(head?null:NOT_FOUND,410);
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
