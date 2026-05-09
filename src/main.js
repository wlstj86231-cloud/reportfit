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
    id: "word-count",
    label: "글자수 계산",
    short: "공백 제외, A4 예상",
    icon: "ABC",
    group: "문서",
    path: "/tools/word-count/",
    description: "레포트 본문의 글자수, 단어수, A4 예상 분량을 빠르게 계산합니다."
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

const popular = ["pdf-compress", "image-convert", "file-name", "word-count", "citation-cleaner", "file-check"];
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
            ${tools.map((tool) => toolCard(tool)).join("")}
          </aside>
          <section class="workspace" aria-live="polite">
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
      </main>

      <footer class="footer">
        <a href="/about/">소개</a>
        <a href="/privacy/">개인정보</a>
        <a href="/terms/">이용안내</a>
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
    <button type="button" class="tool-card ${tool.id === currentTool.id ? "is-active" : ""}" data-tool-link="${tool.id}">
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

function workspaceFor(id) {
  const drop = (accept, multiple = false) => `
    <label class="dropzone">
      <input class="file-input" type="file" ${multiple ? "multiple" : ""} accept="${accept}">
      <span>파일 선택</span>
      <strong>여기에 놓거나 눌러서 선택</strong>
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
    "word-count": `
      <div class="tool-head"><h2>글자수 계산</h2><p>공백 포함, 공백 제외, 단어 수, A4 예상 장수를 계산합니다.</p></div>
      <textarea id="wordText" class="big-textarea" placeholder="레포트 본문을 붙여넣으세요."></textarea>
      <button class="primary-action" id="runWordCount" type="button">글자수 계산하기</button>
      <div class="result" id="result"></div>
    `,
    "citation-cleaner": `
      <div class="tool-head"><h2>참고문헌 정리</h2><p>참고문헌 줄을 정리하고 중복을 제거합니다.</p></div>
      <textarea id="citationText" class="big-textarea" placeholder="참고문헌을 한 줄에 하나씩 붙여넣으세요."></textarea>
      <div class="option-row">
        <label>정렬 방식
          <select id="citationSort">
            <option value="locale">가나다순 + 알파벳순</option>
            <option value="original">원래 순서 유지</option>
          </select>
        </label>
        <label>간단 생성
          <input id="citationQuick" type="text" placeholder="저자, 연도, 제목, 출처">
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
    });
  });

  app.querySelectorAll(".file-input").forEach((input) => {
    input.addEventListener("change", () => updateFileSummary(input));
  });
}

function bindToolEvents(id) {
  const map = {
    "pdf-compress": ["#runPdfCompress", runPdfCompress],
    "pdf-edit": ["#runPdfEdit", runPdfEdit],
    "image-convert": ["#runImageConvert", runImageConvert],
    "image-compress": ["#runImageCompress", runImageCompress],
    "file-name": ["#runFileName", runFileName],
    "word-count": ["#runWordCount", runWordCount],
    "citation-cleaner": ["#runCitation", runCitationCleaner],
    "file-check": ["#runFileCheck", runFileCheck],
    "zip-pack": ["#runZipPack", runZipPack],
    "privacy-clean": ["#runPrivacyClean", runPrivacyClean]
  };
  const entry = map[id];
  if (entry) app.querySelector(entry[0])?.addEventListener("click", entry[1]);
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

function runCitationCleaner() {
  const rawLines = value("#citationText")
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const quick = value("#citationQuick").trim();
  if (quick) rawLines.push(makeSimpleCitation(quick));
  const deduped = [...new Map(rawLines.map((line) => [line.toLowerCase(), line])).values()];
  const lines = value("#citationSort") === "locale"
    ? deduped.sort((a, b) => a.localeCompare(b, "ko"))
    : deduped;
  const output = lines.join("\n");
  setResult(`
    <textarea class="result-text" id="cleanCitation" readonly>${escapeHtml(output)}</textarea>
    <button class="secondary-action" type="button" data-copy="#cleanCitation">정리한 참고문헌 복사</button>
  `);
  app.querySelector("[data-copy]")?.addEventListener("click", copyGenerated);
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
  result.innerHTML = html;
  result.classList.add("is-filled");
  result.querySelectorAll("[data-download-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = downloadStore.get(button.dataset.downloadId);
      if (item) saveBlob(item.blob, item.name);
    });
  });
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

function value(selector) {
  return app.querySelector(selector)?.value || "";
}

function toolById(id) {
  return tools.find((tool) => tool.id === id);
}

function relatedTools(id) {
  const map = {
    "pdf-compress": ["file-check", "file-name", "zip-pack"],
    "pdf-edit": ["pdf-compress", "file-check", "file-name"],
    "image-convert": ["image-compress", "pdf-compress", "privacy-clean"],
    "image-compress": ["image-convert", "file-check", "zip-pack"],
    "file-name": ["file-check", "zip-pack", "pdf-compress"],
    "word-count": ["citation-cleaner", "file-name", "file-check"],
    "citation-cleaner": ["word-count", "file-name", "file-check"],
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
      tip: "정리 후에는 과목에서 요구한 APA, MLA, Chicago, 한국식 표기 기준과 맞는지 한 번 더 확인하세요."
    }
  };
  return extra[id] || base;
}

function makeSimpleCitation(input) {
  const [author = "", year = "", title = "", source = ""] = input.split(",").map((part) => part.trim());
  return [author, year ? `(${year})` : "", title, source].filter(Boolean).join(". ");
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
