"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  BarChart3,
  CheckCircle2,
  Filter,
  KeyRound,
  Loader2,
  LogOut,
  Search,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import type { ScoredProduct } from "@/types/product";

type ApiSource = "sample" | "domeggook" | "error";

interface SearchState {
  keyword: string;
  market: "dome" | "supply";
  sort: string;
  maxMoq: number;
  minPrice: number;
  maxPrice: number;
  shipping: string;
  fastOnly: boolean;
  lowPriceOnly: boolean;
  targetMarginRate: number;
  platformFeeRate: number;
  taxAndBufferRate: number;
}

interface ApiResponse {
  source: ApiSource;
  keyword: string;
  market: "dome" | "supply";
  count?: number;
  message?: string;
  items: ScoredProduct[];
}

const defaultSearch: SearchState = {
  keyword: "생활",
  market: "dome",
  sort: "rd",
  maxMoq: 3,
  minPrice: 0,
  maxPrice: 20000,
  shipping: "",
  fastOnly: false,
  lowPriceOnly: false,
  targetMarginRate: 28,
  platformFeeRate: 12,
  taxAndBufferRate: 6
};

const keywordPresets = ["무타공 선반", "차량용 수납", "주방 정리", "케이블 정리", "캠핑 조명"];

export default function Home() {
  const [search, setSearch] = useState<SearchState>(defaultSearch);
  const [items, setItems] = useState<ScoredProduct[]>([]);
  const [source, setSource] = useState<ApiSource>("sample");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNo, setSelectedNo] = useState<string | null>(null);

  const selected = useMemo(
    () => items.find((item) => item.no === selectedNo) ?? items[0],
    [items, selectedNo]
  );

  const metrics = useMemo(() => {
    const count = items.length;
    const top = items[0]?.totalScore ?? 0;
    const avgMargin = count ? Math.round(items.reduce((sum, item) => sum + item.expectedMarginRate, 0) / count) : 0;
    const priorityCount = items.filter((item) => item.grade === "A" || item.grade === "B").length;
    const lowMoqCount = items.filter((item) => item.moq <= search.maxMoq).length;
    return { count, top, avgMargin, priorityCount, lowMoqCount };
  }, [items, search.maxMoq]);

  useEffect(() => {
    void runSearch(defaultSearch);
  }, []);

  async function runSearch(nextSearch = search) {
    setIsLoading(true);
    setMessage("");

    const params = new URLSearchParams({
      keyword: nextSearch.keyword,
      market: nextSearch.market,
      sort: nextSearch.sort,
      mxq: String(nextSearch.maxMoq),
      targetMarginRate: String(nextSearch.targetMarginRate),
      platformFeeRate: String(nextSearch.platformFeeRate),
      taxAndBufferRate: String(nextSearch.taxAndBufferRate),
      maxPreferredMoq: String(nextSearch.maxMoq)
    });

    if (nextSearch.minPrice > 0) params.set("mnp", String(nextSearch.minPrice));
    if (nextSearch.maxPrice > 0) params.set("mxp", String(nextSearch.maxPrice));
    if (nextSearch.shipping) params.set("who", nextSearch.shipping);
    if (nextSearch.fastOnly) params.set("fdl", "true");
    if (nextSearch.lowPriceOnly) params.set("lwp", "true");

    try {
      const response = await fetch(`/api/domeggook/search?${params.toString()}`);
      const data = (await response.json()) as ApiResponse;
      setSource(data.source);
      setItems(data.items ?? []);
      setSelectedNo(data.items?.[0]?.no ?? null);
      setMessage(data.message ?? "");
    } catch {
      setMessage("검색 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.");
    } finally {
      setIsLoading(false);
    }
  }

  function updateField<Key extends keyof SearchState>(key: Key, value: SearchState[Key]) {
    setSearch((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(keyword: string) {
    const nextSearch = { ...search, keyword };
    setSearch(nextSearch);
    void runSearch(nextSearch);
  }

  function logout() {
    void fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      window.location.href = "/login";
    });
  }

  function exportCsv() {
    const headers = [
      "상품번호",
      "상품명",
      "원가",
      "MOQ",
      "배송비",
      "입고기준원가",
      "예상판매가",
      "예상마진율",
      "점수",
      "등급",
      "판단",
      "다음행동",
      "URL"
    ];
    const rows = items.map((item) => [
      item.no,
      item.title,
      item.price,
      item.moq,
      item.deliveryFee,
      item.landedCost,
      item.expectedSellPrice,
      item.expectedMarginRate,
      item.totalScore,
      item.grade,
      item.verdict,
      item.nextAction,
      item.url ?? ""
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `reportools_${search.keyword || "products"}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Reportools navigation">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <strong>reportools</strong>
            <span>도매꾹 미니 스카우트</span>
          </div>
        </div>
        <nav>
          <a className="active" href="#search">
            <Search size={18} />
            후보 검색
          </a>
          <a href="#score">
            <BarChart3 size={18} />
            선별표
          </a>
          <a href="#settings">
            <SlidersHorizontal size={18} />
            기준값
          </a>
        </nav>
        <div className="source-box">
          <KeyRound size={19} />
          <div>
            <strong>{source === "domeggook" ? "도매꾹 API 연결됨" : "샘플 데이터 모드"}</strong>
            <span>상품 후보 수집은 도매꾹 API 중심으로 처리</span>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Domeggook focused sourcing</span>
            <h1>도매꾹 상품을 가볍게 걸러 쿠팡 후보만 남깁니다</h1>
            <p className="hero-copy">복잡한 통계보다 원가, MOQ, 배송 조건, 마진 리스크를 먼저 봅니다.</p>
          </div>
          <div className="topbar-actions">
            <button className="secondary-button" type="button" onClick={exportCsv} disabled={!items.length}>
              <ArrowDownToLine size={18} />
              CSV 내보내기
            </button>
            <button className="icon-button" type="button" onClick={logout} aria-label="로그아웃" title="로그아웃">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <section className="workflow-strip" aria-label="사용 흐름">
          <span>1. 도매꾹 후보 수집</span>
          <span>2. MOQ·배송·마진 점수화</span>
          <span>3. 상위 후보만 쿠팡에서 최종 확인</span>
        </section>

        <section id="search" className="query-panel" aria-label="상품 검색 조건">
          <div className="field keyword-field">
            <label htmlFor="keyword">도매꾹 검색어</label>
            <div className="input-with-icon">
              <Search size={18} />
              <input
                id="keyword"
                value={search.keyword}
                onChange={(event) => updateField("keyword", event.target.value)}
                placeholder="예: 무타공 선반, 차량용 수납, 캠핑 조명"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="market">소싱처</label>
            <select id="market" value={search.market} onChange={(event) => updateField("market", event.target.value as SearchState["market"])}>
              <option value="dome">도매꾹</option>
              <option value="supply">도매매</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="shipping">배송</label>
            <select id="shipping" value={search.shipping} onChange={(event) => updateField("shipping", event.target.value)}>
              <option value="">전체</option>
              <option value="S">무료배송</option>
              <option value="P">선결제</option>
              <option value="B">착불</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="sort">정렬</label>
            <select id="sort" value={search.sort} onChange={(event) => updateField("sort", event.target.value)}>
              <option value="rd">랭킹순</option>
              <option value="ha">인기상품순</option>
              <option value="aa">낮은가격순</option>
              <option value="qa">적은 MOQ순</option>
              <option value="da">최근등록순</option>
            </select>
          </div>

          <button className="primary-button" type="button" onClick={() => runSearch()} disabled={isLoading}>
            {isLoading ? <Loader2 className="spin" size={18} /> : <Filter size={18} />}
            후보 찾기
          </button>
        </section>

        <div className="preset-row" aria-label="빠른 검색어">
          {keywordPresets.map((keyword) => (
            <button key={keyword} type="button" onClick={() => applyPreset(keyword)}>
              {keyword}
            </button>
          ))}
        </div>

        <section id="settings" className="filters" aria-label="분석 기준">
          <NumberField label="선호 MOQ" value={search.maxMoq} suffix="개" onChange={(value) => updateField("maxMoq", value)} />
          <NumberField label="최저 원가" value={search.minPrice} suffix="원" onChange={(value) => updateField("minPrice", value)} />
          <NumberField label="최고 원가" value={search.maxPrice} suffix="원" onChange={(value) => updateField("maxPrice", value)} />
          <NumberField label="목표 마진" value={search.targetMarginRate} suffix="%" onChange={(value) => updateField("targetMarginRate", value)} />
          <NumberField label="쿠팡 수수료" value={search.platformFeeRate} suffix="%" onChange={(value) => updateField("platformFeeRate", value)} />
          <NumberField label="세금/운영" value={search.taxAndBufferRate} suffix="%" onChange={(value) => updateField("taxAndBufferRate", value)} />
          <label className="check-field">
            <input type="checkbox" checked={search.fastOnly} onChange={(event) => updateField("fastOnly", event.target.checked)} />
            빠른배송만
          </label>
          <label className="check-field">
            <input type="checkbox" checked={search.lowPriceOnly} onChange={(event) => updateField("lowPriceOnly", event.target.checked)} />
            최저가확인
          </label>
        </section>

        {message ? (
          <div className="notice error">
            <AlertTriangle size={18} />
            {message}
          </div>
        ) : null}

        <section className="metrics" aria-label="검색 요약">
          <Metric label="분석 상품" value={`${metrics.count}`} />
          <Metric label="검토 후보" value={`${metrics.priorityCount}`} />
          <Metric label="최고 점수" value={`${metrics.top}`} />
          <Metric label="평균 마진" value={`${metrics.avgMargin}%`} />
          <Metric label="선호 MOQ 내" value={`${metrics.lowMoqCount}`} />
        </section>

        <section className="content-grid">
          <div id="score" className="table-panel">
            <div className="section-head">
              <div>
                <h2>도매꾹 후보 선별표</h2>
                <p>처음에는 A/B 후보만 쿠팡에서 직접 확인하면 됩니다.</p>
              </div>
              <span className={`mode-pill ${source}`}>{source === "domeggook" ? "실 API" : "샘플"}</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>상품</th>
                    <th>원가</th>
                    <th>MOQ</th>
                    <th>예상가</th>
                    <th>마진</th>
                    <th>점수</th>
                    <th>판단</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.no} className={selected?.no === item.no ? "selected-row" : ""} onClick={() => setSelectedNo(item.no)}>
                      <td>
                        <div className="product-cell">
                          {item.thumb ? <img src={item.thumb} alt="" /> : <div className="thumb-fallback" />}
                          <div>
                            <strong>{item.title}</strong>
                            <span>{item.sellerNick || item.sellerId || "판매자 확인 필요"}</span>
                          </div>
                        </div>
                      </td>
                      <td>{formatKRW(item.price)}</td>
                      <td>{item.moq}</td>
                      <td>{formatKRW(item.expectedSellPrice)}</td>
                      <td className={item.expectedMarginRate >= 18 ? "positive" : "negative"}>{item.expectedMarginRate}%</td>
                      <td>
                        <span className={`score-badge grade-${item.grade}`}>{item.totalScore}</span>
                      </td>
                      <td>{item.verdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="detail-panel" aria-label="선택 상품 분석">
            {selected ? (
              <>
                <div className="detail-head">
                  <span className={`grade grade-${selected.grade}`}>{selected.grade}</span>
                  <div>
                    <h2>{selected.title}</h2>
                    <p>상품번호 {selected.no}</p>
                  </div>
                </div>

                <div className="next-action">
                  <span>다음 행동</span>
                  <strong>{selected.nextAction}</strong>
                </div>

                <div className="score-lines">
                  <ScoreLine label="수요 추정" value={selected.demandScore} max={30} />
                  <ScoreLine label="마진" value={selected.marginScore} max={25} />
                  <ScoreLine label="경쟁 완화" value={selected.competitionScore} max={20} />
                  <ScoreLine label="공급 안정" value={selected.supplyScore} max={17} />
                  <ScoreLine label="리스크 낮음" value={selected.riskScore} max={10} />
                </div>

                <dl className="detail-list">
                  <div>
                    <dt>입고 기준 원가</dt>
                    <dd>{formatKRW(selected.landedCost)}</dd>
                  </div>
                  <div>
                    <dt>예상 이익</dt>
                    <dd>{formatKRW(selected.expectedProfit)}</dd>
                  </div>
                  <div>
                    <dt>배송 조건</dt>
                    <dd>{deliveryLabel(selected.deliveryWho)} / {formatKRW(selected.deliveryFee)}</dd>
                  </div>
                </dl>

                <div className="risk-block">
                  <h3>도매꾹에서 먼저 확인할 점</h3>
                  {selected.risks.length ? (
                    <div className="risk-tags">
                      {selected.risks.map((risk) => (
                        <span key={risk}>{risk}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="clean-risk">
                      <CheckCircle2 size={18} />
                      기본 리스크가 낮습니다. 쿠팡 상위 가격만 최종 확인하세요.
                    </p>
                  )}
                </div>

                <a className="link-button" href={selected.url || "#"} target="_blank" rel="noreferrer">
                  도매꾹 상품 보기
                </a>
              </>
            ) : (
              <div className="empty-state">
                <ShieldCheck size={36} />
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </aside>
        </section>
      </section>
    </main>
  );
}

function NumberField({
  label,
  value,
  suffix,
  onChange
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mini-field">
      <span>{label}</span>
      <div>
        <input value={value} type="number" onChange={(event) => onChange(Number(event.target.value))} />
        <b>{suffix}</b>
      </div>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ScoreLine({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="score-line">
      <div>
        <span>{label}</span>
        <strong>
          {value}/{max}
        </strong>
      </div>
      <i style={{ width: `${Math.round((value / max) * 100)}%` }} />
    </div>
  );
}

function formatKRW(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0
  }).format(value);
}

function deliveryLabel(value: ScoredProduct["deliveryWho"]): string {
  const labels: Record<string, string> = {
    S: "무료배송",
    P: "선결제",
    B: "착불",
    C: "구매자선택"
  };
  return labels[value] ?? "확인 필요";
}
