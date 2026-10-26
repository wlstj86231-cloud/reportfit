// Operator facts, site footer, page meta block, sources/limits sections and JSON-LD nodes shared by every page.
// Operator facts were checked on boribay.com/about and jnewmedia.com on 2026-10-26. Do not add facts that are not there.

export const base = "https://www.reportools.com";
export const checkedDate = "2026-10-26";

export const operator = {
  name: "제이 미디어",
  ceo: "이정우",
  bizNo: "456-33-01705",
  address: "전북특별자치도 군산시 의료원로 80-8, 301호(지곡동)",
  phone: "010-2846-2011",
  email: "consultingjinjeong@gmail.com",
  kakaoGeneral: "https://open.kakao.com/o/scuvl1wi",
  kakaoBoribay: "https://open.kakao.com/o/p6HiJ9Pi",
  company: "https://jnewmedia.com/",
  companyInfo: "https://jnewmedia.com/company/",
};

export const orgId = "https://jnewmedia.com/#organization";
export const websiteId = `${base}/#website`;
export const orgRef = { "@id": orgId };

const organizationNode = {
  "@type": "Organization",
  "@id": orgId,
  name: "제이 미디어",
  alternateName: ["J MEDIA", "제이미디어", "제이 미디어(Media)"],
  url: "https://jnewmedia.com/",
  logo: { "@type": "ImageObject", url: "https://jnewmedia.com/assets/mark.svg" },
  address: { "@type": "PostalAddress", streetAddress: "의료원로 80-8, 301호(지곡동)", addressLocality: "군산시", addressRegion: "전북특별자치도", addressCountry: "KR" },
  telephone: "+82-10-2846-2011",
  email: operator.email,
  sameAs: ["https://www.instagram.com/boribaydotcom/", "https://blog.naver.com/plannerset", "https://jnewmedia.com/", "https://boribay.com/"],
};

const websiteNode = {
  "@type": "WebSite",
  "@id": websiteId,
  name: "농가 손익 계산기",
  url: `${base}/`,
  inLanguage: "ko-KR",
  publisher: orgRef,
};

// One <script> per page: Organization and WebSite are repeated so @id references resolve on every page.
export const jsonLd = (...nodes) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [organizationNode, websiteNode, ...nodes] }).replace(/</g, "\\u003c")}</script>`;

export const breadcrumbNode = (path, items) => ({
  "@type": "BreadcrumbList",
  "@id": `${base}${path}#breadcrumb`,
  itemListElement: items.map(([name, itemPath], index) => ({ "@type": "ListItem", position: index + 1, name, item: `${base}${itemPath}` })),
});

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const href = (url) => esc(/[^\x00-\x7f]/.test(url) ? encodeURI(url) : url);

// Visible byline and dates. published = first commit that published the page; checked = the day it was re-checked.
export const metaBlock = ({ published, checked = checkedDate, sources }) => `<div class="page-meta"><p>작성·관리: <a href="/editorial-policy/">제이 미디어 편집팀</a> (운영 책임: 대표 이정우)</p><p>게시일 <time datetime="${published}">${published}</time> · 최종 확인일 <time datetime="${checked}">${checked}</time>${sources === undefined ? "" : ` · <a href="#sources">출처 ${sources}건</a>`} · <a href="/corrections/">수정 기록</a></p></div>`;

// sources: [{ title, org, url, checked? }]
export const sourcesSection = (sources, note = "") => `<section id="sources" class="src"><h2>출처</h2>${sources.length ? `<ol class="src-list">${sources.map((s) => `<li><a href="${href(s.url)}">${esc(s.title)}</a><small>${esc(s.org)} · 확인일 <time>${s.checked ?? checkedDate}</time></small></li>`).join("")}</ol>` : ""}${note ? `<p class="src-note">${esc(note)}</p>` : ""}</section>`;

export const limitsSection = (items) => `<section id="limits" class="limits"><h2>범위와 한계</h2><ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>`;

export const siteFooter = `<footer class="site-footer"><div class="sf-wrap"><nav aria-label="사이트 정보"><a href="/about/">소개</a><a href="/contact/">문의</a><a href="/editorial-policy/">편집 원칙</a><a href="/corrections/">정정·수정 기록</a><a href="/privacy/">개인정보처리방침</a><a href="/terms/">이용약관</a></nav><p><strong>농가 손익 계산기</strong> · 보리장터와 같은 운영자가 만드는 무료 계산기</p><p>제이 미디어 · 대표 이정우 · 사업자등록번호 <span class="nw">456-33-01705</span> · 고객센터 <a class="nw" href="tel:010-2846-2011">010-2846-2011</a></p><p>계산 결과는 판단을 돕는 추정치이며 세무·법률·금융 자문이 아닙니다.</p></div></footer>`;

// Self-contained colours so it works under each page's own stylesheet.
export const sharedCss = `.site-footer{border-top:1px solid #d5ddd8;background:#fff;margin-top:32px;padding:20px 16px 28px;color:#464e49;font-size:16px;line-height:1.6}.site-footer .sf-wrap{max-width:1040px;margin:0 auto}.site-footer nav{display:flex;flex-wrap:wrap;gap:0 16px;margin:0 0 6px}.site-footer nav a{display:inline-flex;align-items:center;min-height:44px;color:#1d6b42;font-weight:700;text-decoration:underline;text-underline-offset:3px}.site-footer p{margin:4px 0}.site-footer p a{color:#1d6b42;text-decoration:underline;text-underline-offset:3px}.page-meta{margin:16px 0;padding:12px 14px;border:1px solid #d5ddd8;border-radius:10px;background:#f7faf8;color:#464e49;font-size:16px;line-height:1.6}.page-meta p{margin:2px 0}.page-meta a{color:#1d6b42;text-decoration:underline;text-underline-offset:3px}.src-list{padding-left:22px}.src-list li{margin:10px 0}.src-list a{color:#1d6b42;text-decoration:underline;text-underline-offset:3px}.src-list small{display:block;color:#4d5751;font-size:16px}.src-note{color:#464e49}.limits li{margin:8px 0}.page-meta time,.src-list time,.site-footer .nw{white-space:nowrap}`;
