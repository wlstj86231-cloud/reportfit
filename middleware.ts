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

  return htmlResponse(renderAppPageV2());
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

function renderAppPageV2(): string {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>reportools | 도매꾹 소싱 도구</title>
  <meta name="description" content="도매꾹 상품 후보를 빠르게 찾고 쿠팡 판매 가능성을 점수화하는 개인용 도구" />
  <style>
    :root {
      color-scheme: light;
      --ink: #171916;
      --muted: #6c7069;
      --line: #ddd9cf;
      --bg: #f4f1ea;
      --paper: #fffdfa;
      --soft: #f8f6f1;
      --green: #08745d;
      --green-2: #0b8c70;
      --gold: #d8af4f;
      --red: #b65145;
      --shadow: 0 18px 45px rgba(42, 39, 32, .08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      letter-spacing: 0;
    }
    button, input, select { font: inherit; }
    button { cursor: pointer; }
    .page { width: min(1180px, calc(100vw - 40px)); margin: 0 auto; padding: 28px 0 42px; }
    .topbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 22px; }
    .brand { display: flex; align-items: center; gap: 12px; min-width: 220px; }
    .brand-mark {
      width: 46px; height: 46px; border-radius: 14px; display: grid; place-items: center;
      background: #111612; color: white; font-weight: 950; position: relative;
    }
    .brand-mark:after {
      content: ""; position: absolute; right: 9px; bottom: 9px; width: 8px; height: 8px;
      border-radius: 50%; background: var(--gold);
    }
    .brand strong { display: block; font-size: 24px; line-height: 1; font-weight: 950; }
    .brand span { display: block; margin-top: 6px; color: var(--muted); font-size: 14px; font-weight: 700; }
    .nav-pills { flex: 1; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
    .nav-pills button, .top-actions button {
      border: 1px solid var(--line); background: var(--paper); color: var(--ink); border-radius: 999px;
      padding: 10px 16px; font-weight: 850; box-shadow: 0 5px 14px rgba(45, 41, 34, .04);
    }
    .nav-pills button.active { background: #111612; color: #fff; border-color: #111612; }
    .top-actions { display: flex; align-items: center; gap: 8px; }
    .top-actions .round { width: 44px; height: 44px; padding: 0; display: grid; place-items: center; }
    .hero-card {
      border: 0; border-radius: 0; background: transparent; box-shadow: none;
      padding: 48px 8px 38px; margin-bottom: 8px;
    }
    .eyebrow { margin: 0 0 12px; color: var(--green); font-weight: 950; font-size: 13px; letter-spacing: .08em; }
    h1 { margin: 0; max-width: 820px; font-size: clamp(38px, 6vw, 74px); line-height: .98; font-weight: 950; }
    .hero-card > p { margin: 18px 0 0; max-width: 780px; color: var(--muted); font-size: 19px; line-height: 1.6; font-weight: 650; }
    .mode-line { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
    .mode-line span {
      border: 1px solid var(--line); border-radius: 999px; background: var(--soft); padding: 9px 13px;
      font-size: 14px; font-weight: 850; color: #343730;
    }
    .mode-line b { margin-left: 8px; color: var(--green); }
    .workspace { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 18px; align-items: start; }
    .tool-list, .tool-panel, .panel, .metric {
      border: 1px solid var(--line); border-radius: 18px; background: var(--paper);
      box-shadow: 0 10px 28px rgba(45, 41, 34, .05);
    }
    .tool-list { padding: 14px; display: grid; gap: 10px; }
    .tool-list header { padding: 8px 8px 4px; }
    .tool-list h2, .panel h2 { margin: 0; font-size: 18px; font-weight: 950; }
    .tool-list p { margin: 8px 0 0; color: var(--muted); font-size: 13px; line-height: 1.5; font-weight: 650; }
    #presets { display: grid; gap: 8px; }
    #presets button {
      width: 100%; border: 1px solid var(--line); border-radius: 14px; background: var(--soft);
      padding: 14px; text-align: left; font-weight: 900; color: var(--ink);
    }
    #presets button:hover { border-color: rgba(8, 116, 93, .45); background: #f1faf6; }
    .tool-panel { padding: 26px; }
    .steps { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }
    .steps span {
      display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--line); border-radius: 999px;
      padding: 9px 13px; background: var(--soft); color: #44483f; font-size: 13px; font-weight: 900;
    }
    .steps b {
      display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%;
      background: #111612; color: #fff; font-size: 12px;
    }
    .search-grid { display: grid; grid-template-columns: minmax(240px, 1fr) 150px 150px auto; gap: 12px; align-items: end; }
    label { display: grid; gap: 8px; color: #575b54; font-size: 14px; font-weight: 900; }
    input, select {
      width: 100%; min-height: 54px; border: 1px solid var(--line); border-radius: 14px;
      background: #fff; color: var(--ink); padding: 0 15px; font-weight: 850; outline: none;
    }
    input:focus, select:focus { border-color: rgba(8, 116, 93, .65); box-shadow: 0 0 0 4px rgba(8, 116, 93, .1); }
    .primary {
      min-height: 54px; border: 0; border-radius: 14px; background: var(--green); color: white;
      padding: 0 24px; font-weight: 950; white-space: nowrap;
    }
    .primary:hover { background: var(--green-2); }
    .secondary {
      border: 1px solid var(--line); border-radius: 14px; background: var(--paper); color: var(--ink);
      padding: 0 18px; min-height: 48px; font-weight: 900;
    }
    .toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 14px; flex-wrap: wrap; }
    .notice {
      flex: 1; min-width: 260px; border: 1px solid #ead08a; background: #fff8df; color: #7a5200;
      border-radius: 14px; padding: 14px 16px; font-weight: 850;
    }
    .notice.ok { border-color: #bedccd; background: #f0fbf5; color: var(--green); }
    .advanced { margin-top: 14px; border: 1px solid var(--line); border-radius: 14px; background: var(--soft); overflow: hidden; }
    .advanced summary { list-style: none; padding: 14px 16px; font-weight: 950; color: #30342f; cursor: pointer; }
    .advanced summary::-webkit-details-marker { display: none; }
    .advanced summary:after { content: "+"; float: right; color: var(--green); font-weight: 950; }
    .advanced[open] summary:after { content: "-"; }
    .advanced-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding: 0 16px 16px; }
    .metrics { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; margin: 18px 0; }
    .metric { padding: 20px; }
    .metric span { display: block; color: var(--muted); font-size: 13px; font-weight: 900; margin-bottom: 10px; }
    .metric strong { font-size: 36px; line-height: 1; font-weight: 950; }
    .content-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(300px, .75fr); gap: 18px; }
    .panel { min-width: 0; padding: 22px; }
    .panel-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; }
    .source { color: var(--muted); font-size: 13px; font-weight: 800; }
    .table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
    table { width: 100%; min-width: 680px; border-collapse: collapse; table-layout: fixed; }
    th, td { padding: 13px 14px; border-bottom: 1px solid #ece8df; text-align: left; vertical-align: top; font-size: 14px; }
    th { color: var(--muted); background: #fbfaf7; font-size: 12px; font-weight: 950; }
    td { font-weight: 750; }
    th:nth-child(1), td:nth-child(1) { width: 48%; }
    th:nth-child(2), td:nth-child(2),
    th:nth-child(3), td:nth-child(3),
    th:nth-child(4), td:nth-child(4),
    th:nth-child(5), td:nth-child(5) { white-space: nowrap; }
    th:nth-child(5), td:nth-child(5) { width: 86px; text-align: center; }
    tbody tr { cursor: pointer; }
    tbody tr:hover { background: #f4faf7; }
    tbody tr.selected { background: #eaf7f1; }
    .product-cell {
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr);
      gap: 12px;
      align-items: center;
      min-width: 0;
    }
    .thumb, .detail-thumb {
      display: block;
      width: 58px;
      height: 58px;
      border: 1px solid var(--line);
      border-radius: 12px;
      object-fit: cover;
      background: var(--soft);
      flex: none;
    }
    .thumb-fallback {
      display: grid;
      place-items: center;
      color: var(--muted);
      font-size: 11px;
      font-weight: 900;
    }
    .product-meta { min-width: 0; }
    .product-meta strong {
      display: block;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.35;
    }
    .product-meta span {
      display: block;
      margin-top: 5px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .product-sub {
      display: block;
      margin-top: 4px;
      color: #687067;
      font-size: 12px;
      font-style: normal;
      font-weight: 850;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .score, .grade {
      display: inline-grid; place-items: center; min-width: 54px; height: 36px; border-radius: 999px;
      background: #edf6f1; color: var(--green); font-weight: 950; line-height: 1; white-space: nowrap;
    }
    .grade { width: 54px; height: 54px; border-radius: 16px; font-size: 20px; }
    .bad { background: #fff0ec; color: var(--red); }
    .mid { background: #fff7df; color: #8b6206; }
    .detail-head { display: flex; gap: 14px; align-items: center; margin-bottom: 18px; }
    .detail-thumb { width: 86px; height: 86px; border-radius: 16px; }
    .detail h2 { margin: 0; font-size: 20px; line-height: 1.35; }
    .detail p { margin: 6px 0 0; color: var(--muted); font-size: 13px; font-weight: 750; }
    .next { border: 1px solid var(--line); border-radius: 14px; background: var(--soft); padding: 14px; margin: 12px 0; }
    .next span { display: block; color: var(--muted); font-size: 12px; font-weight: 900; margin-bottom: 6px; }
    .next strong { font-size: 16px; line-height: 1.45; }
    .score-line { display: grid; gap: 7px; margin: 13px 0; }
    .score-line > div:first-child { display: flex; justify-content: space-between; gap: 10px; color: #4b5048; font-size: 13px; font-weight: 850; }
    .score-line > div:first-child strong { min-width: 46px; text-align: right; white-space: nowrap; }
    .bar { height: 9px; border-radius: 999px; background: #ece8df; overflow: hidden; }
    .bar i { display: block; height: 100%; border-radius: inherit; background: var(--green); }
    .risk-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .risk-tags span {
      border: 1px solid var(--line); border-radius: 999px; background: #fff; padding: 7px 10px;
      color: var(--muted); font-size: 12px; font-weight: 800;
    }
    .link { display: inline-flex; margin-top: 14px; color: var(--green); font-weight: 950; text-decoration: none; }
    .empty { color: var(--muted); font-weight: 800; }
    .foot { margin-top: 18px; color: var(--muted); font-size: 12px; font-weight: 700; }
    @media (max-width: 980px) {
      .topbar, .workspace, .content-grid { grid-template-columns: 1fr; }
      .topbar { align-items: flex-start; flex-direction: column; }
      .nav-pills { justify-content: flex-start; }
      .search-grid { grid-template-columns: 1fr 1fr; }
      .primary { grid-column: 1 / -1; }
      .advanced-grid, .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 640px) {
      .page { width: min(100% - 24px, 1180px); padding-top: 18px; }
      .tool-panel, .panel { padding: 20px; border-radius: 16px; }
      .hero-card { padding: 30px 4px 24px; }
      h1 { font-size: 38px; }
      .hero-card > p { font-size: 16px; }
      .search-grid, .advanced-grid, .metrics { grid-template-columns: 1fr; }
      .metric strong { font-size: 30px; }
      .top-actions { width: 100%; }
      .top-actions .secondary { flex: 1; }
      table { min-width: 0; }
      th:nth-child(2), td:nth-child(2),
      th:nth-child(3), td:nth-child(3),
      th:nth-child(4), td:nth-child(4) { display: none; }
      th:nth-child(1), td:nth-child(1) { width: auto; }
      th:nth-child(5), td:nth-child(5) { width: 72px; }
      .product-cell { grid-template-columns: 48px minmax(0, 1fr); gap: 10px; }
      .thumb { width: 48px; height: 48px; border-radius: 10px; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">R</div>
        <div>
          <strong>reportools</strong>
          <span>도매꾹 전용 소싱 도구</span>
        </div>
      </div>
      <nav class="nav-pills" aria-label="도구 메뉴">
        <button class="active" type="button">후보 발굴</button>
        <button type="button">마진 계산</button>
        <button type="button">쿠팡 점검</button>
        <button type="button">CSV 정리</button>
      </nav>
      <div class="top-actions">
        <button class="secondary round" type="button" aria-label="한국어">KR</button>
        <button class="secondary" id="logoutBtn" type="button">로그아웃</button>
      </div>
    </header>

    <section class="hero-card">
      <p class="eyebrow">DOMEGGOOK SOURCING</p>
      <h1>도매꾹 후보를 빠르게 골라냅니다</h1>
      <p>검색어 하나만 넣으면 원가, MOQ, 배송 조건, 예상 마진을 자동으로 정리해 쿠팡에 올릴 만한 후보를 먼저 보여줍니다.</p>
      <div class="mode-line">
        <span id="modePill">데이터 확인 중</span>
        <span>핵심 기준 <b>자동 적용</b></span>
        <span>고급값 <b>접기</b></span>
      </div>
    </section>

    <section class="workspace">
      <aside class="tool-list">
        <header>
          <h2>빠른 검색</h2>
          <p>자주 보는 키워드만 눌러 바로 분석합니다.</p>
        </header>
        <div id="presets"></div>
      </aside>

      <section class="tool-panel" aria-label="도매꾹 후보 분석">
        <div class="steps">
          <span><b>1</b>검색어 입력</span>
          <span><b>2</b>자동 점수화</span>
          <span><b>3</b>쿠팡 후보 확인</span>
        </div>

        <div class="search-grid">
          <label>검색어
            <input id="keyword" value="생활" autocomplete="off" placeholder="예: 생활 수납, 차량용 수납" />
          </label>
          <label>소싱처
            <select id="market">
              <option value="domeggook">도매꾹</option>
              <option value="domeme">도매매</option>
            </select>
          </label>
          <label>정렬
            <select id="sort">
              <option value="rd">추천순</option>
              <option value="lprc">낮은 가격순</option>
              <option value="date">신상품순</option>
            </select>
          </label>
          <button class="primary" id="searchBtn" type="button">후보 분석하기</button>
        </div>

        <details class="advanced">
          <summary>고급 기준값</summary>
          <div class="advanced-grid">
            <label>배송
              <select id="shipping">
                <option value="all">전체</option>
                <option value="free">무료배송 우선</option>
                <option value="company">업체배송 우선</option>
              </select>
            </label>
            <label>선호 MOQ
              <input id="maxMoq" type="number" min="1" value="3" />
            </label>
            <label>최소 원가
              <input id="minPrice" type="number" min="0" value="0" />
            </label>
            <label>최대 원가
              <input id="maxPrice" type="number" min="0" value="20000" />
            </label>
            <label>목표 마진 %
              <input id="targetMarginRate" type="number" min="5" max="80" value="28" />
            </label>
            <label>쿠팡 수수료 %
              <input id="platformFeeRate" type="number" min="0" max="35" value="12" />
            </label>
            <label>세금/운영 %
              <input id="taxAndBufferRate" type="number" min="0" max="30" value="6" />
            </label>
          </div>
        </details>

        <div class="toolbar">
          <div class="notice" id="notice">도매꾹 API 상태를 확인 중입니다.</div>
          <button class="secondary" id="exportBtn" type="button">CSV 내보내기</button>
        </div>
      </section>
    </section>

    <section class="metrics" id="metrics"></section>

    <section class="content-grid">
      <div class="panel">
        <div class="panel-head">
          <h2>후보 리스트</h2>
          <span class="source" id="sourceLabel">-</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>상품</th>
                <th>원가</th>
                <th>MOQ</th>
                <th>예상 판매가</th>
                <th>점수</th>
              </tr>
            </thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
      </div>

      <aside class="panel detail" id="detail"></aside>
    </section>

    <p class="foot" id="sourceNote">자료: 도매꾹 API 또는 샘플 데이터. 실제 등록 전 쿠팡 가격과 상세페이지를 다시 확인하세요.</p>
  </main>

  <script>
    const AUTH_ENABLED = ${isAuthEnabled() ? "true" : "false"};
    const presets = ["생활 수납", "차량용 수납", "주방 정리", "케이블 정리", "캠핑 조명"];
    const state = { items: [], selectedNo: null, source: "sample" };
    const $ = (id) => document.getElementById(id);
    const fmt = new Intl.NumberFormat("ko-KR");

    $("logoutBtn").hidden = !AUTH_ENABLED;
    $("logoutBtn").addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      location.href = "/login";
    });

    $("presets").innerHTML = presets.map((word) => '<button type="button" data-keyword="' + word + '">' + word + '</button>').join("");
    document.querySelectorAll("#presets button").forEach((button) => {
      button.addEventListener("click", () => {
        $("keyword").value = button.dataset.keyword;
        search();
      });
    });

    $("searchBtn").addEventListener("click", search);
    $("exportBtn").addEventListener("click", exportCsv);
    $("keyword").addEventListener("keydown", (event) => {
      if (event.key === "Enter") search();
    });

    async function search() {
      const query = new URLSearchParams({
        keyword: $("keyword").value.trim() || "생활",
        market: $("market").value,
        sort: $("sort").value,
        size: "80",
        targetMarginRate: $("targetMarginRate").value,
        platformFeeRate: $("platformFeeRate").value,
        taxAndBufferRate: $("taxAndBufferRate").value,
        maxPreferredMoq: $("maxMoq").value
      });
      const minPrice = Number($("minPrice").value || 0);
      const maxPrice = Number($("maxPrice").value || 0);
      if (minPrice > 0) query.set("mnp", String(minPrice));
      if (maxPrice > 0) query.set("mxp", String(maxPrice));
      if (Number($("maxMoq").value || 0) > 0) query.set("mxq", $("maxMoq").value);
      if ($("shipping").value === "free") query.set("fdl", "1");
      if ($("shipping").value === "company") query.set("sgd", "1");

      $("searchBtn").disabled = true;
      $("searchBtn").textContent = "분석 중";
      $("notice").className = "notice";
      $("notice").textContent = "도매꾹 후보를 불러오고 있습니다.";

      try {
        const response = await fetch("/api/domeggook/search?" + query.toString());
        const data = await response.json();
        state.items = Array.isArray(data.items) ? data.items : [];
        state.source = data.source || "sample";
        state.selectedNo = state.items[0]?.no || null;
        $("modePill").textContent = state.source === "domeggook" ? "도매꾹 API 연결됨" : "샘플 데이터";
        $("notice").className = state.source === "domeggook" ? "notice ok" : "notice";
        $("notice").textContent = data.message || "도매꾹 API로 받은 결과입니다.";
        render(data.keyword || $("keyword").value);
      } catch (error) {
        $("notice").className = "notice";
        $("notice").textContent = "분석 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.";
      } finally {
        $("searchBtn").disabled = false;
        $("searchBtn").textContent = "후보 분석하기";
      }
    }

    function render(keyword) {
      const items = state.items;
      const best = items[0];
      const avgMargin = items.length ? Math.round(items.reduce((sum, item) => sum + Number(item.expectedMarginRate || 0), 0) / items.length) : 0;
      const valid = items.filter((item) => item.grade === "A" || item.grade === "B").length;
      const moq = best ? best.moq : "-";
      $("sourceLabel").textContent = (state.source === "domeggook" ? "도매꾹 API" : "샘플 데이터") + (keyword ? " / " + keyword : "");
      $("metrics").innerHTML =
        metric("분석 상품", items.length || 0) +
        metric("검토 후보", valid) +
        metric("최고 점수", best ? best.totalScore : "-") +
        metric("평균 마진", avgMargin + "%") +
        metric("추천 MOQ", moq);
      renderRows(items);
    }

    function metric(label, value) {
      return '<div class="metric"><span>' + esc(label) + '</span><strong>' + esc(value) + '</strong></div>';
    }

    function renderRows(items) {
      if (!items.length) {
        $("tbody").innerHTML = '<tr><td colspan="8" class="empty">검색 결과가 없습니다.</td></tr>';
        $("detail").innerHTML = '<p class="empty">검색어를 바꿔 다시 분석해보세요.</p>';
        return;
      }
      $("tbody").innerHTML = items.slice(0, 12).map((item) => {
        const selected = item.no === state.selectedNo ? "selected" : "";
        const seller = item.sellerNick || item.sellerId || "판매자 확인 필요";
        const meta = "배송 " + money(item.deliveryFee) + " / 마진 " + item.expectedMarginRate + "% / " + item.verdict;
        return '<tr class="' + selected + '" data-no="' + esc(item.no) + '">' +
          '<td><div class="product-cell">' + imageHtml(item.thumb, "thumb") + '<div class="product-meta"><strong>' + esc(item.title) + '</strong><span>' + esc(seller) + '</span><span class="product-sub">' + esc(meta) + '</span></div></div></td>' +
          '<td>' + money(item.price) + '</td>' +
          '<td>' + esc(item.moq) + '</td>' +
          '<td>' + money(item.expectedSellPrice) + '</td>' +
          '<td><span class="score ' + gradeClass(item.grade) + '">' + esc(item.totalScore) + '</span></td>' +
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
        $("detail").innerHTML = '<p class="empty">선택한 상품이 없습니다.</p>';
        return;
      }
      const risks = item.risks?.length ? item.risks.map((risk) => '<span>' + esc(risk) + '</span>').join("") : "<span>기본 리스크 낮음</span>";
      $("detail").innerHTML =
        '<div class="detail-head">' + imageHtml(item.thumb, "detail-thumb") + '<div><div class="grade ' + gradeClass(item.grade) + '">' + esc(item.grade) + '</div><h2>' + esc(item.title) + '</h2><p>상품번호 ' + esc(item.no) + '</p></div></div>' +
        '<div class="next"><span>다음 행동</span><strong>' + esc(item.nextAction) + '</strong></div>' +
        scoreLine("수요 적합", item.demandScore, 25) +
        scoreLine("수익성", item.marginScore, 30) +
        scoreLine("경쟁 완화", item.competitionScore, 15) +
        scoreLine("공급 안정", item.supplyScore, 20) +
        scoreLine("리스크 낮음", item.riskScore, 10) +
        '<div class="next"><span>입고 기준 원가</span><strong>' + money(item.landedCost) + '</strong></div>' +
        '<div class="risk-tags">' + risks + '</div>' +
        '<a class="link" target="_blank" rel="noreferrer" href="' + esc(item.url || "https://domeggook.com") + '">도매꾹 상품 보기</a>';
    }

    function scoreLine(label, value, max) {
      const width = Math.max(0, Math.min(100, Math.round((Number(value || 0) / max) * 100)));
      return '<div class="score-line"><div><span>' + label + '</span><strong>' + esc(value) + '/' + max + '</strong></div><div class="bar"><i style="width:' + width + '%"></i></div></div>';
    }

    function imageHtml(src, className) {
      const value = String(src || "");
      if (!/^https?:\\/\\//i.test(value)) {
        return '<div class="' + esc(className) + ' thumb-fallback">이미지</div>';
      }
      return '<img class="' + esc(className) + '" src="' + esc(value) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility=\\'hidden\\'" />';
    }

    function exportCsv() {
      if (!state.items.length) return;
      const headers = ["상품번호", "상품명", "원가", "MOQ", "배송비", "입고기준원가", "예상판매가", "예상마진", "점수", "등급", "판단", "다음행동", "이미지", "URL"];
      const rows = state.items.map((item) => [item.no, item.title, item.price, item.moq, item.deliveryFee, item.landedCost, item.expectedSellPrice, item.expectedMarginRate, item.totalScore, item.grade, item.verdict, item.nextAction, item.thumb || "", item.url || ""]);
      const csv = [headers, ...rows].map((row) => row.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(",")).join("\\n");
      const blob = new Blob(["\\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "reportools_" + ($("keyword").value || "products") + ".csv";
      anchor.click();
      URL.revokeObjectURL(url);
    }

    function gradeClass(grade) {
      if (grade === "A") return "";
      if (grade === "B") return "mid";
      return "bad";
    }

    function money(value) {
      const number = Number(value || 0);
      return fmt.format(number) + "원";
    }

    function esc(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char]));
    }

    search();
  </script>
</body>
</html>`;
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
        scoreLine("수요 적합", item.demandScore, 25) +
        scoreLine("수익성", item.marginScore, 30) +
        scoreLine("경쟁 완화", item.competitionScore, 15) +
        scoreLine("공급 안정", item.supplyScore, 20) +
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
