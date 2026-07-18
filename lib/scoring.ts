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
  const thumb = normalizeImageUrl(pickString(item, ["thumb", "img", "image", "itemImg", "listImg", "mainImg", "smallImg"]));

  return {
    no: String(item.no ?? ""),
    title: String(item.title ?? "").trim(),
    price: parseNumber(item.price),
    priceOrg: item.priceOrg ? parseNumber(item.priceOrg) : undefined,
    thumb,
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
  const sellPriceDenominator = Math.max(0.35, 1 - (settings.platformFeeRate + settings.taxAndBufferRate + settings.targetMarginRate) / 100);
  const expectedSellPrice = Math.ceil((landedCost / sellPriceDenominator) / 100) * 100;
  const platformFee = expectedSellPrice * (settings.platformFeeRate / 100);
  const buffer = expectedSellPrice * (settings.taxAndBufferRate / 100);
  const expectedProfit = Math.round(expectedSellPrice - landedCost - platformFee - buffer);
  const expectedMarginRate = expectedSellPrice > 0 ? Math.round((expectedProfit / expectedSellPrice) * 1000) / 10 : 0;

  const demandScore = estimateDemandScore(product);
  const marginScore = scoreMargin(expectedMarginRate, expectedProfit, settings);
  const competitionScore = scoreCompetition(product);
  const supplyScore = scoreSupply(product, settings);
  const riskScore = scoreRisk(product, settings);
  const totalScore = clamp(demandScore + marginScore + competitionScore + supplyScore + riskScore, 0, 100);
  const risks = getRisks(product, settings, expectedMarginRate);
  const grade = totalScore >= 78 ? "A" : totalScore >= 64 ? "B" : totalScore >= 50 ? "C" : "D";

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
    verdict: verdictFor(grade, risks),
    nextAction: nextActionFor(grade, risks)
  };
}

function estimateDemandScore(product: RawProduct): number {
  const title = product.title.replace(/\s+/g, " ");
  const hasUseKeyword = /(무타공|정리|수납|차량|주방|욕실|캠핑|펫|고양이|책상|케이블|생활|선반|클립|홀더|쓰레기통|보호|필름|파우치|커버|거치대)/.test(title);
  const hasModelOrUseCase = /([A-Z]{1,4}\d{1,4}|아이폰|갤럭시|프로|미니|플러스|울트라|휴대용|여행용)/i.test(title);
  const hasSpecificShape = title.length >= 12 && /\s/.test(title);
  const base = hasUseKeyword ? 20 : 14;
  return clamp(base + (hasSpecificShape ? 4 : 0) + (hasModelOrUseCase ? 3 : 0) + (product.thumb ? 2 : 0) + (product.lowPriceChecked ? 1 : 0), 0, 30);
}

function scoreMargin(expectedMarginRate: number, expectedProfit: number, settings: ScoreSettings): number {
  const target = Math.max(settings.targetMarginRate, 1);
  const rateScore = Math.round((expectedMarginRate / target) * 20);
  const profitBonus = expectedProfit >= 2500 ? 5 : expectedProfit >= 1200 ? 3 : expectedProfit >= 500 ? 1 : 0;
  return clamp(rateScore + profitBonus, 0, 25);
}

function scoreCompetition(product: RawProduct): number {
  let score = 14;
  if (product.lowPriceChecked) score += 3;
  if (product.comOnly) score += 2;
  if (product.title.length >= 18 && product.title.length <= 80) score += 1;
  if (product.adultOnly || product.fromOversea) score -= 3;
  return clamp(score, 0, 20);
}

function scoreSupply(product: RawProduct, settings: ScoreSettings): number {
  let score = 13;
  if (product.moq <= 1) score += 3;
  else if (product.moq <= settings.maxPreferredMoq) score += 2;
  else if (product.moq > settings.maxPreferredMoq * 3) score -= 5;
  else score -= 3;
  if (product.deliveryFee === 0 || product.deliveryWho === "S") score += 2;
  if (product.deliveryWho === "B" || product.deliveryWho === "C") score -= 3;
  if (product.deliveryAdd) score -= 3;
  if (product.fromOversea) score -= 4;
  if (product.comOnly) score += 1;
  return clamp(score, 0, 17);
}

function scoreRisk(product: RawProduct, settings: ScoreSettings): number {
  let score = 10;
  if (product.adultOnly) score -= 7;
  if (product.fromOversea) score -= 4;
  if (product.deliveryAdd || product.deliveryFee > product.price * 0.45) score -= 2;
  if (product.moq > settings.maxPreferredMoq * 3) score -= 2;
  if (!product.thumb) score -= 2;
  if (!product.url) score -= 1;
  return clamp(score, 0, 10);
}

function getRisks(product: RawProduct, settings: ScoreSettings, expectedMarginRate: number): ScoredProduct["risks"] {
  const risks: ScoredProduct["risks"] = [];
  if (product.adultOnly) risks.push("성인상품");
  if (product.fromOversea) risks.push("해외직배송");
  if (product.deliveryAdd || product.deliveryFee > product.price * 0.45) risks.push("배송비증가");
  if (product.moq > settings.maxPreferredMoq) risks.push("MOQ높음");
  if (expectedMarginRate < settings.targetMarginRate - 7) risks.push("마진낮음");
  if (!product.thumb) risks.push("이미지확인");
  if (!product.comOnly && !product.lowPriceChecked) risks.push("도매꾹조건확인");
  return risks;
}

function verdictFor(grade: ScoredProduct["grade"], risks: ScoredProduct["risks"]): string {
  if (grade === "A") return "우선 검토";
  if (grade === "B") return risks.length ? "조건부 검토" : "후보 보관";
  if (grade === "C") return "추가 확인";
  return "제외 권장";
}

function nextActionFor(grade: ScoredProduct["grade"], risks: ScoredProduct["risks"]): string {
  if (grade === "A") return "쿠팡 상위 가격과 리뷰 수만 확인";
  if (risks.includes("마진낮음")) return "판매가를 올려도 팔릴 키워드인지 확인";
  if (risks.includes("MOQ높음")) return "초기 테스트 수량을 낮출 수 있는 공급처 확인";
  if (grade === "B") return "상품 상세와 배송 조건 확인 후 보관";
  return "시간을 쓰지 말고 다음 후보로 이동";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pickString(item: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function normalizeImageUrl(value: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("//")) return `https:${value}`;
  if (/^https?:\/\//i.test(value)) return value;
  return undefined;
}
