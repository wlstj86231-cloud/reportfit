import { faviconLink } from "./favicon.mjs";

const base = "https://www.reportools.com";
const date = "2026-08-10";
const guides = [
  {
    slug: "kg-price-margin",
    title: "농산물 kg당 판매가와 마진 계산법",
    description: "상자 가격을 kg당 가격으로 바꾸고 감모·포장·배송·결제수수료를 포함한 실제 마진을 계산하는 순서입니다.",
    lead: "상자 판매가만 보면 규격이 다른 상품을 비교하기 어렵습니다. 먼저 내용물 실중량 기준 kg당 가격을 만든 뒤 판매 가능한 수량과 모든 비용을 반영하세요.",
    formula: ["구매자 kg당 가격 = (상품금액 + 구매자 부담 배송비) ÷ 내용물 실중량", "판매자 매출 = 실제 판매 상품금액 + 받은 배송비 - 환불액", "판매자 이익 = 매출 - 생산·선별·포장·운송·수수료 등 비용"],
    checks: ["포장재를 뺀 내용물 실중량인지", "무료배송 비용이 판매가에 포함됐는지", "파손·반품·자가노동비가 빠지지 않았는지"],
    modified: "2026-10-26",
    sourcesChecked: "2026-09-20",
    sections: [
      {
        title: "5kg 상자와 10kg 상자: 배송비를 더한 뒤 나누기",
        paragraphs: ["다음은 계산을 설명하기 위한 가상 견적입니다. 품종·등급·실중량이 같은 조건인지 확인한 뒤 비교하세요. 포장재 무게는 내용량에 넣지 않습니다."],
        table: { caption: "구매자가 부담하는 kg당 가격 비교", headers: ["항목", "5kg 상자", "10kg 상자"], rows: [["상품금액", "24,000원", "46,000원"], ["구매자 부담 배송비", "3,000원", "0원"], ["총 결제금액", "27,000원", "46,000원"], ["내용물 1kg당 가격", "5,400원", "4,600원"]] },
        note: "이 조건에서는 10kg 상자가 kg당 800원 저렴합니다. 하지만 판매자에게 어느 규격이 더 이익인지는 각 상자의 포장비·실제 택배비·감모 비용까지 따로 계산해야 알 수 있습니다.",
      },
      {
        title: "규격이 다른 상자를 kg당 가격으로 맞추기",
        paragraphs: ["정산서나 판매글의 단가가 상자·망 기준이면 내용물 실중량으로 나눠 kg당 가격을 만든 뒤 비교합니다. 계산 설명용 예: 실중량 4kg 상자 16,000원은 kg당 4,000원, 7.5kg 상자 22,500원은 kg당 3,000원, 10kg 상자 40,000원은 kg당 4,000원입니다. 이 숫자는 시세가 아닙니다.", "공식 가격정보와 견줄 때는 품목·품종·등급·규격이 내 상품과 같은 행만 고릅니다. 품종이 다른 행(예: 샤인머스캣 대신 캠벨얼리)이나 작형이 다른 행(예: 하우스감귤 대신 노지감귤)의 가격을 기준으로 쓰면 kg당 가격 비교가 틀어집니다."],
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
    faq: [["무료배송이면 배송비를 0원으로 넣나요?", "구매자의 추가 배송비는 0원이지만 판매자 손익에는 실제 택배비가 들어갑니다. 받은 배송비는 매출, 지급한 택배비는 비용으로 각각 기록하세요."], ["kg당 가격이 높으면 마진도 높나요?", "그렇지 않습니다. 소포장에는 kg당 포장비와 배송비가 더 들 수 있습니다. 같은 품질·중량 기준의 소비자 가격과 한 주문당 판매자 이익을 함께 비교하세요."], ["경매 실수령액과 바로 비교해도 되나요?", "비용 범위를 먼저 맞춰야 합니다. 경매 정산 입금액은 생산비를 빼기 전 금액이고, 정산서 밖에서 따로 낸 포장·선별비도 빠져 있지 않습니다. 경매 정산 가이드의 비용 구분부터 확인하세요."]],
    related: ["auction-net-proceeds", "consignment-settlement"],
    tool: {
      eyebrow: "숫자로 바로 계산",
      title: "kg당 손익분기 판매가와 마진 계산",
      description: "상자당 실중량·판매가·포장·택배비·수수료·감모율을 넣으면 상자당·kg당 이익과 손익분기 판매가, 매출 대비 이익률을 직거래·도매시장·온라인별로 보여줍니다.",
      href: "/#calculator",
    },
    links: [["보리장터 kg당 가격 계산기(배송비 포함)", "produce-price-calculator"], ["품목·등급·단위를 맞춰 공식 가격 조회하는 법", "agricultural-price-lookup", "kg-price-margin-grape"]],
  },
  {
    slug: "auction-net-proceeds",
    title: "농산물 경매 정산 실수령액 계산법",
    description: "가락시장 경락가의 단위를 맞추고 수수료·운송·하역 공제와 선지급한 선별·포장비를 구분해 농가 수취액을 계산합니다.",
    lead: "경매 낙찰금액은 곧바로 농가 실수령액이 아닙니다. 도매시장 경락 결과의 kg당 가중평균은 비교 기준이고, 출하 전 비용과 정산서 공제를 한 표에 모아야 직거래와 같은 기준으로 비교할 수 있습니다.",
    formula: ["총낙찰액 = 등급별 낙찰단가 × 실제 정산 수량의 합", "정산 입금액 = 총낙찰액 - 정산서에 실제로 공제된 비용", "출하 후 순수취액 = 정산 입금액 - 별도로 지급한 출하비용"],
    checks: ["단가 단위가 kg·상자·망 중 무엇인지", "등급별 수량과 유찰·감모 물량이 분리됐는지", "운송·하역 비용이 별도 청구되는지"],
    modified: "2026-10-26",
    sections: [
      {
        title: "가락시장 경락가를 정산액으로 옮기는 순서",
        paragraphs: ["도매시장 경락 결과는 거래량 가중 kg당과 최저~최고 범위로 먼저 적습니다. 최고가 한 건을 내 출하분 대표 단가로 쓰지 마세요. 10kg 상자 30,000원은 kg당 3,000원입니다. 서로 다른 등급이나 포장 단위를 섞은 평균가격을 내 물량 전체에 그대로 곱하지 마세요.", "공개 시세는 비교 기준입니다. 내 출하분의 실제 정산은 거래명세에 적힌 등급별 낙찰단가와 정산 수량으로 다시 계산합니다. 가령 110상자를 보냈더라도 100상자만 낙찰됐다면 아래 예시의 매출 수량은 100상자입니다. 나머지 물량의 유찰·반송·폐기 내역은 따로 확인합니다."],
      },
      {
        title: "망·단·상자 단가를 kg으로 맞추기",
        paragraphs: ["정산서 단가가 망·상자 기준이면 내용 중량으로 나눈 뒤 공식 가격정보의 같은 품목·규격 kg당 가격과 비교합니다. 계산 설명용 예: 배추 실중량 10kg 망 18,000원은 kg당 1,800원, 양파 15kg 망 12,000원은 kg당 800원입니다. 이 숫자는 오늘 시세가 아닙니다.", "대파처럼 단으로 거래하는 품목은 단 무게를 확인하기 전에는 kg으로 바꾸지 않습니다. 여러 품목이나 규격의 가격을 한 평균으로 묶어 출하 전체에 곱하지 마세요."],
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
      {
        title: "법령으로 확인할 수 있는 두 가지: 수수료 상한과 표준하역비",
        paragraphs: ["위탁수수료에는 부류별 법정 최고한도가 있습니다. 청과부류는 거래금액의 1천분의 70(7%), 양곡부류는 1천분의 20(2%)이고, 실제 요율은 그 안에서 각 도매시장 업무규정으로 정합니다(농수산물유통안정법 시행규칙 제39조제4항). 위 예시의 6%는 이 범위 안에서 고른 가정입니다.", "도매시장 개설자가 업무규정으로 정하는 규격출하품의 표준하역비는 도매시장법인 또는 시장도매인이 부담합니다(농수산물유통안정법 제40조제2항). 위 예시의 하역비 공제는 규격출하품이 아니거나 표준하역비 밖의 하역 비용이 있는 경우를 가정한 것입니다. 내 정산서에 하역비가 공제됐다면 어떤 항목인지 확인하세요."],
      },
    ],
    faq: [["평균 경락가 × 출하량이 입금액인가요?", "아닙니다. 내 출하분의 실제 낙찰단가와 정산 수량으로 매출을 구한 뒤 정산서 공제를 차감합니다. 공개 평균가격과 실제 낙찰가격은 같은 값이라고 가정하지 않습니다."], ["유찰·감모 물량은 비용으로 한 번 더 빼나요?", "미판매 물량을 매출 수량에서 이미 제외했다면 같은 판매대금을 다시 공제하지 않습니다. 별도로 발생한 반송·폐기 비용은 증빙 금액만 추가합니다."], ["정산 입금액과 순이익은 무엇이 다른가요?", "입금액은 정산서에서 공제한 뒤 받은 돈입니다. 별도 출하비용과 생산비 등을 모두 반영해야 판매 손익을 판단할 수 있습니다."]],
    related: ["wholesale-commission-cap", "kg-price-margin", "consignment-settlement"],
    sourcesTitle: "가격 단위와 수수료 규정을 확인한 공식 자료",
    sources: [["서울특별시농수산식품공사 주요 품목 가격: 조회일·등급·거래단위·평균가격 항목 확인 (확인일 2026-09-20)", "https://www.data.go.kr/data/15004517/openapi.do"], ["농수산물 유통 및 가격안정에 관한 법률 시행규칙 제39조 위탁수수료 최고한도 (시행 2026. 9. 22., 확인일 2026-10-26)", "https://www.law.go.kr/법령/농수산물유통및가격안정에관한법률시행규칙"], ["농수산물 유통 및 가격안정에 관한 법률 제40조 표준하역비 (시행 2026. 10. 2., 확인일 2026-10-26)", "https://www.law.go.kr/법령/농수산물유통및가격안정에관한법률"]],
    sourcesNote: "계산 예시의 가격·비용·수수료율은 위 자료의 실제 거래값이 아닌 설명용 가정입니다.",
    links: [["내 공제액으로 경매 수취금액 계산", "agricultural-auction-net-calculator", "auction-net-proceeds-calculator"], ["도매시장 경락 결과 조회하는 법", "agricultural-wholesale-market-guide", "auction-net-proceeds-market-price"], ["품목·등급·단위를 맞춰 공식 가격 조회하는 법", "agricultural-price-lookup", "auction-net-proceeds-cabbage"]],
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
  {
    slug: "listing-price-fields",
    title: "판매글 가격칸과 정산표를 같은 단위로",
    description: "직거래 판매글에 적는 상자 가격과 정산표·계산기의 kg당 단가를 포장재를 뺀 실중량 기준으로 맞추고, 규격이 여러 개일 때 따로 계산하는 순서입니다.",
    lead: "판매글에는 ‘10kg 1상자 28,000원’처럼 포장 단위로 적는 경우가 많지만, 다른 글이나 공식 가격정보와 비교하고 손익을 따질 때는 kg당 단가가 필요합니다. 포장재를 뺀 내용물 무게로 나누면 판매글과 정산표가 같은 기준이 됩니다.",
    campaign: "c2c_howto_202609",
    nextLead: "단위를 맞췄다면 같은 칸으로 판매글을 올리세요.",
    formula: [
      "kg당 단가 = 상자 판매가 ÷ 상자 실중량(kg)",
      "정산 매출 = 실제로 판 상자 수 × 상자 판매가",
      "규격이 여러 개면 규격마다 따로 계산한 뒤 더하기",
    ],
    checks: ["가격 옆에 내용물 실중량(kg)을 적었는지", "규격마다 정산 행을 따로 만들었는지", "구매자가 따로 낸 택배비를 판매가에 더하지 않았는지"],
    modified: "2026-10-26",
    sections: [
      {
        title: "가격칸에는 상자 가격, 바로 옆에 실중량",
        paragraphs: ["‘10kg 상자’가 포장재를 포함한 무게인지, 내용물만의 무게인지에 따라 kg당 단가가 달라집니다. 판매글에는 내용물 실중량을 적고, 상자마다 무게가 조금씩 다르면 보장하는 최소 중량(예: 9.5kg 이상)을 적으세요.", "kg당 단가는 그 최소 중량으로 계산합니다. 평균 무게로 나누면 무게가 덜 나가는 상자를 받은 구매자와 다툼이 생기고, 내 단가도 실제보다 낮게 보입니다."],
      },
      {
        title: "예시: 5kg·10kg 두 규격을 한 글에 올릴 때 (가상 숫자)",
        paragraphs: ["아래 숫자는 계산 방법을 보여주는 가정이며 실제 시세가 아닙니다."],
        table: { caption: "규격별 kg당 단가와 매출", headers: ["규격", "상자 판매가", "kg당 단가", "판매 수량", "매출"], rows: [["5kg 상자", "16,000원", "3,200원", "20상자", "320,000원"], ["10kg 상자", "28,000원", "2,800원", "30상자", "840,000원"], ["합계", "—", "평균 2,900원", "50상자 (400kg)", "1,160,000원"]] },
        note: "평균 2,900원은 1,160,000원 ÷ 400kg입니다. 다음 판매에서 5kg와 10kg 비율이 바뀌면 이 평균은 맞지 않으므로, 정산표는 규격별 행으로 남기세요.",
      },
      {
        title: "계산기에 옮기는 법",
        paragraphs: ["농가 손익 계산기의 단위 이름에 ‘상자’, 단위당 실중량에 10, 판매가에 상자 가격 28,000원을 넣으면 상자당과 kg당 손익분기 판매가가 함께 나옵니다.", "규격이 두 가지면 규격마다 한 번씩 계산합니다. 생산비처럼 두 규격이 함께 쓰는 비용은 중량 비율(위 예시라면 5kg 100kg : 10kg 300kg = 1 : 3)로 나눠 넣으세요."],
      },
      {
        title: "받은 택배비와 판매가를 섞지 않기",
        paragraphs: ["구매자가 택배비를 따로 냈다면 판매가에 더하지 않습니다. 택배사에 그대로 내는 돈이라 매출도 비용도 아닙니다. 무료배송으로 팔았다면 판매가에 택배비가 들어 있으니 계산기의 택배비 칸에 실제로 낸 금액을 넣습니다."],
      },
    ],
    faq: [["포장재를 포함한 무게로 나눠도 되나요?", "아니요. 포장재를 뺀 내용물 무게로 나눠야 kg당 단가가 공식 가격정보나 다른 판매글과 같은 기준이 됩니다."], ["실중량이 상자마다 다르면요?", "판매글에 보장하는 최소 중량을 적고 그 무게로 kg당 단가를 계산하세요. 무게를 부풀려 kg당 단가가 실제보다 싸 보이는 일을 막고, 구매자와의 다툼도 줄어듭니다."]],
    related: ["meetup-parcel-cost", "kg-price-margin"],
    links: [["품종·중량·수확일 칸을 채워 판매글 올리기", "produce-listing-three-fields"]],
  },
  {
    slug: "meetup-parcel-cost",
    title: "방문 0원과 택배비를 손익에 넣는 법",
    description: "직거래에서 방문 수령과 택배 발송을 고를 때 판매자가 내는 택배비·포장재·배달 이동 비용을 상자당으로 나눠 남는 금액을 비교하는 방법입니다.",
    lead: "구매자가 직접 와서 가져가면 판매자가 내는 택배비는 0원이 맞습니다. 대신 약속 장소까지 갖다준다면 연료비가 들고, 택배로 보내면 택배비·완충 포장비와 파손 위험이 생깁니다. 같은 판매가라도 수령 방법에 따라 남는 돈이 다릅니다.",
    campaign: "c2c_howto_202609",
    nextLead: "수령 방법을 골랐다면 그 비용을 판매글 칸에 적으세요.",
    formula: [
      "방문 수령 상자당 비용 = 포장재 + (직접 배달 이동 비용 ÷ 상자 수)",
      "판매자 부담 택배 상자당 비용 = 택배용 포장재 + 택배비",
      "구매자가 택배비를 따로 내면 받은 금액과 낸 금액이 같아 손익에서 제외",
    ],
    checks: ["택배비를 누가 내는지 판매글에 적었는지", "무료배송이면 택배비를 비용으로 넣었는지", "직접 배달한 연료비·통행료를 빠뜨리지 않았는지"],
    modified: "2026-10-26",
    sections: [
      {
        title: "구매자가 와서 가져갈 때",
        paragraphs: ["판매자가 내는 택배비가 없으니 0원으로 계산합니다. 포장도 택배용보다 간단해질 수 있습니다.", "다만 판매자가 약속 장소까지 직접 실어다 준다면 그 연료비와 통행료는 비용입니다. 계산기에서는 직거래의 ‘기타 경로 비용’에 총액으로 넣으세요."],
      },
      {
        title: "택배비를 누가 내는지에 따라 달라지는 것",
        paragraphs: ["무료배송(판매자 부담)이면 택배비가 판매자의 비용입니다. 구매자 부담이면 구매자에게 받은 금액을 그대로 택배사에 내므로 손익에 넣지 않고, 받은 금액과 낸 금액이 다를 때 그 차액만 반영합니다.", "택배는 파손·반품도 생길 수 있으니 계산기의 감모·반품률에 예상 비율을 넣으세요. 이미 줄인 수량에 같은 비율을 다시 곱하지 않습니다."],
      },
      {
        title: "예시: 10kg 상자 28,000원, 방문 수령과 판매자 부담 택배 (가상 숫자)",
        paragraphs: ["아래 금액은 계산 방법을 보여주는 가정이며 실제 택배 요금이 아닙니다. 생산비는 두 방법이 같으므로 빼고 비교합니다."],
        table: { caption: "수령 방법별 상자당 남는 금액", headers: ["항목", "방문 수령", "판매자 부담 택배"], rows: [["판매가", "28,000원", "28,000원"], ["포장재", "800원", "2,200원"], ["택배비", "0원", "5,000원"], ["생산비 전 상자당 남는 금액", "27,200원", "20,800원"]] },
        note: "택배로 같은 금액을 남기려면 판매가를 6,400원 올려 34,400원으로 하거나, 택배비를 구매자 부담으로 바꿔야 합니다. 구매자 부담으로 바꾸면 포장재 차이 1,400원만 남습니다.",
      },
      {
        title: "한 글에 둘 다 받을 때",
        paragraphs: ["‘방문 28,000원 / 택배 포함 34,400원’처럼 수령 방법별 가격을 나눠 적고, 정산표에도 방법별로 행을 나눕니다. 한 가격으로 둘 다 받으면 택배 주문이 늘수록 남는 돈이 줄어듭니다."],
      },
    ],
    faq: [["방문 수령이면 택배비 칸에 0원을 넣으면 되나요?", "네. 판매자가 내는 택배비가 없으니 0원이 맞습니다. 직접 갖다준 경우의 연료비·통행료만 ‘기타 경로 비용’에 따로 넣으세요."], ["구매자가 낸 택배비는 매출인가요?", "택배사에 그대로 내는 돈이라면 매출에도 비용에도 넣지 않는 편이 정확합니다. 받은 금액과 낸 금액이 다르면 차액만 손익에 반영합니다."]],
    related: ["listing-price-fields", "sales-channel-comparison"],
    links: [["만나기 또는 택배를 고른 뒤 글에 적기", "meetup-vs-direct-shipping-choice"]],
  },
  {
    slug: "seasonal-price-window",
    title: "김장·햅쌀 글의 가격 유효일",
    description: "김장 배추와 햅쌀처럼 시즌에 값이 움직이는 품목의 판매글에 가격 유효일을 적고, 보관했다가 나중에 팔 때 필요한 손익분기 판매가를 계산하는 방법입니다.",
    lead: "시즌 품목은 몇 주 사이에도 값이 바뀌니, 판매글의 가격이 언제까지 유효한지 적어 두면 구매자와의 오해가 줄어듭니다. 보관했다가 나중에 팔면 저장비와 추가 감모가 생기므로, 나중 가격이 얼마 이상이어야 지금 파는 것보다 나은지 먼저 계산하세요.",
    campaign: "c2c_howto_202609",
    nextLead: "날짜 칸을 나눴다면 시즌 판매글에 그 날짜를 적으세요.",
    formula: [
      "가격 유효일 = 판매글의 단가로 실제 넘길 수 있는 마지막 날",
      "보관 후 손익분기 판매가 = (지금 팔 때 받는 단가 + 단위당 추가 보관비) ÷ (1 − 추가 감모율)",
      "수확일·도정일·가격 유효일은 서로 다른 칸",
    ],
    checks: ["판매글에 가격 유효일(○월 ○일까지)을 적었는지", "보관하면 늘어나는 저장비·감모를 넣고 다시 계산했는지", "햅쌀은 포장에 적힌 생산연도와 도정일을 그대로 옮겼는지"],
    modified: "2026-10-26",
    sections: [
      {
        title: "가격 유효일을 판매글에 적는 이유",
        paragraphs: ["‘11월 20일 출하분까지 10kg 망 12,000원’처럼 날짜를 적으면, 그 뒤에 값을 바꿔도 이전 가격으로 해 달라는 요청을 설명하기 쉽습니다.", "택배 도착 예정일은 배송 일정이지 가격 유효일이 아닙니다. 아직 밭에 있는 배추라면 출하할 수 있는 날을 기준으로 적습니다."],
      },
      {
        title: "예시: 배추를 지금 팔까, 2주 보관 뒤 팔까 (가상 숫자)",
        paragraphs: ["지금 10kg 망을 12,000원에 팔 수 있다고 가정합니다. 2주 보관하면 망당 저장비가 600원 들고, 시들거나 상해서 버리는 양이 5% 늘어난다고 봅니다. 아래 숫자는 계산 설명용 가정입니다."],
        table: { caption: "보관 후 손익분기 판매가 계산", headers: ["단계", "계산", "결과"], rows: [["지금 팔 때 망당 받는 금액", "12,000원", "12,000원"], ["보관 후 같아지려면", "(12,000원 + 600원) ÷ (1 − 0.05)", "약 13,263원"], ["보관 뒤 예상 판매가가 14,000원이면", "14,000원 × 0.95 − 600원", "망당 12,700원"]] },
        note: "보관 뒤 망당 13,263원 넘게 받을 수 있을 때만 보관이 지금 파는 것보다 낫습니다. 포장·운송비처럼 언제 팔아도 같은 비용은 양쪽에서 똑같이 빠지므로 이 비교에서는 빼도 됩니다.",
      },
      {
        title: "햅쌀은 생산연도·도정일과 가격 유효일을 나누기",
        paragraphs: ["햅쌀 판매글에는 포장에 적힌 생산연도와 도정일을 그대로 옮기고, 가격 유효일은 따로 적습니다. 주문을 받은 뒤 도정한다면 ‘주문 후 도정’이라고 쓰고 실제 도정일은 포장 표시로 확인하게 합니다.", "포장양곡의 표시사항과 표시방법은 양곡관리법 시행규칙 제7조의3과 별표 4에서 정합니다. 표시 의무가 궁금하면 국가법령정보센터 원문을 확인하세요."],
      },
    ],
    faq: [["절임배추 도착일을 가격 유효일로 써도 되나요?", "도착일은 배송 일정입니다. 그 가격으로 주문을 받을 수 있는 마지막 날을 따로 적으세요."], ["보관하면 감모율을 어떻게 넣나요?", "보관 때문에 늘어나는 비율만 넣습니다. 지금 팔 때도 생기는 감모까지 더하면 손실을 두 번 넣게 됩니다."]],
    related: ["listing-price-fields", "meetup-parcel-cost"],
    sourcesTitle: "확인한 공식 자료",
    sources: [["양곡관리법 시행규칙 제7조의3(양곡의 표시사항 등)·별표 4 (시행 2026. 8. 27., 확인일 2026-10-26)", "https://www.law.go.kr/법령/양곡관리법시행규칙"]],
    sourcesNote: "예시의 가격·저장비·감모율은 설명용 가정입니다.",
    links: [["출하일·도정일을 칸에 적어 시즌 글 올리기", "kimjang-rice-listing-dates"]],
  },
  {
    slug: "wholesale-commission-cap",
    title: "도매시장 위탁수수료 상한과 정산서 공제 항목",
    description: "공영도매시장에 위탁 출하할 때 부류별 위탁수수료 법정 상한, 표준정산서의 공제 명세, 규격출하품 표준하역비의 부담 주체를 법령 원문 기준으로 정리하고 손익 계산에 넣는 방법을 설명합니다.",
    lead: "도매시장법인이 출하자에게 받는 위탁수수료에는 법정 최고한도가 있습니다. 청과부류는 거래금액의 1천분의 70(7%), 양곡부류는 1천분의 20(2%)입니다. 실제 요율은 이 한도 안에서 각 도매시장 업무규정으로 정하므로, 출하 전에 거래할 도매시장법인에 확인하고 정산 뒤에는 표준정산서의 공제 명세와 대조하세요.",
    published: "2026-10-26",
    modified: "2026-10-26",
    formula: [
      "위탁수수료 = 판매대금(거래금액) × 출하한 도매시장법인의 위탁수수료율",
      "상한으로 잡은 수수료 = 거래금액 × 부류별 최고한도 (수수료를 가장 크게 잡은 값)",
      "정산금액 = 판매대금 총액 − 공제금액 총액(위탁수수료, 운송료 선급금, 하역비, 선별비 등)",
    ],
    checks: ["출하할 도매시장법인의 위탁수수료율을 출하 전에 확인했는지", "정산서 공제 명세의 항목이 내가 아는 비용과 맞는지", "규격출하품의 표준하역비가 출하자에게 공제되지 않았는지"],
    sections: [
      {
        title: "부류별 위탁수수료 최고한도",
        paragraphs: ["농수산물유통안정법 시행규칙 제39조제4항이 정한 최고한도입니다. 도매시장 개설자는 이 한도에서 업무규정으로 위탁수수료를 정할 수 있고, 일정액으로 받는 위탁수수료도 이 한도를 넘을 수 없습니다(같은 조 제5항).", "농협 등이 개설한 공판장에도 법 제45조에 따라 이 수수료 규정(법 제42조)과 표준하역비 규정(법 제40조)이 준용됩니다. 다만 규모·거래물량에 비추어 준용이 맞지 않는 공판장은 개설자가 업무규정으로 달리 정할 수 있으니, 공판장에 낼 때도 요율을 먼저 확인하세요."],
        table: { caption: "위탁수수료 최고한도 (거래금액 기준)", headers: ["부류", "법령 표기", "백분율"], rows: [["양곡부류", "1천분의 20", "2%"], ["청과부류", "1천분의 70", "7%"], ["수산부류", "1천분의 60", "6%"], ["축산부류", "1천분의 20", "2% (도매시장·공판장 안 도축장의 도살·해체수수료는 별도)"], ["화훼부류", "1천분의 70", "7%"], ["약용작물부류", "1천분의 50", "5%"]] },
        note: "이 표는 상한입니다. 실제 적용 요율은 시장·법인·품목에 따라 이보다 낮을 수 있습니다. 계산기에서 상한을 넣으면 수수료를 가장 보수적으로(크게) 잡은 결과가 됩니다.",
      },
      {
        title: "시장도매인에게 맡길 때의 중개수수료",
        paragraphs: ["시장도매인이 출하자와 매수인에게서 각각 받는 중개수수료는 해당 부류 위탁수수료 최고한도의 2분의 1을 넘지 못합니다(시행규칙 제39조제7항). 예를 들어 청과부류라면 출하자 쪽 중개수수료의 상한은 3.5%입니다."],
      },
      {
        title: "표준정산서에 들어가야 하는 항목",
        paragraphs: ["도매시장법인·시장도매인·공판장 개설자가 쓰는 표준정산서에는 다음이 들어가야 합니다(시행규칙 제38조). 발행일과 발행자명, 출하자명과 주소, 거래형태(매수·위탁·중개)와 매매방법(경매·입찰, 정가·수의매매), 판매 명세(품목·품종·등급별 수량·단가와 거래단위당 수량 또는 무게), 판매대금총액과 매수인, 공제 명세(위탁수수료, 운송료 선급금, 하역비, 선별비 등)와 공제금액 총액, 정산금액, 송금 명세.", "통장 입금액이 기대와 다르면 판매 명세의 수량·단가부터 맞추고, 공제 명세에서 금액이 빠진 항목을 하나씩 대조하세요."],
      },
      {
        title: "규격출하품의 표준하역비는 도매시장법인이 부담",
        paragraphs: ["도매시장 개설자가 업무규정으로 정하는 규격출하품에 대한 표준하역비(도매시장 안에서 규격출하품을 판매하기 위해 필수적으로 드는 하역비)는 도매시장법인 또는 시장도매인이 부담합니다(농수산물유통안정법 제40조제2항).", "그래서 계산기의 ‘운송·하역비’ 칸에는 실제로 내 정산서에서 빠지거나 내가 따로 낸 운송·하역 금액만 넣습니다. 내 물품이 규격출하품에 해당하는지는 출하할 시장에 확인하세요."],
      },
      {
        title: "대금 결제와 수수료 징수 제한",
        paragraphs: ["도매시장법인 또는 시장도매인은 위탁받은 농수산물이 매매되면 그 대금 전부를 출하자에게 즉시 결제해야 합니다. 대금 지급방법에 관해 따로 특약을 맺었다면 그 특약을 따릅니다(법 제41조제1항).", "도매시장 개설자, 도매시장법인, 시장도매인, 중도매인, 대금정산조직은 법에서 정한 사용료·수수료 외에는 어떤 명목으로도 금전을 징수할 수 없습니다(법 제42조제1항). 2026년 2월 27일 신설된 법 제42조제3항에 따라 농림축산식품부장관 또는 해양수산부장관은 도매시장법인·시장도매인에게 위탁수수료 조정을 권고할 수 있고, 그 기준과 절차가 2026년 9월 22일 시행규칙 제39조의2로 시행됐습니다. 농림축산식품부는 더 구체적인 기준을 고시로 정할 계획이라고 밝혔습니다. 이 개정이 위의 최고한도 숫자를 바꾼 것은 아닙니다."],
      },
      {
        title: "예시: 청과 거래금액 250만 원의 수수료 (가상 숫자)",
        paragraphs: ["10kg 100상자가 모두 250만 원에 팔렸고 운송료 선급금 12만 원이 공제된다고 가정합니다. 4%는 비교를 위한 임의 가정이며 특정 시장의 요율이 아닙니다."],
        table: { caption: "요율에 따른 정산금액 차이", headers: ["항목", "상한 7%로 계산", "4%로 가정"], rows: [["판매대금", "2,500,000원", "2,500,000원"], ["위탁수수료", "175,000원", "100,000원"], ["운송료 선급금", "120,000원", "120,000원"], ["정산금액", "2,205,000원", "2,280,000원"]] },
        note: "요율 3%p 차이가 이 물량에서 75,000원, 상자당 750원의 차이를 만듭니다. 실제 요율을 모르면 상한으로 먼저 계산해 두고, 확인한 뒤 다시 계산하세요.",
      },
    ],
    faq: [["청과면 모든 도매시장이 7%를 받나요?", "아닙니다. 7%는 청과부류의 법정 최고한도입니다. 각 도매시장 개설자가 그 한도 안에서 업무규정으로 정하고, 정산서에 적용된 금액이 나옵니다."], ["수수료 말고 다른 명목으로 떼어 가면요?", "법 제42조제1항은 정해진 사용료·수수료 외의 금전 징수를 금지합니다. 공제 명세에 근거를 알 수 없는 항목이 있으면 먼저 도매시장법인에 내역을 요청하고, 해결되지 않으면 해당 도매시장 관리사무소에 문의하세요."], ["계산기에는 무엇을 넣나요?", "‘도매시장 위탁’ 칸의 위탁수수료에 확인한 요율을, 모르면 부류별 상한을 넣으세요. 운송료·하역비는 정산서에서 실제로 빠지는 금액을 상자당으로 나눠 넣습니다."]],
    related: ["auction-net-proceeds", "sales-channel-comparison"],
    tool: {
      eyebrow: "직접 계산",
      title: "위탁수수료를 넣어 직거래·온라인과 비교",
      description: "도매시장 위탁 칸에서 부류별 법정 상한을 바로 넣고, 같은 물량을 직거래·온라인으로 팔 때와 예상 이익을 비교할 수 있습니다.",
      href: "/#calculator",
    },
    sourcesTitle: "법령 원문과 확인일",
    sources: [["농수산물 유통 및 가격안정에 관한 법률 시행규칙 제38조·제39조·제39조의2 (시행 2026. 9. 22., 농림축산식품부령 제792호)", "https://www.law.go.kr/법령/농수산물유통및가격안정에관한법률시행규칙"], ["농수산물 유통 및 가격안정에 관한 법률 제40조·제41조·제42조·제45조 (시행 2026. 10. 2., 법률 제21490호)", "https://www.law.go.kr/법령/농수산물유통및가격안정에관한법률"], ["농림축산식품부 보도자료: 개정 농안법 시행규칙 시행 (2026. 9. 22.)", "https://mafra.go.kr/bbs/home/792/579257/artclView.do"]],
    sourcesChecked: "2026-10-26",
    sourcesNote: "법령은 개정될 수 있으니 출하 전에 국가법령정보센터의 현행 조문을 다시 확인하세요. 예시의 금액과 4% 요율은 설명용 가정입니다. 이 글은 법률 자문이 아닙니다.",
    nextLead: "도매시장 경락 결과를 찾아보는 방법은 보리장터 안내에 정리되어 있습니다.",
    links: [["도매시장 경락 결과 조회하는 법", "https://boribay.com/guides/agricultural-wholesale-market-guide?utm_source=reportools.com&utm_medium=referral&utm_campaign=support"]],
  },
  {
    slug: "sales-channel-comparison",
    title: "직거래·도매시장·온라인 판매 손익 비교 예시",
    description: "감자 10kg 50상자를 직거래, 도매시장 위탁, 온라인 몰로 팔 때 매출·수수료·포장·운송비·감모를 같은 식에 넣어 예상 이익과 손익분기 판매가를 비교하는 가상 예시입니다.",
    lead: "판매가가 가장 높은 경로가 가장 많이 남는 것은 아닙니다. 수수료, 택배비, 감모가 경로마다 다르기 때문입니다. 아래 숫자는 모두 계산을 설명하려는 가정이며 실제 시세나 요금이 아닙니다.",
    published: "2026-10-26",
    modified: "2026-10-26",
    formula: [
      "판매 가능 수량 = 출하 수량 × (1 − 감모율)",
      "예상 이익 = 판매 가능 수량 × 판매가 × (1 − 수수료율) − 공통 비용 − 출하 수량 × (포장재 + 운송비) − 기타 경로 비용",
      "손익분기 판매가 = (공통 비용 + 포장·운송비 + 기타 경로 비용) ÷ (판매 가능 수량 × (1 − 수수료율))",
    ],
    checks: ["경로별 판매가를 같은 규격·등급 기준으로 넣었는지", "택배비를 누가 내는지 확인했는지(구매자 부담이면 0)", "도매시장 위탁수수료를 확인한 요율 또는 법정 상한으로 넣었는지"],
    sections: [
      {
        title: "공통 조건: 10kg 50상자, 공통 비용 740,000원",
        paragraphs: ["생산비 620,000원, 선별 인건비 80,000원, 기타 40,000원을 더한 740,000원은 어느 경로로 팔아도 같으므로 세 경로에 똑같이 들어갑니다. 상자당 실중량은 10kg로 둡니다."],
      },
      {
        title: "경로별 가정",
        paragraphs: ["포장재와 운송비는 상자당 금액이고, 감모·반품된 상자에도 이미 들었다고 봅니다."],
        table: { caption: "경로별 입력값 (가상)", headers: ["항목", "직거래", "도매시장 위탁", "온라인 몰"], rows: [["판매가 (상자당)", "28,000원", "21,000원 (예상 낙찰가)", "31,000원"], ["수수료", "0% (계좌이체)", "7% (청과부류 법정 상한)", "12% (판매·결제 합계 가정)"], ["감모·반품", "3%", "2%", "5%"], ["포장재 (상자당)", "2,200원", "1,600원", "2,600원"], ["운송·택배 (상자당)", "5,000원", "2,000원", "4,000원"], ["기타 경로 비용", "20,000원 (배달 연료)", "0원", "30,000원 (광고)"]] },
      },
      {
        title: "한 줄씩 계산한 결과",
        paragraphs: ["도매시장 예: 판매 가능 수량 50 × (1 − 0.02) = 49상자, 매출 49 × 21,000원 = 1,029,000원, 수수료 1,029,000원 × 7% = 72,030원, 포장·운송비 50 × (1,600원 + 2,000원) = 180,000원입니다."],
        table: { caption: "경로별 계산 결과", headers: ["항목", "직거래", "도매시장 위탁", "온라인 몰"], rows: [["판매 가능 수량", "48.5상자", "49상자", "47.5상자"], ["매출", "1,358,000원", "1,029,000원", "1,472,500원"], ["수수료", "0원", "72,030원", "176,700원"], ["포장·운송비", "360,000원", "180,000원", "330,000원"], ["기타 경로 비용", "20,000원", "0원", "30,000원"], ["총비용 (공통 740,000원 포함)", "1,120,000원", "992,030원", "1,276,700원"], ["예상 이익", "238,000원", "36,970원", "195,800원"], ["이익률 (매출 대비)", "17.5%", "3.6%", "13.3%"], ["손익분기 판매가 (상자당)", "23,093원", "20,189원", "26,316원"], ["손익분기 판매가 (kg당)", "2,309원", "2,019원", "2,632원"]] },
      },
      {
        title: "결과를 읽는 법",
        paragraphs: ["직거래가 가장 많이 남지만 50상자를 모두 직거래로 팔 수 있다는 가정입니다. 30상자만 직거래로 팔리고 나머지를 도매시장에 낸다면, 경로별로 수량을 나누고 공통 비용도 수량 비율로 나눠 따로 계산한 뒤 더하세요.", "도매시장은 판매가 여유가 811원(21,000원 − 20,189원)뿐입니다. 낙찰가가 4% 가까이만 낮아져도 손실로 바뀝니다. 온라인은 판매가가 가장 높아도 수수료 12%와 택배비 때문에 손익분기가 26,316원이라, 2만 6천 원대로 할인하면 남는 것이 거의 없습니다.", "숫자에 없는 것도 있습니다. 주문 응대·포장에 드는 내 시간, 대금이 들어오는 시점, 반품 분쟁, 낙찰가의 변동은 경로를 고를 때 따로 따져 보세요."],
      },
      {
        title: "내 숫자로 바꿔 계산하기",
        paragraphs: ["계산기 첫 화면에서 ‘감자 10kg’ 예시를 누르면 이 글과 같은 숫자가 들어갑니다. 판매가·수수료·택배비를 내 거래 조건으로 바꾸면 결과와 대입한 계산 과정이 바로 바뀌고, CSV로 저장하거나 인쇄할 수 있습니다."],
      },
    ],
    faq: [["직거래가 항상 유리한가요?", "아닙니다. 계산기의 ‘복숭아 4kg’ 예시처럼 택배 파손이 많은 품목은 같은 가정에서도 도매시장이 더 남을 수 있습니다."], ["여러 경로로 나눠 팔면 어떻게 계산하나요?", "경로별로 팔 수량을 정하고, 공통 비용을 수량 비율로 나눠 경로마다 따로 계산한 뒤 이익을 더합니다."]],
    related: ["wholesale-commission-cap", "meetup-parcel-cost"],
    tool: {
      eyebrow: "직접 계산",
      title: "내 숫자로 세 경로 비교하기",
      description: "공통 비용과 경로별 판매가·수수료·감모·포장·운송비를 넣으면 예상 이익과 상자당·kg당 손익분기 판매가를 계산합니다.",
      href: "/#calculator",
    },
    nextLead: "직거래로 팔기로 했다면 같은 지역의 비슷한 판매글부터 살펴보세요.",
    links: [["보리장터 농산물 매물 둘러보기", "https://boribay.com/?category=PRODUCE&utm_source=reportools.com&utm_medium=referral&utm_campaign=support"]],
  },
];

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const href = (url) => esc(/[^\x00-\x7f]/.test(url) ? encodeURI(url) : url);
const publisher = { "@type": "Organization", name: "제이 미디어", alternateName: "J MEDIA", url: "https://jnewmedia.com/" };
const style = `:root{--g:#104b2d;--g2:#1d6b42;--y:#f7bd24;--ink:#171a18;--text:#464e49;--muted:#4d5751;--line:#d5ddd8;--pale:#f2f7f3;--max:1000px}*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR','Noto Sans CJK KR',sans-serif;color:var(--ink);font-size:17px;line-height:1.7;word-break:keep-all;overflow-wrap:anywhere}a{text-decoration:none;color:inherit}:focus-visible{outline:3px solid var(--y);outline-offset:2px}.site-header{border-bottom:1px solid var(--line);display:flex;align-items:center;flex-wrap:wrap;gap:4px 18px;padding:10px max(16px,calc((100% - var(--max))/2));background:#fff}.brand{display:flex;gap:10px;align-items:center;min-height:48px}.brand-mark{width:34px;height:34px;border-radius:50%;background:var(--y);display:grid;place-items:center;color:var(--g);font-weight:700}.brand strong{color:var(--g);font-size:21px}.site-header nav{margin-left:auto;display:flex;gap:4px;overflow-x:auto;max-width:100%}.site-header nav a{display:flex;align-items:center;min-height:44px;padding:0 10px;font-size:16px;font-weight:700;white-space:nowrap;border-radius:8px}.site-header nav a:hover,.site-header nav a:focus-visible{background:var(--pale);color:var(--g2)}main{max-width:var(--max);margin:auto;padding:0 16px}.crumb{padding-top:22px;display:flex;align-items:center;flex-wrap:wrap;gap:8px;color:var(--muted);font-size:16px}.crumb a{text-decoration:underline;text-underline-offset:3px;display:inline-flex;align-items:center;min-height:44px}.hero{padding:40px 0 30px}.hero>p,.cards article>p,.article>header>p{color:var(--g2);font-size:16px;font-weight:700;margin:0}.hero h1{font-size:42px;line-height:1.25;letter-spacing:-1.5px;margin:7px 0}.hero h1 em{font-style:normal;color:var(--g)}.hero>span,.cards article>span,.article>header>span{color:var(--text)}.group{padding-bottom:30px}.group>h2{font-size:22px;margin:0 0 12px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.cards article{border:1px solid var(--line);border-radius:12px;padding:20px;display:flex;flex-direction:column}.cards h3{font-size:19px;line-height:1.45;margin:6px 0}.cards h3 a{display:flex;align-items:center;min-height:44px}.cards article>a{display:flex;align-items:center;gap:7px;margin-top:auto;padding-top:12px;min-height:44px;color:var(--g2);font-weight:700}.article>header{padding:30px 0;border-bottom:1px solid var(--line)}.article h1{font-size:37px;line-height:1.3;margin:7px 0}.layout{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:34px;padding:30px 0 60px}.lead{padding:18px;border-left:4px solid var(--y);background:#fff9e9}.lead p{margin-bottom:0;color:var(--text)}.layout section{padding:16px 0;border-bottom:1px solid var(--line)}.layout h2{font-size:22px;line-height:1.4}.formula{list-style:none;padding:0;counter-reset:formula}.formula li{counter-increment:formula;padding:13px;margin:8px 0;background:var(--pale)}.formula li:before{content:counter(formula);display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#fff;color:var(--g2);font-weight:700;margin-right:8px}.tool-cta{display:block;margin:18px 0 4px;padding:20px 22px;border-radius:12px;background:var(--g);color:#fff}.tool-cta small{display:block;color:#f8ce55;font-weight:700;font-size:16px}.tool-cta h2{margin:4px 0;font-size:22px}.tool-cta span{display:block;color:#e4eee8}.tool-cta strong{display:inline-flex;align-items:center;gap:7px;margin-top:14px;min-height:44px;padding:8px 14px;border-radius:8px;background:#fff;color:var(--g)}.checks li{color:var(--text);margin:8px 0}.next{align-self:start;position:sticky;top:20px;background:var(--pale);padding:20px;border-radius:10px}.next h2{font-size:20px;margin-top:0}.next p{color:var(--text)}.next a{display:flex;justify-content:space-between;gap:8px;min-height:48px;background:#fff;border:1px solid var(--line);border-radius:8px;padding:11px 12px;margin-top:8px;color:var(--g2);font-weight:700}.next small{display:block;margin-top:10px;color:var(--muted);font-size:16px}footer{border-top:1px solid var(--line);padding:22px max(16px,calc((100% - var(--max))/2));display:flex;flex-wrap:wrap;gap:8px 18px;color:var(--text)}footer nav{margin-left:auto;display:flex;flex-wrap:wrap;gap:4px 14px}footer a{min-height:44px;display:inline-flex;align-items:center;color:var(--g2)}@media(max-width:760px){.site-header nav{margin-left:0;width:100%}.cards,.layout{grid-template-columns:1fr}.hero h1,.article h1{font-size:30px;letter-spacing:-.8px}.tool-cta{padding:18px}.tool-cta h2{font-size:20px}.next{position:static}}`;
const contentStyle = `.layout>div{min-width:0}.table-scroll{overflow:auto;margin:18px 0}.table-scroll:focus{outline:2px solid var(--g2);outline-offset:3px}table{width:100%;min-width:450px;border-collapse:collapse;font-size:16px}caption{text-align:left;font-weight:700;margin-bottom:10px}th,td{text-align:left;vertical-align:top;border:1px solid var(--line);padding:10px}thead{background:var(--pale)}tbody th{font-weight:700}.example-note{background:var(--pale);padding:14px}.article h3{font-size:18px;margin-bottom:4px}.related a,.layout section p a{color:var(--g2);text-decoration:underline;text-underline-offset:3px}.related li{margin:9px 0}`;
const head = (title, description, canonical, type = "article") => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | 농가 손익 계산기</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${esc(title)} | 농가 손익 계산기"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="${type}"><meta property="og:url" content="${canonical}">${faviconLink}<style>${style}${contentStyle}</style><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5877883031077615" crossorigin="anonymous"></script></head><body><header class="site-header"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">₩</span><strong>농가 손익 계산기</strong></a><nav aria-label="주요 메뉴"><a href="/">손익 계산기</a><a href="/guides/">정산 가이드</a><a href="/tools/used-tractor-total-cost/">트랙터 총비용</a><a href="/about/">소개</a></nav></header>`;
const foot = `<footer><strong>농가 손익 계산기</strong><span>운영: 제이 미디어(J MEDIA) · 보리장터와 같은 운영자</span><nav aria-label="하단 메뉴"><a href="/guides/">정산 가이드</a><a href="/tools/used-tractor-total-cost/">트랙터 총비용</a><a href="/about/">소개·정정 요청</a></nav></footer></body></html>`;

export const guideUrls = ["/guides/", ...guides.map((guide) => `/guides/${guide.slug}/`)];
export const guideLastModified = Object.fromEntries(guides.map((guide) => [`/guides/${guide.slug}/`, guide.modified ?? date]));
guideLastModified["/guides/"] = Object.values(guideLastModified).sort().at(-1);
export const guidePages = {};
const groups = [
  ["계산기와 함께 보는 예시·기준", ["sales-channel-comparison", "wholesale-commission-cap"]],
  ["정산서 읽기", ["auction-net-proceeds", "consignment-settlement", "kg-price-margin"]],
  ["직거래 판매글과 손익", ["listing-price-fields", "meetup-parcel-cost", "seasonal-price-window"]],
];
const grouped = groups.flatMap(([, slugs]) => slugs);
for (const guide of guides) if (!grouped.includes(guide.slug)) throw new Error(`guide hub group missing: ${guide.slug}`);
const card = (label, url, title, description, action) => `<article><p>${label}</p><h3><a href="${url}">${esc(title)}</a></h3><span>${esc(description)}</span><a href="${url}">${action} →</a></article>`;
const hubGroups = groups.map(([title, slugs]) => `<section class="group"><h2>${title}</h2><div class="cards">${slugs.map((slug) => { const guide = guides.find((item) => item.slug === slug); return card("정산 원리", `/guides/${slug}/`, guide.title, guide.description, "읽어 보기"); }).join("")}</div></section>`).join("") + `<section class="group"><h2>직접 계산</h2><div class="cards">${card("계산기", "/", "직거래·도매시장·온라인 손익 비교", "공통 비용과 경로별 판매가·수수료·감모·포장·운송비로 예상 이익과 손익분기 판매가를 계산합니다.", "계산기 열기")}${card("계산기", "/tools/used-tractor-total-cost/", "중고 트랙터 구입·보유 총비용", "구입 총액에 보유 기간의 연료·정비·보험·이자와 처분가를 더해 연평균·시간당 비용을 비교합니다.", "계산기 열기")}</div></section>`;
const hubSchema = JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "농산물 판매·정산 가이드", url: `${base}/guides/`, inLanguage: "ko-KR", publisher, hasPart: guides.map((guide) => ({ "@type": "Article", name: guide.title, url: `${base}/guides/${guide.slug}/` })) }).replace(/</g, "\\u003c");
guidePages["/guides/"] = `${head("농산물 판매·정산 가이드", "판매 경로별 손익 비교 예시, 도매시장 위탁수수료 상한, 경매·위탁판매 정산서 읽는 법, 직거래 판매글의 단위와 택배비 처리까지 농가 정산을 같은 원리로 정리한 가이드입니다.", `${base}/guides/`, "website")}<script type="application/ld+json">${hubSchema}</script><main><nav class="crumb" aria-label="현재 위치"><a href="/">손익 계산기</a><span>›</span><span>정산 가이드</span></nav><section class="hero"><p>숫자를 넣기 전에</p><h1>농산물 판매·정산<br><em>계산 원리</em></h1><span>판매 경로가 달라도 매출에서 빠지는 비용을 같은 표로 만들면 실제로 남는 돈을 비교할 수 있습니다. 예시 숫자는 모두 설명용 가정이며, 법령·공식 자료는 출처와 확인일을 함께 적었습니다.</span></section>${hubGroups}</main>${foot}`;

for (const guide of guides) {
  const path = `/guides/${guide.slug}/`;
  const canonical = `${base}${path}`;
  const formulas = guide.formula.map((item) => `<li>${esc(item)}</li>`).join("");
  const checks = guide.checks.map((item) => `<li>${esc(item)}</li>`).join("");
  const campaign = guide.campaign ?? "farm_settlement_guides";
  const links = guide.links.map(([text, slug, content = guide.slug]) => {
    const url = slug.startsWith("https://") ? slug : `https://boribay.com/guides/${slug}?utm_source=reportools.com&utm_medium=owned_referral&utm_campaign=${campaign}&utm_content=${content}`;
    return `<a href="${esc(url)}">${esc(text)} <span aria-hidden="true">→</span></a>`;
  }).join("");
  const sections = guide.sections.map((section) => {
    const table = section.table ? `<div class="table-scroll" role="region" aria-label="${esc(section.table.caption)}" tabindex="0"><table><caption>${esc(section.table.caption)}</caption><thead><tr>${section.table.headers.map((cell) => `<th scope="col">${esc(cell)}</th>`).join("")}</tr></thead><tbody>${section.table.rows.map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : "";
    return `<section><h2>${esc(section.title)}</h2>${section.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}${table}${section.note ? `<p class="example-note">${esc(section.note)}</p>` : ""}</section>`;
  }).join("");
  const faq = `<section><h2>자주 묻는 질문</h2>${guide.faq.map(([question, answer]) => `<h3>${esc(question)}</h3><p>${esc(answer)}</p>`).join("")}</section>`;
  const related = `<section><h2>다음 계산으로 이어가기</h2><ul class="related">${guide.related.map((slug) => { const target = guides.find((item) => item.slug === slug); return `<li><a href="/guides/${slug}/">${esc(target.title)}</a></li>`; }).join("")}<li><a href="/">내 비용으로 판매 경로별 손익 계산하기</a></li></ul></section>`;
  const sources = guide.sources ? `<section><h2>${esc(guide.sourcesTitle ?? "가격 단위를 확인한 공식 자료")}</h2><ul class="related">${guide.sources.map(([label, url]) => `<li><a href="${href(url)}">${esc(label)}</a></li>`).join("")}</ul><p>${guide.sourcesChecked ? `확인일: ${guide.sourcesChecked}. ` : ""}${esc(guide.sourcesNote ?? "계산 예시의 가격·비용·수수료율은 위 자료의 실제 거래값이 아닌 설명용 가정입니다.")}</p></section>` : "";
  const tool = guide.tool ? `<a class="tool-cta" href="${esc(guide.tool.href)}"><small>${esc(guide.tool.eyebrow)}</small><h2>${esc(guide.tool.title)}</h2><span>${esc(guide.tool.description)}</span><strong>무료 계산기 열기 <span aria-hidden="true">→</span></strong></a>` : "";
  const modified = guide.modified ?? date;
  const published = guide.published ?? date;
  const schema = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, datePublished: published, dateModified: modified, inLanguage: "ko-KR", mainEntityOfPage: canonical, author: { "@type": "Organization", name: "농가 손익 계산기", url: base }, publisher }).replace(/</g, "\\u003c");
  const sameOperator = links.includes("boribay.com") ? `<small>보리장터는 이 계산기와 같은 운영자 제이 미디어가 운영합니다.</small>` : "";
  guidePages[path] = `${head(guide.title, guide.description, canonical)}<script type="application/ld+json">${schema}</script><main><nav class="crumb" aria-label="현재 위치"><a href="/">손익 계산기</a><span>›</span><a href="/guides/">정산 가이드</a></nav><article class="article"><header><p>정산 원리 · ${modified === published ? `작성 ${published}` : `업데이트 ${modified}`}</p><h1>${esc(guide.title)}</h1><span>${esc(guide.description)}</span></header><div class="layout"><div><aside class="lead"><strong>핵심</strong><p>${esc(guide.lead)}</p></aside><section><h2>계산식</h2><ol class="formula">${formulas}</ol>${tool}</section>${sections}<section><h2>빠뜨리기 쉬운 항목</h2><ul class="checks">${checks}</ul></section>${faq}${related}${sources}<section><h2>계산 뒤 기록할 것</h2><p>계산 기준일, 품목·규격, 수량·단가, 각 비용의 근거와 실제 입금액을 함께 저장하세요. 계산기 결과는 CSV로 저장하거나 인쇄할 수 있습니다.</p></section></div><aside class="next"><h2>실제 거래 기준</h2><p>${esc(guide.nextLead ?? "같은 계산 원리로 시세·직거래 가이드를 이어서 확인하세요.")}</p>${links}${sameOperator}</aside></div></article></main>${foot}`;
}
