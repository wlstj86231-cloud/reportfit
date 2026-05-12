import "./styles.css";

let pdfLibPromise;
let pdfJsPromise;
let zipPromise;

function getPdfLib() {
  pdfLibPromise ||= import("pdf-lib");
  return pdfLibPromise;
}

async function getPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.mjs?url")
    ]).then(([pdfjs, worker]) => {
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      return pdfjs;
    });
  }
  return pdfJsPromise;
}

async function getJSZip() {
  zipPromise ||= import("jszip").then((module) => module.default);
  return zipPromise;
}

const tools = [
  {
    id: "pdf-compress",
    label: "PDF 압축",
    short: "용량 줄이기",
    icon: "PDF",
    group: "PDF",
    path: "/tools/pdf-compress/",
    description: "LMS 업로드 제한에 맞게 PDF를 다시 저장하고 불필요한 문서 정보를 정리합니다."
  },
  {
    id: "pdf-slim",
    label: "PDF 경량화",
    short: "스캔본 크게 줄이기",
    icon: "PDF",
    group: "PDF",
    path: "/tools/pdf-slim/",
    description: "스캔본이나 이미지가 많은 PDF를 페이지 이미지로 다시 저장해 용량을 줄입니다."
  },
  {
    id: "pdf-edit",
    label: "PDF 편집",
    short: "합치기, 나누기, 회전",
    icon: "PDF",
    group: "PDF",
    path: "/tools/pdf-edit/",
    description: "여러 PDF를 합치거나 필요한 페이지만 골라 새 PDF로 만듭니다."
  },
  {
    id: "pdf-number",
    label: "페이지 번호",
    short: "PDF 하단 번호 넣기",
    icon: "PDF",
    group: "PDF",
    path: "/tools/pdf-number/",
    description: "제출용 PDF에 페이지 번호를 넣어 본문 순서를 확인하기 쉽게 만듭니다."
  },
  {
    id: "pdf-watermark",
    label: "워터마크",
    short: "초안, 참고용 표시",
    icon: "PDF",
    group: "PDF",
    path: "/tools/pdf-watermark/",
    description: "초안, 개인 확인용, 참고자료 같은 문구를 PDF에 은은하게 표시합니다."
  },
  {
    id: "pdf-split",
    label: "PDF 분할",
    short: "페이지별, 범위별 ZIP",
    icon: "PDF",
    group: "PDF",
    path: "/tools/pdf-split/",
    description: "PDF를 페이지별 또는 지정한 범위별로 나누고 ZIP 파일로 묶어 받습니다."
  },
  {
    id: "pdf-organize",
    label: "PDF 페이지 정리",
    short: "삭제, 재정렬, 역순",
    icon: "PDF",
    group: "PDF",
    path: "/tools/pdf-organize/",
    description: "필요한 페이지만 남기거나 순서를 바꿔 제출용 PDF를 다시 만듭니다."
  },
  {
    id: "pdf-rotate",
    label: "PDF 선택 회전",
    short: "일부 페이지만 회전",
    icon: "PDF",
    group: "PDF",
    path: "/tools/pdf-rotate/",
    description: "스캔 방향이 틀어진 페이지를 범위로 지정해 90도, 180도, 270도로 회전합니다."
  },
  {
    id: "image-convert",
    label: "이미지 변환",
    short: "JPG, PNG, WebP, PDF",
    icon: "IMG",
    group: "이미지",
    path: "/tools/image-convert/",
    description: "사진과 캡처를 제출 가능한 이미지 형식이나 PDF로 변환합니다."
  },
  {
    id: "image-compress",
    label: "이미지 압축",
    short: "사진 용량 줄이기",
    icon: "IMG",
    group: "이미지",
    path: "/tools/image-compress/",
    description: "여러 이미지를 한 번에 줄이고 폭과 품질을 조정합니다."
  },
  {
    id: "image-resize",
    label: "이미지 리사이즈",
    short: "가로/세로 맞추기",
    icon: "IMG",
    group: "이미지",
    path: "/tools/image-resize/",
    description: "과제 첨부나 LMS 미리보기에 맞게 이미지의 최대 가로와 세로 크기를 줄입니다."
  },
  {
    id: "image-rotate",
    label: "이미지 회전",
    short: "90도, 뒤집기",
    icon: "IMG",
    group: "이미지",
    path: "/tools/image-rotate/",
    description: "휴대폰 사진이나 캡처 이미지의 방향을 회전하고 좌우 또는 상하로 뒤집습니다."
  },
  {
    id: "image-watermark",
    label: "이미지 워터마크",
    short: "이름, 초안 표시",
    icon: "IMG",
    group: "이미지",
    path: "/tools/image-watermark/",
    description: "제출 전 확인용 이미지에 이름, 초안, 참고용 같은 문구를 작게 표시합니다."
  },
  {
    id: "file-name",
    label: "파일명 만들기",
    short: "학번, 이름, 과목명",
    icon: "TXT",
    group: "제출",
    path: "/tools/file-name/",
    description: "과목명, 학번, 이름, 과제명을 깔끔한 제출 파일명으로 정리합니다."
  },
  {
    id: "submit-checklist",
    label: "제출 전 점검표",
    short: "마감, 파일, 참고문헌",
    icon: "CHK",
    group: "제출",
    path: "/tools/submit-checklist/",
    description: "과제 제출 직전에 확인할 항목을 과목, 마감, 파일 조건에 맞춰 복사 가능한 체크리스트로 만듭니다."
  },
  {
    id: "submit-package",
    label: "제출 패키지",
    short: "파일명 + ZIP + 점검표",
    icon: "PKG",
    group: "제출",
    path: "/tools/submit-package/",
    description: "여러 제출 파일의 이름을 규칙에 맞게 정리하고 점검표와 함께 하나의 ZIP으로 묶습니다."
  },
  {
    id: "word-count",
    label: "글자수 계산",
    short: "공백 제외, A4 예상",
    icon: "ABC",
    group: "문서",
    path: "/tools/word-count/",
    description: "레포트 본문의 글자수, 단어수, A4 예상 분량을 빠르게 계산합니다."
  },
  {
    id: "text-clean",
    label: "텍스트 정리",
    short: "줄바꿈, 공백 정리",
    icon: "TXT",
    group: "문서",
    path: "/tools/text-clean/",
    description: "PDF에서 복사한 글이나 메모의 줄바꿈, 공백, 문장 간격을 보기 좋게 정리합니다."
  },
  {
    id: "table-convert",
    label: "표 변환",
    short: "CSV, 표, Markdown",
    icon: "TAB",
    group: "문서",
    path: "/tools/table-convert/",
    description: "엑셀에서 복사한 표를 Markdown 표, CSV, HTML 표로 변환합니다."
  },
  {
    id: "citation-cleaner",
    label: "참고문헌 정리",
    short: "정렬, 중복 제거",
    icon: "REF",
    group: "문서",
    path: "/tools/citation-cleaner/",
    description: "참고문헌 목록을 정렬하고 중복 줄을 제거하며 간단한 인용 형식을 만듭니다."
  },
  {
    id: "file-check",
    label: "파일 점검",
    short: "용량, 확장자, 페이지",
    icon: "CHK",
    group: "제출",
    path: "/tools/file-check/",
    description: "제출 파일의 용량, 확장자, 이름, PDF 페이지 수를 확인합니다."
  },
  {
    id: "zip-pack",
    label: "ZIP 압축",
    short: "여러 파일 묶기",
    icon: "ZIP",
    group: "제출",
    path: "/tools/zip-pack/",
    description: "과제 본문, 참고자료, 이미지 파일을 하나의 ZIP으로 묶습니다."
  },
  {
    id: "privacy-clean",
    label: "개인정보 제거",
    short: "EXIF, PDF 정보 정리",
    icon: "SEC",
    group: "보안",
    path: "/tools/privacy-clean/",
    description: "이미지 위치정보와 PDF 작성자 정보를 브라우저에서 다시 저장해 줄입니다."
  }
];

const popular = ["pdf-slim", "image-resize", "image-compress", "image-rotate", "submit-package", "file-check"];
const app = document.querySelector("#app");
const infoPages = {
  "/about/": {
    title: "소개",
    lead: "레포트핏은 과제를 대신 작성하지 않고, 제출 전에 필요한 파일 변환과 문서 정리를 빠르게 처리하는 도구입니다.",
    body: [
      "대학생이 과제를 제출할 때 겪는 문제는 대개 거창하지 않습니다. PDF 용량이 제한을 넘거나, 사진 여러 장을 하나로 묶어야 하거나, 파일명이 어수선하거나, 참고문헌 줄이 뒤섞여 있는 식입니다.",
      "레포트핏은 이런 작은 제출 문제를 브라우저 안에서 해결하도록 설계했습니다. 가능한 작업은 서버 업로드 없이 사용자의 기기에서 처리되며, 도구 화면을 먼저 보여주고 설명은 아래로 내려 실제 사용 흐름을 방해하지 않습니다."
    ]
  },
  "/privacy/": {
    title: "개인정보 처리방침",
    lead: "레포트핏의 파일 처리 기능은 기본적으로 브라우저 안에서 실행됩니다.",
    body: [
      "선택한 PDF, 이미지, ZIP 대상 파일은 변환 작업을 위해 사용자의 브라우저 메모리에서 읽힙니다. 별도 서버로 파일을 저장하거나 전송하는 구조를 사용하지 않습니다.",
      "사이트 개선을 위해 일반적인 접속 로그나 브라우저가 제공하는 기술 정보가 호스팅 서비스 또는 분석 도구에 남을 수 있습니다. 이름, 학번, 과제 파일 원본을 수집하는 입력 양식은 두지 않습니다.",
      "문의가 필요한 경우 사용자가 직접 보낸 내용에 한해 답변 목적의 연락 정보를 확인할 수 있습니다."
    ]
  },
  "/terms/": {
    title: "이용안내",
    lead: "레포트핏은 제출 전 파일과 형식 정리를 돕는 보조 도구입니다.",
    body: [
      "도구 결과는 제출 전 확인을 편하게 하기 위한 참고용입니다. 과목별 제출 규정, 교수자의 안내, 학교 LMS의 실제 제한을 우선해야 합니다.",
      "레포트핏은 과제를 대신 작성하거나 표절을 우회하는 서비스를 제공하지 않습니다. 사용자는 본인이 작성하고 제출할 권리가 있는 파일만 처리해야 합니다.",
      "브라우저와 파일 형식에 따라 일부 변환 결과가 다를 수 있으므로, 다운로드한 결과 파일은 제출 전에 직접 열어 확인해야 합니다."
    ]
  },
  "/contact/": {
    title: "문의",
    lead: "오류, 건의, 추가했으면 하는 도구를 편하게 정리해 보내주세요.",
    body: [
      "기능 오류를 보낼 때는 사용한 도구 이름, 파일 형식, 브라우저, 어떤 단계에서 막혔는지를 적어주면 확인이 빠릅니다.",
      "추가 기능 제안은 과제 제출 상황이 구체적일수록 좋습니다. 예를 들어 'PDF가 20MB 제한에 걸림', '사진 12장을 한 파일로 묶어야 함'처럼 실제 상황 중심으로 보내주세요.",
      "정식 문의 폼을 붙이기 전까지는 사이트 운영자가 안내하는 연락 경로를 통해 의견을 받습니다."
    ]
  },
  "/editorial/": {
    title: "편집 기준",
    lead: "레포트핏의 설명 문서는 과제 대행이 아니라 제출 전 실수를 줄이는 방법에 집중합니다.",
    body: [
      "각 도구 페이지는 먼저 실제 기능을 제공하고, 아래 설명에서는 언제 필요한지, 제출 전에 어떤 점을 확인해야 하는지, 어떤 경우에 결과를 다시 열어봐야 하는지를 다룹니다.",
      "레포트핏은 레포트 본문을 대신 작성하거나 표절을 숨기는 방향의 기능을 넣지 않습니다. 파일 형식, 참고문헌 정리, 용량 제한, 개인정보 제거처럼 사용자가 직접 작성한 과제를 제출 가능한 상태로 정리하는 작업만 다룹니다.",
      "도구 설명은 실제 제출 상황을 기준으로 업데이트합니다. 사용자가 자주 겪는 파일 오류, LMS 업로드 제한, 이미지 스캔 품질, 참고문헌 누락 같은 구체적인 문제를 우선합니다."
    ]
  },
  "/review-readiness/": {
    title: "승인 준비 체크",
    lead: "레포트핏은 애드센스 심사 전에 기능, 신뢰 페이지, 내비게이션, 고유 설명 문서를 함께 갖추도록 구성했습니다.",
    body: [
      "구글 애드센스 공식 안내는 방문자에게 관련성 있는 고유 콘텐츠와 좋은 사용자 경험을 제공하는 사이트를 요구합니다. 레포트핏은 빈 도구 화면만 두지 않고 각 기능별 사용 맥락과 주의점을 함께 제공합니다.",
      "광고 코드는 실제 도메인에서만 유휴 시간에 불러오도록 구성했습니다. 변환 버튼, 다운로드 버튼, 내비게이션과 혼동되는 위치에는 광고를 두지 않는 것이 원칙입니다.",
      "심사 전에는 깨진 링크, 빈 페이지, placeholder 문구, 과도한 광고 영역, 저작권 침해 자료, 과제 대행처럼 보이는 표현을 제거해야 합니다."
    ]
  }
};
let currentPage = findPageFromLocation();
let currentTool = findToolFromLocation() || tools[0];

render();

function findToolFromLocation() {
  return tools.find((tool) => location.pathname === tool.path || location.pathname.startsWith(tool.path));
}

function findPageFromLocation() {
  return infoPages[location.pathname] ? location.pathname : null;
}

function render() {
  currentPage = findPageFromLocation();
  if (currentPage) {
    renderInfoPage();
    return;
  }
  document.title = `${currentTool.label} - 레포트핏`;
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="/" data-tool-link="pdf-compress" aria-label="레포트핏 홈">
          <span class="brand-mark">R</span>
          <span>
            <strong>레포트핏</strong>
            <small>과제 제출 도구함</small>
          </span>
        </a>
        <nav class="quick-nav" aria-label="빠른 도구">
          ${popular.map((id) => navButton(toolById(id))).join("")}
        </nav>
      </header>

      <main>
        <section class="work-hero">
          <div class="hero-copy">
            <p class="eyebrow">파일은 브라우저에서 처리됩니다</p>
            <h1>${escapeHtml(currentTool.label)}</h1>
            <p>${escapeHtml(currentTool.description)}</p>
          </div>
          <div class="hero-stat">
            <span>${escapeHtml(currentTool.group)}</span>
            <strong>${escapeHtml(currentTool.short)}</strong>
          </div>
        </section>

        ${toolCategoryOverview()}

        <section class="tool-layout">
          <aside class="tool-menu" aria-label="도구 카테고리">
            <div class="tool-search">
              <input id="toolSearch" type="search" placeholder="필요한 도구 검색" autocomplete="off">
              <span id="toolSearchCount">${tools.length}개 도구</span>
            </div>
            <div class="tool-list" id="toolList">
              ${tools.map((tool) => toolCard(tool)).join("")}
            </div>
          </aside>
          <section class="workspace" aria-live="polite">
            ${stepStrip(currentTool.id)}
            ${workspaceFor(currentTool.id)}
          </section>
        </section>

        <section class="content-grid">
          <article>
            <h2>${escapeHtml(currentTool.label)}를 과제 제출 전에 쓰는 이유</h2>
            <p>${copyFor(currentTool.id).why}</p>
            <p>${copyFor(currentTool.id).tip}</p>
          </article>
          <article>
            <h2>같이 쓰면 좋은 도구</h2>
            <div class="related-list">
              ${relatedTools(currentTool.id).map((tool) => relatedCard(tool)).join("")}
            </div>
          </article>
        </section>

        ${toolGuideSection(currentTool.id)}
      </main>

      <footer class="footer">
        <a href="/about/">소개</a>
        <a href="/privacy/">개인정보</a>
        <a href="/terms/">이용안내</a>
        <a href="/editorial/">편집 기준</a>
        <a href="/review-readiness/">승인 준비</a>
        <a href="/contact/">문의</a>
        <span>레포트핏은 과제를 대신 작성하지 않고 제출 전 파일과 형식 정리를 돕습니다.</span>
      </footer>
    </div>
  `;

  bindGlobalEvents();
  bindToolEvents(currentTool.id);
}

function renderInfoPage() {
  const page = infoPages[currentPage];
  document.title = `${page.title} - 레포트핏`;
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="/" data-tool-link="pdf-compress" aria-label="레포트핏 홈">
          <span class="brand-mark">R</span>
          <span>
            <strong>레포트핏</strong>
            <small>과제 제출 도구함</small>
          </span>
        </a>
        <nav class="quick-nav" aria-label="빠른 도구">
          ${popular.map((id) => navButton(toolById(id))).join("")}
        </nav>
      </header>
      <main class="info-page">
        <section class="info-card">
          <p class="eyebrow">ReportFit</p>
          <h1>${escapeHtml(page.title)}</h1>
          <p class="info-lead">${escapeHtml(page.lead)}</p>
          ${page.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          <div class="related-list info-tools">
            ${popular.map((id) => relatedCard(toolById(id))).join("")}
          </div>
        </section>
      </main>
      <footer class="footer">
        <a href="/about/">소개</a>
        <a href="/privacy/">개인정보</a>
        <a href="/terms/">이용안내</a>
        <a href="/editorial/">편집 기준</a>
        <a href="/review-readiness/">승인 준비</a>
        <a href="/contact/">문의</a>
        <span>레포트핏은 과제를 대신 작성하지 않고 제출 전 파일과 형식 정리를 돕습니다.</span>
      </footer>
    </div>
  `;
  bindGlobalEvents();
}

function navButton(tool) {
  return `<button type="button" class="${tool.id === currentTool.id ? "is-active" : ""}" data-tool-link="${tool.id}">${escapeHtml(tool.label)}</button>`;
}

function toolCard(tool) {
  return `
    <button type="button" class="tool-card ${tool.id === currentTool.id ? "is-active" : ""}" data-tool-link="${tool.id}" data-search="${escapeHtml(`${tool.id} ${tool.label} ${tool.short} ${tool.group} ${tool.description}`.toLowerCase())}">
      <span class="tool-icon">${escapeHtml(tool.icon)}</span>
      <span>
        <strong>${escapeHtml(tool.label)}</strong>
        <small>${escapeHtml(tool.short)}</small>
      </span>
    </button>
  `;
}

function toolCategoryOverview() {
  const groups = [...new Set(tools.map((tool) => tool.group))];
  return `
    <section class="category-overview" aria-label="도구 묶음">
      ${groups.map((group) => {
        const groupTools = tools.filter((tool) => tool.group === group);
        const active = group === currentTool.group ? " is-active" : "";
        return `
          <button class="category-card${active}" type="button" data-tool-group="${escapeHtml(group)}">
            <span>${escapeHtml(group)}</span>
            <strong>${groupTools.length}개 도구</strong>
            <small>${groupTools.slice(0, 3).map((tool) => tool.label).join(" · ")}</small>
          </button>
        `;
      }).join("")}
    </section>
  `;
}

function relatedCard(tool) {
  return `
    <button type="button" class="related-card" data-tool-link="${tool.id}">
      <strong>${escapeHtml(tool.label)}</strong>
      <span>${escapeHtml(tool.short)}</span>
    </button>
  `;
}

function toolGuideSection(id) {
  const guide = guideFor(id);
  return `
    <section class="tool-guide" aria-label="${escapeHtml(guide.title)} 도움말">
      <article>
        <p class="eyebrow">제출 전 사용 팁</p>
        <h2>${escapeHtml(guide.title)}</h2>
        <ul class="guide-list">
          ${guide.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}
        </ul>
      </article>
      <article>
        <p class="eyebrow">자주 묻는 질문</p>
        <h2>헷갈리기 쉬운 부분</h2>
        <div class="faq-list">
          ${guide.faq.map((item) => `
            <details>
              <summary>${escapeHtml(item.q)}</summary>
              <p>${escapeHtml(item.a)}</p>
            </details>
          `).join("")}
        </div>
      </article>
    </section>
  `;
}

function stepStrip(id) {
  const map = {
    "pdf-compress": ["PDF 선택", "기준 확인", "압축본 받기"],
    "pdf-slim": ["PDF 선택", "품질 조절", "경량본 받기"],
    "pdf-edit": ["PDF 선택", "작업 선택", "새 PDF 받기"],
    "pdf-number": ["PDF 선택", "번호 위치", "번호본 받기"],
    "pdf-watermark": ["PDF 선택", "문구 조절", "표시본 받기"],
    "pdf-split": ["PDF 선택", "분할 방식", "ZIP 받기"],
    "pdf-organize": ["PDF 선택", "페이지 순서", "정리본 받기"],
    "pdf-rotate": ["PDF 선택", "회전 범위", "회전본 받기"],
    "image-convert": ["이미지 선택", "형식 선택", "결과 받기"],
    "image-compress": ["이미지 선택", "품질 조절", "ZIP 받기"],
    "image-resize": ["이미지 선택", "크기 조절", "ZIP 받기"],
    "image-rotate": ["이미지 선택", "방향 조절", "ZIP 받기"],
    "image-watermark": ["이미지 선택", "문구 위치", "ZIP 받기"],
    "file-name": ["정보 입력", "파일명 생성", "복사"],
    "submit-checklist": ["조건 입력", "확인 항목 선택", "점검표 복사"],
    "submit-package": ["정보 입력", "파일 묶기", "제출팩 받기"],
    "word-count": ["본문 붙여넣기", "분량 확인", "다음 정리"],
    "text-clean": ["텍스트 붙여넣기", "정리 방식", "복사"],
    "table-convert": ["표 붙여넣기", "형식 선택", "복사"],
    "citation-cleaner": ["자료 입력", "스타일 선택", "정리/복사"],
    "file-check": ["파일 선택", "기준 확인", "주의점 보기"],
    "zip-pack": ["파일 선택", "이름 지정", "ZIP 받기"],
    "privacy-clean": ["파일 선택", "정보 정리", "새 파일 받기"]
  };
  return `
    <div class="step-strip" aria-label="작업 순서">
      ${(map[id] || ["입력", "처리", "결과"]).map((step, index) => `<span><b>${index + 1}</b>${escapeHtml(step)}</span>`).join("")}
    </div>
  `;
}

function workspaceFor(id) {
  const drop = (accept, multiple = false) => `
    <label class="dropzone">
      <input class="file-input" type="file" ${multiple ? "multiple" : ""} accept="${accept}">
      <span>파일 선택</span>
      <strong>눌러서 선택하거나 파일을 놓기</strong>
      <small class="file-summary">선택된 파일 없음</small>
    </label>
  `;

  const panel = {
    "pdf-compress": `
      <div class="tool-head"><h2>PDF 압축</h2><p>PDF를 다시 저장해 용량과 문서 정보를 정리합니다.</p></div>
      ${drop("application/pdf")}
      <div class="option-row">
        <label>목표 용량
          <select id="targetSize">
            <option value="20">20MB 이하</option>
            <option value="10">10MB 이하</option>
            <option value="50">50MB 이하</option>
          </select>
        </label>
        <label>파일명
          <input id="pdfCompressName" type="text" placeholder="과제_압축.pdf">
        </label>
      </div>
      <button class="primary-action" id="runPdfCompress" type="button">압축 PDF 만들기</button>
      <div class="result" id="result"></div>
    `,
    "pdf-slim": `
      <div class="tool-head"><h2>스캔 PDF 경량화</h2><p>스캔본이나 이미지가 많은 PDF를 다시 이미지화해 더 작은 제출용 PDF로 만듭니다.</p></div>
      ${drop("application/pdf")}
      <div class="option-row">
        <label>출력 품질
          <input id="pdfSlimQuality" type="range" min="0.4" max="0.9" step="0.05" value="0.68">
        </label>
        <label>페이지 최대 폭
          <input id="pdfSlimWidth" type="number" min="700" max="1800" step="100" value="1200">
        </label>
        <label>색상
          <select id="pdfSlimColor">
            <option value="color">컬러 유지</option>
            <option value="gray">흑백 느낌으로 줄이기</option>
          </select>
        </label>
        <label>파일명
          <input id="pdfSlimName" type="text" placeholder="과제_경량화.pdf">
        </label>
      </div>
      <button class="primary-action" id="runPdfSlim" type="button">경량 PDF 만들기</button>
      <p class="soft-note">스캔본에는 효과가 크지만, 텍스트 선택, 링크, 주석은 이미지화되면서 사라질 수 있습니다.</p>
      <div class="result" id="result"></div>
    `,
    "pdf-edit": `
      <div class="tool-head"><h2>PDF 편집</h2><p>합치기, 필요한 페이지만 뽑기, 전체 회전을 처리합니다.</p></div>
      ${drop("application/pdf", true)}
      <div class="option-row">
        <label>작업
          <select id="pdfEditMode">
            <option value="merge">PDF 합치기</option>
            <option value="range">페이지 범위 추출</option>
          </select>
        </label>
        <label>페이지 범위
          <input id="pageRange" type="text" placeholder="예: 1-3, 5">
        </label>
        <label>회전
          <select id="rotatePages">
            <option value="0">회전 없음</option>
            <option value="90">오른쪽 90도</option>
            <option value="180">180도</option>
            <option value="270">왼쪽 90도</option>
          </select>
        </label>
      </div>
      <button class="primary-action" id="runPdfEdit" type="button">새 PDF 만들기</button>
      <div class="result" id="result"></div>
    `,
    "pdf-number": `
      <div class="tool-head"><h2>페이지 번호</h2><p>PDF 하단에 페이지 번호를 넣어 제출본 순서를 확인하기 쉽게 만듭니다.</p></div>
      ${drop("application/pdf")}
      <div class="option-row">
        <label>표기 형식
          <select id="pageNumberFormat">
            <option value="simple">1 / 10</option>
            <option value="page">Page 1 of 10</option>
            <option value="short">p. 1 / 10</option>
          </select>
        </label>
        <label>시작 번호
          <input id="pageNumberStart" type="number" min="1" value="1">
        </label>
        <label>위치
          <select id="pageNumberPosition">
            <option value="center">하단 중앙</option>
            <option value="right">하단 오른쪽</option>
            <option value="left">하단 왼쪽</option>
          </select>
        </label>
      </div>
      <button class="primary-action" id="runPdfNumber" type="button">번호 넣은 PDF 만들기</button>
      <div class="result" id="result"></div>
    `,
    "pdf-watermark": `
      <div class="tool-head"><h2>워터마크</h2><p>초안, 참고용, 개인 확인용 같은 문구를 PDF에 은은하게 표시합니다.</p></div>
      ${drop("application/pdf")}
      <div class="option-row">
        <label>문구
          <input id="watermarkText" type="text" value="DRAFT" placeholder="DRAFT">
        </label>
        <label>진하기
          <input id="watermarkOpacity" type="range" min="0.08" max="0.35" step="0.01" value="0.16">
        </label>
        <label>크기
          <input id="watermarkSize" type="number" min="24" max="96" value="52">
        </label>
      </div>
      <button class="primary-action" id="runPdfWatermark" type="button">워터마크 PDF 만들기</button>
      <div class="result" id="result"></div>
    `,
    "pdf-split": `
      <div class="tool-head"><h2>PDF 분할</h2><p>한 PDF를 페이지별 또는 범위별 PDF로 나눈 뒤 ZIP으로 묶습니다.</p></div>
      ${drop("application/pdf")}
      <div class="option-row">
        <label>분할 방식
          <select id="pdfSplitMode">
            <option value="pages">페이지별로 나누기</option>
            <option value="ranges">범위별로 나누기</option>
          </select>
        </label>
        <label>범위 묶음
          <input id="pdfSplitRanges" type="text" placeholder="예: 1-3; 4-6; 7">
        </label>
        <label>ZIP 파일명
          <input id="pdfSplitName" type="text" placeholder="과제_PDF_분할.zip">
        </label>
      </div>
      <button class="primary-action" id="runPdfSplit" type="button">분할 ZIP 만들기</button>
      <div class="result" id="result"></div>
    `,
    "pdf-organize": `
      <div class="tool-head"><h2>PDF 페이지 정리</h2><p>남길 페이지와 순서를 지정해 새 PDF를 만듭니다. 삭제와 재정렬을 한 번에 처리합니다.</p></div>
      ${drop("application/pdf")}
      <div class="option-row">
        <label>페이지 순서
          <input id="pdfOrganizeOrder" type="text" placeholder="예: 1-3, 6, 5, 8-10">
        </label>
        <label>빠른 정리
          <select id="pdfOrganizePreset">
            <option value="custom">입력한 순서 사용</option>
            <option value="reverse">전체 역순</option>
            <option value="odd">홀수 페이지만</option>
            <option value="even">짝수 페이지만</option>
          </select>
        </label>
        <label>파일명
          <input id="pdfOrganizeName" type="text" placeholder="과제_정리본.pdf">
        </label>
      </div>
      <button class="primary-action" id="runPdfOrganize" type="button">정리한 PDF 만들기</button>
      <div class="result" id="result"></div>
    `,
    "pdf-rotate": `
      <div class="tool-head"><h2>PDF 선택 회전</h2><p>스캔 방향이 틀어진 페이지만 골라 회전합니다. 범위를 비우면 전체 페이지가 회전됩니다.</p></div>
      ${drop("application/pdf")}
      <div class="option-row">
        <label>회전할 페이지
          <input id="pdfRotateRange" type="text" placeholder="예: 1, 3-5">
        </label>
        <label>회전 각도
          <select id="pdfRotateAngle">
            <option value="90">오른쪽 90도</option>
            <option value="180">180도</option>
            <option value="270">왼쪽 90도</option>
          </select>
        </label>
        <label>파일명
          <input id="pdfRotateName" type="text" placeholder="과제_회전본.pdf">
        </label>
      </div>
      <button class="primary-action" id="runPdfRotate" type="button">회전 PDF 만들기</button>
      <div class="result" id="result"></div>
    `,
    "image-convert": `
      <div class="tool-head"><h2>이미지 변환</h2><p>사진 여러 장을 JPG, PNG, WebP 또는 PDF로 변환합니다.</p></div>
      ${drop("image/*", true)}
      <div class="option-row">
        <label>출력 형식
          <select id="imageFormat">
            <option value="pdf">PDF</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>
        <label>품질
          <input id="imageQuality" type="range" min="0.45" max="0.95" step="0.05" value="0.82">
        </label>
        <label>최대 폭
          <input id="imageMaxWidth" type="number" min="640" max="4000" step="100" value="1800">
        </label>
      </div>
      <button class="primary-action" id="runImageConvert" type="button">이미지 변환하기</button>
      <div class="result" id="result"></div>
    `,
    "image-compress": `
      <div class="tool-head"><h2>이미지 압축</h2><p>과제 첨부용 이미지를 한 번에 가볍게 만듭니다.</p></div>
      ${drop("image/*", true)}
      <div class="option-row">
        <label>출력 형식
          <select id="compressFormat">
            <option value="image/jpeg">JPG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>
        <label>품질
          <input id="compressQuality" type="range" min="0.35" max="0.95" step="0.05" value="0.72">
        </label>
        <label>최대 폭
          <input id="compressMaxWidth" type="number" min="640" max="4000" step="100" value="1600">
        </label>
      </div>
      <button class="primary-action" id="runImageCompress" type="button">압축 이미지 받기</button>
      <div class="result" id="result"></div>
    `,
    "image-resize": `
      <div class="tool-head"><h2>이미지 리사이즈</h2><p>LMS 첨부나 미리보기에 맞게 사진의 최대 가로와 세로를 줄입니다.</p></div>
      ${drop("image/*", true)}
      <div class="option-row">
        <label>출력 형식
          <select id="imageResizeFormat">
            <option value="original">원본 형식 유지</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>
        <label>최대 가로
          <input id="imageResizeMaxWidth" type="number" min="320" max="8000" step="100" value="1600">
        </label>
        <label>최대 세로
          <input id="imageResizeMaxHeight" type="number" min="320" max="8000" step="100" value="1600">
        </label>
        <label>품질
          <input id="imageResizeQuality" type="range" min="0.45" max="0.95" step="0.05" value="0.82">
        </label>
      </div>
      <button class="primary-action" id="runImageResize" type="button">리사이즈 이미지 받기</button>
      <div class="result" id="result"></div>
    `,
    "image-rotate": `
      <div class="tool-head"><h2>이미지 회전</h2><p>옆으로 돌아간 사진과 캡처 이미지를 90도 단위로 돌리거나 뒤집습니다.</p></div>
      ${drop("image/*", true)}
      <div class="option-row">
        <label>회전
          <select id="imageRotateAngle">
            <option value="90">90도</option>
            <option value="180">180도</option>
            <option value="270">270도</option>
          </select>
        </label>
        <label>뒤집기
          <select id="imageFlip">
            <option value="none">없음</option>
            <option value="horizontal">좌우 반전</option>
            <option value="vertical">상하 반전</option>
            <option value="both">좌우+상하 반전</option>
          </select>
        </label>
        <label>출력 형식
          <select id="imageRotateFormat">
            <option value="original">원본 형식 유지</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>
        <label>품질
          <input id="imageRotateQuality" type="range" min="0.45" max="0.95" step="0.05" value="0.82">
        </label>
      </div>
      <button class="primary-action" id="runImageRotate" type="button">회전 이미지 받기</button>
      <div class="result" id="result"></div>
    `,
    "image-watermark": `
      <div class="tool-head"><h2>이미지 워터마크</h2><p>제출 전 확인용 사진에 이름, 초안, 참고용 같은 표시를 작게 얹습니다.</p></div>
      ${drop("image/*", true)}
      <div class="option-row">
        <label>워터마크 문구
          <input id="imageWatermarkText" type="text" value="DRAFT" placeholder="홍길동, 초안, 참고용">
        </label>
        <label>위치
          <select id="imageWatermarkPosition">
            <option value="bottom-right">오른쪽 아래</option>
            <option value="bottom-left">왼쪽 아래</option>
            <option value="top-right">오른쪽 위</option>
            <option value="top-left">왼쪽 위</option>
            <option value="center">가운데</option>
          </select>
        </label>
        <label>글자 크기
          <input id="imageWatermarkSize" type="number" min="16" max="96" step="2" value="32">
        </label>
        <label>투명도
          <input id="imageWatermarkOpacity" type="range" min="0.15" max="0.75" step="0.05" value="0.45">
        </label>
        <label>색상
          <select id="imageWatermarkColor">
            <option value="white">흰색</option>
            <option value="black">검정</option>
            <option value="green">초록</option>
          </select>
        </label>
        <label>출력 형식
          <select id="imageWatermarkFormat">
            <option value="original">원본 형식 유지</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>
      </div>
      <button class="primary-action" id="runImageWatermark" type="button">워터마크 이미지 받기</button>
      <div class="result" id="result"></div>
    `,
    "file-name": `
      <div class="tool-head"><h2>파일명 만들기</h2><p>과목명, 학번, 이름, 과제명을 제출용 파일명으로 정리합니다.</p></div>
      <div class="sample-row"><button type="button" data-sample="file-name">예시 채우기</button><button type="button" data-clear="form">입력 비우기</button></div>
      <div class="form-grid">
        <label>과목명<input id="courseName" type="text" placeholder="마케팅원론"></label>
        <label>학번<input id="studentId" type="text" placeholder="20261234"></label>
        <label>이름<input id="studentName" type="text" placeholder="홍길동"></label>
        <label>과제명<input id="assignmentName" type="text" placeholder="1주차 개인과제"></label>
        <label>확장자
          <select id="fileExt"><option>pdf</option><option>docx</option><option>pptx</option><option>hwp</option><option>zip</option></select>
        </label>
      </div>
      <button class="primary-action" id="runFileName" type="button">파일명 만들기</button>
      <div class="result" id="result"></div>
    `,
    "submit-checklist": `
      <div class="tool-head"><h2>제출 전 점검표</h2><p>마감 직전에 놓치기 쉬운 파일명, 용량, 참고문헌, 첨부 여부를 한 번에 확인할 표로 만듭니다.</p></div>
      <div class="sample-row"><button type="button" data-sample="submit-checklist">예시 채우기</button><button type="button" data-clear="form">입력 비우기</button></div>
      <div class="form-grid">
        <label>과목명<input id="submitCourse" type="text" placeholder="마케팅원론"></label>
        <label>과제명<input id="submitAssignment" type="text" placeholder="1주차 개인과제"></label>
        <label>마감일<input id="submitDueDate" type="date"></label>
        <label>마감 시간<input id="submitDueTime" type="time"></label>
        <label>LMS/제출처<input id="submitChannel" type="text" placeholder="학교 LMS, 이메일, 구글폼"></label>
        <label>최종 파일명<input id="submitFileName" type="text" placeholder="마케팅원론_20261234_홍길동_1주차.pdf"></label>
        <label>허용 형식<input id="submitExts" type="text" placeholder="pdf, docx, zip"></label>
        <label>용량 제한<input id="submitLimit" type="text" placeholder="20MB 이하"></label>
      </div>
      <div class="checklist-panel" aria-label="확인 항목">
        ${[
          ["file-open", "최종 파일을 다시 열어봤음"],
          ["file-name", "파일명에 과목명, 학번, 이름, 과제명이 들어감"],
          ["file-size", "용량 제한과 확장자를 확인함"],
          ["pages", "PDF 페이지 순서와 누락 페이지를 확인함"],
          ["citation", "참고문헌/출처 표기를 마지막에 정리함"],
          ["privacy", "개인정보, 위치정보, 불필요한 메타데이터를 확인함"],
          ["attach", "제출 화면에서 파일 첨부 완료 상태를 확인함"],
          ["receipt", "제출 완료 화면이나 접수 메일을 저장함"]
        ].map(([id, label]) => `
          <label class="check-item">
            <input type="checkbox" data-submit-check="${id}">
            <span>${label}</span>
          </label>
        `).join("")}
      </div>
      <button class="primary-action" id="runSubmitChecklist" type="button">점검표 만들기</button>
      <div class="result" id="result"></div>
    `,
    "submit-package": `
      <div class="tool-head"><h2>제출 패키지</h2><p>본문, 참고자료, 이미지 파일을 제출 규칙에 맞는 이름으로 정리하고 점검표와 함께 ZIP으로 묶습니다.</p></div>
      <div class="sample-row"><button type="button" data-sample="submit-package">예시 채우기</button><button type="button" data-clear="form">입력 비우기</button></div>
      ${drop("*/*", true)}
      <div class="form-grid">
        <label>과목명<input id="packageCourse" type="text" placeholder="마케팅원론"></label>
        <label>과제명<input id="packageAssignment" type="text" placeholder="1주차 개인과제"></label>
        <label>학번<input id="packageStudentId" type="text" placeholder="20261234"></label>
        <label>이름<input id="packageStudentName" type="text" placeholder="홍길동"></label>
        <label>제출처<input id="packageChannel" type="text" placeholder="학교 LMS"></label>
        <label>마감일<input id="packageDueDate" type="date"></label>
        <label>파일명 방식
          <select id="packageNameMode">
            <option value="prefix">과목_학번_이름_과제명_원본명</option>
            <option value="numbered">과목_학번_이름_과제명_01</option>
            <option value="keep">원본 파일명 유지</option>
          </select>
        </label>
        <label>ZIP 파일명<input id="packageZipName" type="text" placeholder="마케팅원론_20261234_홍길동_제출팩.zip"></label>
      </div>
      <button class="primary-action" id="runSubmitPackage" type="button">제출 패키지 만들기</button>
      <div class="result" id="result"></div>
    `,
    "word-count": `
      <div class="tool-head"><h2>글자수 계산</h2><p>공백 포함, 공백 제외, 단어 수, A4 예상 장수를 계산합니다.</p></div>
      <div class="sample-row"><button type="button" data-sample="word-count">예시 본문</button><button type="button" data-clear="textarea">비우기</button></div>
      <textarea id="wordText" class="big-textarea" placeholder="레포트 본문을 붙여넣으세요."></textarea>
      <button class="primary-action" id="runWordCount" type="button">글자수 계산하기</button>
      <div class="result" id="result"></div>
    `,
    "text-clean": `
      <div class="tool-head"><h2>텍스트 정리</h2><p>PDF에서 복사한 글의 이상한 줄바꿈, 중복 공백, 깨진 문단을 정리합니다.</p></div>
      <div class="sample-row"><button type="button" data-sample="text-clean">깨진 텍스트 예시</button><button type="button" data-clear="textarea">비우기</button></div>
      <textarea id="dirtyText" class="big-textarea" placeholder="정리할 텍스트를 붙여넣으세요."></textarea>
      <div class="option-row">
        <label>작업
          <select id="textCleanMode">
            <option value="paragraph">문단 흐름 정리</option>
            <option value="line">줄 단위 유지</option>
            <option value="list">목록처럼 정리</option>
          </select>
        </label>
        <label>문장 사이
          <select id="sentenceSpace">
            <option value="normal">일반 공백</option>
            <option value="blank">빈 줄 추가</option>
          </select>
        </label>
      </div>
      <button class="primary-action" id="runTextClean" type="button">텍스트 정리하기</button>
      <div class="result" id="result"></div>
    `,
    "table-convert": `
      <div class="tool-head"><h2>표 변환</h2><p>엑셀에서 복사한 표를 CSV, Markdown, HTML 표로 바꿉니다.</p></div>
      <div class="sample-row"><button type="button" data-sample="table-convert">표 예시</button><button type="button" data-clear="textarea">비우기</button></div>
      <textarea id="tableText" class="big-textarea" placeholder="엑셀이나 한글 표를 복사해서 붙여넣으세요."></textarea>
      <div class="option-row">
        <label>출력 형식
          <select id="tableFormat">
            <option value="markdown">Markdown 표</option>
            <option value="csv">CSV</option>
            <option value="html">HTML table</option>
          </select>
        </label>
        <label>첫 줄
          <select id="tableHeader">
            <option value="header">제목 행으로 사용</option>
            <option value="body">일반 행으로 사용</option>
          </select>
        </label>
      </div>
      <button class="primary-action" id="runTableConvert" type="button">표 변환하기</button>
      <div class="result" id="result"></div>
    `,
    "citation-cleaner": `
      <div class="tool-head"><h2>참고문헌 정리</h2><p>스타일 생성, 정렬, 중복 제거, 누락 경고, 본문 인용까지 한 번에 정리합니다.</p></div>
      <div class="sample-row"><button type="button" data-sample="citation-web">웹 자료 예시</button><button type="button" data-sample="citation-article">논문 예시</button><button type="button" data-clear="form">입력 비우기</button></div>
      <div class="citation-builder">
        <label>형식
          <select id="citationStyle">
            <option value="korean">한국식</option>
            <option value="apa">APA 7</option>
            <option value="mla">MLA</option>
            <option value="chicago">Chicago</option>
          </select>
        </label>
        <label>자료 유형
          <select id="citationType">
            <option value="web">웹페이지</option>
            <option value="book">도서</option>
            <option value="article">논문/학술지</option>
            <option value="report">보고서</option>
          </select>
        </label>
        <label>저자
          <input id="citationAuthor" type="text" placeholder="홍길동 또는 Kim, J.">
        </label>
        <label>연도
          <input id="citationYear" type="text" placeholder="2026">
        </label>
        <label>제목
          <input id="citationTitle" type="text" placeholder="자료 제목">
        </label>
        <label>출처/사이트/학술지
          <input id="citationSource" type="text" placeholder="사이트명, 출판사, 학술지명">
        </label>
        <label>URL 또는 DOI
          <input id="citationUrl" type="text" placeholder="https:// 또는 10.xxxx">
        </label>
        <label>접속일
          <input id="citationAccessed" type="date">
        </label>
      </div>
      <button class="secondary-action" id="addCitationEntry" type="button">입력값으로 참고문헌 줄 만들기</button>
      <textarea id="citationText" class="big-textarea citation-textarea" placeholder="참고문헌을 한 줄에 하나씩 붙여넣거나, 위 입력값으로 줄을 만드세요."></textarea>
      <div class="option-row">
        <label>정렬 방식
          <select id="citationSort">
            <option value="locale">가나다순 + 알파벳순</option>
            <option value="original">원래 순서 유지</option>
          </select>
        </label>
        <label>정리 기준
          <select id="citationNormalize">
            <option value="strict">중복 제거 + 구두점 정리</option>
            <option value="light">공백만 정리</option>
          </select>
        </label>
      </div>
      <button class="primary-action" id="runCitation" type="button">참고문헌 정리하기</button>
      <div class="result" id="result"></div>
    `,
    "file-check": `
      <div class="tool-head"><h2>파일 점검</h2><p>제출 파일의 용량, 확장자, 이름, PDF 페이지 수를 확인합니다.</p></div>
      ${drop("*/*", true)}
      <div class="option-row">
        <label>용량 기준
          <select id="limitSize">
            <option value="20">20MB</option>
            <option value="10">10MB</option>
            <option value="50">50MB</option>
          </select>
        </label>
      </div>
      <button class="primary-action" id="runFileCheck" type="button">파일 점검하기</button>
      <div class="result" id="result"></div>
    `,
    "zip-pack": `
      <div class="tool-head"><h2>ZIP 압축</h2><p>과제 관련 파일을 하나의 압축 파일로 묶습니다.</p></div>
      ${drop("*/*", true)}
      <div class="option-row">
        <label>ZIP 파일명
          <input id="zipName" type="text" placeholder="과제제출.zip">
        </label>
      </div>
      <button class="primary-action" id="runZipPack" type="button">ZIP 만들기</button>
      <div class="result" id="result"></div>
    `,
    "privacy-clean": `
      <div class="tool-head"><h2>개인정보 제거</h2><p>이미지는 다시 인코딩하고 PDF는 문서 정보를 비워 저장합니다.</p></div>
      ${drop("image/*,application/pdf", true)}
      <button class="primary-action" id="runPrivacyClean" type="button">정리한 파일 받기</button>
      <div class="result" id="result"></div>
    `
  };

  return panel[id] || panel["pdf-compress"];
}

function bindGlobalEvents() {
  app.querySelectorAll("[data-tool-link]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const tool = toolById(button.dataset.toolLink);
      if (!tool) return;
      currentTool = tool;
      currentPage = null;
      history.pushState({ tool: tool.id }, "", tool.path);
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  app.querySelectorAll(".file-input").forEach((input) => {
    input.addEventListener("change", () => updateFileSummary(input));
  });
  bindDropzones();
  bindToolSearch();
  bindCategoryOverview();
  bindUtilityButtons();
}

function bindToolEvents(id) {
  const map = {
    "pdf-compress": ["#runPdfCompress", runPdfCompress],
    "pdf-slim": ["#runPdfSlim", runPdfSlim],
    "pdf-edit": ["#runPdfEdit", runPdfEdit],
    "pdf-number": ["#runPdfNumber", runPdfNumber],
    "pdf-watermark": ["#runPdfWatermark", runPdfWatermark],
    "pdf-split": ["#runPdfSplit", runPdfSplit],
    "pdf-organize": ["#runPdfOrganize", runPdfOrganize],
    "pdf-rotate": ["#runPdfRotate", runPdfRotate],
    "image-convert": ["#runImageConvert", runImageConvert],
    "image-compress": ["#runImageCompress", runImageCompress],
    "image-resize": ["#runImageResize", runImageResize],
    "image-rotate": ["#runImageRotate", runImageRotate],
    "image-watermark": ["#runImageWatermark", runImageWatermark],
    "file-name": ["#runFileName", runFileName],
    "submit-checklist": ["#runSubmitChecklist", runSubmitChecklist],
    "submit-package": ["#runSubmitPackage", runSubmitPackage],
    "word-count": ["#runWordCount", runWordCount],
    "text-clean": ["#runTextClean", runTextClean],
    "table-convert": ["#runTableConvert", runTableConvert],
    "citation-cleaner": ["#runCitation", runCitationCleaner],
    "file-check": ["#runFileCheck", runFileCheck],
    "zip-pack": ["#runZipPack", runZipPack],
    "privacy-clean": ["#runPrivacyClean", runPrivacyClean]
  };
  const entry = map[id];
  if (entry) app.querySelector(entry[0])?.addEventListener("click", entry[1]);
  if (id === "citation-cleaner") app.querySelector("#addCitationEntry")?.addEventListener("click", addCitationEntry);
}

function bindDropzones() {
  app.querySelectorAll(".dropzone").forEach((zone) => {
    const input = zone.querySelector(".file-input");
    if (!input) return;
    ["dragenter", "dragover"].forEach((eventName) => {
      zone.addEventListener(eventName, (event) => {
        event.preventDefault();
        zone.classList.add("is-dragging");
      });
    });
    ["dragleave", "drop"].forEach((eventName) => {
      zone.addEventListener(eventName, (event) => {
        event.preventDefault();
        zone.classList.remove("is-dragging");
      });
    });
    zone.addEventListener("drop", (event) => {
      const files = event.dataTransfer?.files;
      if (!files?.length) return;
      input.files = files;
      updateFileSummary(input);
    });
  });
}

function bindToolSearch() {
  const search = app.querySelector("#toolSearch");
  const count = app.querySelector("#toolSearchCount");
  if (!search) return;
  search.addEventListener("input", () => {
    const keyword = search.value.trim().toLowerCase();
    let visible = 0;
    app.querySelectorAll(".tool-card").forEach((card) => {
      const haystack = card.dataset.search || "";
      const match = !keyword || haystack.includes(keyword);
      card.hidden = !match;
      if (match) visible += 1;
    });
    if (count) count.textContent = `${visible}개 도구`;
  });
}

function bindCategoryOverview() {
  app.querySelectorAll("[data-tool-group]").forEach((button) => {
    button.addEventListener("click", () => {
      const search = app.querySelector("#toolSearch");
      if (!search) return;
      search.value = button.dataset.toolGroup || "";
      search.dispatchEvent(new Event("input"));
      app.querySelector(".tool-menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function bindUtilityButtons() {
  app.querySelectorAll("[data-sample]").forEach((button) => {
    button.addEventListener("click", () => applySample(button.dataset.sample));
  });
  app.querySelectorAll("[data-clear]").forEach((button) => {
    button.addEventListener("click", () => clearCurrentInputs(button.dataset.clear));
  });
}

window.addEventListener("popstate", () => {
  currentPage = findPageFromLocation();
  currentTool = findToolFromLocation() || tools[0];
  render();
});

async function runPdfCompress() {
  await withProgress(async () => {
    const { PDFDocument } = await getPdfLib();
    const file = singleFile();
    requireFile(file, "PDF 파일을 선택하세요.");
    const input = await file.arrayBuffer();
    const pdf = await PDFDocument.load(input, { ignoreEncryption: true });
    scrubPdfInfo(pdf);
    const bytes = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
    const outName = cleanOutputName(value("#pdfCompressName") || file.name.replace(/\.pdf$/i, "_reportfit.pdf"), "pdf");
    const blob = new Blob([bytes], { type: "application/pdf" });
    setResult(`
      ${compareSize(file.size, blob.size)}
      ${downloadButton(blob, outName, "압축 PDF 다운로드")}
      <p class="soft-note">스캔 이미지가 가득한 PDF는 이미지 자체를 다시 압축해야 크게 줄어듭니다.</p>
    `);
  });
}

async function runPdfSlim() {
  await withProgress(async () => {
    const { PDFDocument } = await getPdfLib();
    const pdfjs = await getPdfJs();
    const file = singleFile();
    requireFile(file, "PDF 파일을 선택하세요.");

    const quality = Number(value("#pdfSlimQuality") || 0.68);
    const maxWidth = Number(value("#pdfSlimWidth") || 1200);
    const grayscale = value("#pdfSlimColor") === "gray";
    const input = await file.arrayBuffer();
    const source = await pdfjs.getDocument({ data: input }).promise;
    const output = await PDFDocument.create();
    const rows = [];

    for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber += 1) {
      const sourcePage = await source.getPage(pageNumber);
      const baseViewport = sourcePage.getViewport({ scale: 1 });
      const scale = Math.max(0.6, Math.min(maxWidth / baseViewport.width, 2.8));
      const renderViewport = sourcePage.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(renderViewport.width);
      canvas.height = Math.ceil(renderViewport.height);
      const ctx = canvas.getContext("2d", { alpha: false });
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await sourcePage.render({ canvasContext: ctx, viewport: renderViewport }).promise;
      if (grayscale) applyCanvasGrayscale(ctx, canvas.width, canvas.height);

      const imageBlob = await canvasToBlob(canvas, "image/jpeg", quality);
      const jpg = await output.embedJpg(await imageBlob.arrayBuffer());
      const page = output.addPage([baseViewport.width, baseViewport.height]);
      page.drawImage(jpg, { x: 0, y: 0, width: baseViewport.width, height: baseViewport.height });
      rows.push({ page: pageNumber, width: canvas.width, size: imageBlob.size });
      sourcePage.cleanup?.();
    }

    source.cleanup?.();
    scrubPdfInfo(output);
    const blob = new Blob([await output.save({ useObjectStreams: true })], { type: "application/pdf" });
    const outName = cleanOutputName(value("#pdfSlimName") || replaceExt(file.name, "slim.pdf"), "pdf");
    const avgWidth = Math.round(rows.reduce((sum, row) => sum + row.width, 0) / rows.length);
    const sizeNote = blob.size < file.size
      ? "용량이 줄었습니다. 제출 전에는 결과 PDF를 열어 작은 글자와 표가 읽히는지 확인하세요."
      : "원본이 이미 가볍거나 텍스트 중심이면 더 커질 수 있습니다. 스캔본은 페이지 최대 폭과 품질을 더 낮춰 다시 시도하세요.";

    setResult(`
      ${compareSize(file.size, blob.size)}
      <div class="metric-grid"><div><span>페이지</span><strong>${source.numPages}쪽</strong></div><div><span>품질</span><strong>${Math.round(quality * 100)}%</strong></div><div><span>평균 폭</span><strong>${avgWidth}px</strong></div></div>
      ${downloadButton(blob, outName, "경량 PDF 다운로드")}
      <p class="soft-note">${escapeHtml(sizeNote)} 결과 PDF는 페이지를 이미지로 다시 만든 파일입니다.</p>
    `);
  });
}

async function runPdfEdit() {
  await withProgress(async () => {
    const { PDFDocument, degrees } = await getPdfLib();
    const files = selectedFiles();
    requireFiles(files, "PDF 파일을 선택하세요.");
    const mode = value("#pdfEditMode");
    const rotate = Number(value("#rotatePages") || 0);
    const output = await PDFDocument.create();

    if (mode === "merge") {
      for (const file of files) {
        const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const pages = await output.copyPages(source, source.getPageIndices());
        pages.forEach((page) => addPageWithRotation(output, page, rotate, degrees));
      }
    } else {
      const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const indices = parsePageRange(value("#pageRange"), source.getPageCount());
      const pages = await output.copyPages(source, indices);
      pages.forEach((page) => addPageWithRotation(output, page, rotate, degrees));
    }

    scrubPdfInfo(output);
    const bytes = await output.save({ useObjectStreams: true });
    const blob = new Blob([bytes], { type: "application/pdf" });
    setResult(`
      <div class="metric-grid"><div><span>페이지</span><strong>${output.getPageCount()}쪽</strong></div><div><span>파일</span><strong>${formatBytes(blob.size)}</strong></div></div>
      ${downloadButton(blob, "reportfit_pdf.pdf", "새 PDF 다운로드")}
    `);
  });
}

async function runPdfNumber() {
  await withProgress(async () => {
    const { PDFDocument, StandardFonts, rgb } = await getPdfLib();
    const file = singleFile();
    requireFile(file, "PDF 파일을 선택하세요.");
    const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const pages = pdf.getPages();
    const total = pages.length;
    const start = Math.max(1, Number(value("#pageNumberStart") || 1));
    const format = value("#pageNumberFormat");
    const position = value("#pageNumberPosition");

    pages.forEach((page, index) => {
      const { width } = page.getSize();
      const number = start + index;
      const text = format === "page" ? `Page ${number} of ${total}` : format === "short" ? `p. ${number} / ${total}` : `${number} / ${total}`;
      const size = 10;
      const textWidth = font.widthOfTextAtSize(text, size);
      const x = position === "left" ? 36 : position === "right" ? width - textWidth - 36 : (width - textWidth) / 2;
      page.drawText(text, { x, y: 24, size, font, color: rgb(0.25, 0.31, 0.3) });
    });

    scrubPdfInfo(pdf);
    const blob = new Blob([await pdf.save({ useObjectStreams: true })], { type: "application/pdf" });
    setResult(`
      <div class="metric-grid"><div><span>페이지</span><strong>${total}쪽</strong></div><div><span>결과</span><strong>${formatBytes(blob.size)}</strong></div></div>
      ${downloadButton(blob, replaceExt(file.name, "numbered.pdf"), "번호 넣은 PDF 다운로드")}
    `);
  });
}

async function runPdfWatermark() {
  await withProgress(async () => {
    const { PDFDocument, StandardFonts, degrees, rgb } = await getPdfLib();
    const file = singleFile();
    requireFile(file, "PDF 파일을 선택하세요.");
    const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    const text = safePdfText(value("#watermarkText") || "DRAFT");
    const opacity = Number(value("#watermarkOpacity") || 0.16);
    const size = Number(value("#watermarkSize") || 52);

    pdf.getPages().forEach((page) => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: Math.max(24, (width - textWidth) / 2),
        y: height / 2,
        size,
        font,
        rotate: degrees(-28),
        color: rgb(0.1, 0.16, 0.15),
        opacity
      });
    });

    scrubPdfInfo(pdf);
    const blob = new Blob([await pdf.save({ useObjectStreams: true })], { type: "application/pdf" });
    setResult(`
      <div class="metric-grid"><div><span>워터마크</span><strong>${escapeHtml(text)}</strong></div><div><span>결과</span><strong>${formatBytes(blob.size)}</strong></div></div>
      ${downloadButton(blob, replaceExt(file.name, "watermark.pdf"), "워터마크 PDF 다운로드")}
      <p class="soft-note">PDF 기본 폰트 호환을 위해 워터마크 문구는 영문/숫자 중심으로 저장됩니다.</p>
    `);
  });
}

async function runPdfSplit() {
  await withProgress(async () => {
    const { PDFDocument } = await getPdfLib();
    const JSZip = await getJSZip();
    const file = singleFile();
    requireFile(file, "PDF 파일을 선택하세요.");
    const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const total = source.getPageCount();
    const mode = value("#pdfSplitMode");
    const groups = mode === "ranges"
      ? parsePageGroups(value("#pdfSplitRanges"), total)
      : Array.from({ length: total }, (_, index) => ({ label: `${index + 1}`, indices: [index] }));
    const zip = new JSZip();
    const base = pdfBaseName(file);
    const rows = [];

    for (const group of groups) {
      const output = await PDFDocument.create();
      const pages = await output.copyPages(source, group.indices);
      pages.forEach((page) => output.addPage(page));
      scrubPdfInfo(output);
      const bytes = await output.save({ useObjectStreams: true });
      const pdfName = cleanOutputName(`${base}_p${group.label}.pdf`, "pdf");
      zip.file(pdfName, bytes);
      rows.push({ name: pdfName, pages: group.indices.length, range: group.label, size: bytes.length });
    }

    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    });
    const outName = cleanOutputName(value("#pdfSplitName") || replaceExt(file.name, "split.zip"), "zip");

    setResult(`
      <div class="metric-grid"><div><span>분할 파일</span><strong>${rows.length}개</strong></div><div><span>원본 페이지</span><strong>${total}쪽</strong></div><div><span>ZIP</span><strong>${formatBytes(blob.size)}</strong></div></div>
      <div class="table-wrap">
        <table><thead><tr><th>파일명</th><th>페이지</th><th>범위</th><th>용량</th></tr></thead><tbody>
          ${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${row.pages}쪽</td><td>${escapeHtml(row.range)}</td><td>${formatBytes(row.size)}</td></tr>`).join("")}
        </tbody></table>
      </div>
      ${downloadButton(blob, outName, "분할 PDF ZIP 다운로드")}
    `);
  });
}

async function runPdfOrganize() {
  await withProgress(async () => {
    const { PDFDocument } = await getPdfLib();
    const file = singleFile();
    requireFile(file, "PDF 파일을 선택하세요.");
    const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const total = source.getPageCount();
    const preset = value("#pdfOrganizePreset");
    const indices = preset === "reverse"
      ? Array.from({ length: total }, (_, index) => total - index - 1)
      : preset === "odd"
        ? Array.from({ length: total }, (_, index) => index).filter((index) => index % 2 === 0)
        : preset === "even"
          ? Array.from({ length: total }, (_, index) => index).filter((index) => index % 2 === 1)
          : parsePageSequence(value("#pdfOrganizeOrder"), total);

    if (!indices.length) throw new Error("남길 페이지가 없습니다. 페이지 순서를 다시 확인하세요.");

    const output = await PDFDocument.create();
    const pages = await output.copyPages(source, indices);
    pages.forEach((page) => output.addPage(page));
    scrubPdfInfo(output);
    const blob = new Blob([await output.save({ useObjectStreams: true })], { type: "application/pdf" });
    const outName = cleanOutputName(value("#pdfOrganizeName") || replaceExt(file.name, "organized.pdf"), "pdf");

    setResult(`
      <div class="metric-grid"><div><span>원본</span><strong>${total}쪽</strong></div><div><span>정리본</span><strong>${indices.length}쪽</strong></div><div><span>결과</span><strong>${formatBytes(blob.size)}</strong></div></div>
      <p class="soft-note">적용된 순서: ${escapeHtml(pageSelectionLabel(indices))}</p>
      ${downloadButton(blob, outName, "정리한 PDF 다운로드")}
    `);
  });
}

async function runPdfRotate() {
  await withProgress(async () => {
    const { PDFDocument, degrees } = await getPdfLib();
    const file = singleFile();
    requireFile(file, "PDF 파일을 선택하세요.");
    const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const total = pdf.getPageCount();
    const indices = parsePageRange(value("#pdfRotateRange"), total);
    const targets = new Set(indices);
    const angle = Number(value("#pdfRotateAngle") || 90);

    pdf.getPages().forEach((page, index) => {
      if (!targets.has(index)) return;
      page.setRotation(degrees((page.getRotation().angle + angle) % 360));
    });

    scrubPdfInfo(pdf);
    const blob = new Blob([await pdf.save({ useObjectStreams: true })], { type: "application/pdf" });
    const outName = cleanOutputName(value("#pdfRotateName") || replaceExt(file.name, "rotated.pdf"), "pdf");

    setResult(`
      <div class="metric-grid"><div><span>회전 페이지</span><strong>${indices.length}쪽</strong></div><div><span>각도</span><strong>${angle}도</strong></div><div><span>결과</span><strong>${formatBytes(blob.size)}</strong></div></div>
      <p class="soft-note">회전된 페이지: ${escapeHtml(pageSelectionLabel(indices))}</p>
      ${downloadButton(blob, outName, "회전 PDF 다운로드")}
    `);
  });
}

async function runImageConvert() {
  await withProgress(async () => {
    const files = selectedFiles();
    requireFiles(files, "이미지 파일을 선택하세요.");
    const format = value("#imageFormat");
    const quality = Number(value("#imageQuality"));
    const maxWidth = Number(value("#imageMaxWidth"));

    if (format === "pdf") {
      const pdfBytes = await imagesToPdf(files, quality, maxWidth);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResult(`${downloadButton(blob, "reportfit_images.pdf", "이미지 PDF 다운로드")}`);
      return;
    }

    const JSZip = await getJSZip();
    const zip = new JSZip();
    for (const file of files) {
      const converted = await convertImage(file, format, quality, maxWidth);
      zip.file(replaceExt(file.name, extensionFor(format)), converted);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    setResult(`${downloadButton(blob, "reportfit_images.zip", "변환 이미지 ZIP 다운로드")}`);
  });
}

async function runImageCompress() {
  await withProgress(async () => {
    const files = selectedFiles();
    requireFiles(files, "이미지 파일을 선택하세요.");
    const format = value("#compressFormat");
    const quality = Number(value("#compressQuality"));
    const maxWidth = Number(value("#compressMaxWidth"));
    const JSZip = await getJSZip();
    const zip = new JSZip();
    let before = 0;
    let after = 0;

    for (const file of files) {
      before += file.size;
      const converted = await convertImage(file, format, quality, maxWidth);
      after += converted.size;
      zip.file(replaceExt(file.name, extensionFor(format)), converted);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    setResult(`
      ${compareSize(before, after)}
      ${downloadButton(blob, "reportfit_image_compress.zip", "압축 이미지 ZIP 다운로드")}
    `);
  });
}

async function runImageResize() {
  await withProgress(async () => {
    const files = selectedFiles();
    requireFiles(files, "이미지 파일을 선택하세요.");
    const format = value("#imageResizeFormat");
    const quality = Number(value("#imageResizeQuality"));
    const maxWidth = clampNumber(value("#imageResizeMaxWidth"), 320, 8000, 1600);
    const maxHeight = clampNumber(value("#imageResizeMaxHeight"), 320, 8000, 1600);
    const JSZip = await getJSZip();
    const zip = new JSZip();
    const rows = [];
    let before = 0;
    let after = 0;

    for (const file of files) {
      before += file.size;
      const mime = outputMimeForImage(file, format);
      const result = await resizeImage(file, { mime, quality, maxWidth, maxHeight });
      after += result.blob.size;
      zip.file(imageOutputName(file, "resize", mime), result.blob);
      rows.push([file.name, `${result.width}x${result.height}`, formatBytes(result.blob.size)]);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    setResult(`
      ${compareSize(before, after)}
      ${imageResultTable(rows, ["파일", "크기", "결과"])}
      ${downloadButton(blob, "reportfit_image_resize.zip", "리사이즈 이미지 ZIP 다운로드")}
    `);
  });
}

async function runImageRotate() {
  await withProgress(async () => {
    const files = selectedFiles();
    requireFiles(files, "이미지 파일을 선택하세요.");
    const angle = Number(value("#imageRotateAngle")) || 90;
    const flip = value("#imageFlip") || "none";
    const format = value("#imageRotateFormat");
    const quality = Number(value("#imageRotateQuality"));
    const JSZip = await getJSZip();
    const zip = new JSZip();
    const rows = [];
    let before = 0;
    let after = 0;

    for (const file of files) {
      before += file.size;
      const mime = outputMimeForImage(file, format);
      const result = await rotateImage(file, { mime, quality, angle, flip });
      after += result.blob.size;
      zip.file(imageOutputName(file, "rotate", mime), result.blob);
      rows.push([file.name, `${result.width}x${result.height}`, formatBytes(result.blob.size)]);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    setResult(`
      ${compareSize(before, after)}
      ${imageResultTable(rows, ["파일", "크기", "결과"])}
      ${downloadButton(blob, "reportfit_image_rotate.zip", "회전 이미지 ZIP 다운로드")}
    `);
  });
}

async function runImageWatermark() {
  await withProgress(async () => {
    const files = selectedFiles();
    requireFiles(files, "이미지 파일을 선택하세요.");
    const text = value("#imageWatermarkText").trim();
    if (!text) throw new Error("워터마크 문구를 입력하세요.");
    const format = value("#imageWatermarkFormat");
    const quality = 0.9;
    const position = value("#imageWatermarkPosition") || "bottom-right";
    const opacity = clampNumber(value("#imageWatermarkOpacity"), 0.15, 0.75, 0.45);
    const size = clampNumber(value("#imageWatermarkSize"), 16, 96, 32);
    const color = value("#imageWatermarkColor") || "white";
    const JSZip = await getJSZip();
    const zip = new JSZip();
    const rows = [];
    let before = 0;
    let after = 0;

    for (const file of files) {
      before += file.size;
      const mime = outputMimeForImage(file, format);
      const result = await watermarkImage(file, { mime, quality, text, position, opacity, size, color });
      after += result.blob.size;
      zip.file(imageOutputName(file, "watermark", mime), result.blob);
      rows.push([file.name, positionLabel(position), formatBytes(result.blob.size)]);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    setResult(`
      ${compareSize(before, after)}
      ${imageResultTable(rows, ["파일", "위치", "결과"])}
      ${downloadButton(blob, "reportfit_image_watermark.zip", "워터마크 이미지 ZIP 다운로드")}
    `);
  });
}

function runFileName() {
  const parts = [
    value("#courseName"),
    value("#studentId"),
    value("#studentName"),
    value("#assignmentName")
  ].map(slugPart).filter(Boolean);
  const ext = value("#fileExt") || "pdf";
  const name = `${parts.join("_") || "reportfit_assignment"}.${ext}`;
  setResult(`
    <div class="copy-box">
      <input id="generatedName" value="${escapeHtml(name)}" readonly>
      <button type="button" data-copy="#generatedName">복사</button>
    </div>
  `);
  app.querySelector("[data-copy]")?.addEventListener("click", copyGenerated);
}

function runSubmitChecklist() {
  const course = value("#submitCourse").trim() || "과목명 미입력";
  const assignment = value("#submitAssignment").trim() || "과제명 미입력";
  const dueDate = value("#submitDueDate");
  const dueTime = value("#submitDueTime");
  const channel = value("#submitChannel").trim() || "제출처 미입력";
  const fileName = value("#submitFileName").trim() || "최종 파일명 미입력";
  const exts = value("#submitExts").trim() || "형식 기준 미입력";
  const limit = value("#submitLimit").trim() || "용량 기준 미입력";
  const checked = [...app.querySelectorAll("[data-submit-check]")]
    .filter((input) => input.checked)
    .map((input) => input.closest(".check-item")?.innerText.trim())
    .filter(Boolean);
  const unchecked = [...app.querySelectorAll("[data-submit-check]")]
    .filter((input) => !input.checked)
    .map((input) => input.closest(".check-item")?.innerText.trim())
    .filter(Boolean);
  const due = dueLabel(dueDate, dueTime);
  const checklistText = [
    `[과제 제출 전 점검표]`,
    `과목: ${course}`,
    `과제: ${assignment}`,
    `제출처: ${channel}`,
    `마감: ${due}`,
    `최종 파일명: ${fileName}`,
    `허용 형식: ${exts}`,
    `용량 제한: ${limit}`,
    ``,
    `[확인 완료]`,
    ...(checked.length ? checked.map((item) => `- ${item}`) : ["- 아직 체크한 항목 없음"]),
    ``,
    `[마지막으로 볼 항목]`,
    ...(unchecked.length ? unchecked.map((item) => `- ${item}`) : ["- 남은 확인 항목 없음"]),
    ``,
    `제출 후에는 완료 화면, 접수 메일, LMS 제출 시간을 캡처해 보관합니다.`
  ].join("\n");

  setResult(`
    <div class="submit-summary">
      <div><span>과목</span><strong>${escapeHtml(course)}</strong></div>
      <div><span>마감</span><strong>${escapeHtml(due)}</strong></div>
      <div><span>남은 확인</span><strong>${unchecked.length}개</strong></div>
    </div>
    <textarea class="result-text submit-output" id="submitChecklistResult" readonly>${escapeHtml(checklistText)}</textarea>
    ${unchecked.length ? `<ul class="warning-list">${unchecked.slice(0, 5).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<p class="soft-note">선택한 항목 기준으로 남은 확인 항목이 없습니다. 실제 제출 화면에서 첨부 상태만 마지막으로 확인하세요.</p>`}
    <button class="secondary-action" type="button" data-copy="#submitChecklistResult">점검표 복사</button>
  `);
  app.querySelector("[data-copy]")?.addEventListener("click", copyGenerated);
}

async function runSubmitPackage() {
  await withProgress(async () => {
    const JSZip = await getJSZip();
    const files = selectedFiles();
    requireFiles(files, "묶을 제출 파일을 선택하세요.");

    const meta = {
      course: value("#packageCourse").trim() || "과목명",
      assignment: value("#packageAssignment").trim() || "과제명",
      studentId: value("#packageStudentId").trim() || "학번",
      studentName: value("#packageStudentName").trim() || "이름",
      channel: value("#packageChannel").trim() || "제출처 미입력",
      dueDate: value("#packageDueDate"),
      mode: value("#packageNameMode") || "prefix"
    };
    const zip = new JSZip();
    const rows = [];
    let totalSize = 0;

    files.forEach((file, index) => {
      totalSize += file.size;
      const packagedName = packageFileName(file, index, meta);
      zip.file(packagedName, file);
      rows.push({ original: file.name, packaged: packagedName, size: file.size });
    });

    const checklist = buildPackageChecklist(meta, rows, totalSize);
    zip.file("제출점검표.txt", checklist);

    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    });
    const outName = cleanOutputName(value("#packageZipName") || `${slugPart(meta.course)}_${slugPart(meta.studentId)}_${slugPart(meta.studentName)}_제출팩.zip`, "zip");

    setResult(`
      <div class="submit-summary">
        <div><span>묶은 파일</span><strong>${files.length}개</strong></div>
        <div><span>원본 합계</span><strong>${formatBytes(totalSize)}</strong></div>
        <div><span>ZIP 용량</span><strong>${formatBytes(blob.size)}</strong></div>
      </div>
      <div class="table-wrap">
        <table><thead><tr><th>원본</th><th>패키지 안 파일명</th><th>용량</th></tr></thead><tbody>
          ${rows.map((row) => `<tr><td>${escapeHtml(row.original)}</td><td>${escapeHtml(row.packaged)}</td><td>${formatBytes(row.size)}</td></tr>`).join("")}
        </tbody></table>
      </div>
      <textarea class="result-text submit-output" id="packageChecklistResult" readonly>${escapeHtml(checklist)}</textarea>
      ${downloadButton(blob, outName, "제출 패키지 ZIP 다운로드")}
      <button class="secondary-action" type="button" data-copy="#packageChecklistResult">점검표 복사</button>
    `);
    app.querySelector("[data-copy]")?.addEventListener("click", copyGenerated);
  });
}

function runWordCount() {
  const text = value("#wordText");
  const noSpace = text.replace(/\s/g, "");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const koreanUnits = Math.ceil(noSpace.length / 1800 * 10) / 10;
  setResult(`
    <div class="metric-grid">
      <div><span>공백 포함</span><strong>${text.length.toLocaleString()}자</strong></div>
      <div><span>공백 제외</span><strong>${noSpace.length.toLocaleString()}자</strong></div>
      <div><span>단어 수</span><strong>${words.toLocaleString()}개</strong></div>
      <div><span>A4 예상</span><strong>${koreanUnits || 0}장</strong></div>
    </div>
  `);
}

function runTextClean() {
  const raw = value("#dirtyText");
  const mode = value("#textCleanMode");
  const gap = value("#sentenceSpace");
  const cleaned = cleanText(raw, mode, gap);
  setResult(`
    <textarea class="result-text" id="cleanTextResult" readonly>${escapeHtml(cleaned)}</textarea>
    <div class="metric-grid">
      <div><span>원본</span><strong>${raw.length.toLocaleString()}자</strong></div>
      <div><span>결과</span><strong>${cleaned.length.toLocaleString()}자</strong></div>
      <div><span>줄 수</span><strong>${cleaned.split(/\n/).filter(Boolean).length.toLocaleString()}줄</strong></div>
    </div>
    <button class="secondary-action" type="button" data-copy="#cleanTextResult">정리한 텍스트 복사</button>
  `);
  app.querySelector("[data-copy]")?.addEventListener("click", copyGenerated);
}

function runTableConvert() {
  const raw = value("#tableText");
  const rows = parseTableRows(raw);
  if (!rows.length) {
    setResult(`<p class="error">변환할 표 내용을 붙여넣으세요.</p>`);
    return;
  }
  const format = value("#tableFormat");
  const hasHeader = value("#tableHeader") === "header";
  const output = formatTableRows(rows, format, hasHeader);
  setResult(`
    <textarea class="result-text" id="tableResult" readonly>${escapeHtml(output)}</textarea>
    <div class="metric-grid">
      <div><span>행</span><strong>${rows.length}개</strong></div>
      <div><span>열</span><strong>${Math.max(...rows.map((row) => row.length))}개</strong></div>
      <div><span>형식</span><strong>${format.toUpperCase()}</strong></div>
    </div>
    <button class="secondary-action" type="button" data-copy="#tableResult">변환한 표 복사</button>
  `);
  app.querySelector("[data-copy]")?.addEventListener("click", copyGenerated);
}

function addCitationEntry() {
  const entry = citationFromFields();
  if (!entry.line) {
    setResult(`<p class="error">저자와 제목은 최소한 입력해야 참고문헌 줄을 만들 수 있습니다.</p>`);
    return;
  }
  const textarea = app.querySelector("#citationText");
  const prefix = textarea.value.trim() ? "\n" : "";
  textarea.value += `${prefix}${entry.line}`;
  setResult(`
    <p class="soft-note">참고문헌 줄을 추가했습니다. 아래에서 정렬과 중복 제거를 이어서 실행하세요.</p>
    ${entry.inText ? `<div class="copy-box"><input id="citationInText" value="${escapeHtml(entry.inText)}" readonly><button type="button" data-copy="#citationInText">본문 인용 복사</button></div>` : ""}
  `);
  app.querySelector("[data-copy]")?.addEventListener("click", copyGenerated);
}

function runCitationCleaner() {
  const generated = citationFromFields();
  const rawLines = [
    ...value("#citationText").split(/\r?\n/),
    generated.line
  ]
    .filter(Boolean)
    .map((line) => value("#citationNormalize") === "strict" ? normalizeCitationLine(line) : line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const seen = new Map();
  const duplicates = [];
  for (const line of rawLines) {
    const key = citationKey(line);
    if (seen.has(key)) duplicates.push(line);
    else seen.set(key, line);
  }
  const deduped = [...seen.values()];
  const lines = value("#citationSort") === "locale"
    ? sortCitationLines(deduped)
    : deduped;
  const warnings = citationWarnings(lines, generated.fields);
  const output = lines.join("\n");
  setResult(`
    <textarea class="result-text" id="cleanCitation" readonly>${escapeHtml(output)}</textarea>
    <div class="metric-grid">
      <div><span>정리된 줄</span><strong>${lines.length}개</strong></div>
      <div><span>중복 제거</span><strong>${duplicates.length}개</strong></div>
      <div><span>경고</span><strong>${warnings.length}개</strong></div>
    </div>
    ${generated.inText ? `<div class="copy-box"><input id="citationInText" value="${escapeHtml(generated.inText)}" readonly><button type="button" data-copy="#citationInText">본문 인용 복사</button></div>` : ""}
    ${warnings.length ? `<ul class="warning-list">${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>` : `<p class="soft-note">중복과 기본 누락 항목을 확인했습니다. 과목별 세부 양식은 교수자 안내를 우선하세요.</p>`}
    <button class="secondary-action" type="button" data-copy="#cleanCitation">정리한 참고문헌 복사</button>
  `);
  app.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", copyGenerated));
}

async function runFileCheck() {
  await withProgress(async () => {
    const { PDFDocument } = await getPdfLib();
    const files = selectedFiles();
    requireFiles(files, "점검할 파일을 선택하세요.");
    const limit = Number(value("#limitSize")) * 1024 * 1024;
    const rows = [];

    for (const file of files) {
      const ext = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "없음";
      const nameOk = /^[가-힣a-zA-Z0-9._() -]+$/.test(file.name);
      let pageText = "해당 없음";
      if (ext === "pdf") {
        try {
          const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
          pageText = `${pdf.getPageCount()}쪽`;
        } catch {
          pageText = "확인 실패";
        }
      }
      rows.push(`
        <tr>
          <td>${escapeHtml(file.name)}</td>
          <td>${formatBytes(file.size)}</td>
          <td>${escapeHtml(ext)}</td>
          <td>${pageText}</td>
          <td>${file.size <= limit ? "확인 완료" : "용량 주의"}</td>
          <td>${nameOk ? "확인 완료" : "이름 확인"}</td>
        </tr>
      `);
    }

    setResult(`
      <div class="table-wrap">
        <table><thead><tr><th>파일</th><th>용량</th><th>확장자</th><th>PDF 페이지</th><th>용량</th><th>파일명</th></tr></thead><tbody>${rows.join("")}</tbody></table>
      </div>
    `);
  });
}

async function runZipPack() {
  await withProgress(async () => {
    const JSZip = await getJSZip();
    const files = selectedFiles();
    requireFiles(files, "ZIP으로 묶을 파일을 선택하세요.");
    const zip = new JSZip();
    for (const file of files) zip.file(file.name, file);
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
    const outName = cleanOutputName(value("#zipName") || "reportfit_assignment.zip", "zip");
    setResult(`
      <div class="metric-grid"><div><span>묶은 파일</span><strong>${files.length}개</strong></div><div><span>ZIP 용량</span><strong>${formatBytes(blob.size)}</strong></div></div>
      ${downloadButton(blob, outName, "ZIP 다운로드")}
    `);
  });
}

async function runPrivacyClean() {
  await withProgress(async () => {
    const { PDFDocument } = await getPdfLib();
    const JSZip = await getJSZip();
    const files = selectedFiles();
    requireFiles(files, "정리할 파일을 선택하세요.");
    const zip = new JSZip();
    for (const file of files) {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        scrubPdfInfo(pdf);
        zip.file(replaceExt(file.name, "pdf"), await pdf.save({ useObjectStreams: true }));
      } else if (file.type.startsWith("image/")) {
        const blob = await convertImage(file, "image/jpeg", 0.9, 2400);
        zip.file(replaceExt(file.name, "jpg"), blob);
      }
    }
    const blob = await zip.generateAsync({ type: "blob" });
    setResult(`${downloadButton(blob, "reportfit_privacy_clean.zip", "정리한 파일 다운로드")}`);
  });
}

async function imagesToPdf(files, quality, maxWidth) {
  const { PDFDocument } = await getPdfLib();
  const pdf = await PDFDocument.create();
  for (const file of files) {
    const jpg = await convertImage(file, "image/jpeg", quality, maxWidth);
    const bytes = await jpg.arrayBuffer();
    const image = await pdf.embedJpg(bytes);
    const width = image.width;
    const height = image.height;
    const page = pdf.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }
  scrubPdfInfo(pdf);
  return pdf.save({ useObjectStreams: true });
}

async function convertImage(file, mime, quality, maxWidth) {
  const image = await loadImage(file);
  const ratio = Math.min(1, maxWidth / image.naturalWidth);
  const width = Math.max(1, Math.round(image.naturalWidth * ratio));
  const height = Math.max(1, Math.round(image.naturalHeight * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: mime === "image/png" });
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
  URL.revokeObjectURL(image.src);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("이미지를 변환하지 못했습니다."));
      else resolve(blob);
    }, mime, quality);
  });
}

async function resizeImage(file, { mime, quality, maxWidth, maxHeight }) {
  const image = await loadImage(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const ratio = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
  const width = Math.max(1, Math.round(sourceWidth * ratio));
  const height = Math.max(1, Math.round(sourceHeight * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = imageCanvasContext(canvas, mime);
  ctx.drawImage(image, 0, 0, width, height);
  URL.revokeObjectURL(image.src);
  return { blob: await canvasToBlob(canvas, mime, quality), width, height };
}

async function rotateImage(file, { mime, quality, angle, flip }) {
  const image = await loadImage(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const normalizedAngle = ((Number(angle) % 360) + 360) % 360;
  const swap = normalizedAngle === 90 || normalizedAngle === 270;
  const width = swap ? sourceHeight : sourceWidth;
  const height = swap ? sourceWidth : sourceHeight;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = imageCanvasContext(canvas, mime);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((normalizedAngle * Math.PI) / 180);
  ctx.scale(flip === "horizontal" || flip === "both" ? -1 : 1, flip === "vertical" || flip === "both" ? -1 : 1);
  ctx.drawImage(image, -sourceWidth / 2, -sourceHeight / 2, sourceWidth, sourceHeight);
  ctx.restore();
  URL.revokeObjectURL(image.src);
  return { blob: await canvasToBlob(canvas, mime, quality), width, height };
}

async function watermarkImage(file, { mime, quality, text, position, opacity, size, color }) {
  const image = await loadImage(file);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = imageCanvasContext(canvas, mime);
  ctx.drawImage(image, 0, 0, width, height);
  drawWatermark(ctx, text, { width, height, position, opacity, size, color });
  URL.revokeObjectURL(image.src);
  return { blob: await canvasToBlob(canvas, mime, quality), width, height };
}

function imageCanvasContext(canvas, mime) {
  const keepAlpha = mime === "image/png" || mime === "image/webp";
  const ctx = canvas.getContext("2d", { alpha: keepAlpha });
  if (!keepAlpha) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  return ctx;
}

function drawWatermark(ctx, text, { width, height, position, opacity, size, color }) {
  const fontSize = Math.min(Math.max(size, 16), Math.max(16, Math.floor(Math.min(width, height) * 0.16)));
  const margin = Math.max(18, Math.round(fontSize * 0.85));
  ctx.save();
  ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = Math.max(3, Math.round(fontSize * 0.18));
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.max(1, Math.round(fontSize * 0.05));
  ctx.lineWidth = Math.max(2, Math.round(fontSize * 0.12));
  ctx.strokeStyle = outlineColorForWatermark(color, opacity);
  ctx.fillStyle = rgbaFromChoice(color, opacity);

  let x = width - margin;
  let y = height - margin;
  ctx.textAlign = "right";
  if (position === "bottom-left") {
    x = margin;
    ctx.textAlign = "left";
  } else if (position === "top-right") {
    y = margin;
  } else if (position === "top-left") {
    x = margin;
    y = margin;
    ctx.textAlign = "left";
  } else if (position === "center") {
    x = width / 2;
    y = height / 2;
    ctx.textAlign = "center";
  }

  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
  ctx.restore();
}

function outputMimeForImage(file, mode) {
  if (mode && mode !== "original") return mode;
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type) ? file.type : "image/jpeg";
}

function imageOutputName(file, suffix, mime) {
  const base = slugPart(file.name.replace(/\.[^.]+$/, "")) || "image";
  return cleanOutputName(`${base}_${suffix}`, extensionFor(mime));
}

function imageResultTable(rows, headers) {
  const head = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const body = rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
  return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function positionLabel(position) {
  const map = {
    "bottom-right": "오른쪽 아래",
    "bottom-left": "왼쪽 아래",
    "top-right": "오른쪽 위",
    "top-left": "왼쪽 위",
    center: "가운데"
  };
  return map[position] || "오른쪽 아래";
}

function rgbaFromChoice(choice, opacity) {
  const alpha = Math.min(1, Math.max(0, Number(opacity) || 0.45));
  if (choice === "black") return `rgba(10, 20, 35, ${alpha})`;
  if (choice === "green") return `rgba(13, 148, 85, ${alpha})`;
  return `rgba(255, 255, 255, ${alpha})`;
}

function outlineColorForWatermark(choice, opacity) {
  const alpha = Math.min(0.65, Math.max(0.2, Number(opacity) + 0.18 || 0.62));
  return choice === "black" ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
}

function clampNumber(raw, min, max, fallback) {
  const number = Number(raw);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("이미지를 변환하지 못했습니다."));
      else resolve(blob);
    }, mime, quality);
  });
}

function applyCanvasGrayscale(ctx, width, height) {
  const image = ctx.getImageData(0, 0, width, height);
  const { data } = image;
  for (let index = 0; index < data.length; index += 4) {
    const value = Math.round(data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114);
    data[index] = value;
    data[index + 1] = value;
    data[index + 2] = value;
  }
  ctx.putImageData(image, 0, 0);
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이 브라우저에서 열 수 없는 이미지 형식입니다."));
    };
    image.src = url;
  });
}

function parsePageRange(text, total) {
  if (!text.trim()) return Array.from({ length: total }, (_, index) => index);
  const selected = new Set();
  text.split(",").forEach((chunk) => {
    const part = chunk.trim();
    if (!part) return;
    const [startRaw, endRaw] = part.split("-").map((value) => Number(value.trim()));
    const start = Math.max(1, startRaw || 1);
    const end = Math.min(total, endRaw || start);
    for (let page = start; page <= end; page += 1) selected.add(page - 1);
  });
  if (!selected.size) throw new Error("페이지 범위를 확인하세요.");
  return [...selected].sort((a, b) => a - b);
}

function parsePageSequence(text, total, defaultAll = true) {
  if (!text.trim()) {
    if (!defaultAll) throw new Error("페이지 범위를 입력하세요.");
    return Array.from({ length: total }, (_, index) => index);
  }
  const selected = [];
  text.split(",").forEach((chunk) => {
    const part = chunk.trim();
    if (!part) return;
    selected.push(...expandPagePart(part, total));
  });
  if (!selected.length) throw new Error("페이지 순서를 확인하세요.");
  return selected;
}

function parsePageGroups(text, total) {
  const raw = text.trim();
  if (!raw) return Array.from({ length: total }, (_, index) => ({ label: `${index + 1}`, indices: [index] }));
  const groups = raw.split(/[;\n]+/)
    .map((group) => group.trim())
    .filter(Boolean)
    .map((group) => {
      const indices = parsePageSequence(group, total, false);
      return { label: pageSelectionLabel(indices).replace(/\s+/g, ""), indices };
    });
  if (!groups.length) throw new Error("분할할 페이지 범위를 입력하세요.");
  return groups;
}

function expandPagePart(part, total) {
  const pieces = part.split("-").map((value) => value.trim());
  if (pieces.length > 2) throw new Error(`페이지 범위를 확인하세요: ${part}`);
  if (pieces.length === 1) return [parsePageToken(pieces[0], total) - 1];
  const start = pieces[0] ? parsePageToken(pieces[0], total) : 1;
  const end = pieces[1] ? parsePageToken(pieces[1], total) : total;
  const step = start <= end ? 1 : -1;
  const indices = [];
  for (let page = start; step > 0 ? page <= end : page >= end; page += step) {
    indices.push(page - 1);
  }
  return indices;
}

function parsePageToken(token, total) {
  const normalized = token.trim().toLowerCase();
  if (["end", "last", "끝"].includes(normalized)) return total;
  const page = Number(normalized);
  if (!Number.isInteger(page) || page < 1 || page > total) {
    throw new Error(`페이지 번호를 확인하세요: ${token}`);
  }
  return page;
}

function pageSelectionLabel(indices) {
  const pages = indices.map((index) => index + 1);
  const ascending = pages.every((page, index) => index === 0 || page === pages[index - 1] + 1);
  if (ascending && pages.length > 2) return `${pages[0]}-${pages[pages.length - 1]}`;
  return pages.join(", ");
}

function pdfBaseName(file) {
  return slugPart(file.name.replace(/\.[^.]+$/, "")) || "reportfit";
}

function addPageWithRotation(pdf, page, rotate, degreesFn) {
  if (rotate) page.setRotation(degreesFn((page.getRotation().angle + rotate) % 360));
  pdf.addPage(page);
}

function scrubPdfInfo(pdf) {
  const now = new Date();
  pdf.setTitle("");
  pdf.setAuthor("");
  pdf.setSubject("");
  pdf.setKeywords([]);
  pdf.setProducer("ReportFit");
  pdf.setCreator("ReportFit");
  pdf.setCreationDate(now);
  pdf.setModificationDate(now);
}

function setResult(html) {
  const result = app.querySelector("#result");
  if (!result) return;
  const finalHtml = shouldAttachNextActions(html) ? `${html}${nextActionsHtml(currentTool.id)}` : html;
  result.innerHTML = finalHtml;
  result.classList.add("is-filled");
  result.querySelectorAll("[data-download-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = downloadStore.get(button.dataset.downloadId);
      if (item) saveBlob(item.blob, item.name);
    });
  });
  result.querySelectorAll("[data-tool-link]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const tool = toolById(button.dataset.toolLink);
      if (!tool) return;
      currentTool = tool;
      currentPage = null;
      history.pushState({ tool: tool.id }, "", tool.path);
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  result.querySelector("[data-share-tool]")?.addEventListener("click", copyToolLink);
}

function shouldAttachNextActions(html) {
  return !html.includes('class="error"') && !html.includes('class="progress"') && !html.includes("처리 중입니다");
}

function nextActionsHtml(id) {
  const related = relatedTools(id).slice(0, 3);
  if (!related.length) return "";
  return `
    <div class="result-next">
      <strong>다음에 바로 할 작업</strong>
      <div>
        ${related.map((tool) => `<button type="button" data-tool-link="${tool.id}">${escapeHtml(tool.label)}</button>`).join("")}
        <button type="button" data-share-tool>도구 링크 복사</button>
      </div>
    </div>
  `;
}

const downloadStore = new Map();

function downloadButton(blob, name, label) {
  const id = crypto.randomUUID();
  downloadStore.set(id, { blob, name });
  return `<button class="download-action" type="button" data-download-id="${id}">${escapeHtml(label)}</button>`;
}

function compareSize(before, after) {
  const percent = before ? Math.round((1 - after / before) * 100) : 0;
  return `
    <div class="metric-grid">
      <div><span>원본</span><strong>${formatBytes(before)}</strong></div>
      <div><span>결과</span><strong>${formatBytes(after)}</strong></div>
      <div><span>변화</span><strong>${percent > 0 ? `${percent}% 감소` : "재저장 완료"}</strong></div>
    </div>
  `;
}

async function withProgress(task) {
  const result = app.querySelector("#result");
  try {
    if (result) {
      result.classList.add("is-filled");
      result.innerHTML = `<div class="progress"><span></span><strong>처리 중입니다</strong></div>`;
    }
    await task();
  } catch (error) {
    setResult(`<p class="error">${escapeHtml(error.message || "작업 중 오류가 발생했습니다.")}</p>`);
  }
}

function selectedFiles() {
  return [...(app.querySelector(".file-input")?.files || [])];
}

function singleFile() {
  return selectedFiles()[0];
}

function requireFile(file, message) {
  if (!file) throw new Error(message);
}

function requireFiles(files, message) {
  if (!files.length) throw new Error(message);
}

function updateFileSummary(input) {
  const files = [...input.files];
  const summary = input.closest(".dropzone")?.querySelector(".file-summary");
  if (!summary) return;
  summary.textContent = files.length
    ? files.length === 1
      ? `${files[0].name} · ${formatBytes(files[0].size)}`
      : `${files.length}개 선택 · ${formatBytes(files.reduce((sum, file) => sum + file.size, 0))}`
    : "선택된 파일 없음";
}

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "0B";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)}${units[unit]}`;
}

function dueLabel(date, time) {
  if (!date && !time) return "마감 미입력";
  const base = [date, time].filter(Boolean).join(" ");
  if (!date) return base;
  const due = new Date(`${date}T${time || "23:59"}`);
  if (Number.isNaN(due.getTime())) return base;
  const diff = due.getTime() - Date.now();
  const absHours = Math.abs(diff) / 36e5;
  const days = Math.floor(absHours / 24);
  const hours = Math.round(absHours % 24);
  const relative = diff >= 0
    ? days > 0 ? `${days}일 ${hours}시간 남음` : `${Math.max(0, Math.round(absHours))}시간 남음`
    : days > 0 ? `${days}일 ${hours}시간 지남` : `${Math.round(absHours)}시간 지남`;
  return `${base} · ${relative}`;
}

function packageFileName(file, index, meta) {
  if (meta.mode === "keep") return file.name;
  const ext = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "file";
  const originalBase = slugPart(file.name.replace(/\.[^.]+$/, ""));
  const prefix = [meta.course, meta.studentId, meta.studentName, meta.assignment].map(slugPart).filter(Boolean).join("_");
  const number = String(index + 1).padStart(2, "0");
  const base = meta.mode === "numbered"
    ? `${prefix}_${number}`
    : `${prefix}_${number}_${originalBase}`;
  return `${base || `reportfit_${number}`}.${ext}`;
}

function buildPackageChecklist(meta, rows, totalSize) {
  return [
    "[레포트핏 제출 패키지]",
    `과목: ${meta.course}`,
    `과제: ${meta.assignment}`,
    `학번/이름: ${meta.studentId} ${meta.studentName}`,
    `제출처: ${meta.channel}`,
    `마감일: ${meta.dueDate || "마감일 미입력"}`,
    `파일 수: ${rows.length}개`,
    `원본 합계: ${formatBytes(totalSize)}`,
    "",
    "[패키지 파일 목록]",
    ...rows.map((row, index) => `${index + 1}. ${row.packaged} (${formatBytes(row.size)})`),
    "",
    "[제출 직전 확인]",
    "- ZIP 파일을 한 번 열어 모든 파일이 들어 있는지 확인",
    "- LMS나 이메일 화면에서 첨부 완료 상태 확인",
    "- 제출 완료 화면, 접수 메일, 제출 시간을 캡처 또는 저장",
    "- 교수자 안내가 ZIP 제출을 허용하는지 마지막으로 확인"
  ].join("\n");
}

function value(selector) {
  return app.querySelector(selector)?.value || "";
}

function setValue(selector, text) {
  const element = app.querySelector(selector);
  if (element) element.value = text;
}

function applySample(type) {
  const samples = {
    "file-name": () => {
      setValue("#courseName", "마케팅원론");
      setValue("#studentId", "20261234");
      setValue("#studentName", "홍길동");
      setValue("#assignmentName", "1주차 개인과제");
      setValue("#fileExt", "pdf");
    },
    "submit-checklist": () => {
      const due = new Date();
      due.setDate(due.getDate() + 2);
      setValue("#submitCourse", "마케팅원론");
      setValue("#submitAssignment", "1주차 개인과제");
      setValue("#submitDueDate", due.toISOString().slice(0, 10));
      setValue("#submitDueTime", "23:59");
      setValue("#submitChannel", "학교 LMS");
      setValue("#submitFileName", "마케팅원론_20261234_홍길동_1주차.pdf");
      setValue("#submitExts", "pdf");
      setValue("#submitLimit", "20MB 이하");
      app.querySelectorAll("[data-submit-check]").forEach((input, index) => {
        input.checked = index < 4;
      });
    },
    "submit-package": () => {
      const due = new Date();
      due.setDate(due.getDate() + 2);
      setValue("#packageCourse", "마케팅원론");
      setValue("#packageAssignment", "1주차 개인과제");
      setValue("#packageStudentId", "20261234");
      setValue("#packageStudentName", "홍길동");
      setValue("#packageChannel", "학교 LMS");
      setValue("#packageDueDate", due.toISOString().slice(0, 10));
      setValue("#packageNameMode", "prefix");
      setValue("#packageZipName", "마케팅원론_20261234_홍길동_제출팩.zip");
    },
    "word-count": () => setValue("#wordText", "서론에서는 과제의 배경과 문제의식을 정리합니다.\n\n본론에서는 핵심 근거를 나누어 설명하고, 결론에서는 내가 확인한 시사점과 한계를 짧게 정리합니다."),
    "text-clean": () => setValue("#dirtyText", "PDF에서 복사한 문장입니다.\n줄바꿈이\n이상하게 들어가고      공백도     많습니다.\n\n문단을 다시 정리해야 합니다."),
    "table-convert": () => setValue("#tableText", "항목\t기준\t확인\nPDF 용량\t20MB 이하\t필요\n파일명\t학번_이름_과제명\t필요\n참고문헌\t가나다순\t선택"),
    "citation-web": () => {
      setValue("#citationStyle", "apa");
      setValue("#citationType", "web");
      setValue("#citationAuthor", "Kim, J.");
      setValue("#citationYear", "2026");
      setValue("#citationTitle", "mobile assignment submission habits");
      setValue("#citationSource", "ReportFit Guide");
      setValue("#citationUrl", "10.1234/reportfit.2026");
    },
    "citation-article": () => {
      setValue("#citationStyle", "korean");
      setValue("#citationType", "article");
      setValue("#citationAuthor", "홍길동");
      setValue("#citationYear", "2025");
      setValue("#citationTitle", "대학생 과제 제출 과정에서의 파일 형식 문제");
      setValue("#citationSource", "디지털학습연구 12(3)");
      setValue("#citationUrl", "");
    }
  };
  samples[type]?.();
}

function clearCurrentInputs(scope) {
  const selector = scope === "textarea" ? "textarea" : "input:not([type='file']), textarea";
  app.querySelectorAll(selector).forEach((element) => {
    if (element.type === "date") element.value = "";
    else if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") element.value = "";
  });
  const result = app.querySelector("#result");
  if (result) {
    result.innerHTML = "";
    result.classList.remove("is-filled");
  }
}

function toolById(id) {
  return tools.find((tool) => tool.id === id);
}

function relatedTools(id) {
  const map = {
    "pdf-compress": ["pdf-slim", "pdf-split", "file-check"],
    "pdf-slim": ["pdf-compress", "file-check", "pdf-organize"],
    "pdf-edit": ["pdf-organize", "pdf-split", "pdf-rotate"],
    "pdf-number": ["pdf-organize", "pdf-compress", "pdf-watermark"],
    "pdf-watermark": ["pdf-number", "pdf-rotate", "privacy-clean"],
    "pdf-split": ["pdf-organize", "pdf-compress", "zip-pack"],
    "pdf-organize": ["pdf-split", "pdf-rotate", "pdf-number"],
    "pdf-rotate": ["pdf-organize", "pdf-watermark", "file-check"],
    "image-convert": ["image-resize", "image-compress", "pdf-slim"],
    "image-compress": ["image-resize", "image-convert", "file-check"],
    "image-resize": ["image-compress", "image-rotate", "image-watermark"],
    "image-rotate": ["image-resize", "image-watermark", "image-convert"],
    "image-watermark": ["image-resize", "image-rotate", "privacy-clean"],
    "file-name": ["file-check", "zip-pack", "pdf-compress"],
    "submit-checklist": ["submit-package", "file-name", "file-check"],
    "submit-package": ["submit-checklist", "file-check", "privacy-clean"],
    "word-count": ["text-clean", "citation-cleaner", "file-name"],
    "text-clean": ["word-count", "table-convert", "citation-cleaner"],
    "table-convert": ["text-clean", "citation-cleaner", "file-check"],
    "citation-cleaner": ["word-count", "text-clean", "file-check"],
    "file-check": ["submit-package", "pdf-compress", "pdf-slim"],
    "zip-pack": ["submit-package", "file-check", "file-name"],
    "privacy-clean": ["file-check", "image-compress", "image-watermark"]
  };
  return (map[id] || popular).map(toolById).filter(Boolean);
}

function copyFor(id) {
  const base = {
    why: "제출 직전에는 파일 용량, 확장자, 파일명, 페이지 순서처럼 작은 부분에서 문제가 자주 생깁니다. 레포트핏은 그 작업을 기능별로 쪼개 바로 처리할 수 있게 만든 도구입니다.",
    tip: "파일은 가능한 한 마지막 저장본으로 작업하고, 결과 파일을 받은 뒤 실제 제출 화면에서 한 번 더 열어보는 것이 좋습니다."
  };
  const extra = {
    "pdf-compress": {
      why: "LMS나 메일 첨부는 10MB, 20MB처럼 용량 제한이 걸려 있는 경우가 많습니다. PDF를 다시 저장하면 문서 구조와 메타데이터가 정리되어 제출 실패 가능성을 줄일 수 있습니다.",
      tip: "사진 스캔이 많은 PDF는 이미지 압축이나 이미지 PDF 재생성을 함께 쓰면 더 안정적으로 줄일 수 있습니다."
    },
    "pdf-slim": {
      why: "스캔본이나 이미지가 많은 PDF는 일반 재저장만으로 용량이 거의 줄지 않는 경우가 많습니다. PDF 경량화는 각 페이지를 적당한 해상도와 품질의 이미지로 다시 묶어 LMS 업로드 제한에 맞추기 쉽게 만듭니다.",
      tip: "글자 선택, 링크, 주석이 중요한 문서는 원본을 보관하세요. 이 도구는 제출용으로 가볍게 만드는 대신 페이지를 이미지처럼 다시 저장합니다."
    },
    "image-convert": {
      why: "아이폰 사진, 캡처, 실험 노트 이미지는 제출 형식이 맞지 않아 다시 저장해야 하는 일이 많습니다. 여러 장을 PDF로 묶으면 교수자나 조원이 열어보기 쉽습니다.",
      tip: "글자가 있는 이미지는 너무 낮은 품질로 줄이지 말고, 최대 폭 1600에서 2200 사이를 먼저 시도하세요."
    },
    "image-compress": {
      why: "사진 원본은 한 장만으로도 LMS 첨부 제한을 넘는 경우가 많습니다. 여러 이미지를 같은 품질과 폭으로 줄여 ZIP으로 받으면 제출 파일 정리가 훨씬 빨라집니다.",
      tip: "글자 캡처는 JPG보다 WebP가 선명도와 용량 균형이 좋은 경우가 많습니다. 결과를 받은 뒤 확대해서 글자가 읽히는지 확인하세요."
    },
    "image-resize": {
      why: "사진의 실제 픽셀 크기가 너무 크면 문서에 붙였을 때 파일이 무거워지고, LMS 미리보기에서도 느리게 열릴 수 있습니다. 최대 가로와 세로를 제한하면 보기 좋은 크기로 정리됩니다.",
      tip: "A4 문서에 넣을 사진은 1400에서 1800px 정도면 대개 충분합니다. 세부 글자가 많은 캡처는 2000px 이상으로 남겨두세요."
    },
    "image-rotate": {
      why: "휴대폰 사진과 스캔 이미지는 방향 정보가 기기마다 다르게 읽혀 옆으로 눕는 일이 있습니다. 회전본을 새 파일로 만들면 제출 후 미리보기 방향이 더 안정적입니다.",
      tip: "좌우 반전은 칠판 사진이나 카메라 셀피처럼 글자가 거꾸로 보일 때만 사용하세요. 일반 문서는 보통 90도 회전만으로 충분합니다."
    },
    "image-watermark": {
      why: "초안, 참고용, 이름 표시가 필요한 이미지는 편집 앱을 따로 열지 않고 바로 표시를 얹을 수 있습니다. 원본은 건드리지 않고 결과 파일만 내려받습니다.",
      tip: "최종 제출본에는 불필요한 워터마크가 남지 않게 다시 열어 확인하세요. 확인용 공유 이미지라면 오른쪽 아래와 낮은 투명도가 가장 무난합니다."
    },
    "citation-cleaner": {
      why: "참고문헌은 내용보다 정렬, 중복, 띄어쓰기에서 어수선해 보이는 경우가 많습니다. 제출 전에 줄 단위로 정리하면 문서의 마감감이 좋아집니다.",
      tip: "정리 후에는 과목에서 요구한 APA, MLA, Chicago, 한국식 표기 기준과 맞는지 한 번 더 확인하세요. 레포트핏은 누락 가능성을 알려주지만 최종 양식 판단은 강의 안내를 우선합니다."
    },
    "submit-checklist": {
      why: "과제 제출 실패는 본문 내용보다 파일명, 용량, 첨부 누락, 참고문헌 정리 같은 마지막 단계에서 생기는 경우가 많습니다. 제출 전 점검표는 이 항목을 한 화면에서 정리해 실제 제출 직전 확인 시간을 줄입니다.",
      tip: "점검표를 만든 뒤에는 파일명 만들기, 파일 점검, 참고문헌 정리 도구로 이어가면 제출 전 흐름을 끊지 않고 마감본을 정리할 수 있습니다."
    },
    "submit-package": {
      why: "조별 과제나 첨부 파일이 많은 과제는 최종본, 참고자료, 이미지 파일이 흩어져 제출 직전에 실수가 생기기 쉽습니다. 제출 패키지는 파일명을 같은 규칙으로 맞추고 점검표를 함께 넣어 마감본을 한 묶음으로 정리합니다.",
      tip: "ZIP 제출이 허용되는 과목인지 먼저 확인하세요. ZIP 제출이 안 되는 경우에도 패키지 안 파일명 목록과 점검표를 참고해 개별 파일 첨부 순서를 확인할 수 있습니다."
    },
    "pdf-number": {
      why: "PDF를 합치거나 스캔하면 페이지 순서가 헷갈릴 수 있습니다. 하단 번호를 넣어두면 제출 전 검토와 조별 확인이 쉬워집니다.",
      tip: "표지나 목차를 번호에서 제외해야 하는 과목이라면 PDF 편집에서 본문만 분리한 뒤 번호를 넣는 방식이 깔끔합니다."
    },
    "pdf-watermark": {
      why: "초안, 개인 확인용, 참고자료처럼 제출본과 구분해야 하는 PDF에는 워터마크가 도움이 됩니다.",
      tip: "최종 제출본에는 불필요한 워터마크가 남지 않았는지 반드시 다시 열어 확인하세요."
    },
    "pdf-split": {
      why: "교수자나 LMS가 본문, 부록, 참고자료를 따로 요구할 때 한 PDF를 손으로 다시 저장하면 페이지 누락이 생기기 쉽습니다. PDF 분할은 지정한 범위대로 파일을 나누고 ZIP으로 묶어 제출 전 정리를 빠르게 끝냅니다.",
      tip: "범위별 분할은 세미콜론으로 묶음을 나눕니다. 예를 들어 1-3; 4-6; 7처럼 입력하면 세 개의 PDF가 ZIP 안에 만들어집니다."
    },
    "pdf-organize": {
      why: "스캔본이나 합친 PDF는 표지, 빈 페이지, 부록 순서가 뒤섞이는 경우가 많습니다. PDF 페이지 정리는 필요한 페이지만 남기고 원하는 순서로 다시 묶어 제출본을 정돈합니다.",
      tip: "페이지를 삭제하고 싶으면 남길 페이지만 입력하세요. 순서를 바꾸고 싶으면 1-3, 6, 5처럼 원하는 순서대로 적으면 됩니다."
    },
    "pdf-rotate": {
      why: "휴대폰 스캔이나 복합기 스캔에서는 일부 페이지만 옆으로 돌아가는 일이 잦습니다. PDF 선택 회전은 틀어진 페이지만 범위로 지정해 전체 파일을 다시 만들지 않고 방향을 맞춥니다.",
      tip: "범위를 비우면 전체 페이지가 회전됩니다. 일부만 고칠 때는 1, 3-5처럼 지정한 뒤 결과 파일을 열어 방향을 확인하세요."
    },
    "text-clean": {
      why: "PDF나 웹페이지에서 복사한 문장은 줄바꿈과 공백이 깨져 레포트에 붙였을 때 문단이 지저분해질 수 있습니다.",
      tip: "정리한 뒤에는 문장이 서로 붙어 의미가 달라진 곳이 없는지 한 번 읽어보는 것이 좋습니다."
    },
    "table-convert": {
      why: "엑셀, 한글, 노션에서 복사한 표는 제출 문서나 README, 보고서 부록에 옮길 때 형식이 자주 깨집니다.",
      tip: "Markdown 표는 보고서 초안 공유에 좋고, CSV는 엑셀 재가공에 좋으며, HTML 표는 웹 제출이나 LMS 게시글에 붙이기 좋습니다."
    }
  };
  return extra[id] || base;
}

function guideFor(id) {
  const base = {
    title: "이 도구를 쓸 때 확인할 것",
    tips: [
      "결과를 받은 뒤에는 실제 제출 화면에서 다시 열어 파일이 깨지지 않았는지 확인하세요.",
      "과목별 제출 형식이 다르면 레포트핏 결과보다 교수자 안내와 LMS 제한을 우선해야 합니다.",
      "마감 직전에는 파일명, 용량, 첨부 여부처럼 작은 항목을 마지막으로 확인하는 편이 안전합니다."
    ],
    faq: [
      {
        q: "파일이 서버로 업로드되나요?",
        a: "레포트핏의 주요 파일 처리 기능은 브라우저 안에서 실행되도록 구성되어 있습니다. 그래도 최종 제출 전에는 결과 파일을 직접 열어 확인하는 것이 좋습니다."
      },
      {
        q: "결과를 바로 제출해도 되나요?",
        a: "도구 결과는 제출 준비를 돕는 보조 자료입니다. 과목별 제출 규정, 학교 LMS 제한, 교수자 안내를 마지막으로 확인한 뒤 제출하세요."
      }
    ]
  };
  const guides = {
    "pdf-compress": {
      title: "PDF 압축 전에 확인할 것",
      tips: [
        "스캔 이미지가 많은 PDF는 단순 재저장만으로 크게 줄지 않을 수 있습니다.",
        "압축 후에는 글자와 표가 흐려지지 않았는지 첫 페이지와 마지막 페이지를 열어보세요.",
        "LMS 제한이 20MB라면 19MB 이하로 여유를 두는 편이 업로드 실패를 줄입니다."
      ],
      faq: [
        {
          q: "PDF가 생각보다 많이 줄지 않는 이유는 뭔가요?",
          a: "PDF 안에 고해상도 스캔 이미지가 많으면 문서 정보 정리만으로는 용량이 크게 줄지 않을 수 있습니다. 이 경우 이미지 압축이나 이미지 PDF 재생성을 함께 쓰는 편이 좋습니다."
        },
        {
          q: "압축하면 내용이 바뀌나요?",
          a: "본문을 새로 작성하거나 수정하는 기능이 아니라 PDF 저장 구조와 문서 정보를 정리하는 기능입니다. 다만 제출 전에는 결과 파일을 직접 열어 페이지와 글자를 확인해야 합니다."
        }
      ]
    },
    "pdf-slim": {
      title: "스캔 PDF 경량화 전에 확인할 것",
      tips: [
        "글자가 선택되는 일반 PDF도 결과에서는 페이지 이미지처럼 저장될 수 있습니다.",
        "LMS 제한이 빡빡하면 최대 폭을 900-1200px로 낮추고 품질을 60-70% 사이에서 먼저 시도하세요.",
        "결과 파일은 반드시 열어 글자 선명도, 페이지 누락, 표나 작은 글자의 가독성을 확인하세요."
      ],
      faq: [
        {
          q: "왜 일반 PDF 압축보다 더 줄어드나요?",
          a: "스캔본은 큰 이미지가 페이지 안에 들어 있는 구조라서, 페이지를 더 작은 이미지 품질로 다시 만들면 용량이 크게 줄 수 있습니다."
        },
        {
          q: "단점은 없나요?",
          a: "텍스트 선택, 링크, 주석 같은 PDF 정보가 이미지화되면서 사라질 수 있습니다. 최종 제출용 경량본으로 쓰고 원본은 따로 보관하는 편이 안전합니다."
        }
      ]
    },
    "pdf-split": {
      title: "PDF를 나눌 때 확인할 것",
      tips: [
        "페이지별 분할은 모든 페이지가 각각 PDF로 만들어지므로 페이지 수가 많으면 ZIP 안 파일도 많아집니다.",
        "범위별 분할은 1-3; 4-6처럼 세미콜론으로 묶음을 나누면 제출 항목별 PDF를 만들기 좋습니다.",
        "분할한 뒤에는 ZIP을 열어 파일 수와 각 PDF의 첫 페이지가 의도와 맞는지 확인하세요."
      ],
      faq: [
        {
          q: "범위를 어떻게 입력하나요?",
          a: "한 파일 안에 들어갈 페이지는 쉼표로 묶고, 다른 PDF로 나눌 묶음은 세미콜론으로 구분합니다. 예를 들어 1-2, 5; 6-8은 두 개의 PDF를 만듭니다."
        },
        {
          q: "원본 PDF가 바뀌나요?",
          a: "아닙니다. 원본은 그대로 두고 브라우저 안에서 새 PDF와 ZIP을 만들어 내려받는 방식입니다."
        }
      ]
    },
    "pdf-organize": {
      title: "PDF 페이지 정리 전에 확인할 것",
      tips: [
        "삭제할 페이지를 적는 방식이 아니라 남길 페이지를 적는 방식입니다.",
        "순서를 바꾸려면 1-3, 6, 5처럼 결과에 들어갈 순서 그대로 입력하세요.",
        "홀수/짝수/역순 같은 빠른 정리를 쓸 때도 결과 PDF의 페이지 순서를 직접 열어 확인하세요."
      ],
      faq: [
        {
          q: "같은 페이지를 두 번 넣을 수 있나요?",
          a: "가능합니다. 같은 번호를 반복해서 입력하면 결과 PDF에도 그 페이지가 반복해서 들어갑니다."
        },
        {
          q: "빈 페이지 삭제도 되나요?",
          a: "자동으로 빈 페이지를 감지하지는 않습니다. 미리 원본을 보고 남길 페이지만 입력하면 빈 페이지를 제외한 정리본을 만들 수 있습니다."
        }
      ]
    },
    "pdf-rotate": {
      title: "PDF 페이지를 회전할 때 확인할 것",
      tips: [
        "범위를 비우면 전체 페이지가 회전되므로 일부 페이지만 고칠 때는 반드시 페이지 번호를 입력하세요.",
        "왼쪽 90도는 270도로 저장됩니다. 결과 파일을 열어 실제 방향을 확인하는 것이 안전합니다.",
        "스캔본은 화면 보기 방향과 실제 페이지 회전값이 다를 수 있으니 회전 후 한 번 더 미리보기하세요."
      ],
      faq: [
        {
          q: "일부 페이지만 회전할 수 있나요?",
          a: "가능합니다. 1, 3-5처럼 회전할 페이지만 입력하면 그 페이지만 지정한 각도로 돌아갑니다."
        },
        {
          q: "글자나 이미지를 다시 압축하나요?",
          a: "아닙니다. 페이지 회전값을 조정하고 새 PDF로 저장하는 기능입니다. 용량을 줄이고 싶으면 PDF 압축을 이어서 사용하세요."
        }
      ]
    },
    "submit-checklist": {
      title: "제출 전 점검표를 쓰는 순서",
      tips: [
        "먼저 과목명, 과제명, 마감 시간, 제출처를 입력해 제출 상황을 한 곳에 모으세요.",
        "체크하지 않은 항목은 결과 아래 경고 목록으로 남기 때문에 마감 직전 다시 보기 좋습니다.",
        "점검표를 복사해 메모장이나 카카오톡 나에게 보내기에 저장해두면 제출 완료 확인까지 이어가기 쉽습니다."
      ],
      faq: [
        {
          q: "점검표만 만들면 제출 준비가 끝난 건가요?",
          a: "아닙니다. 점검표는 빠뜨린 항목을 줄이는 도구입니다. 실제 제출 화면에서 파일 첨부 완료 상태와 제출 완료 화면을 마지막으로 확인해야 합니다."
        },
        {
          q: "마감 시간이 없으면 어떻게 쓰면 되나요?",
          a: "마감 시간이 명확하지 않으면 과목 공지나 LMS 안내를 먼저 확인하세요. 시간이 없으면 날짜만 입력해도 점검표를 만들 수 있습니다."
        }
      ]
    },
    "submit-package": {
      title: "제출 패키지를 만들 때 확인할 것",
      tips: [
        "첨부해야 할 파일을 모두 선택한 뒤 빠진 참고자료나 이미지가 없는지 파일 목록을 먼저 확인하세요.",
        "파일명 방식은 교수자 안내가 따로 없으면 과목명, 학번, 이름, 과제명이 들어가는 방식이 가장 무난합니다.",
        "ZIP 파일을 내려받은 뒤 실제로 열어보고, 제출처가 ZIP 업로드를 허용하는지 마지막으로 확인하세요."
      ],
      faq: [
        {
          q: "ZIP 안에 어떤 파일이 들어가나요?",
          a: "선택한 제출 파일과 함께 제출점검표.txt가 들어갑니다. 점검표에는 과목, 과제, 제출처, 파일 목록, 제출 직전 확인 항목이 정리됩니다."
        },
        {
          q: "원본 파일명이 바뀌나요?",
          a: "원본 파일은 그대로 두고 ZIP 안에 들어가는 복사본 이름만 선택한 규칙에 맞게 정리합니다."
        }
      ]
    },
    "citation-cleaner": {
      title: "참고문헌 정리 전에 확인할 것",
      tips: [
        "APA, MLA, Chicago, 한국식 중 과목에서 요구한 형식을 먼저 확인하세요.",
        "웹 자료는 URL뿐 아니라 제목, 저자, 연도, 사이트명을 같이 남기는 편이 안전합니다.",
        "정렬과 중복 제거 후에도 누락된 저자나 연도가 없는지 한 번 더 읽어보세요."
      ],
      faq: [
        {
          q: "참고문헌 양식을 완전히 보장하나요?",
          a: "기본 정리와 누락 경고를 돕지만 학과나 교수자별 세부 규정까지 모두 대체하지는 않습니다. 최종 기준은 강의 안내를 우선하세요."
        },
        {
          q: "본문 인용도 만들 수 있나요?",
          a: "입력값으로 참고문헌 줄을 만들면 간단한 본문 인용도 함께 복사할 수 있습니다. 다만 직접 인용, 간접 인용 규칙은 과목 기준에 맞춰 확인해야 합니다."
        }
      ]
    },
    "image-convert": {
      title: "이미지 변환 전에 확인할 것",
      tips: [
        "글자가 들어간 캡처는 너무 낮은 품질로 변환하지 않는 것이 좋습니다.",
        "여러 장을 PDF로 묶을 때는 페이지 순서가 맞는지 결과 파일을 열어 확인하세요.",
        "투명 배경이 필요한 이미지는 PNG를, 용량을 줄이고 싶으면 JPG나 WebP를 먼저 고려하세요."
      ],
      faq: [
        {
          q: "여러 이미지를 PDF 한 파일로 만들 수 있나요?",
          a: "가능합니다. 이미지 변환에서 출력 형식을 PDF로 선택하면 선택한 이미지들을 하나의 PDF로 묶을 수 있습니다."
        },
        {
          q: "아이폰 사진도 변환할 수 있나요?",
          a: "브라우저가 읽을 수 있는 이미지라면 변환할 수 있습니다. 일부 특수 형식은 브라우저 지원 여부에 따라 열리지 않을 수 있습니다."
        }
      ]
    },
    "image-compress": {
      title: "이미지 압축 전에 확인할 것",
      tips: [
        "글자가 작은 캡처는 품질을 너무 낮추면 읽기 어려워질 수 있습니다.",
        "사진 위주 이미지는 JPG, 캡처나 도표는 WebP를 먼저 비교해 보세요.",
        "여러 장을 한 번에 처리하면 결과가 ZIP으로 묶여 내려갑니다."
      ],
      faq: [
        {
          q: "원본 이미지를 직접 바꾸나요?",
          a: "아니요. 브라우저에서 새 결과 파일을 만들어 다운로드하는 방식이라 원본 파일은 유지됩니다."
        },
        {
          q: "압축했는데 용량이 더 커질 수도 있나요?",
          a: "작은 PNG나 단순한 캡처는 형식에 따라 커질 수 있습니다. 이 경우 출력 형식과 품질을 바꿔 다시 시도하세요."
        }
      ]
    },
    "image-resize": {
      title: "이미지 리사이즈 전에 확인할 것",
      tips: [
        "최대 가로와 세로를 지정하면 비율은 유지한 채 그 안에 들어오도록 줄입니다.",
        "원본보다 크게 키우지는 않으므로 작은 이미지는 그대로 유지됩니다.",
        "문서 삽입용 사진은 1600px 전후부터 먼저 시도해 보세요."
      ],
      faq: [
        {
          q: "비율이 찌그러지나요?",
          a: "아니요. 가로와 세로 비율을 유지해서 축소합니다."
        },
        {
          q: "여러 이미지를 한 번에 받을 수 있나요?",
          a: "가능합니다. 선택한 이미지들이 리사이즈된 뒤 ZIP 파일로 묶여 내려갑니다."
        }
      ]
    },
    "image-rotate": {
      title: "이미지 회전 전에 확인할 것",
      tips: [
        "옆으로 누운 사진은 90도 또는 270도를 먼저 시도하세요.",
        "좌우 반전은 글자가 거울처럼 보이는 셀피나 카메라 캡처에만 쓰는 편이 좋습니다.",
        "회전 결과는 새 이미지로 내려받기 때문에 원본 방향은 바뀌지 않습니다."
      ],
      faq: [
        {
          q: "일부 사진만 회전할 수 있나요?",
          a: "필요한 사진만 선택해서 처리하면 됩니다. 여러 장을 선택하면 같은 회전 설정이 모두 적용됩니다."
        },
        {
          q: "이미지 품질은 유지되나요?",
          a: "출력 형식과 품질 설정에 따라 달라집니다. 글자 이미지라면 PNG 또는 높은 품질 값을 권장합니다."
        }
      ]
    },
    "image-watermark": {
      title: "이미지 워터마크 전에 확인할 것",
      tips: [
        "확인용 문구는 너무 크지 않게 넣어 본문 내용을 가리지 않게 하세요.",
        "공유용 초안은 낮은 투명도와 오른쪽 아래 위치가 무난합니다.",
        "최종 제출 파일에는 불필요한 워터마크가 남지 않았는지 다시 열어 확인하세요."
      ],
      faq: [
        {
          q: "워터마크를 지울 수 있나요?",
          a: "레포트핏은 결과 이미지를 새로 만드는 방식이라, 원본을 보관해 두고 필요할 때 다시 작업하는 것이 안전합니다."
        },
        {
          q: "한글 문구도 넣을 수 있나요?",
          a: "가능합니다. 브라우저와 시스템 글꼴이 표시할 수 있는 문자는 그대로 이미지에 그려집니다."
        }
      ]
    },
    "file-check": {
      title: "파일 점검에서 봐야 할 것",
      tips: [
        "용량 기준은 학교 LMS나 메일 첨부 제한에 맞춰 선택하세요.",
        "PDF는 페이지 수가 예상과 맞는지 확인해 누락 페이지를 줄일 수 있습니다.",
        "파일명에 특수문자가 많으면 LMS에서 깨질 수 있으니 제출 전 단순하게 정리하는 편이 좋습니다."
      ],
      faq: [
        {
          q: "파일명이 왜 중요한가요?",
          a: "과목명, 학번, 이름, 과제명이 들어간 파일명은 교수자나 조교가 확인하기 쉽고, 업로드 중 깨질 가능성도 줄어듭니다."
        },
        {
          q: "PDF 페이지 수 확인이 실패할 수도 있나요?",
          a: "암호화되었거나 브라우저에서 읽기 어려운 PDF는 페이지 수 확인이 실패할 수 있습니다. 이 경우 파일을 직접 열어 다시 확인하세요."
        }
      ]
    },
    "word-count": {
      title: "글자수 계산을 볼 때 주의할 것",
      tips: [
        "공백 포함과 공백 제외 기준은 학교나 과목마다 다를 수 있습니다.",
        "A4 예상 장수는 글꼴, 줄간격, 여백에 따라 달라지는 참고값입니다.",
        "본문을 붙여넣기 전에 표지, 목차, 참고문헌을 포함할지 기준을 먼저 정하세요."
      ],
      faq: [
        {
          q: "A4 예상 장수는 정확한가요?",
          a: "대략적인 감을 잡기 위한 참고값입니다. 실제 장수는 글꼴, 줄간격, 문단 간격, 표와 이미지 포함 여부에 따라 달라집니다."
        },
        {
          q: "참고문헌도 글자수에 포함해야 하나요?",
          a: "과목마다 기준이 다릅니다. 분량 기준이 본문만인지 전체 문서인지 강의 안내를 먼저 확인하는 것이 좋습니다."
        }
      ]
    },
    "privacy-clean": {
      title: "개인정보 제거 전에 확인할 것",
      tips: [
        "이미지 위치정보나 PDF 작성자 정보가 걱정될 때 제출 전 한 번 정리하세요.",
        "정리한 파일은 새 파일로 내려받은 뒤 원본과 구분해서 보관하는 편이 좋습니다.",
        "개인정보 제거 후에도 파일 본문 안에 직접 적힌 이름, 학번, 연락처는 직접 확인해야 합니다."
      ],
      faq: [
        {
          q: "본문 안의 개인정보도 자동으로 지워지나요?",
          a: "아닙니다. 이 기능은 이미지 재인코딩과 PDF 문서 정보 정리를 돕습니다. 본문에 직접 적힌 개인정보는 사용자가 직접 확인해야 합니다."
        },
        {
          q: "원본 파일이 바뀌나요?",
          a: "원본을 직접 수정하지 않고 정리된 새 파일을 내려받는 방식으로 사용하는 것이 안전합니다."
        }
      ]
    }
  };
  return guides[id] || base;
}

function cleanText(raw, mode, gap) {
  const normalized = raw
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *([,.;:!?]) */g, "$1 ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (mode === "line") return normalized.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join("\n");
  if (mode === "list") {
    return normalized.split(/\r?\n/).map((line) => line.replace(/^[-•*]\s*/, "").trim()).filter(Boolean).map((line) => `- ${line}`).join("\n");
  }
  const joined = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/([.!?다요죠음임함됨됨니다])\s+/g, gap === "blank" ? "$1\n\n" : "$1 ");
  return joined.trim();
}

function parseTableRows(raw) {
  return raw.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const delimiter = line.includes("\t") ? "\t" : line.includes("|") ? "|" : ",";
      return line.split(delimiter).map((cell) => cell.trim()).filter((cell, index, arr) => delimiter !== "|" || cell || index !== 0 && index !== arr.length - 1);
    })
    .filter((row) => row.length);
}

function formatTableRows(rows, format, hasHeader) {
  const width = Math.max(...rows.map((row) => row.length));
  const padded = rows.map((row) => Array.from({ length: width }, (_, index) => row[index] || ""));
  if (format === "csv") return padded.map((row) => row.map(csvCell).join(",")).join("\n");
  if (format === "html") {
    const bodyRows = padded.map((row, rowIndex) => {
      const tag = hasHeader && rowIndex === 0 ? "th" : "td";
      return `  <tr>${row.map((cell) => `<${tag}>${escapeHtml(cell)}</${tag}>`).join("")}</tr>`;
    });
    return `<table>\n${bodyRows.join("\n")}\n</table>`;
  }
  const header = hasHeader ? padded[0] : padded[0].map((_, index) => `열 ${index + 1}`);
  const body = hasHeader ? padded.slice(1) : padded;
  return [
    `| ${header.map(markdownCell).join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.map(markdownCell).join(" | ")} |`)
  ].join("\n");
}

function csvCell(cell) {
  return /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

function markdownCell(cell) {
  return cell.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function citationFromFields() {
  const fields = {
    style: value("#citationStyle"),
    type: value("#citationType"),
    author: cleanCitationPart(value("#citationAuthor")),
    year: cleanCitationPart(value("#citationYear")),
    title: cleanCitationPart(value("#citationTitle")),
    source: cleanCitationPart(value("#citationSource")),
    url: normalizeCitationUrl(value("#citationUrl")),
    accessed: value("#citationAccessed")
  };
  if (!fields.author && !fields.title) return { line: "", inText: "", fields };
  const line = normalizeCitationLine(formatCitation(fields));
  return {
    line,
    inText: makeInTextCitation(fields),
    fields
  };
}

function formatCitation(fields) {
  const year = fields.year || "n.d.";
  const accessed = fields.accessed ? `Accessed ${fields.accessed}.` : "";
  const url = fields.url ? `${fields.url}.` : "";
  if (fields.style === "apa") {
    if (fields.type === "book") return `${fields.author}. (${year}). ${sentenceTitle(fields.title)}. ${fields.source}.`;
    return `${fields.author}. (${year}). ${sentenceTitle(fields.title)}. ${fields.source}. ${url}`;
  }
  if (fields.style === "mla") {
    return `${fields.author}. "${fields.title}." ${fields.source}, ${fields.year || "n.d."}, ${fields.url}.`;
  }
  if (fields.style === "chicago") {
    return `${fields.author}. "${fields.title}." ${fields.source}. ${accessed} ${url}`;
  }
  const koreanYear = fields.year ? `(${fields.year})` : "(연도 미상)";
  const title = fields.type === "book" ? `『${fields.title}』` : `「${fields.title}」`;
  return `${fields.author}. ${koreanYear}. ${title}. ${fields.source}. ${fields.url}`;
}

function makeInTextCitation(fields) {
  if (!fields.author) return "";
  const author = shortAuthor(fields.author);
  const year = fields.year || "n.d.";
  if (fields.style === "mla") return `(${author})`;
  if (fields.style === "chicago") return `${author}, ${year}`;
  return `(${author}, ${year})`;
}

function shortAuthor(author) {
  const first = author.split(/[;&]/)[0].trim();
  if (first.includes(",")) return first.split(",")[0].trim();
  const tokens = first.split(/\s+/).filter(Boolean);
  if (/[가-힣]/.test(first)) return tokens[0] || first;
  return tokens.length > 1 ? tokens[tokens.length - 1] : first;
}

function normalizeCitationLine(line) {
  return line
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/([.!?]){2,}/g, "$1")
    .replace(/\s+\./g, ".")
    .replace(/(\. ){2,}/g, ". ")
    .replace(/\s+$/g, "")
    .replace(/^\s+/g, "")
    .replace(/\s+\.$/, ".")
    .replace(/\.?$/, ".");
}

function cleanCitationPart(text) {
  return text.replace(/\s+/g, " ").trim().replace(/[.。]+$/g, "");
}

function normalizeCitationUrl(text) {
  const raw = text.trim();
  if (!raw) return "";
  if (/^10\.\d{4,9}\//.test(raw)) return `https://doi.org/${raw}`;
  return raw;
}

function sentenceTitle(title) {
  if (!title) return "";
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function citationKey(line) {
  return line.toLowerCase().replace(/https?:\/\/(www\.)?/g, "").replace(/[^a-z0-9가-힣]/g, "");
}

function sortCitationLines(lines) {
  return [...lines].sort((a, b) => {
    const aKo = /^[가-힣]/.test(a);
    const bKo = /^[가-힣]/.test(b);
    if (aKo !== bKo) return aKo ? -1 : 1;
    return a.localeCompare(b, "ko", { numeric: true });
  });
}

function citationWarnings(lines, fields) {
  const warnings = [];
  if (fields.author || fields.title || fields.url) {
    if (!fields.author) warnings.push("입력값에 저자가 없습니다.");
    if (!fields.year) warnings.push("입력값에 연도가 없습니다. 연도 미상 표기를 확인하세요.");
    if (!fields.title) warnings.push("입력값에 제목이 없습니다.");
    if (fields.type === "web" && !fields.url) warnings.push("웹페이지 자료는 URL을 함께 남기는 편이 안전합니다.");
  }
  const missingYear = lines.filter((line) => !/\((\d{4}|n\.d\.|연도 미상)\)|\b\d{4}\b/.test(line)).length;
  if (missingYear) warnings.push(`연도 표현이 보이지 않는 줄이 ${missingYear}개 있습니다.`);
  const missingUrlWeb = lines.filter((line) => /https?:\/\/|doi\.org/.test(line) === false && /웹|사이트|online|retrieved/i.test(line)).length;
  if (missingUrlWeb) warnings.push("웹 자료로 보이는 줄 중 URL이 없는 항목이 있습니다.");
  return warnings;
}

function safePdfText(text) {
  const safe = text.replace(/[^\x20-\x7E]/g, "").trim();
  return safe || "DRAFT";
}

function copyGenerated(event) {
  const target = app.querySelector(event.currentTarget.dataset.copy);
  if (!target) return;
  target.select?.();
  navigator.clipboard?.writeText(target.value || target.textContent || "");
  event.currentTarget.textContent = "복사 완료";
}

function copyToolLink(event) {
  const url = new URL(currentTool.path, location.origin).href;
  navigator.clipboard?.writeText(`${currentTool.label} - 레포트핏\n${url}`);
  event.currentTarget.textContent = "링크 복사 완료";
}

function slugPart(text) {
  return text.trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

function cleanOutputName(name, ext) {
  const safe = slugPart(name).replace(new RegExp(`\\.${ext}$`, "i"), "");
  return `${safe || "reportfit"}.${ext}`;
}

function replaceExt(name, ext) {
  return `${name.replace(/\.[^.]+$/, "")}.${ext}`;
}

function extensionFor(mime) {
  return mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
