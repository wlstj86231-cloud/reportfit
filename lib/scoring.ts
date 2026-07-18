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
  const perUnitShipping = shippingCost / Math.max(product.moq, 1);
  const landedCost = Math.round(product.price + perUnitShipping);
  const sellPriceDenominator = Math.max(0.35, 1 - (settings.platformFeeRate + settings.taxAndBufferRate + settings.targetMarginRate) / 100);
  const expectedSellPrice = Math.ceil((landedCost / sellPriceDenominator) / 100) * 100;
  const platformFee = expectedSellPrice * (settings.platformFeeRate / 100);
  const buffer = expectedSellPrice * (settings.taxAndBufferRate / 100);
  const expectedProfit = Math.round(expectedSellPrice - landedCost - platformFee - buffer);
  const expectedMarginRate = expectedSellPrice > 0 ? Math.round((expectedProfit / expectedSellPrice) * 1000) / 10 : 0;
  const context: ProductScoreContext = buildScoreContext(product, {
    expectedProfit,
    expectedSellPrice,
    landedCost,
    perUnitShipping,
    shippingCost
  });

  const demandScore = estimateDemandScore(product, context);
  const marginScore = scoreMargin(expectedMarginRate, expectedProfit, context, settings);
  const competitionScore = scoreCompetition(product, context);
  const supplyScore = scoreSupply(product, context, settings);
  const riskScore = scoreRisk(product, context, settings);
  const risks = getRisks(product, settings, expectedMarginRate, context);
  const uncappedScore = clamp(demandScore + marginScore + competitionScore + supplyScore + riskScore, 0, 100);
  const totalScore = applyPracticalCaps(uncappedScore, product, context);
  const grade = totalScore >= 85 ? "A" : totalScore >= 72 ? "B" : totalScore >= 58 ? "C" : "D";

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

interface ProductScoreContext {
  title: string;
  expectedProfit: number;
  expectedSellPrice: number;
  landedCost: number;
  perUnitShipping: number;
  shippingRatio: number;
  purchaseAmount: number;
  capitalReturnRate: number;
  titleQuality: "good" | "weak" | "bad";
  hasEvergreenKeyword: boolean;
  hasProblemSolverKeyword: boolean;
  hasSpecificUseCase: boolean;
  hasDifferentiator: boolean;
  hasRegulatoryRisk: boolean;
  hasBrandKeyword: boolean;
  hasSeasonalRisk: boolean;
}

function buildScoreContext(
  product: RawProduct,
  input: {
    expectedProfit: number;
    expectedSellPrice: number;
    landedCost: number;
    perUnitShipping: number;
    shippingCost: number;
  }
): ProductScoreContext {
  const title = product.title.replace(/\s+/g, " ").trim();
  const titleQuality = title.length < 10 || !/\s/.test(title) ? "bad" : title.length > 95 ? "weak" : "good";
  const purchaseAmount = Math.round(product.price * Math.max(product.moq, 1) + input.shippingCost);
  const shippingRatio = product.price > 0 ? input.perUnitShipping / product.price : 1;
  const capitalReturnRate = purchaseAmount > 0 ? input.expectedProfit / purchaseAmount : 0;

  return {
    title,
    expectedProfit: input.expectedProfit,
    expectedSellPrice: input.expectedSellPrice,
    landedCost: input.landedCost,
    perUnitShipping: input.perUnitShipping,
    shippingRatio,
    purchaseAmount,
    capitalReturnRate,
    titleQuality,
    hasEvergreenKeyword: /(정리|수납|주방|욕실|차량|캠핑|생활|청소|보관|케이블|파우치|거치대|선반|보호|필름|케이스|홀더|클립|무타공|방수)/.test(title),
    hasProblemSolverKeyword: /(간편|접이식|휴대용|미니|대용량|자석|논슬립|방수|먼지|틈새|고정|분리|충전|호환|세트|리필)/.test(title),
    hasSpecificUseCase: /([A-Z]{1,5}\d{1,5}|아이폰|갤럭시|프로|플러스|울트라|차박|여행용|주방용|차량용|캠핑용)/i.test(title),
    hasDifferentiator: /(세트|1\+1|대용량|초경량|접이식|무타공|자석|방수|논슬립|호환|리필|국산|스테인리스|실리콘)/.test(title),
    hasRegulatoryRisk: /(KC|어린이|유아|아동|식품|건강|다이어트|영양|화장품|의료|마스크|전기|충전기|배터리|살균|소독|의약|반려동물\s*사료)/i.test(title),
    hasBrandKeyword: /(아이폰|갤럭시|애플|삼성|나이키|아디다스|디즈니|산리오|캐릭터|정품|호환)/i.test(title),
    hasSeasonalRisk: /(크리스마스|할로윈|추석|설날|여름|겨울|장마|휴가|입학|졸업|어버이날|어린이날|발렌타인|빼빼로)/.test(title)
  };
}

function estimateDemandScore(product: RawProduct, context: ProductScoreContext): number {
  let score = 8;
  if (context.hasEvergreenKeyword) score += 6;
  if (context.hasProblemSolverKeyword) score += 4;
  if (context.hasSpecificUseCase) score += 3;
  if (context.hasDifferentiator) score += 2;
  if (context.titleQuality === "good") score += 3;
  if (product.thumb) score += 2;
  if (context.expectedSellPrice >= 8000 && context.expectedSellPrice <= 35000) score += 2;
  if (context.titleQuality === "bad") score -= 4;
  if (context.hasSeasonalRisk) score -= 4;
  if (context.hasRegulatoryRisk) score -= 3;
  if (context.expectedSellPrice > 70000) score -= 2;
  return clamp(score, 0, 25);
}

function scoreMargin(expectedMarginRate: number, expectedProfit: number, context: ProductScoreContext, settings: ScoreSettings): number {
  let score = 0;
  score += expectedProfit >= 6000 ? 12 : expectedProfit >= 3500 ? 10 : expectedProfit >= 2000 ? 8 : expectedProfit >= 1200 ? 5 : expectedProfit >= 700 ? 3 : 1;
  score += expectedMarginRate >= settings.targetMarginRate + 3 ? 6 : expectedMarginRate >= settings.targetMarginRate ? 5 : expectedMarginRate >= settings.targetMarginRate - 5 ? 3 : 1;
  score += context.expectedSellPrice >= 9000 && context.expectedSellPrice <= 35000 ? 5 : context.expectedSellPrice >= 5000 && context.expectedSellPrice <= 55000 ? 3 : 1;
  score += context.shippingRatio <= 0.2 ? 3 : context.shippingRatio <= 0.45 ? 2 : context.shippingRatio <= 0.7 ? 1 : 0;
  score += context.capitalReturnRate >= 0.45 ? 4 : context.capitalReturnRate >= 0.3 ? 3 : context.capitalReturnRate >= 0.2 ? 2 : 0;
  return clamp(score, 0, 30);
}

function scoreCompetition(product: RawProduct, context: ProductScoreContext): number {
  let score = 7;
  if (product.lowPriceChecked) score += 2;
  if (product.comOnly) score += 1;
  if (context.titleQuality === "good") score += 2;
  if (context.hasDifferentiator) score += 2;
  if (context.hasSpecificUseCase) score += 1;
  if (!product.comOnly && !product.lowPriceChecked) score -= 2;
  if (context.hasBrandKeyword) score -= 1;
  if (context.hasRegulatoryRisk) score -= 2;
  if (context.hasSeasonalRisk) score -= 2;
  if (product.adultOnly || product.fromOversea) score -= 3;
  return clamp(score, 0, 15);
}

function scoreSupply(product: RawProduct, context: ProductScoreContext, settings: ScoreSettings): number {
  let score = 0;
  score += product.moq <= 1 ? 6 : product.moq <= settings.maxPreferredMoq ? 5 : product.moq <= settings.maxPreferredMoq * 2 ? 3 : product.moq <= settings.maxPreferredMoq * 4 ? 1 : 0;
  score += context.purchaseAmount <= 25000 ? 5 : context.purchaseAmount <= 50000 ? 3 : context.purchaseAmount <= 90000 ? 1 : 0;
  score += product.deliveryFee === 0 || product.deliveryWho === "S" ? 4 : context.shippingRatio <= 0.2 ? 3 : context.shippingRatio <= 0.45 ? 1 : 0;
  if (!product.deliveryAdd) score += 3;
  if (!product.fromOversea) score += 2;
  if (product.deliveryWho === "B" || product.deliveryWho === "C") score -= 2;
  if (product.comOnly) score += 1;
  return clamp(score, 0, 20);
}

function scoreRisk(product: RawProduct, context: ProductScoreContext, settings: ScoreSettings): number {
  let score = 10;
  if (product.adultOnly) score -= 6;
  if (product.fromOversea) score -= 3;
  if (context.hasRegulatoryRisk) score -= 3;
  if (context.hasSeasonalRisk) score -= 2;
  if (context.shippingRatio > 0.7) score -= 2;
  else if (context.shippingRatio > 0.45) score -= 1;
  if (product.deliveryAdd) score -= 1;
  if (product.moq > settings.maxPreferredMoq * 3 || context.purchaseAmount > 90000) score -= 2;
  if (context.expectedProfit < 700) score -= 2;
  if (context.titleQuality === "bad") score -= 1;
  if (!product.thumb) score -= 2;
  if (!product.url) score -= 1;
  return clamp(score, 0, 10);
}

function applyPracticalCaps(score: number, product: RawProduct, context: ProductScoreContext): number {
  let cap = 100;
  if (product.adultOnly) cap = Math.min(cap, 45);
  if (product.fromOversea) cap = Math.min(cap, 60);
  if (context.hasRegulatoryRisk) cap = Math.min(cap, 68);
  if (context.expectedProfit < 700) cap = Math.min(cap, 62);
  else if (context.expectedProfit < 1200) cap = Math.min(cap, 74);
  if (context.shippingRatio > 0.7) cap = Math.min(cap, 68);
  else if (context.shippingRatio > 0.45) cap = Math.min(cap, 78);
  if (context.purchaseAmount > 100000) cap = Math.min(cap, 72);
  else if (context.purchaseAmount > 60000) cap = Math.min(cap, 82);
  if (!product.thumb) cap = Math.min(cap, 72);
  if (context.hasSeasonalRisk) cap = Math.min(cap, 76);
  if (context.titleQuality === "bad") cap = Math.min(cap, 70);
  return Math.min(score, cap);
}

function getRisks(product: RawProduct, settings: ScoreSettings, expectedMarginRate: number, context: ProductScoreContext): ScoredProduct["risks"] {
  const risks: ScoredProduct["risks"] = [];
  if (product.adultOnly) risks.push("성인상품");
  if (product.fromOversea) risks.push("해외직배송");
  if (product.deliveryAdd || context.shippingRatio > 0.45) risks.push("배송비증가");
  if (product.moq > settings.maxPreferredMoq) risks.push("MOQ높음");
  if (expectedMarginRate < settings.targetMarginRate - 7) risks.push("마진낮음");
  if (!product.thumb) risks.push("이미지확인");
  if (!product.comOnly && !product.lowPriceChecked) risks.push("도매꾹조건확인");
  if (context.expectedProfit < 1200 || context.expectedSellPrice < 7000) risks.push("저가소액");
  if (context.purchaseAmount > 60000) risks.push("초기자금부담");
  if (context.hasRegulatoryRisk) risks.push("인증위험");
  if (context.hasBrandKeyword) risks.push("브랜드키워드");
  if (context.hasSeasonalRisk) risks.push("시즌성");
  if (context.titleQuality !== "good") risks.push("상품명부실");
  return risks;
}

function verdictFor(grade: ScoredProduct["grade"], risks: ScoredProduct["risks"]): string {
  if (grade === "A") return "우선 검토";
  if (grade === "B") return risks.length ? "조건부 테스트" : "테스트 후보";
  if (grade === "C") return "추가 확인";
  return "제외 권장";
}

function nextActionFor(grade: ScoredProduct["grade"], risks: ScoredProduct["risks"]): string {
  if (risks.includes("성인상품") || risks.includes("인증위험")) return "인증·판매 제한 가능성이 있어 우선순위를 낮추기";
  if (risks.includes("저가소액")) return "묶음 구성이나 세트 판매가 가능한지 먼저 확인";
  if (risks.includes("초기자금부담")) return "첫 주문 전 최소 발주 수량을 낮출 수 있는지 확인";
  if (risks.includes("배송비증가")) return "배송비 포함 판매가가 쿠팡에서 통할지 확인";
  if (risks.includes("시즌성")) return "시즌 종료 전 판매 가능한 기간인지 확인";
  if (risks.includes("브랜드키워드")) return "상표·호환 표기 리스크를 상세페이지에서 확인";
  if (grade === "A") return "쿠팡 상위 가격과 리뷰 수만 확인";
  if (risks.includes("마진낮음")) return "판매가를 올려도 팔릴 키워드인지 확인";
  if (risks.includes("MOQ높음")) return "초기 테스트 수량을 낮출 수 있는 공급처 확인";
  if (grade === "B") return "상세페이지 품질과 쿠팡 최저가만 확인 후 테스트";
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
