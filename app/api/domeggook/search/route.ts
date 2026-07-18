import { NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";
import { defaultScoreSettings, normalizeArray, normalizeDomeggookItem, scoreProduct } from "@/lib/scoring";
import type { MarketType, RawProduct, ScoreSettings } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.DOMEGGOOK_API_KEY;
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

    return NextResponse.json({
      source: apiKey ? "domeggook" : "sample",
      keyword,
      market,
      count: scored.length,
      items: scored
    });
  } catch (error) {
    return NextResponse.json(
      {
        source: "error",
        message: error instanceof Error ? error.message : "도매꾹 API 호출 중 오류가 발생했습니다.",
        items: filterMockProducts(keyword, market).map((item) => scoreProduct(item, settings))
      },
      { status: 502 }
    );
  }
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
  copyOptionalParam(input.searchParams, params, "org");
  copyOptionalBoolean(input.searchParams, params, "sgd");
  copyOptionalBoolean(input.searchParams, params, "fdl");
  copyOptionalBoolean(input.searchParams, params, "lwp");
  copyOptionalBoolean(input.searchParams, params, "dfos");

  const response = await fetch(`https://domeggook.com/ssl/api/?${params.toString()}`, {
    headers: {
      accept: "application/json"
    },
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

function filterMockProducts(keyword: string, market: MarketType): RawProduct[] {
  const normalized = keyword.trim().toLowerCase();
  return mockProducts.filter((item) => {
    const matchesKeyword = !normalized || item.title.toLowerCase().includes(normalized) || normalized === "생활";
    const matchesMarket = market === "dome" ? item.market.domeggook : item.market.supply;
    return matchesKeyword && matchesMarket;
  });
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
