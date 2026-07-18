import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";
import { defaultScoreSettings, normalizeArray, normalizeDomeggookItem, scoreProduct } from "@/lib/scoring";
import type { MarketType, RawProduct, ScoreSettings } from "@/types/product";

const AUTH_COOKIE = "reportools_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (pathname === "/favicon.ico") {
    return new NextResponse(null, { status: 204 });
  }

  if (pathname === "/.well-known/sites-deployment-id") {
    return textResponse("reportools");
  }

  if (pathname === "/api/domeggook/search") {
    return handleProductSearch(request);
  }

  if (pathname === "/api/auth/login" && request.method === "POST") {
    return handleLogin(request);
  }

  if (pathname === "/api/auth/logout" && request.method === "POST") {
    return handleLogout(request);
  }

  if (isAuthEnabled() && !(await hasValidSession(request))) {
    if (pathname === "/login") {
      return htmlResponse(renderLoginPage(request));
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return htmlResponse(renderAppPage());
}

async function handleProductSearch(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const apiKey = getEnv("DOMEGGOOK_API_KEY");
  const keyword = sanitizeKeyword(searchParams.get("keyword") || "생활");
  const market = sanitizeMarket(searchParams.get("market"));
  const size = clampNumber(Number(searchParams.get("size") || 50), 1, 200);
  const settings: ScoreSettings = {
    targetMarginRate: clampNumber(Number(searchParams.get("targetMarginRate") || defaultScoreSettings.targetMarginRate), 5, 80),
    platformFeeRate: clampNumber(Number(searchParams.get("platformFeeRate") || defaultScoreSettings.platformFeeRate), 0, 35),
    taxAndBufferRate: clampNumber(Number(searchParams.get("taxAndBufferRate") || defaultScoreSettings.taxAndBufferRate), 0, 30),
    maxPreferredMoq: clampNumber(Number(searchParams.get("maxPreferredMoq") || defaultScoreSettings.maxPreferredMoq), 1, 200)
  };

  try {
    const products = apiKey
      ? await fetchDomeggookProducts({ apiKey, keyword, market, size, searchParams })
      : filterMockProducts(keyword, market);

    const scored = products
      .filter((item) => item.title && item.price > 0)
      .map((item) => scoreProduct(item, settings))
      .sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json(
      {
        source: apiKey ? "domeggook" : "sample",
        keyword,
        market,
        count: scored.length,
        message: apiKey ? "" : "도매꾹 API 키가 아직 없어 샘플 데이터로 표시 중입니다.",
        items: scored
      },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (error) {
    const fallback = filterMockProducts(keyword, market).map((item) => scoreProduct(item, settings));
    return NextResponse.json(
      {
        source: "error",
        keyword,
        market,
        count: fallback.length,
        message: error instanceof Error ? error.message : "도매꾹 API 호출 중 오류가 발생했습니다.",
        items: fallback
      },
      { status: 502, headers: { "cache-control": "no-store" } }
    );
  }
}

async function handleLogin(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  const next = String(form.get("next") || "/");
  const configuredPassword = getEnv("REPORTOOLS_PASSWORD");

  if (!configuredPassword || password !== configuredPassword) {
    return htmlResponse(renderLoginPage(request, true), 401);
  }

  const response = NextResponse.redirect(new URL(safePath(next), request.url));
  response.cookies.set(AUTH_COOKIE, await createSessionValue(configuredPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}

function handleLogout(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0
  });
  return response;
}

async function fetchDomeggookProducts(input: {
  apiKey: string;
  keyword: string;
  market: MarketType;
  size: number;
  searchParams: URLSearchParams;
}): Promise<RawProduct[]> {
  const params = new URLSearchParams({
    ver: "4.1",
    mode: "getItemList",
    aid: input.apiKey,
    market: input.market,
    om: "json",
    kw: input.keyword,
    sz: String(input.size),
    pg: "1",
    so: input.searchParams.get("sort") || "rd"
  });

  copyOptionalParam(input.searchParams, params, "mnp");
  copyOptionalParam(input.searchParams, params, "mxp");
  copyOptionalParam(input.searchParams, params, "mnq");
  copyOptionalParam(input.searchParams, params, "mxq");
  copyOptionalParam(input.searchParams, params, "who");
  copyOptionalBoolean(input.searchParams, params, "sgd");
  copyOptionalBoolean(input.searchParams, params, "fdl");
  copyOptionalBoolean(input.searchParams, params, "lwp");

  const response = await fetch(`https://domeggook.com/ssl/api/?${params.toString()}`, {
    headers: { accept: "application/json" },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`도매꾹 API 응답 실패: ${response.status}`);
  }

  const data = await response.json();
  const root = data.domeggook ?? data;
  const list = root.list?.item ?? root.item ?? [];
  return normalizeArray<Record<string, unknown>>(list).map(normalizeDomeggookItem);
}

function renderAppPage(): string {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>reportools | 도매꾹 미니 스카우트</title>
  <meta name="description" content="도매꾹 상품 후보를 점수화해 쿠팡 판매 전 검토 시간을 줄이는 개인용 도구" />
  <style>
    :root {
      color-scheme: light;
      --ink: #20211f;
      --muted: #696c66;
      --line: #dedbd2;
      --bg: #f6f3ed;
      --panel: #fffdfa;
      --green: #0f6a55;
      --blue: #285f8f;
      --red: #b65145;
      --gold: #b9852c;
      --shadow: 0 18px 40px rgba(48, 43, 35, 0.08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: Inter, Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", system-ui, sans-serif;
      letter-spacing: 0;
    }
    button, input, select { font: inherit; }
    .shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 248px 1fr;
    }
    .sidebar {
      border-right: 1px solid var(--line);
      background: #ebe7dc;
      padding: 28px 22px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .mark {
      width: 36px; height: 36px; display: grid; place-items: center;
      border-radius: 8px; background: var(--green); color: white; font-weight: 800;
    }
    .brand strong { display: block; font-size: 20px; }
    .brand span { color: var(--muted); font-size: 12px; }
    .nav { display: grid; gap: 8px; }
    .nav a {
      text-decoration: none; color: var(--ink); padding: 11px 12px;
      border-radius: 8px; font-weight: 700; font-size: 14px;
    }
    .nav a.active { background: var(--panel); box-shadow: 0 1px 0 rgba(0,0,0,0.04); }
    .status-card {
      margin-top: auto; background: var(--panel); border: 1px solid var(--line);
      border-radius: 8px; padding: 14px; display: grid; gap: 8px;
    }
    .status-card b { color: var(--green); }
    .status-card span { color: var(--muted); font-size: 12px; line-height: 1.55; }
    .workspace { padding: 30px; max-width: 1440px; width: 100%; margin: 0 auto; }
    .topbar {
      display: flex; justify-content: space-between; gap: 24px; align-items: flex-start;
      margin-bottom: 22px;
    }
    .eyebrow {
      color: var(--green); font-weight: 800; font-size: 12px; text-transform: uppercase;
    }
    h1 { margin: 8px 0 8px; font-size: clamp(30px, 4vw, 52px); line-height: 1.06; letter-spacing: 0; }
    .lead { color: var(--muted); font-size: 16px; line-height: 1.65; max-width: 760px; margin: 0; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
    .btn {
      border: 1px solid var(--line); background: var(--panel); color: var(--ink);
      height: 42px; padding: 0 14px; border-radius: 8px; font-weight: 800; cursor: pointer;
    }
    .btn.primary { background: var(--green); color: white; border-color: var(--green); }
    .btn:disabled { opacity: .55; cursor: wait; }
    .query-panel, .filters, .metrics, .content-grid { margin-top: 18px; }
    .query-panel {
      display: grid; grid-template-columns: minmax(260px, 1.6fr) repeat(3, minmax(130px, .8fr)) auto;
      gap: 10px; align-items: end;
    }
    .field, .mini-field {
      display: grid; gap: 7px;
    }
    label, .field span, .mini-field span { font-size: 12px; color: var(--muted); font-weight: 800; }
    input, select {
      width: 100%; height: 42px; border-radius: 8px; border: 1px solid var(--line);
      background: var(--panel); color: var(--ink); padding: 0 12px;
    }
    .preset-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
    .preset-row button {
      border: 1px solid var(--line); background: transparent; color: var(--ink);
      border-radius: 999px; padding: 8px 12px; font-weight: 800; cursor: pointer; font-size: 13px;
    }
    .filters {
      display: grid; grid-template-columns: repeat(6, minmax(110px, 1fr));
      gap: 10px;
    }
    .metrics { display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr)); gap: 10px; }
    .metric, .panel {
      background: var(--panel); border: 1px solid var(--line); border-radius: 8px; box-shadow: var(--shadow);
    }
    .metric { padding: 16px; }
    .metric span { display: block; color: var(--muted); font-size: 12px; font-weight: 800; }
    .metric strong { display: block; margin-top: 8px; font-size: 28px; }
    .notice {
      margin-top: 14px; border-radius: 8px; border: 1px solid #ead7a7;
      background: #fff8df; color: #6f4d0e; padding: 12px 14px; font-weight: 700;
    }
    .content-grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 16px; align-items: start; }
    .panel { overflow: hidden; }
    .panel-head {
      padding: 18px 20px; border-bottom: 1px solid var(--line);
      display: flex; justify-content: space-between; align-items: center; gap: 12px;
    }
    .panel-head h2 { margin: 0; font-size: 20px; }
    .panel-head p { margin: 4px 0 0; color: var(--muted); font-size: 13px; }
    .pill {
      border-radius: 999px; padding: 7px 10px; font-size: 12px; font-weight: 900;
      color: white; background: var(--blue); white-space: nowrap;
    }
    .pill.sample { background: var(--gold); }
    .pill.error { background: var(--red); }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 760px; }
    th, td { text-align: left; padding: 14px 16px; border-bottom: 1px solid var(--line); font-size: 13px; vertical-align: middle; }
    th { color: var(--muted); font-size: 12px; }
    tr { cursor: pointer; }
    tr:hover, tr.selected { background: #f7f2e8; }
    .product { display: flex; align-items: center; gap: 12px; min-width: 300px; }
    .thumb {
      width: 48px; height: 48px; border-radius: 8px; object-fit: cover;
      border: 1px solid var(--line); background: #ece7dc;
    }
    .product strong { display: block; line-height: 1.35; }
    .product span { display: block; margin-top: 3px; color: var(--muted); font-size: 12px; }
    .score { display: inline-grid; place-items: center; min-width: 38px; height: 30px; border-radius: 999px; color: white; font-weight: 900; }
    .grade-a { background: var(--green); }
    .grade-b { background: var(--blue); }
    .grade-c { background: var(--gold); }
    .grade-d { background: var(--red); }
    .detail { padding: 20px; display: grid; gap: 16px; position: sticky; top: 16px; }
    .detail-head { display: flex; align-items: center; gap: 12px; }
    .grade {
      width: 44px; height: 44px; display: grid; place-items: center;
      border-radius: 8px; color: white; font-size: 20px; font-weight: 900;
    }
    .detail h2 { margin: 0; font-size: 18px; line-height: 1.35; }
    .detail p { margin: 4px 0 0; color: var(--muted); font-size: 13px; }
    .next {
      border: 1px solid var(--line); border-radius: 8px; padding: 14px; background: #faf6ee;
    }
    .next span { display: block; color: var(--muted); font-size: 12px; font-weight: 800; }
    .next strong { display: block; margin-top: 6px; line-height: 1.45; }
    .score-line { display: grid; gap: 6px; }
    .score-line div { display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; color: var(--muted); }
    .score-line i { display: block; height: 8px; border-radius: 999px; background: var(--green); }
    .bar { background: #e9e2d5; border-radius: 999px; overflow: hidden; }
    .risk-tags { display: flex; flex-wrap: wrap; gap: 7px; }
    .risk-tags span { border: 1px solid var(--line); border-radius: 999px; padding: 7px 9px; font-size: 12px; font-weight: 800; }
    .link { color: var(--green); font-weight: 900; text-decoration: none; }
    .empty { color: var(--muted); }
    @media (max-width: 1000px) {
      .shell { grid-template-columns: 1fr; }
      .sidebar { position: static; flex-direction: row; align-items: center; flex-wrap: wrap; }
      .status-card { margin-top: 0; }
      .query-panel, .filters, .metrics, .content-grid { grid-template-columns: 1fr; }
      .topbar { flex-direction: column; }
      .actions { justify-content: flex-start; }
      .detail { position: static; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="mark">R</div>
        <div><strong>reportools</strong><span>도매꾹 미니 스카우트</span></div>
      </div>
      <nav class="nav">
        <a class="active" href="#search">후보 검색</a>
        <a href="#score">점수표</a>
        <a href="#settings">기준값</a>
      </nav>
      <div class="status-card">
        <b id="sourceLabel">공개 검수 모드</b>
        <span id="sourceNote">현재 비밀번호 없이 열립니다. 도매꾹 API 키가 연결되면 실데이터로 전환됩니다.</span>
      </div>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div>
          <span class="eyebrow">Domeggook focused sourcing</span>
          <h1>도매꾹 상품을 빠르게 걸러 쿠팡 후보만 남깁니다</h1>
          <p class="lead">원가, MOQ, 배송 조건, 예상 마진을 한 화면에서 점수화해 직접 검색 시간을 줄이는 개인용 분석 도구입니다.</p>
        </div>
        <div class="actions">
          <button class="btn" id="exportBtn" type="button">CSV 내보내기</button>
          <button class="btn" id="logoutBtn" type="button">로그아웃</button>
        </div>
      </header>

      <section id="search" class="query-panel">
        <label class="field">검색어<input id="keyword" value="생활" /></label>
        <label class="field">소싱처<select id="market"><option value="dome">도매꾹</option><option value="supply">도매매</option></select></label>
        <label class="field">배송<select id="shipping"><option value="">전체</option><option value="S">무료배송</option><option value="P">선결제</option><option value="B">착불</option></select></label>
        <label class="field">정렬<select id="sort"><option value="rd">추천순</option><option value="ha">인기순</option><option value="aa">낮은 가격순</option><option value="qa">낮은 MOQ순</option><option value="da">최근 등록순</option></select></label>
        <button class="btn primary" id="searchBtn" type="button">후보 찾기</button>
      </section>

      <div class="preset-row" id="presets"></div>

      <section id="settings" class="filters">
        <label class="mini-field">선호 MOQ<input id="maxMoq" type="number" value="3" /></label>
        <label class="mini-field">최소 원가<input id="minPrice" type="number" value="0" /></label>
        <label class="mini-field">최대 원가<input id="maxPrice" type="number" value="20000" /></label>
        <label class="mini-field">목표 마진 %<input id="targetMarginRate" type="number" value="28" /></label>
        <label class="mini-field">쿠팡 수수료 %<input id="platformFeeRate" type="number" value="12" /></label>
        <label class="mini-field">세금/운영 %<input id="taxAndBufferRate" type="number" value="6" /></label>
      </section>

      <div class="notice" id="notice" hidden></div>

      <section class="metrics">
        <div class="metric"><span>분석 상품</span><strong id="metricCount">0</strong></div>
        <div class="metric"><span>검토 후보</span><strong id="metricPriority">0</strong></div>
        <div class="metric"><span>최고 점수</span><strong id="metricTop">0</strong></div>
        <div class="metric"><span>평균 마진</span><strong id="metricMargin">0%</strong></div>
        <div class="metric"><span>선호 MOQ</span><strong id="metricMoq">0</strong></div>
      </section>

      <section class="content-grid">
        <div class="panel">
          <div class="panel-head">
            <div><h2>도매꾹 후보 점수표</h2><p>A/B 등급만 쿠팡에서 최종 확인하면 됩니다.</p></div>
            <span class="pill sample" id="modePill">샘플</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>상품</th><th>원가</th><th>MOQ</th><th>예상가</th><th>마진</th><th>점수</th><th>판단</th></tr></thead>
              <tbody id="tbody"></tbody>
            </table>
          </div>
        </div>

        <aside class="panel detail" id="detail">
          <p class="empty">검색 결과를 불러오는 중입니다.</p>
        </aside>
      </section>
    </section>
  </main>

  <script>
    const AUTH_ENABLED = ${JSON.stringify(isAuthEnabled())};
    const presets = ["생활 수납", "차량용 수납", "주방 정리", "케이블 정리", "캠핑 조명"];
    const state = { items: [], selectedNo: null, source: "sample" };

    const $ = (id) => document.getElementById(id);
    const money = (value) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(Number(value || 0));
    const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
    const gradeClass = (grade) => "grade-" + String(grade || "d").toLowerCase();

    $("logoutBtn").hidden = !AUTH_ENABLED;
    $("logoutBtn").addEventListener("click", () => fetch("/api/auth/logout", { method: "POST" }).finally(() => location.href = "/login"));
    $("searchBtn").addEventListener("click", search);
    $("exportBtn").addEventListener("click", exportCsv);
    $("presets").innerHTML = presets.map((keyword) => '<button type="button" data-keyword="' + esc(keyword) + '">' + esc(keyword) + '</button>').join("");
    $("presets").addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      $("keyword").value = button.dataset.keyword;
      search();
    });

    async function search() {
      $("searchBtn").disabled = true;
      $("searchBtn").textContent = "검색 중";
      $("notice").hidden = true;

      const params = new URLSearchParams({
        keyword: $("keyword").value,
        market: $("market").value,
        sort: $("sort").value,
        mxq: $("maxMoq").value,
        maxPreferredMoq: $("maxMoq").value,
        targetMarginRate: $("targetMarginRate").value,
        platformFeeRate: $("platformFeeRate").value,
        taxAndBufferRate: $("taxAndBufferRate").value
      });
      if (Number($("minPrice").value) > 0) params.set("mnp", $("minPrice").value);
      if (Number($("maxPrice").value) > 0) params.set("mxp", $("maxPrice").value);
      if ($("shipping").value) params.set("who", $("shipping").value);

      try {
        const response = await fetch("/api/domeggook/search?" + params.toString());
        const data = await response.json();
        state.items = data.items || [];
        state.selectedNo = state.items[0]?.no || null;
        state.source = data.source || "sample";
        render(data.message || "");
      } catch {
        $("notice").textContent = "검색 중 오류가 발생했습니다.";
        $("notice").hidden = false;
      } finally {
        $("searchBtn").disabled = false;
        $("searchBtn").textContent = "후보 찾기";
      }
    }

    function render(message) {
      const items = state.items;
      const count = items.length;
      const priority = items.filter((item) => item.grade === "A" || item.grade === "B").length;
      const top = items[0]?.totalScore || 0;
      const avgMargin = count ? Math.round(items.reduce((sum, item) => sum + Number(item.expectedMarginRate || 0), 0) / count) : 0;
      const lowMoq = items.filter((item) => Number(item.moq || 0) <= Number($("maxMoq").value || 3)).length;

      $("metricCount").textContent = count;
      $("metricPriority").textContent = priority;
      $("metricTop").textContent = top;
      $("metricMargin").textContent = avgMargin + "%";
      $("metricMoq").textContent = lowMoq;
      $("notice").textContent = message;
      $("notice").hidden = !message;

      const sourceText = state.source === "domeggook" ? "도매꾹 API 연결됨" : state.source === "error" ? "API 오류, 샘플 표시" : "샘플 데이터 모드";
      $("sourceLabel").textContent = sourceText;
      $("modePill").textContent = state.source === "domeggook" ? "API" : state.source === "error" ? "오류" : "샘플";
      $("modePill").className = "pill " + state.source;

      $("tbody").innerHTML = items.map((item) => {
        const selected = item.no === state.selectedNo ? " selected" : "";
        return '<tr class="' + selected + '" data-no="' + esc(item.no) + '">' +
          '<td><div class="product"><img class="thumb" src="' + esc(item.thumb || "") + '" alt="" /><div><strong>' + esc(item.title) + '</strong><span>' + esc(item.sellerNick || item.sellerId || "판매자 확인 필요") + '</span></div></div></td>' +
          '<td>' + money(item.price) + '</td>' +
          '<td>' + esc(item.moq) + '</td>' +
          '<td>' + money(item.expectedSellPrice) + '</td>' +
          '<td>' + esc(item.expectedMarginRate) + '%</td>' +
          '<td><span class="score ' + gradeClass(item.grade) + '">' + esc(item.totalScore) + '</span></td>' +
          '<td>' + esc(item.verdict) + '</td>' +
        '</tr>';
      }).join("");

      document.querySelectorAll("#tbody tr").forEach((row) => {
        row.addEventListener("click", () => {
          state.selectedNo = row.dataset.no;
          render("");
        });
      });

      renderDetail(items.find((item) => item.no === state.selectedNo) || items[0]);
    }

    function renderDetail(item) {
      if (!item) {
        $("detail").innerHTML = '<p class="empty">검색 결과가 없습니다.</p>';
        return;
      }
      const risks = item.risks?.length ? item.risks.map((risk) => '<span>' + esc(risk) + '</span>').join("") : "<span>기본 리스크 낮음</span>";
      $("detail").innerHTML =
        '<div class="detail-head"><div class="grade ' + gradeClass(item.grade) + '">' + esc(item.grade) + '</div><div><h2>' + esc(item.title) + '</h2><p>상품번호 ' + esc(item.no) + '</p></div></div>' +
        '<div class="next"><span>다음 행동</span><strong>' + esc(item.nextAction) + '</strong></div>' +
        scoreLine("수요 추정", item.demandScore, 30) +
        scoreLine("마진", item.marginScore, 25) +
        scoreLine("경쟁 완화", item.competitionScore, 20) +
        scoreLine("공급 안정", item.supplyScore, 17) +
        scoreLine("리스크 낮음", item.riskScore, 10) +
        '<div class="next"><span>입고 기준 원가</span><strong>' + money(item.landedCost) + '</strong></div>' +
        '<div class="risk-tags">' + risks + '</div>' +
        '<a class="link" target="_blank" rel="noreferrer" href="' + esc(item.url || "https://domeggook.com") + '">도매꾹 상품 보기</a>';
    }

    function scoreLine(label, value, max) {
      const width = Math.max(0, Math.min(100, Math.round((Number(value || 0) / max) * 100)));
      return '<div class="score-line"><div><span>' + label + '</span><strong>' + esc(value) + '/' + max + '</strong></div><div class="bar"><i style="width:' + width + '%"></i></div></div>';
    }

    function exportCsv() {
      if (!state.items.length) return;
      const headers = ["상품번호", "상품명", "원가", "MOQ", "배송비", "입고기준원가", "예상판매가", "예상마진율", "점수", "등급", "판단", "다음행동", "URL"];
      const rows = state.items.map((item) => [item.no, item.title, item.price, item.moq, item.deliveryFee, item.landedCost, item.expectedSellPrice, item.expectedMarginRate, item.totalScore, item.grade, item.verdict, item.nextAction, item.url || ""]);
      const csv = [headers, ...rows].map((row) => row.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(",")).join("\\n");
      const blob = new Blob(["\\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "reportools_" + ($("keyword").value || "products") + ".csv";
      anchor.click();
      URL.revokeObjectURL(url);
    }

    search();
  </script>
</body>
</html>`;
}

function renderLoginPage(request: NextRequest, failed = false): string {
  const next = safePath(request.nextUrl.searchParams.get("next") || "/");
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>reportools 로그인</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f3ed; color: #20211f; font-family: Pretendard, "Noto Sans KR", system-ui, sans-serif; }
    form { width: min(420px, calc(100vw - 40px)); background: #fffdfa; border: 1px solid #dedbd2; border-radius: 10px; padding: 28px; box-shadow: 0 18px 40px rgba(48,43,35,.08); }
    h1 { margin: 0 0 8px; font-size: 28px; }
    p { margin: 0 0 22px; color: #696c66; line-height: 1.55; }
    input { width: 100%; height: 46px; border: 1px solid #dedbd2; border-radius: 8px; padding: 0 12px; font: inherit; box-sizing: border-box; }
    button { width: 100%; height: 46px; margin-top: 12px; border: 0; border-radius: 8px; background: #0f6a55; color: white; font-weight: 900; font: inherit; cursor: pointer; }
    .error { color: #b65145; font-weight: 800; margin-bottom: 12px; }
  </style>
</head>
<body>
  <form method="post" action="/api/auth/login">
    <h1>reportools</h1>
    <p>개인용 분석 도구입니다.</p>
    ${failed ? '<div class="error">비밀번호가 맞지 않습니다.</div>' : ""}
    <input name="password" type="password" placeholder="비밀번호" autofocus />
    <input name="next" type="hidden" value="${escapeAttribute(next)}" />
    <button type="submit">열기</button>
  </form>
</body>
</html>`;
}

function filterMockProducts(keyword: string, market: MarketType): RawProduct[] {
  const normalized = keyword.trim().toLowerCase();
  return mockProducts.filter((item) => {
    const matchesKeyword = !normalized || item.title.toLowerCase().includes(normalized) || normalized === "생활";
    const matchesMarket = market === "dome" ? item.market.domeggook : item.market.supply;
    return matchesKeyword && matchesMarket;
  });
}

function isAuthEnabled(): boolean {
  return getEnv("REPORTOOLS_AUTH_ENABLED") === "true";
}

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const password = getEnv("REPORTOOLS_PASSWORD");
  if (!password) return false;
  return request.cookies.get(AUTH_COOKIE)?.value === (await createSessionValue(password));
}

async function createSessionValue(password: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`reportools:${password}`));
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getEnv(key: string): string {
  return typeof process !== "undefined" ? process.env[key] ?? "" : "";
}

function sanitizeKeyword(keyword: string): string {
  return keyword.trim().slice(0, 40) || "생활";
}

function sanitizeMarket(value: string | null): MarketType {
  return value === "supply" ? "supply" : "dome";
}

function copyOptionalParam(from: URLSearchParams, to: URLSearchParams, key: string) {
  const value = from.get(key);
  if (value) to.set(key, value);
}

function copyOptionalBoolean(from: URLSearchParams, to: URLSearchParams, key: string) {
  const value = from.get(key);
  if (value === "true" || value === "false") to.set(key, value);
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function safePath(value: string): string {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function htmlResponse(html: string, status = 200) {
  return new NextResponse(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function textResponse(text: string) {
  return new NextResponse(text, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function escapeAttribute(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return replacements[char] || char;
  });
}

export const config = {
  matcher: ["/:path*"]
};
