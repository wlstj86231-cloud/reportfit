export type MarketType = "dome" | "supply";

export type ProductRisk =
  | "성인상품"
  | "해외직배송"
  | "배송비증가"
  | "MOQ높음"
  | "마진낮음"
  | "이미지확인"
  | "도매꾹조건확인"
  | "저가소액"
  | "초기자금부담"
  | "인증위험"
  | "브랜드키워드"
  | "시즌성"
  | "상품명부실";

export interface RawProduct {
  no: string;
  title: string;
  price: number;
  priceOrg?: number;
  thumb?: string;
  sellerId?: string;
  sellerNick?: string;
  moq: number;
  comOnly: boolean;
  adultOnly: boolean;
  lowPriceChecked: boolean;
  deliveryWho: "S" | "P" | "B" | "C" | "";
  deliveryFee: number;
  deliveryAdd: boolean;
  fromOversea: boolean;
  url?: string;
  market: {
    domeggook: boolean;
    supply: boolean;
  };
}

export interface ScoreSettings {
  targetMarginRate: number;
  platformFeeRate: number;
  taxAndBufferRate: number;
  maxPreferredMoq: number;
}

export interface ScoredProduct extends RawProduct {
  landedCost: number;
  expectedSellPrice: number;
  expectedProfit: number;
  expectedMarginRate: number;
  demandScore: number;
  marginScore: number;
  competitionScore: number;
  supplyScore: number;
  riskScore: number;
  totalScore: number;
  grade: "A" | "B" | "C" | "D";
  risks: ProductRisk[];
  verdict: string;
  nextAction: string;
}
