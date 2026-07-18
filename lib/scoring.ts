import type { RawProduct, ScoredProduct, ScoreSettings } from "@/types/product";

export const defaultScoreSettings: ScoreSettings = {
  targetMarginRate: 28,
  platformFeeRate: 12,
  taxAndBufferRate: 6,
  maxPreferredMoq: 3
};

export function parseNumber(value: unknown, fallback = 0): number {
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function normalizeDomeggookItem(item: Record<string, unknown>): RawProduct {
  const deli = (item.deli ?? {}) as Record<string, unknown>;
  const market = (item.market ?? {}) as Record<string, unknown>;

  return {
    no: String(item.no ?? ""),
    title: String(item.title ?? "").trim(),
    price: parseNumber(item.price),
    priceOrg: item.priceOrg ? parseNumber(item.priceOrg) : undefined,
    thumb: item.thumb ? String(item.thumb).trim() : undefined,
    sellerId: item.id ? String(item.id) : undefined,
    sellerNick: item.nick ? String(item.nick) : undefined,
    moq: Math.max(parseNumber(item.unitQty, 1), 1),
    comOnly: item.comOnly === true || String(item.comOnly) === "true",
    adultOnly: item.adultOnly === true || String(item.adultOnly) === "true",
    lowPriceChecked: item.lwp === true || String(item.lwp) === "true",
    deliveryWho: ["S", "P", "B", "C"].includes(String(deli.who)) ? (String(deli.who) as RawProduct["deliveryWho"]) : "",
    deliveryFee: parseNumber(deli.fee),
    deliveryAdd: deli.add === true || String(deli.add) === "true",
    fromOversea: deli.fromOversea === true || String(deli.fromOversea) === "true",
    url: item.url ? String(item.url).trim() : undefined,
    market: {
      domeggook: market.domeggook === true || String(market.domeggook) === "true",
      supply: market.supply === true || String(market.supply) === "true"
    }
  };
}

export function scoreProduct(product: RawProduct, settings: ScoreSettings = defaultScoreSettings): ScoredProduct {
  const shippingCost = product.deliveryWho === "S" ? 0 : product.deliveryFee;
  const landedCost = Math.round(product.price + shippingCost / Math.max(product.moq, 1));
  const expectedSellPrice = Math.ceil((landedCost * (1 + settings.targetMarginRate / 100)) / 100) * 100;
  const platformFee = expectedSellPrice * (settings.platformFeeRate / 100);
  const buffer = expectedSellPrice * (settings.taxAndBufferRate / 100);
  const expectedProfit = Math.round(expectedSellPrice - landedCost - platformFee - buffer);
  const expectedMarginRate = expectedSellPrice > 0 ? Math.round((expectedProfit / expectedSellPrice) * 1000) / 10 : 0;

  const marginScore = clamp(Math.round((expectedMarginRate / 30) * 25), 0, 25);
  const demandScore = estimateDemandScore(product);
  const competitionScore = product.lowPriceChecked ? 14 : 20;
  const supplyScore = scoreSupply(product, settings);
  const riskScore = scoreRisk(product, settings);
  const totalScore = clamp(demandScore + marginScore + competitionScore + supplyScore + riskScore, 0, 100);
  const risks = getRisks(product, settings, expectedMarginRate);
  const grade = totalScore >= 80 ? "A" : totalScore >= 65 ? "B" : totalScore >= 50 ? "C" : "D";

  return {
    ...product,
    landedCost,
    expectedSellPrice,
    expectedProfit,
    expectedMarginRate,
    demandScore,
    marginScore,
    competitionScore,
    supplyScore,
    riskScore,
    totalScore,
    grade,
    risks,
    verdict: verdictFor(grade, risks)
  };
}

function estimateDemandScore(product: RawProduct): number {
  const title = product.title.replace(/\s+/g, " ");
  const hasClearUse = /(무타공|정리|수납|차량|주방|욕실|캠핑|펫|책상|케이블|생활)/.test(title);
  const tooGeneric = title.length < 8;
  const base = hasClearUse ? 23 : 17;
  const lwpBoost = product.lowPriceChecked ? 3 : 0;
  return clamp(base + lwpBoost - (tooGeneric ? 5 : 0), 0, 30);
}

function scoreSupply(product: RawProduct, settings: ScoreSettings): number {
  let score = 15;
  if (product.moq > settings.maxPreferredMoq) score -= 5;
  if (product.deliveryWho === "B" || product.deliveryWho === "C") score -= 2;
  if (product.deliveryAdd) score -= 3;
  if (product.fromOversea) score -= 4;
  if (product.comOnly) score += 1;
  return clamp(score, 0, 15);
}

function scoreRisk(product: RawProduct, settings: ScoreSettings): number {
  let score = 10;
  if (product.adultOnly) score -= 6;
  if (product.fromOversea) score -= 4;
  if (product.deliveryAdd) score -= 2;
  if (product.moq > settings.maxPreferredMoq * 3) score -= 2;
  if (!product.thumb) score -= 2;
  return clamp(score, 0, 10);
}

function getRisks(product: RawProduct, settings: ScoreSettings, expectedMarginRate: number): ScoredProduct["risks"] {
  const risks: ScoredProduct["risks"] = [];
  if (product.adultOnly) risks.push("성인상품");
  if (product.fromOversea) risks.push("해외직배송");
  if (product.deliveryAdd) risks.push("배송비증가");
  if (product.moq > settings.maxPreferredMoq) risks.push("MOQ높음");
  if (expectedMarginRate < 18) risks.push("마진낮음");
  if (!product.thumb) risks.push("이미지확인");
  return risks;
}

function verdictFor(grade: ScoredProduct["grade"], risks: ScoredProduct["risks"]): string {
  if (grade === "A") return "우선 검토";
  if (grade === "B") return risks.length ? "조건부 검토" : "후보 보관";
  if (grade === "C") return "추가 확인";
  return "제외 권장";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
