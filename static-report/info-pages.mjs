// Site information pages: about, contact, editorial policy, corrections log, privacy policy, terms.
import { faviconLink } from "./favicon.mjs";
import { base, breadcrumbNode, checkedDate, jsonLd, operator, orgRef, sharedCss, siteFooter, websiteId } from "./site-shared.mjs";

const utm = "utm_source=reportools.com&amp;utm_medium=referral&amp;utm_campaign=support";

const css = `:root{--g:#104b2d;--g2:#1d6b42;--y:#f7bd24;--ink:#171a18;--text:#464e49;--line:#d5ddd8;--pale:#f2f7f3;--max:860px}*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR','Noto Sans CJK KR',sans-serif;color:var(--ink);font-size:17px;line-height:1.75;word-break:keep-all;overflow-wrap:anywhere;background:#fff}a{color:var(--g2)}:focus-visible{outline:3px solid var(--y);outline-offset:2px}.site-header{border-bottom:1px solid var(--line);display:flex;align-items:center;flex-wrap:wrap;gap:4px 18px;padding:10px max(16px,calc((100% - 1000px)/2))}.brand{display:flex;gap:10px;align-items:center;min-height:48px;text-decoration:none}.brand-mark{width:34px;height:34px;border-radius:50%;background:var(--y);display:grid;place-items:center;color:var(--g);font-weight:700}.brand strong{color:var(--g);font-size:21px}.site-header nav{margin-left:auto;display:flex;gap:4px;overflow-x:auto;max-width:100%}.site-header nav a{display:flex;align-items:center;min-height:44px;padding:0 10px;font-weight:700;color:var(--ink);text-decoration:none;white-space:nowrap}main{max-width:var(--max);margin:auto;padding:12px 16px 40px}.crumb{display:flex;flex-wrap:wrap;align-items:center;gap:8px;color:var(--text);font-size:16px}.crumb a{display:inline-flex;align-items:center;min-height:44px}h1{font-size:36px;line-height:1.3;margin:6px 0 12px}h2{font-size:23px;line-height:1.4;margin:30px 0 8px}h3{font-size:19px;margin:20px 0 4px}.eyebrow{color:var(--g2);font-weight:700;margin:0}.box{background:var(--pale);border-radius:12px;padding:16px 18px}dl{display:grid;grid-template-columns:170px 1fr;gap:8px 16px;margin:0}dt{font-weight:700}dd{margin:0}ul,ol{padding-left:22px}li{margin:6px 0}.table-scroll{overflow-x:auto;margin:12px 0}table{border-collapse:collapse;width:100%;min-width:480px;font-size:16px}th,td{border:1px solid var(--line);padding:9px 10px;text-align:left;vertical-align:top}thead th{background:var(--pale)}.log li{margin:12px 0}.log time{font-weight:700}.note{color:var(--text);font-size:16px}@media(max-width:640px){.site-header nav{margin-left:0;width:100%}h1{font-size:29px}dl{grid-template-columns:1fr}dt{margin-top:6px}}${sharedCss}`;

const pages = {};
const nav = (current) => `<nav aria-label="주요 메뉴">${[["/", "손익 계산기"], ["/guides/", "정산 가이드"], ["/tools/used-tractor-total-cost/", "트랙터 총비용"], ["/about/", "소개"]].map(([url, label]) => `<a href="${url}"${url === current ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>`;

function page({ path, title, description, type = "WebPage", eyebrow, h1, body, published = checkedDate }) {
  const canonical = `${base}${path}`;
  const node = { "@type": type, "@id": `${canonical}#webpage`, name: title, description, url: canonical, inLanguage: "ko-KR", isPartOf: { "@id": websiteId }, datePublished: published, dateModified: checkedDate, author: orgRef, publisher: orgRef, breadcrumb: { "@id": `${canonical}#breadcrumb` } };
  if (type === "AboutPage" || type === "ContactPage") node.mainEntity = orgRef;
  pages[path] = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | 농가 손익 계산기</title><meta name="description" content="${description}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${title} | 농가 손익 계산기"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR">${faviconLink}<style>${css}</style>${jsonLd(node, breadcrumbNode(path, [["손익 계산기", "/"], [title, path]]))}</head><body><header class="site-header"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">₩</span><strong>농가 손익 계산기</strong></a>${nav(path)}</header><main><nav class="crumb" aria-label="현재 위치"><a href="/">손익 계산기</a><span aria-hidden="true">›</span><span>${title}</span></nav><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1>${body}<p class="note">게시일 ${published} · 최종 확인일 ${checkedDate} · 작성·관리: 제이 미디어 편집팀 (운영 책임: 대표 이정우)</p></main>${siteFooter}</body></html>`;
}

const operatorTable = `<div class="box"><dl><dt>운영자</dt><dd>제이 미디어(J MEDIA, 제이미디어)</dd><dt>대표</dt><dd>${operator.ceo}</dd><dt>사업자등록번호</dt><dd>${operator.bizNo}</dd><dt>주소</dt><dd>${operator.address}</dd><dt>고객센터</dt><dd><a href="tel:${operator.phone}">${operator.phone}</a></dd><dt>이메일</dt><dd><a href="mailto:${operator.email}">${operator.email}</a></dd><dt>카카오톡 오픈채팅</dt><dd><a href="${operator.kakaoGeneral}">제휴·일반 문의</a> · <a href="${operator.kakaoBoribay}">보리장터 이용 문의</a></dd><dt>회사 정보</dt><dd><a href="${operator.companyInfo}">jnewmedia.com 회사 정보</a></dd></dl></div>`;

page({
  path: "/about/",
  type: "AboutPage",
  title: "소개",
  description: "농가 손익 계산기가 무엇을 계산하는지, 운영자 제이 미디어(J MEDIA)의 사업자 정보와 연락처, 보리장터·자매 사이트와의 관계, 운영 비용과 광고를 안내합니다.",
  eyebrow: "소개·운영자",
  h1: "농가 손익 계산기 소개",
  published: "2026-10-26",
  body: `<p>농가 손익 계산기는 농산물을 팔기 전에 <strong>어디로 팔면 얼마가 남는지</strong>, <strong>얼마 이상 받아야 손해를 보지 않는지</strong>를 직접 계산해 보는 무료 도구입니다. 직거래·도매시장 위탁·온라인 몰의 예상 이익과 손익분기 판매가를 같은 식으로 비교하고, 중고 트랙터를 살 때는 구입·보유 총비용을 비교합니다. 경매·위탁판매 정산서를 읽는 법과 도매시장 위탁수수료의 법정 상한은 정산 가이드에 정리했습니다.</p><p>직접 판매가를 정하는 농가, 도매시장이나 공판장에 출하하는 농가, 중고 농기계 구입을 앞둔 농가가 거래처의 견적과 정산서를 같은 기준으로 맞춰 볼 수 있도록 만들었습니다.</p><h2>무엇을 할 수 있나요</h2><ul><li><a href="/">판매 경로별 손익 계산기</a>: 직거래·도매시장 위탁·온라인 몰의 예상 이익, 상자당·kg당 이익과 손익분기 판매가</li><li><a href="/tools/used-tractor-total-cost/">중고 트랙터 구입·보유 총비용 계산기</a>: 구입 총액, 보유 기간 총비용, 연평균·시간당 비용</li><li><a href="/guides/">정산 가이드</a>: 위탁수수료 상한, 경매·위탁판매 정산서, 판매글 단위와 택배비 처리</li><li><a href="/mn/" lang="mn">Монгол хэрэгслүүд</a>: 몽골어 고기 kg 비교·밀 순수입 계산기(보리장터 몽골어 이용자용, 검색 노출 제외)</li></ul><h2>누가 운영하나요</h2><p>이 사이트는 제이 미디어가 운영합니다. 사업자 정보와 연락처는 다음과 같습니다.</p>${operatorTable}<h2>왜 이 주제를 다루나요</h2><p>제이 미디어는 같은 지역 사람끼리 농산물과 중고 농기계를 사고팔고 농기계 탁송 업체를 찾는 거래 서비스 <a href="https://boribay.com/?${utm}">보리장터</a>를 운영합니다. 거래를 앞두면 “이 값에 팔아도 남는가”, “싼 매물이 결국 싼가”를 숫자로 따져 봐야 합니다. 농가 손익 계산기는 거래 전 그 계산 단계를 맡는 도구로 만들었습니다. 그래서 계산기 결과 뒤에는 필요할 때 보리장터 매물이나 안내로 이어지는 링크가 있고, 링크 옆에 같은 운영자라는 사실을 적습니다.</p><h2>보리장터와 자매 사이트</h2><p>아래 사이트는 모두 제이 미디어가 운영하며, 보리장터 거래의 앞뒤 단계를 하나씩 맡습니다. 같은 운영자의 서비스이므로 서로 연결할 때 독립된 외부 추천이나 전문가 검증으로 표시하지 않습니다.</p><ul><li><a href="https://boribay.com/?${utm}">보리장터</a> — 지역 농산물·중고 농기계 거래, 농기계 탁송 업체 찾기</li><li><a href="https://yomiwiki.com/">농산물 거래사전</a> — 농산물·농기계 거래 용어와 현장 확인 기준</li><li><a href="https://scamreader.com/">직거래 사기 점검</a> — 받은 문자·판매글의 직거래 사기 신호 점검</li><li>농가 손익 계산기 — 이 사이트, 판매 경로별 손익과 손익분기 판매가</li><li><a href="https://goatool.com/">거래 증빙 도우미</a> — 거래 때 남길 사진과 서류 정리</li><li><a href="https://occultworldcup.com/">농사 비교 월드컵</a> — 작물 품종과 농기계를 1:1로 비교</li><li><a href="https://policyfundpedia.com/">농업 정책자금 백과</a> — 농업 정책자금의 종류와 신청 조건</li><li><a href="https://megapureunasset.kr/">농기계 자산 수첩</a> — 농기계 인수 상태·정비·사고 이력 기록</li><li><a href="https://sumimap.com/">영농폐기물 집하장 지도</a> — 가까운 영농폐기물 공동집하장 찾기</li><li><a href="https://tripmarking.com/">농기계 탁송 견적 비교</a> — 탁송 견적 요청서와 받은 견적 비교</li></ul><h2>운영 비용과 광고</h2><p>계산기와 정산 가이드 페이지에는 Google AdSense 광고 코드가 들어 있으며, 광고 수익은 사이트 운영에 씁니다. 그 밖의 비용은 운영자 제이 미디어가 부담합니다. 현재 유료 게재, 협찬 글, 제휴 수수료를 받는 링크는 없습니다. 광고는 Google이 게재하며 광고주는 계산식이나 글 내용에 관여하지 않습니다. 쿠키와 맞춤 광고 해제 방법은 <a href="/privacy/">개인정보처리방침</a>에 있습니다.</p><h2>어떻게 만들고 고치나요</h2><p>법령·공식 자료를 원문으로 확인해 출처와 확인일을 적고, 계산식과 대입한 숫자를 공개합니다. 초안 작성과 자료 대조에 AI 도구를 활용하며, 게시 내용의 책임은 운영자에게 있습니다. 자세한 기준은 <a href="/editorial-policy/">편집 원칙</a>에, 오류를 알리는 방법과 지금까지 고친 내용은 <a href="/contact/">문의</a>와 <a href="/corrections/">정정·수정 기록</a>에 있습니다.</p>`,
});

page({
  path: "/contact/",
  type: "ContactPage",
  title: "문의",
  description: "농가 손익 계산기 운영자 제이 미디어의 고객센터 전화, 이메일, 카카오톡 오픈채팅, 주소와 계산 오류·출처 변경을 제보할 때 적어 주실 내용을 안내합니다.",
  eyebrow: "문의·오류 제보",
  h1: "문의와 오류 제보",
  body: `<p>계산이 틀렸거나, 출처 법령이 바뀌었거나, 설명이 헷갈리는 곳을 발견하면 아래 연락처로 알려 주세요. 사이트 이용과 제휴 문의도 같은 곳에서 받습니다.</p>${operatorTable}<p class="note">공개적으로 남겨도 되는 오류 제보는 <a href="https://github.com/wlstj86231-cloud/reportfit/issues">GitHub Issues</a>에도 올릴 수 있습니다. GitHub 계정이 필요하며 작성 내용이 공개됩니다.</p><h2>어디로 문의하면 되나요</h2><ul><li><strong>계산 오류·출처 변경·사이트 이용·제휴</strong>: 고객센터 전화, 이메일, 카카오톡 ‘제휴·일반 문의’</li><li><strong>보리장터 매물·거래·회원 문의</strong>: 카카오톡 ‘보리장터 이용 문의’</li></ul><h2>오류를 제보할 때 적어 주실 것</h2><ol><li>문제가 있는 페이지 주소</li><li>틀린 문장, 또는 계산기에 넣은 입력값과 기대한 결과</li><li>바른 내용을 확인할 수 있는 원문 주소(법령, 공식 요금표 등)</li><li>답변을 받을 연락 방법(원할 때만)</li></ol><p>거래 상대방의 계좌번호·연락처·주민등록번호 같은 개인정보는 적지 마세요. 계산에 필요한 숫자만으로 충분합니다.</p><h2>답변과 처리</h2><p>영업일 기준으로 내용을 확인한 뒤 답변합니다. 확인된 오류는 해당 페이지를 고치고 최종 확인일을 바꾼 뒤 <a href="/corrections/">정정·수정 기록</a>에 날짜와 함께 남깁니다.</p><h2>이 사이트가 하지 않는 일</h2><p>개별 거래의 세무·법률·금융 상담, 거래 중개나 대금 보증, 특정 매물·판매처의 추천은 하지 않습니다. 도매시장 위탁수수료와 정산 공제는 출하한 도매시장법인이나 도매시장 관리사무소에, 세금은 국세청이나 세무 전문가에게 확인하세요. 확인할 곳은 <a href="/terms/">이용약관</a>의 표에 모아 두었습니다.</p>`,
});

page({
  path: "/editorial-policy/",
  title: "편집 원칙",
  description: "농가 손익 계산기의 글과 계산기를 누가, 어떤 자료로, 어떻게 만들고 확인하는지, AI 도구 활용, 날짜 표시 기준, 하지 않는 일과 이해관계를 밝힙니다.",
  eyebrow: "편집 원칙·콘텐츠 작성 방법",
  h1: "편집 원칙과 콘텐츠 작성 방법",
  body: `<h2>누가 만드나요</h2><p>모든 글과 계산기는 <strong>제이 미디어 편집팀</strong>이 작성·관리하며, 운영 책임은 대표 이정우에게 있습니다. 외부 전문가의 감수를 받지 않았고, 받지 않은 감수나 현장 경험을 받은 것처럼 표시하지 않습니다. 이 원칙은 운영자가 함께 운영하는 보리장터의 원칙과 같습니다.</p><h2>어떻게 만드나요</h2><ol><li><strong>공식 1차 자료부터 모읍니다.</strong> 법령은 국가법령정보센터 원문, 제도 변경은 농림축산식품부 보도자료, 가격 자료는 aT 농산물유통정보(KAMIS)와 공공데이터포털, 택배 요금은 우정사업본부 요금안내처럼 기관이 직접 낸 자료를 씁니다. 여러 자료를 대조해 조문 번호·숫자·시행일이 맞는지 확인합니다.</li><li><strong>AI 도구를 활용합니다.</strong> 초안 작성과 자료 대조에 AI 도구를 씁니다. 게시 전에 법령 조문, 숫자, 링크를 원문과 다시 맞춰 보며, 게시된 내용의 책임은 운영자 제이 미디어에 있습니다.</li><li><strong>계산식을 공개하고 검사합니다.</strong> 계산기는 쓰는 식과 내 숫자를 대입한 과정을 결과 옆에 보여 줍니다. 페이지에 실린 예시 숫자가 실제 계산 결과와 같은지는 <a href="https://github.com/wlstj86231-cloud/reportfit">공개 저장소</a>의 검사 스크립트로 확인한 뒤 배포합니다.</li><li><strong>예시는 예시라고 적습니다.</strong> 계산 방법을 보여주려고 만든 숫자는 ‘가상 예시’로 표시하며, 실제 시세·요금·사례처럼 쓰지 않습니다.</li></ol><h2>출처와 날짜 표시</h2><ul><li>각 계산기와 가이드에는 <strong>출처</strong> 목록(자료 이름, 기관, 주소, 확인일)과 <strong>범위와 한계</strong>를 둡니다. 본문의 법령·요율·요금·날짜는 출처 목록에서 찾을 수 있어야 합니다.</li><li><strong>게시일</strong>은 그 페이지를 처음 게시한 날, <strong>최종 확인일</strong>은 출처와 내용을 다시 확인한 날입니다. 날짜를 앞당겨 적지 않습니다.</li><li>법령은 시행일을 함께 적습니다. 개정될 수 있으니 거래 전에 국가법령정보센터의 현행 조문을 다시 확인하세요.</li><li>확인하지 못한 사실은 쓰지 않습니다. 언론 보도나 블로그 글은 사실의 근거로 쓰지 않습니다.</li></ul><h2>하지 않는 일</h2><ul><li>수익, 가격, 낙찰가를 보장하지 않습니다. 계산 결과는 입력한 값에 따른 추정치입니다.</li><li>개별 거래에 대한 세무·법률·금융·투자 조언을 하지 않습니다.</li><li>돈을 받고 특정 판매처·매물·상품을 추천하지 않습니다. 현재 유료 게재와 협찬 글은 없습니다.</li></ul><h2>이해관계 공개</h2><p>보리장터와 자매 사이트(농기계 탁송 견적 비교, 농기계 자산 수첩 등)는 이 사이트와 같은 운영자 제이 미디어의 서비스입니다. 이 서비스로 연결하는 링크 옆에는 그 관계를 적고, 유입 경로를 알기 위한 UTM 매개변수(utm_source 등)를 붙입니다. 광고는 Google AdSense가 게재하며 광고주는 글 내용에 관여하지 않습니다.</p><h2>고치는 방법</h2><p>오류 제보는 <a href="/contact/">문의</a>에서 받습니다. 확인한 정정은 해당 페이지와 <a href="/corrections/">정정·수정 기록</a>에 날짜와 함께 남깁니다.</p>`,
});

const log = [
  ["2026-10-26", "운영자 사업자 정보와 연락처를 이 사이트에 직접 공개하고 문의·편집 원칙·정정·개인정보처리방침·이용약관 페이지를 만들었습니다. 계산기와 모든 가이드에 작성·관리 주체, 게시일·최종 확인일, 출처 목록, 범위와 한계를 붙였습니다. 판매글 가격칸·방문 수령과 택배비·가격 유효일 가이드의 구조화 데이터 게시일이 2026-08-10으로 잘못 적혀 있던 것을 실제 게시일 2026-09-20으로 바로잡았습니다. 방문 수령·택배 가이드에 우체국 소포의 무게·크기 요금 구간을, 위탁판매 정산서 가이드에 표준정산서 항목을, 판매글 가격칸 가이드에 표준규격품 실중량 표시 규정을 출처와 함께 보탰습니다. 몽골어 페이지는 AdSense 지원 언어가 아니어서 광고 코드를 빼고 검색 노출과 사이트맵에서 제외했습니다(페이지는 그대로 둡니다)."],
  ["2026-10-26", "위탁수수료 가이드에 공판장에 수수료·표준하역비 규정이 준용되는 범위(법 제45조)와 위탁수수료 조정 권고의 법적 근거(법 제42조제3항)를 보탰습니다. 계산식에 상자당·kg당 이익 식을 공개했고, 트랙터 계산기는 예상 처분가가 구입 총액보다 크면 확인 문구를 보여 줍니다. 몽골어 페이지 글자 크기를 16px 이상으로 키웠습니다."],
  ["2026-10-26", "사이트 이름을 농가 손익 계산기로 정리하고 소개 페이지에 운영자를 밝혔습니다. 첫 화면을 직거래·도매시장·온라인 판매 경로 비교 계산기로 바꾸고, 도매시장 위탁수수료 상한 가이드와 경로 비교 예시, 트랙터 보유 총비용 계산을 추가했습니다. 보리장터가 없앤 가락시장 품목 페이지로 가던 링크를 살아 있는 안내로 바꿨습니다."],
  ["2026-10-15", "트랙터 계산기에서 미확인 비용과 확인된 0원을 구분하고, 입력·결과 복사와 인쇄를 추가했습니다."],
  ["2026-09-27", "계산기 결과 표시 오류를 고치고, 없는 주소가 첫 화면 대신 ‘페이지를 찾을 수 없습니다’를 돌려주도록 했습니다."],
  ["2026-09-24", "중고 트랙터 구입 비용 비교 계산기와 몽골어 고기 kg 비교·밀 순수입 계산기를 추가했습니다."],
  ["2026-09-20", "직거래 판매글 가이드 3편(가격칸 단위, 방문 수령과 택배비, 가격 유효일)을 추가하고 www 주소에서도 정산 가이드 목록을 볼 수 있게 했습니다."],
  ["2026-08-10", "농산물 판매 손익 계산기와 정산 가이드 3편(kg당 판매가와 마진, 경매 정산 실수령액, 위탁판매 정산서)으로 사이트를 공개했습니다."],
];

page({
  path: "/corrections/",
  title: "정정·수정 기록",
  description: "농가 손익 계산기의 오류 정정 절차와 날짜별 수정 기록입니다. 계산 오류나 바뀐 출처를 알리는 방법과 처리 순서를 안내합니다.",
  eyebrow: "정정 정책·수정 기록",
  h1: "정정 정책과 수정 기록",
  body: `<h2>오류를 알리는 방법</h2><p>고객센터 <a href="tel:${operator.phone}">${operator.phone}</a>, 이메일 <a href="mailto:${operator.email}">${operator.email}</a>, <a href="${operator.kakaoGeneral}">카카오톡 오픈채팅(제휴·일반 문의)</a>, 공개 <a href="https://github.com/wlstj86231-cloud/reportfit/issues">GitHub Issues</a> 중 편한 곳으로 알려 주세요. 적어 주실 내용은 <a href="/contact/">문의</a> 페이지에 있습니다.</p><h2>처리 순서</h2><ol><li>제보 내용과 원문(법령, 공식 요금표 등)을 대조합니다.</li><li>사실이나 계산이 틀렸으면 페이지를 고치고, 계산기라면 예시 숫자의 검사도 함께 고칩니다.</li><li>고친 페이지의 최종 확인일을 바꾸고 아래 기록에 날짜와 내용을 남깁니다.</li><li>오류가 아니라고 판단하면 근거를 들어 답변합니다.</li></ol><p>맞춤법이나 문장 다듬기처럼 뜻이 바뀌지 않는 수정은 기록하지 않을 수 있습니다. 숫자, 법령, 계산식, 운영자 정보가 바뀌면 반드시 기록합니다.</p><h2>수정 기록</h2><ul class="log">${log.map(([date, text]) => `<li><time datetime="${date}">${date}</time> ${text}</li>`).join("")}</ul>`,
});

page({
  path: "/privacy/",
  title: "개인정보처리방침",
  description: "농가 손익 계산기가 처리하는 정보, 계산기 입력값의 처리 방식, Google AdSense 광고 쿠키와 맞춤 광고 해제 방법, 호스팅 접속 기록, 문의 시 정보와 연락처를 안내합니다.",
  eyebrow: "개인정보처리방침",
  h1: "개인정보처리방침",
  body: `<p>제이 미디어(이하 ‘운영자’)는 농가 손익 계산기(www.reportools.com, reportools.com)를 운영하면서 아래와 같이 정보를 처리합니다. <strong>시행일: 2026-10-26</strong></p><h2>1. 계산기 입력값</h2><p>이 사이트에는 회원가입, 로그인, 입력 양식 제출이 없습니다. 계산기에 넣은 숫자와 메모는 이용자의 브라우저 안에서만 계산하며 서버로 보내거나 저장하지 않습니다. 사이트 자체 코드는 쿠키나 브라우저 저장소(localStorage 등)를 쓰지 않으므로 페이지를 닫으면 입력값이 남지 않습니다. CSV 저장·복사·인쇄를 누르면 이용자가 고른 기기·앱·프린터로만 전달됩니다.</p><h2>2. 접속 기록(호스팅)</h2><p>사이트는 Cloudflare를 통해 제공됩니다. 페이지를 전송하고 공격을 막는 과정에서 Cloudflare가 IP 주소, 요청한 주소, 브라우저 정보, 접속 시각 같은 접속 기록을 처리할 수 있습니다. 운영자는 Cloudflare가 보여 주는 요청 수 같은 집계 통계를 볼 수 있으며, 이를 개인을 식별하는 데 쓰지 않습니다. 별도의 방문자 분석 스크립트(예: Google Analytics)는 넣지 않았습니다. Cloudflare의 처리 방식은 <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare 개인정보 정책</a>에서 확인할 수 있습니다.</p><h2>3. 광고와 쿠키(Google AdSense)</h2><p>계산기와 정산 가이드 페이지에는 Google AdSense 광고 코드가 들어 있습니다. 소개·문의·정책 페이지, 몽골어 페이지, 오류 페이지에는 광고 코드를 넣지 않았습니다.</p><ul><li>Google을 포함한 제3자 공급업체는 쿠키를 사용하여 이용자가 이 사이트나 다른 웹사이트를 이전에 방문한 기록을 바탕으로 광고를 게재합니다.</li><li>Google은 광고 쿠키를 사용하여 Google과 파트너가 이 사이트 및 인터넷의 다른 사이트 방문 기록에 기반한 광고를 이용자에게 게재할 수 있게 합니다.</li><li>이용자는 <a href="https://adssettings.google.com">Google 광고 설정</a>에서 맞춤 광고를 해제할 수 있습니다. Google이 광고에 쿠키와 정보를 쓰는 방식은 <a href="https://policies.google.com/technologies/ads?hl=ko">Google 광고 기술 정책</a>에 설명되어 있습니다.</li><li>브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있습니다. 차단해도 계산기는 그대로 작동합니다.</li></ul><p>계산기에 넣은 값은 광고에 쓰이지 않습니다. 사이트 코드가 입력값을 광고 코드나 서버로 보내지 않기 때문입니다.</p><h2>4. 외부 링크</h2><p>보리장터 등 같은 운영자의 사이트로 가는 링크에는 어느 페이지에서 왔는지 알기 위한 UTM 매개변수(utm_source 등)가 붙어 있습니다. 여기에는 이용자를 식별하는 정보가 들어가지 않습니다. 다른 사이트에서의 정보 처리는 그 사이트의 방침을 따릅니다.</p><h2>5. 문의할 때 보내는 정보</h2><p>전화, 이메일, 카카오톡 오픈채팅, GitHub Issues로 문의하면 보내 주신 이름·연락처·문의 내용을 받게 됩니다. 이 정보는 답변과 정정 처리에만 쓰고, 처리를 마치면 법령상 보관 의무가 있는 경우를 빼고 지체 없이 파기합니다. 카카오톡과 GitHub에 남긴 내용에는 각 서비스의 개인정보 정책도 적용되며, GitHub Issues의 글은 공개됩니다.</p><h2>6. 제3자 제공</h2><p>운영자는 법령에 따라 요구되는 경우를 빼고 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p><h2>7. 이용자의 권리</h2><p>문의 과정에서 운영자에게 보낸 개인정보의 열람, 정정, 삭제, 처리 정지를 요구할 수 있습니다. 아래 연락처로 요청해 주세요.</p><h2>8. 개인정보 문의처</h2><p>제이 미디어(대표 ${operator.ceo}) · 이메일 <a href="mailto:${operator.email}">${operator.email}</a> · 고객센터 <a href="tel:${operator.phone}">${operator.phone}</a> · ${operator.address}</p><h2>9. 방침의 변경</h2><p>이 방침을 바꾸면 이 페이지에 새 시행일과 바뀐 내용을 적고 <a href="/corrections/">정정·수정 기록</a>에도 남깁니다.</p>`,
});

const checkWhere = [
  ["도매시장 위탁수수료율, 정산서 공제 항목", "출하할 도매시장법인, 해당 도매시장 관리사무소(개설자)"],
  ["법령 조문과 시행일", "국가법령정보센터(law.go.kr) 현행 법령"],
  ["온라인 몰 판매·결제 수수료", "입점한 몰의 판매자센터 요금표와 계약 조건"],
  ["택배 요금, 파손·분실 배상", "이용하는 택배사의 요금표와 약관(우체국 소포는 우정사업본부 요금안내)"],
  ["부가가치세·소득세 등 세금", "국세청 또는 세무 전문가"],
  ["농업용 면세유", "면세유류 관리기관인 조합(지역 농협 등)"],
  ["농기계 대출 이자·할부 조건", "거래 금융기관의 약정서"],
  ["중고 농기계의 상태와 안전", "현장 점검, 정비업체, 농촌진흥청 농작업 안전 자료"],
];

page({
  path: "/terms/",
  title: "이용약관",
  description: "농가 손익 계산기 이용 조건, 계산 결과와 정보의 성격, 거래 전에 무엇을 누구에게 확인해야 하는지, 면책 범위와 외부 링크·저작권 기준을 안내합니다.",
  eyebrow: "이용약관·면책",
  h1: "이용약관과 면책",
  body: `<p><strong>시행일: 2026-10-26</strong> · 운영자: 제이 미디어</p><h2>1. 서비스</h2><p>농가 손익 계산기는 농산물 판매 경로별 손익 계산기, 중고 트랙터 구입·보유 총비용 계산기, 정산 가이드를 무료로 제공합니다. 회원가입 없이 누구나 쓸 수 있습니다.</p><h2>2. 정보와 계산 결과의 성격</h2><ul><li>계산 결과는 이용자가 넣은 값을 공개된 식에 대입한 추정치입니다. 실제 낙찰가, 수수료, 운임, 세금과 다를 수 있습니다.</li><li>이 사이트의 글과 계산기는 일반 정보를 제공하기 위한 것이며 세무·법률·금융·투자 자문이 아닙니다. 수익이나 가격을 보장하지 않습니다.</li><li>예시 숫자는 계산 방법을 보여주려는 가정이며 실제 시세나 사례가 아닙니다.</li></ul><h2>3. 거래 전에 확인할 곳</h2><p>돈이 오가는 결정 전에는 아래 항목을 해당 기관이나 거래처의 원문으로 확인하세요.</p><div class="table-scroll" role="region" aria-label="확인할 곳" tabindex="0"><table><thead><tr><th scope="col">확인할 내용</th><th scope="col">확인할 곳</th></tr></thead><tbody>${checkWhere.map(([what, where]) => `<tr><td>${what}</td><td>${where}</td></tr>`).join("")}</tbody></table></div><h2>4. 이용자의 책임</h2><p>입력값이 맞는지, 계산 결과를 어떻게 쓸지는 이용자가 판단합니다. 거래 조건은 상대방과 서면으로 확인하세요.</p><h2>5. 면책</h2><p>운영자는 출처를 확인하고 오류를 고치려고 노력하지만, 이 사이트의 정보나 계산 결과를 근거로 한 거래·판단의 결과를 보장하지 않으며 그로 인한 손해에 책임을 지지 않습니다. 다만 운영자의 고의 또는 중대한 과실로 생긴 손해는 그렇지 않습니다.</p><h2>6. 외부 링크</h2><p>보리장터 등 같은 운영자의 서비스를 포함한 외부 사이트를 이용할 때는 그 사이트의 약관과 방침이 적용됩니다.</p><h2>7. 글의 이용</h2><p>이 사이트의 글과 화면 구성은 제이 미디어가 관리합니다. 페이지 주소를 밝힌 짧은 인용은 자유롭게 할 수 있으며, 전체를 복제하거나 다시 배포하려면 먼저 <a href="/contact/">문의</a>해 주세요.</p><h2>8. 약관의 변경</h2><p>약관을 바꾸면 이 페이지에 새 시행일과 바뀐 내용을 적고 <a href="/corrections/">정정·수정 기록</a>에도 남깁니다.</p>`,
});

export const infoUrls = Object.keys(pages);
export const infoLastModified = Object.fromEntries(infoUrls.map((url) => [url, checkedDate]));
export const infoPages = pages;
