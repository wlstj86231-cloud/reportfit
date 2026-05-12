import "./styles.css";

let pdfLibPromise;
let zipPromise;

function getPdfLib() {
  pdfLibPromise ||= import("pdf-lib");
  return pdfLibPromise;
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

const popular = ["pdf-compress", "image-convert", "submit-checklist", "file-name", "citation-cleaner", "file-check"];
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
    "pdf-edit": ["PDF 선택", "작업 선택", "새 PDF 받기"],
    "pdf-number": ["PDF 선택", "번호 위치", "번호본 받기"],
    "pdf-watermark": ["PDF 선택", "문구 조절", "표시본 받기"],
    "image-convert": ["이미지 선택", "형식 선택", "결과 받기"],
    "image-compress": ["이미지 선택", "품질 조절", "ZIP 받기"],
    "file-name": ["정보 입력", "파일명 생성", "복사"],
    "submit-checklist": ["조건 입력", "확인 항목 선택", "점검표 복사"],
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
  bindUtilityButtons();
}

function bindToolEvents(id) {
  const map = {
    "pdf-compress": ["#runPdfCompress", runPdfCompress],
    "pdf-edit": ["#runPdfEdit", runPdfEdit],
    "pdf-number": ["#runPdfNumber", runPdfNumber],
    "pdf-watermark": ["#runPdfWatermark", runPdfWatermark],
    "image-convert": ["#runImageConvert", runImageConvert],
    "image-compress": ["#runImageCompress", runImageCompress],
    "file-name": ["#runFileName", runFileName],
    "submit-checklist": ["#runSubmitChecklist", runSubmitChecklist],
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
    "pdf-compress": ["file-check", "pdf-number", "file-name"],
    "pdf-edit": ["pdf-compress", "pdf-number", "pdf-watermark"],
    "pdf-number": ["pdf-compress", "file-check", "pdf-watermark"],
    "pdf-watermark": ["pdf-number", "privacy-clean", "file-check"],
    "image-convert": ["image-compress", "pdf-compress", "privacy-clean"],
    "image-compress": ["image-convert", "file-check", "zip-pack"],
    "file-name": ["file-check", "zip-pack", "pdf-compress"],
    "submit-checklist": ["file-name", "file-check", "citation-cleaner"],
    "word-count": ["text-clean", "citation-cleaner", "file-name"],
    "text-clean": ["word-count", "table-convert", "citation-cleaner"],
    "table-convert": ["text-clean", "citation-cleaner", "file-check"],
    "citation-cleaner": ["word-count", "text-clean", "file-check"],
    "file-check": ["pdf-compress", "file-name", "zip-pack"],
    "zip-pack": ["file-check", "file-name", "privacy-clean"],
    "privacy-clean": ["file-check", "image-compress", "pdf-compress"]
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
    "image-convert": {
      why: "아이폰 사진, 캡처, 실험 노트 이미지는 제출 형식이 맞지 않아 다시 저장해야 하는 일이 많습니다. 여러 장을 PDF로 묶으면 교수자나 조원이 열어보기 쉽습니다.",
      tip: "글자가 있는 이미지는 너무 낮은 품질로 줄이지 말고, 최대 폭 1600에서 2200 사이를 먼저 시도하세요."
    },
    "citation-cleaner": {
      why: "참고문헌은 내용보다 정렬, 중복, 띄어쓰기에서 어수선해 보이는 경우가 많습니다. 제출 전에 줄 단위로 정리하면 문서의 마감감이 좋아집니다.",
      tip: "정리 후에는 과목에서 요구한 APA, MLA, Chicago, 한국식 표기 기준과 맞는지 한 번 더 확인하세요. 레포트핏은 누락 가능성을 알려주지만 최종 양식 판단은 강의 안내를 우선합니다."
    },
    "submit-checklist": {
      why: "과제 제출 실패는 본문 내용보다 파일명, 용량, 첨부 누락, 참고문헌 정리 같은 마지막 단계에서 생기는 경우가 많습니다. 제출 전 점검표는 이 항목을 한 화면에서 정리해 실제 제출 직전 확인 시간을 줄입니다.",
      tip: "점검표를 만든 뒤에는 파일명 만들기, 파일 점검, 참고문헌 정리 도구로 이어가면 제출 전 흐름을 끊지 않고 마감본을 정리할 수 있습니다."
    },
    "pdf-number": {
      why: "PDF를 합치거나 스캔하면 페이지 순서가 헷갈릴 수 있습니다. 하단 번호를 넣어두면 제출 전 검토와 조별 확인이 쉬워집니다.",
      tip: "표지나 목차를 번호에서 제외해야 하는 과목이라면 PDF 편집에서 본문만 분리한 뒤 번호를 넣는 방식이 깔끔합니다."
    },
    "pdf-watermark": {
      why: "초안, 개인 확인용, 참고자료처럼 제출본과 구분해야 하는 PDF에는 워터마크가 도움이 됩니다.",
      tip: "최종 제출본에는 불필요한 워터마크가 남지 않았는지 반드시 다시 열어 확인하세요."
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
