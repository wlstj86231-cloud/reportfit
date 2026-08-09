const base = "https://reportools.com";
const date = "2026-08-10";
const guides = [
  {
    slug: "kg-price-margin",
    title: "농산물 kg당 판매가와 마진 계산법",
    description: "상자 가격을 kg당 가격으로 바꾸고 감모·포장·배송·결제수수료를 포함한 실제 마진을 계산하는 순서입니다.",
    lead: "상자 판매가만 보면 규격이 다른 상품을 비교하기 어렵습니다. 먼저 내용물 실중량 기준 kg당 가격을 만든 뒤 판매 가능한 수량과 모든 비용을 반영하세요.",
    formula: ["kg당 판매가 = 배송 포함 결제금액 ÷ 내용물 실중량", "예상 매출 = 판매가 × 예정 수량 × (1 - 감모율)", "예상 이익 = 예상 매출 - 생산·선별·포장·배송·수수료"],
    checks: ["포장재를 뺀 내용물 실중량인지", "무료배송 비용이 판매가에 포함됐는지", "파손·반품·자가노동비가 빠지지 않았는지"],
    links: [["농산물 판매가 계산기 안내", "produce-price-calculator"], ["직거래 가격·포장 원리", "produce-direct-sale-pricing-packaging"]],
  },
  {
    slug: "auction-net-proceeds",
    title: "농산물 경매 정산 실수령액 계산법",
    description: "낙찰금액에서 수수료, 운송·하역·선별·포장과 감모 비용을 분리해 실제 정산액을 계산하는 방법입니다.",
    lead: "경매 낙찰금액은 곧바로 농가 실수령액이 아닙니다. 출하 전 비용과 정산서에서 공제되는 항목을 한 표에 모아야 직거래와 같은 기준으로 비교할 수 있습니다.",
    formula: ["총낙찰액 = 낙찰단가 × 정산 수량", "정산 공제 = 위탁수수료 + 운송·하역 + 선별·포장 + 기타 공제", "예상 실수령액 = 총낙찰액 - 정산 공제"],
    checks: ["단가 단위가 kg·상자·망 중 무엇인지", "등급별 수량과 유찰·감모 물량이 분리됐는지", "운송·하역 비용이 별도 청구되는지"],
    links: [["경매 실수령액 계산기 안내", "agricultural-auction-net-calculator"], ["농산물 도매시장 거래 구조", "agricultural-wholesale-market-guide"]],
  },
  {
    slug: "consignment-settlement",
    title: "농산물 위탁판매 정산서 읽는 법",
    description: "위탁판매의 총판매액, 수수료, 포장·배송·반품·폐기 공제와 정산일을 계약 전후로 맞추는 확인표입니다.",
    lead: "위탁판매는 판매가보다 공제 기준이 더 중요합니다. 판매된 수량과 반품·폐기 수량, 판매수수료와 결제수수료를 구분해 정산서 한 장으로 재구성하세요.",
    formula: ["정산 대상 매출 = 판매 수량 × 실제 판매단가", "총공제액 = 판매·결제수수료 + 포장·배송 + 반품·폐기 + 광고 등 합의 비용", "입금 예정액 = 정산 대상 매출 - 총공제액"],
    checks: ["할인 판매를 누가 승인하는지", "미판매·반품·폐기 물량의 소유와 비용", "판매내역 제공 주기와 입금 예정일"],
    links: [["농산물 위탁판매 계약·정산 가이드", "agricultural-products-consignment-sales-guide"]],
  },
];

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const style = `:root{--g:#104b2d;--g2:#1d6b42;--y:#f7bd24;--ink:#171a18;--text:#535b56;--line:#dfe4e0;--pale:#f2f7f3;--max:1000px}*{box-sizing:border-box}body{margin:0;font-family:'Noto Sans KR',sans-serif;color:var(--ink);line-height:1.7}a{text-decoration:none;color:inherit}.site-header{height:70px;border-bottom:1px solid var(--line);display:flex;align-items:center;padding:0 max(20px,calc((100% - var(--max))/2));position:sticky;top:0;background:#fff;z-index:10}.brand{display:flex;gap:10px;align-items:center}.brand-mark{width:32px;height:32px;border-radius:50%;background:var(--y);display:grid;place-items:center;color:var(--g)}.brand strong{color:var(--g);font-size:20px}.brand small{margin-left:6px;color:#747c77}.site-header nav{margin-left:auto;display:flex;gap:20px;font-size:13px;font-weight:800}main{max-width:var(--max);margin:auto;padding:0 20px}.crumb{padding-top:26px;display:flex;gap:8px;color:#77807a;font-size:13px}.hero{padding:58px 0 40px}.hero>p,.cards article>p,.article>header>p{color:var(--g2);font-size:13px;font-weight:900}.hero h1{font-size:47px;line-height:1.22;letter-spacing:-2px;margin:7px 0}.hero h1 em{font-style:normal;color:var(--g)}.hero>span,.cards article>span,.article>header>span{color:var(--text)}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding-bottom:70px}.cards article{border:1px solid var(--line);border-radius:12px;padding:21px}.cards h2{font-size:19px;line-height:1.45;margin:7px 0}.cards article>a{display:flex;align-items:center;gap:7px;margin-top:14px;color:var(--g2);font-size:13px;font-weight:800}.cards svg{width:16px}.article>header{padding:38px 0;border-bottom:1px solid var(--line)}.article h1{font-size:39px;line-height:1.3;margin:7px 0}.layout{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:34px;padding:34px 0 70px}.lead{padding:18px;border-left:4px solid var(--y);background:#fff9e9}.lead p{margin-bottom:0;color:var(--text)}.layout section{padding:16px 0;border-bottom:1px solid var(--line)}.layout h2{font-size:21px}.formula{list-style:none;padding:0;counter-reset:formula}.formula li{counter-increment:formula;padding:13px;margin:8px 0;background:var(--pale)}.formula li:before{content:counter(formula);display:inline-grid;place-items:center;width:25px;height:25px;border-radius:50%;background:#fff;color:var(--g2);font-weight:900;margin-right:8px}.checks li{color:var(--text);margin:8px 0}.next{align-self:start;position:sticky;top:96px;background:var(--pale);padding:20px;border-radius:10px}.next p{font-size:13px;color:var(--text)}.next a{display:flex;justify-content:space-between;gap:8px;background:#fff;border:1px solid var(--line);border-radius:7px;padding:11px;margin-top:8px;color:var(--g2);font-size:13px;font-weight:800}.next svg{width:15px;min-width:15px}footer{border-top:1px solid var(--line);padding:25px max(20px,calc((100% - var(--max))/2));display:flex;gap:18px;color:#6b736e}footer nav{margin-left:auto;font-size:12px}@media(max-width:760px){.site-header nav,.brand small{display:none}.cards,.layout{grid-template-columns:1fr}.hero h1,.article h1{font-size:34px}.next{position:static}}`;
const head = (title, description, canonical, type = "article") => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | reportools</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(title)} | reportools"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="${type}"><meta property="og:url" content="${canonical}"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${style}</style></head><body><header class="site-header"><a class="brand" href="/"><span class="brand-mark"><i data-lucide="receipt-text"></i></span><strong>reportools</strong><small>농가 판매 손익·정산 보고서</small></a><nav><a href="/">손익 계산기</a><a href="/guides/">정산 가이드</a></nav></header>`;
const foot = `<footer><strong>reportools</strong><span>농가 판매 의사결정을 돕는 무료 계산 도구</span><nav><a href="/guides/">정산 가이드</a></nav></footer><script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script><script>if(window.lucide)lucide.createIcons();</script></body></html>`;

export const guideUrls = ["/guides/", ...guides.map((guide) => `/guides/${guide.slug}/`)];
export const guidePages = {};
const cards = guides.map((guide) => `<article><p>정산 원리</p><h2><a href="/guides/${guide.slug}/">${esc(guide.title)}</a></h2><span>${esc(guide.description)}</span><a href="/guides/${guide.slug}/">계산 순서 보기 <i data-lucide="arrow-right"></i></a></article>`).join("");
const hubSchema = JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "농산물 판매·정산 가이드", url: `${base}/guides/`, hasPart: guides.map((guide) => ({ "@type": "Article", name: guide.title, url: `${base}/guides/${guide.slug}/` })) }).replace(/</g, "\\u003c");
guidePages["/guides/"] = `${head("농산물 판매·정산 가이드", "직거래 kg당 판매가, 경매 실수령액, 위탁판매 정산서를 같은 원리로 계산하는 짧은 농가 정산 가이드입니다.", `${base}/guides/`, "website")}<script type="application/ld+json">${hubSchema}</script><main><nav class="crumb"><a href="/">손익 계산기</a><span>›</span><span>정산 가이드</span></nav><section class="hero"><p>숫자를 넣기 전에</p><h1>농산물 판매·정산<br><em>계산 원리</em></h1><span>판매 채널이 달라도 매출에서 빠지는 비용을 같은 표로 만들면 실제 수익을 비교할 수 있습니다.</span></section><section class="cards">${cards}</section></main>${foot}`;

for (const guide of guides) {
  const path = `/guides/${guide.slug}/`;
  const canonical = `${base}${path}`;
  const formulas = guide.formula.map((item) => `<li>${esc(item)}</li>`).join("");
  const checks = guide.checks.map((item) => `<li>${esc(item)}</li>`).join("");
  const links = guide.links.map(([text, slug]) => `<a href="https://boribay.com/guides/${slug}?utm_source=reportools.com&amp;utm_medium=owned_referral&amp;utm_campaign=farm_settlement_guides&amp;utm_content=${guide.slug}">${esc(text)} <i data-lucide="arrow-right"></i></a>`).join("");
  const schema = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, datePublished: date, dateModified: date, inLanguage: "ko-KR", mainEntityOfPage: canonical, author: { "@type": "Organization", name: "reportools 편집팀" }, publisher: { "@type": "Organization", name: "reportools", url: base } }).replace(/</g, "\\u003c");
  guidePages[path] = `${head(guide.title, guide.description, canonical)}<script type="application/ld+json">${schema}</script><main><nav class="crumb"><a href="/">손익 계산기</a><span>›</span><a href="/guides/">정산 가이드</a></nav><article class="article"><header><p>정산 원리 · ${date}</p><h1>${esc(guide.title)}</h1><span>${esc(guide.description)}</span></header><div class="layout"><div><aside class="lead"><strong>핵심</strong><p>${esc(guide.lead)}</p></aside><section><h2>계산식</h2><ol class="formula">${formulas}</ol></section><section><h2>빠뜨리기 쉬운 항목</h2><ul class="checks">${checks}</ul></section><section><h2>계산 뒤 기록할 것</h2><p>계산 기준일, 품목·규격, 수량·단가, 각 비용의 근거와 실제 입금액을 함께 저장하세요. 실제 세무·회계 처리는 전문가의 최신 안내를 확인해야 합니다.</p></section></div><aside class="next"><h2>실제 거래 기준</h2><p>같은 계산 원리로 보리장터의 시세·직거래 가이드를 이어서 확인하세요.</p>${links}</aside></div></article></main>${foot}`;
}
