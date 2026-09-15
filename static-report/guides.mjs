const base = "https://reportools.com";
const date = "2026-08-10";
const guides = [
  {
    slug: "kg-price-margin",
    title: "농산물 kg당 판매가와 마진 계산법",
    description: "상자 가격을 kg당 가격으로 바꾸고 감모·포장·배송·결제수수료를 포함한 실제 마진을 계산하는 순서입니다.",
    lead: "상자 판매가만 보면 규격이 다른 상품을 비교하기 어렵습니다. 먼저 내용물 실중량 기준 kg당 가격을 만든 뒤 판매 가능한 수량과 모든 비용을 반영하세요.",
    formula: ["구매자 kg당 가격 = (상품금액 + 구매자 부담 배송비) ÷ 내용물 실중량", "판매자 매출 = 실제 판매 상품금액 + 받은 배송비 - 환불액", "판매자 이익 = 매출 - 생산·선별·포장·운송·수수료 등 비용"],
    checks: ["포장재를 뺀 내용물 실중량인지", "무료배송 비용이 판매가에 포함됐는지", "파손·반품·자가노동비가 빠지지 않았는지"],
    modified: "2026-09-16",
    sections: [
      {
        title: "5kg 상자와 10kg 상자: 배송비를 더한 뒤 나누기",
        paragraphs: ["다음은 계산을 설명하기 위한 가상 견적입니다. 품종·등급·실중량이 같은 조건인지 확인한 뒤 비교하세요. 포장재 무게는 내용량에 넣지 않습니다."],
        table: { caption: "구매자가 부담하는 kg당 가격 비교", headers: ["항목", "5kg 상자", "10kg 상자"], rows: [["상품금액", "24,000원", "46,000원"], ["구매자 부담 배송비", "3,000원", "0원"], ["총 결제금액", "27,000원", "46,000원"], ["내용물 1kg당 가격", "5,400원", "4,600원"]] },
        note: "이 조건에서는 10kg 상자가 kg당 800원 저렴합니다. 하지만 판매자에게 어느 규격이 더 이익인지는 각 상자의 포장비·실제 택배비·감모 비용까지 따로 계산해야 알 수 있습니다.",
      },
      {
        title: "무료배송 24,000원에 팔면 실제로 얼마가 남을까",
        paragraphs: ["별도의 판매자 예시입니다. 5kg 한 상자를 무료배송 24,000원에 판매하고, 결제수수료를 상품금액의 3%로 가정합니다. 이 비율과 비용은 특정 판매처의 실제 요금이 아닙니다."],
        table: { caption: "한 상자 판매 손익 예시", headers: ["항목", "금액", "계산 근거"], rows: [["매출", "24,000원", "구매자 추가 배송비 없음"], ["생산·선별 원가", "13,000원", "한 상자 배분 원가"], ["포장비", "1,000원", "상자·완충재 등"], ["실제 택배비", "4,000원", "판매자가 부담"], ["결제수수료", "720원", "24,000원 × 3%"], ["감모·반품 예상 비용", "500원", "한 상자 배분 추정치"], ["예상 이익", "4,780원", "24,000원 - 19,220원"]] },
        note: "매출 대비 마진율은 약 19.9%입니다. 4,780원 ÷ 24,000원으로 구하며 원가 대비 이익률과 구분합니다. 반품 충당 추정치와 실제 환불 비용을 같은 건에 중복 반영하지 마세요.",
      },
      {
        title: "목표 이익에서 판매가를 거꾸로 계산하기",
        paragraphs: ["위 예시에서 수수료 외 비용은 18,500원입니다. 한 상자당 5,000원을 남기려면 (18,500원 + 5,000원) ÷ (1 - 0.03) = 약 24,227원이 필요합니다. 이는 무료배송·수수료 3% 가정이며 실제 수수료 부과 대상과 반올림 규칙에 맞춰 다시 계산합니다.", "감모율을 사용한다면 수확량에서 판매 가능 중량을 먼저 구하고 그 중량에 원가를 배분합니다. 이미 줄인 판매 수량에 같은 감모율을 다시 곱하면 손실을 두 번 반영하게 됩니다."],
      },
    ],
    faq: [["무료배송이면 배송비를 0원으로 넣나요?", "구매자의 추가 배송비는 0원이지만 판매자 손익에는 실제 택배비가 들어갑니다. 받은 배송비는 매출, 지급한 택배비는 비용으로 각각 기록하세요."], ["kg당 가격이 높으면 마진도 높나요?", "그렇지 않습니다. 소포장에는 kg당 포장비와 배송비가 더 들 수 있습니다. 같은 품질·중량 기준의 소비자 가격과 한 주문당 판매자 이익을 함께 비교하세요."], ["경매 실수령액과 바로 비교해도 되나요?", "생산비·출하비를 포함하는 범위를 먼저 맞춰야 합니다. 경매 정산 입금액에는 생산 원가가 빠져 있지 않을 수 있으므로 아래 경매 정산 가이드의 비용 구분부터 확인하세요."]],
    related: ["auction-net-proceeds", "consignment-settlement"],
    tool: {
      eyebrow: "숫자로 바로 비교",
      title: "5kg·10kg 상자, 배송비 포함 kg당 가격 비교",
      description: "상자 가격·내용량·배송비를 입력하면 배송 전후 kg당 가격과 총 주문금액을 한 번에 확인할 수 있습니다.",
      href: "https://boribay.com/guides/produce-price-calculator?utm_source=reportools.com&utm_medium=owned_referral&utm_campaign=farm_settlement_guides&utm_content=kg-price-margin-inline",
    },
    links: [["무료 kg당 가격 계산기 열기", "produce-price-calculator"], ["직거래 가격·포장 원리", "produce-direct-sale-pricing-packaging"]],
  },
  {
    slug: "auction-net-proceeds",
    title: "농산물 경매 정산 실수령액 계산법",
    description: "가락시장 경락가의 단위를 맞추고 수수료·운송·하역 공제와 선지급한 선별·포장비를 구분해 농가 수취액을 계산합니다.",
    lead: "경매 낙찰금액은 곧바로 농가 실수령액이 아닙니다. 출하 전 비용과 정산서에서 공제되는 항목을 한 표에 모아야 직거래와 같은 기준으로 비교할 수 있습니다.",
    formula: ["총낙찰액 = 등급별 낙찰단가 × 실제 정산 수량의 합", "정산 입금액 = 총낙찰액 - 정산서에 실제로 공제된 비용", "출하 후 순수취액 = 정산 입금액 - 별도로 지급한 출하비용"],
    checks: ["단가 단위가 kg·상자·망 중 무엇인지", "등급별 수량과 유찰·감모 물량이 분리됐는지", "운송·하역 비용이 별도 청구되는지"],
    modified: "2026-09-16",
    sections: [
      {
        title: "가락시장 경락가를 정산액으로 옮기는 순서",
        paragraphs: ["가격표의 조회일·품목·등급·단량·단위를 먼저 적습니다. 10kg 상자 30,000원은 kg당 3,000원입니다. 서로 다른 등급이나 포장 단위를 섞은 평균가격을 내 물량 전체에 그대로 곱하지 마세요.", "공개 시세는 비교 기준입니다. 내 출하분의 실제 정산은 거래명세에 적힌 등급별 낙찰단가와 정산 수량으로 다시 계산합니다. 가령 110상자를 보냈더라도 100상자만 낙찰됐다면 아래 예시의 매출 수량은 100상자입니다. 나머지 물량의 유찰·반송·폐기 내역은 따로 확인합니다."],
      },
      {
        title: "10kg 100상자: 300만원 낙찰과 248만원 수취의 차이",
        paragraphs: ["10kg 100상자를 상자당 30,000원에 낙찰하고, 위탁수수료를 6%로 가정한 계산 예시입니다. 실제 가락시장 수수료율이나 현재 경락가를 제시하는 표가 아닙니다. 적용 비율과 공제 항목은 해당 거래의 정산서로 확인하세요."],
        table: { caption: "정산서 공제와 별도 지출을 나눈 가상 예시", headers: ["단계", "금액", "계산"], rows: [["총낙찰액", "3,000,000원", "30,000원 × 100상자"], ["정산서 위탁수수료", "180,000원", "3,000,000원 × 가정 6%"], ["정산서 운송비", "100,000원", "이 예시에서는 정산 시 공제"], ["정산서 하역비", "40,000원", "이 예시에서는 정산 시 공제"], ["정산 입금액", "2,680,000원", "3,000,000원 - 320,000원"], ["미리 지급한 포장·선별비", "200,000원", "포장 120,000원 + 선별 80,000원"], ["출하 후 순수취액", "2,480,000원", "2,680,000원 - 200,000원"]] },
        note: "정산 중량 1,000kg 기준 순수취액은 kg당 2,480원입니다. 생산비·자가노동비 등이 포함되지 않았으므로 이를 최종 순이익이라고 부르지 않습니다. 수수료율이 1%p 달라지면 이 예시의 공제액은 30,000원 달라집니다.",
      },
      {
        title: "운송·선별 공제를 두 번 빼지 않는 확인표",
        paragraphs: ["비용마다 금액, 지급처, 지급일, 정산서 공제 여부를 한 줄로 적습니다. 이미 운송업체에 100,000원을 지급했다면 정산서의 같은 운송비가 실제 추가 청구인지, 내역 표기인지 확인한 뒤 한 번만 반영합니다.", "내부 경매 계산표에는 총낙찰액과 정산서 공제를 먼저 넣고, 선지급한 포장·선별비는 별도 칸에서 뺍니다. 직거래와 비교할 때에는 같은 물량의 배송·반품·판매 노동비까지 비용 범위를 맞추세요."],
      },
    ],
    faq: [["평균 경락가 × 출하량이 입금액인가요?", "아닙니다. 내 출하분의 실제 낙찰단가와 정산 수량으로 매출을 구한 뒤 정산서 공제를 차감합니다. 공개 평균가격과 실제 낙찰가격은 같은 값이라고 가정하지 않습니다."], ["유찰·감모 물량은 비용으로 한 번 더 빼나요?", "미판매 물량을 매출 수량에서 이미 제외했다면 같은 판매대금을 다시 공제하지 않습니다. 별도로 발생한 반송·폐기 비용은 증빙 금액만 추가합니다."], ["정산 입금액과 순이익은 무엇이 다른가요?", "입금액은 정산서에서 공제한 뒤 받은 돈입니다. 별도 출하비용과 생산비 등을 모두 반영해야 판매 손익을 판단할 수 있습니다."]],
    related: ["kg-price-margin", "consignment-settlement"],
    sources: [["서울특별시농수산식품공사 주요 품목 가격: 조회일·등급·거래단위·평균가격 항목 확인", "https://www.data.go.kr/data/15004517/openapi.do"]],
    links: [["같은 등급·단위의 가락시장 시세 확인", "garak-market-price-lookup", "auction-net-proceeds-market-price"], ["내 공제액으로 경매 수취금액 계산", "agricultural-auction-net-calculator", "auction-net-proceeds-calculator"]],
  },
  {
    slug: "consignment-settlement",
    title: "농산물 위탁판매 정산서 읽는 법",
    description: "위탁판매의 총판매액, 수수료, 포장·배송·반품·폐기 공제와 정산일을 계약 전후로 맞추는 확인표입니다.",
    lead: "위탁판매는 판매가보다 공제 기준이 더 중요합니다. 판매된 수량과 반품·폐기 수량, 판매수수료와 결제수수료를 구분해 정산서 한 장으로 재구성하세요.",
    formula: ["정산 대상 매출 = 판매 수량 × 실제 판매단가", "총공제액 = 판매·결제수수료 + 포장·배송 + 반품·폐기 + 광고 등 합의 비용", "입금 예정액 = 정산 대상 매출 - 총공제액"],
    checks: ["할인 판매를 누가 승인하는지", "미판매·반품·폐기 물량의 소유와 비용", "판매내역 제공 주기와 입금 예정일"],
    modified: "2026-09-16",
    sections: [
      {
        title: "정산서는 수량, 판매금액, 공제, 입금의 네 묶음으로 읽기",
        paragraphs: ["출고 수량에서 시작해 판매·미판매 반환·폐기·남은 재고로 물량을 맞춥니다. 정가와 할인 판매 수량을 나눠 실제 매출을 만들고, 그 매출에 어떤 비용이 공제됐는지 대조합니다.", "아래 예시는 출고 100상자가 정가 판매 80상자, 할인 판매 10상자, 미판매 반환 8상자, 폐기 2상자로 마감된 경우입니다. 판매 90상자만 매출에 넣고, 미판매 반환분은 고객 판매 후 반품과 구분합니다."],
      },
      {
        title: "100상자를 맡기고 90상자가 팔렸을 때의 입금 예시",
        paragraphs: ["판매수수료 10%, 결제수수료 2%를 각각 판매액에 부과하고, 아래 비용을 정산서에서 공제하기로 한 가상 계약입니다. 실제 계약의 비율·부과 대상·포함 항목을 확인해 숫자를 바꾸세요."],
        table: { caption: "판매내역과 공제내역 대조 예시", headers: ["항목", "금액", "계산 근거"], rows: [["정가 판매", "2,000,000원", "80상자 × 25,000원"], ["할인 판매", "200,000원", "10상자 × 20,000원"], ["정산 대상 매출", "2,200,000원", "실제 판매된 90상자"], ["판매·결제수수료", "264,000원", "220,000원 + 44,000원"], ["포장비", "72,000원", "판매 90상자 × 800원"], ["배송비", "315,000원", "판매 90상자 × 3,500원"], ["폐기 처리비", "20,000원", "폐기 증빙 및 합의 금액"], ["입금 예정액", "1,529,000원", "2,200,000원 - 671,000원"]] },
        note: "이 예시의 입금액에는 농가 생산비나 별도 선지급 비용이 반영되지 않았습니다. 판매수수료에 결제수수료가 포함된 계약이라면 44,000원을 다시 공제하지 않습니다.",
      },
      {
        title: "입금액이 맞지 않을 때 요청할 내역",
        paragraphs: ["먼저 정산 대상 기간과 입금 회차를 맞춥니다. 판매명세에는 판매일·품목·규격·수량·실제 단가·할인액을, 공제명세에는 비용명·계산 대상·비율 또는 건당 금액·증빙을 요청합니다.", "선지급금이나 이전 회차 이월액이 있으면 이번 판매금액과 분리해 조정합니다. 예상 입금액과 실제 통장 입금액의 차이를 금액별로 표시하면 누락인지, 다음 회차 정산인지 확인하기 쉽습니다. 반환 8상자의 재고 가치를 이번 매출로 더하지 마세요."],
      },
    ],
    faq: [["출고한 100상자 모두 판매가로 계산하나요?", "판매가 확인된 물량만 매출로 잡아 정산 내역을 대조합니다. 미판매 반환·폐기·남은 재고는 별도 수량으로 관리하며 예상 판매와 확정 판매를 섞지 않습니다."], ["판매수수료와 결제수수료를 모두 빼야 하나요?", "계약에서 별도 부담인지 포함 요금인지 먼저 확인합니다. 정산서에 두 항목이 있다는 이유만으로 같은 수수료를 두 번 차감하지 않습니다."], ["정산금이 커 보이는데 왜 손해가 날 수 있나요?", "입금 전에 직접 지불한 생산·선별·운송비가 정산서에 없을 수 있습니다. 아래 kg당 판매가 가이드의 비용표에 이 비용을 합쳐 최종 손익을 따로 계산하세요."]],
    related: ["kg-price-margin", "auction-net-proceeds"],
    links: [["농산물 위탁판매 계약·정산 가이드", "agricultural-products-consignment-sales-guide"]],
  },
];

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const style = `:root{--g:#104b2d;--g2:#1d6b42;--y:#f7bd24;--ink:#171a18;--text:#535b56;--line:#dfe4e0;--pale:#f2f7f3;--max:1000px}*{box-sizing:border-box}body{margin:0;font-family:'Noto Sans KR',sans-serif;color:var(--ink);line-height:1.7}a{text-decoration:none;color:inherit}.site-header{height:70px;border-bottom:1px solid var(--line);display:flex;align-items:center;padding:0 max(20px,calc((100% - var(--max))/2));position:sticky;top:0;background:#fff;z-index:10}.brand{display:flex;gap:10px;align-items:center}.brand-mark{width:32px;height:32px;border-radius:50%;background:var(--y);display:grid;place-items:center;color:var(--g)}.brand strong{color:var(--g);font-size:20px}.brand small{margin-left:6px;color:#747c77}.site-header nav{margin-left:auto;display:flex;gap:20px;font-size:13px;font-weight:800}main{max-width:var(--max);margin:auto;padding:0 20px}.crumb{padding-top:26px;display:flex;gap:8px;color:#77807a;font-size:13px}.hero{padding:58px 0 40px}.hero>p,.cards article>p,.article>header>p{color:var(--g2);font-size:13px;font-weight:900}.hero h1{font-size:47px;line-height:1.22;letter-spacing:-2px;margin:7px 0}.hero h1 em{font-style:normal;color:var(--g)}.hero>span,.cards article>span,.article>header>span{color:var(--text)}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding-bottom:70px}.cards article{border:1px solid var(--line);border-radius:12px;padding:21px}.cards h2{font-size:19px;line-height:1.45;margin:7px 0}.cards article>a{display:flex;align-items:center;gap:7px;margin-top:14px;color:var(--g2);font-size:13px;font-weight:800}.cards svg{width:16px}.article>header{padding:38px 0;border-bottom:1px solid var(--line)}.article h1{font-size:39px;line-height:1.3;margin:7px 0}.layout{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:34px;padding:34px 0 70px}.lead{padding:18px;border-left:4px solid var(--y);background:#fff9e9}.lead p{margin-bottom:0;color:var(--text)}.layout section{padding:16px 0;border-bottom:1px solid var(--line)}.layout h2{font-size:21px}.formula{list-style:none;padding:0;counter-reset:formula}.formula li{counter-increment:formula;padding:13px;margin:8px 0;background:var(--pale)}.formula li:before{content:counter(formula);display:inline-grid;place-items:center;width:25px;height:25px;border-radius:50%;background:#fff;color:var(--g2);font-weight:900;margin-right:8px}.tool-cta{display:block;margin:18px 0 4px;padding:21px 22px;border-radius:12px;background:var(--g);color:#fff}.tool-cta small{display:block;color:#f8ce55;font-weight:900}.tool-cta h2{margin:4px 0;font-size:22px}.tool-cta span{display:block;color:#dce9e1}.tool-cta strong{display:inline-flex;align-items:center;gap:7px;margin-top:14px;padding:8px 12px;border-radius:7px;background:#fff;color:var(--g)}.tool-cta svg{width:17px}.checks li{color:var(--text);margin:8px 0}.next{align-self:start;position:sticky;top:96px;background:var(--pale);padding:20px;border-radius:10px}.next p{font-size:13px;color:var(--text)}.next a{display:flex;justify-content:space-between;gap:8px;background:#fff;border:1px solid var(--line);border-radius:7px;padding:11px;margin-top:8px;color:var(--g2);font-size:13px;font-weight:800}.next svg{width:15px;min-width:15px}footer{border-top:1px solid var(--line);padding:25px max(20px,calc((100% - var(--max))/2));display:flex;gap:18px;color:#6b736e}footer nav{margin-left:auto;font-size:12px}@media(max-width:760px){.site-header nav,.brand small{display:none}.cards,.layout{grid-template-columns:1fr}.hero h1,.article h1{font-size:34px}.tool-cta{padding:19px}.tool-cta h2{font-size:20px}.next{position:static}}`;
const contentStyle = `.layout>div{min-width:0}.table-scroll{overflow:auto;margin:18px 0}.table-scroll:focus{outline:2px solid var(--g2);outline-offset:3px}table{width:100%;min-width:450px;border-collapse:collapse;font-size:14px}caption{text-align:left;font-weight:800;margin-bottom:10px}th,td{text-align:left;vertical-align:top;border:1px solid var(--line);padding:10px}thead{background:var(--pale)}tbody th{font-weight:600}.example-note{background:var(--pale);padding:14px}.article h3{font-size:17px;margin-bottom:4px}.related a{color:var(--g2);text-decoration:underline;text-underline-offset:3px}.related li{margin:9px 0}`;
const head = (title, description, canonical, type = "article") => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | reportools</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(title)} | reportools"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="${type}"><meta property="og:url" content="${canonical}"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${style}${contentStyle}</style></head><body><header class="site-header"><a class="brand" href="/"><span class="brand-mark"><i data-lucide="receipt-text"></i></span><strong>reportools</strong><small>농가 판매 손익·정산 보고서</small></a><nav><a href="/">손익 계산기</a><a href="/guides/">정산 가이드</a></nav></header>`;
const foot = `<footer><strong>reportools</strong><span>농가 판매 의사결정을 돕는 무료 계산 도구</span><nav><a href="/guides/">정산 가이드</a></nav></footer><script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script><script>if(window.lucide)lucide.createIcons();</script></body></html>`;

export const guideUrls = ["/guides/", ...guides.map((guide) => `/guides/${guide.slug}/`)];
export const guideLastModified = Object.fromEntries(guides.map((guide) => [`/guides/${guide.slug}/`, guide.modified ?? date]));
guideLastModified["/guides/"] = Object.values(guideLastModified).sort().at(-1);
export const guidePages = {};
const cards = guides.map((guide) => `<article><p>정산 원리</p><h2><a href="/guides/${guide.slug}/">${esc(guide.title)}</a></h2><span>${esc(guide.description)}</span><a href="/guides/${guide.slug}/">계산 순서 보기 <i data-lucide="arrow-right"></i></a></article>`).join("");
const hubSchema = JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "농산물 판매·정산 가이드", url: `${base}/guides/`, hasPart: guides.map((guide) => ({ "@type": "Article", name: guide.title, url: `${base}/guides/${guide.slug}/` })) }).replace(/</g, "\\u003c");
guidePages["/guides/"] = `${head("농산물 판매·정산 가이드", "직거래 kg당 판매가, 경매 실수령액, 위탁판매 정산서를 같은 원리로 계산하는 짧은 농가 정산 가이드입니다.", `${base}/guides/`, "website")}<script type="application/ld+json">${hubSchema}</script><main><nav class="crumb"><a href="/">손익 계산기</a><span>›</span><span>정산 가이드</span></nav><section class="hero"><p>숫자를 넣기 전에</p><h1>농산물 판매·정산<br><em>계산 원리</em></h1><span>판매 채널이 달라도 매출에서 빠지는 비용을 같은 표로 만들면 실제 수익을 비교할 수 있습니다.</span></section><section class="cards">${cards}</section></main>${foot}`;

for (const guide of guides) {
  const path = `/guides/${guide.slug}/`;
  const canonical = `${base}${path}`;
  const formulas = guide.formula.map((item) => `<li>${esc(item)}</li>`).join("");
  const checks = guide.checks.map((item) => `<li>${esc(item)}</li>`).join("");
  const links = guide.links.map(([text, slug, content = guide.slug]) => `<a href="https://boribay.com/guides/${slug}?utm_source=reportools.com&amp;utm_medium=owned_referral&amp;utm_campaign=farm_settlement_guides&amp;utm_content=${content}">${esc(text)} <i data-lucide="arrow-right"></i></a>`).join("");
  const sections = guide.sections.map((section) => {
    const table = section.table ? `<div class="table-scroll" role="region" aria-label="${esc(section.table.caption)}" tabindex="0"><table><caption>${esc(section.table.caption)}</caption><thead><tr>${section.table.headers.map((cell) => `<th scope="col">${esc(cell)}</th>`).join("")}</tr></thead><tbody>${section.table.rows.map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : "";
    return `<section><h2>${esc(section.title)}</h2>${section.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}${table}${section.note ? `<p class="example-note">${esc(section.note)}</p>` : ""}</section>`;
  }).join("");
  const faq = `<section><h2>자주 묻는 질문</h2>${guide.faq.map(([question, answer]) => `<h3>${esc(question)}</h3><p>${esc(answer)}</p>`).join("")}</section>`;
  const related = `<section><h2>다음 계산으로 이어가기</h2><ul class="related">${guide.related.map((slug) => { const target = guides.find((item) => item.slug === slug); return `<li><a href="/guides/${slug}/">${esc(target.title)}</a></li>`; }).join("")}<li><a href="/">내 비용으로 농가 손익 계산하기</a></li></ul></section>`;
  const sources = guide.sources ? `<section><h2>가격 단위를 확인한 공식 자료</h2><ul class="related">${guide.sources.map(([label, url]) => `<li><a href="${esc(url)}">${esc(label)}</a></li>`).join("")}</ul><p>확인일: ${guide.modified}. 계산 예시의 가격·비용·수수료율은 위 자료의 실제 거래값이 아닌 설명용 가정입니다.</p></section>` : "";
  const tool = guide.tool ? `<a class="tool-cta" href="${guide.tool.href.replace(/&/g, "&amp;")}"><small>${esc(guide.tool.eyebrow)}</small><h2>${esc(guide.tool.title)}</h2><span>${esc(guide.tool.description)}</span><strong>무료 계산기 열기 <i data-lucide="arrow-right"></i></strong></a>` : "";
  const modified = guide.modified ?? date;
  const schema = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, datePublished: date, dateModified: modified, inLanguage: "ko-KR", mainEntityOfPage: canonical, author: { "@type": "Organization", name: "reportools 편집팀" }, publisher: { "@type": "Organization", name: "reportools", url: base } }).replace(/</g, "\\u003c");
  guidePages[path] = `${head(guide.title, guide.description, canonical)}<script type="application/ld+json">${schema}</script><main><nav class="crumb"><a href="/">손익 계산기</a><span>›</span><a href="/guides/">정산 가이드</a></nav><article class="article"><header><p>정산 원리 · ${guide.modified ? `업데이트 ${modified}` : date}</p><h1>${esc(guide.title)}</h1><span>${esc(guide.description)}</span></header><div class="layout"><div><aside class="lead"><strong>핵심</strong><p>${esc(guide.lead)}</p></aside><section><h2>계산식</h2><ol class="formula">${formulas}</ol>${tool}</section>${sections}<section><h2>빠뜨리기 쉬운 항목</h2><ul class="checks">${checks}</ul></section>${faq}${related}${sources}<section><h2>계산 뒤 기록할 것</h2><p>계산 기준일, 품목·규격, 수량·단가, 각 비용의 근거와 실제 입금액을 함께 저장하세요.</p></section></div><aside class="next"><h2>실제 거래 기준</h2><p>같은 계산 원리로 보리장터의 시세·직거래 가이드를 이어서 확인하세요.</p>${links}</aside></div></article></main>${foot}`;
}
