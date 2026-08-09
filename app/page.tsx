"use client";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  Download,
  FileSpreadsheet,
  Info,
  PackageCheck,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Truck,
  Wheat,
} from "lucide-react";
type Inputs = {
  item: string;
  quantity: number;
  unit: string;
  price: number;
  production: number;
  sorting: number;
  packageCost: number;
  shipping: number;
  feeRate: number;
  lossRate: number;
  other: number;
};
const defaults: Inputs = {
  item: "감자 10kg",
  quantity: 50,
  unit: "상자",
  price: 28000,
  production: 620000,
  sorting: 80000,
  packageCost: 110000,
  shipping: 250000,
  feeRate: 3.5,
  lossRate: 5,
  other: 40000,
};
const presets: { label: string; values: Partial<Inputs> }[] = [
  {
    label: "감자 10kg",
    values: {
      item: "감자 10kg",
      quantity: 50,
      unit: "상자",
      price: 28000,
      production: 620000,
      sorting: 80000,
      packageCost: 110000,
      shipping: 250000,
      lossRate: 5,
    },
  },
  {
    label: "쌀 20kg",
    values: {
      item: "햅쌀 20kg",
      quantity: 80,
      unit: "포대",
      price: 62000,
      production: 2800000,
      sorting: 180000,
      packageCost: 160000,
      shipping: 480000,
      lossRate: 2,
    },
  },
  {
    label: "복숭아 4kg",
    values: {
      item: "복숭아 4kg",
      quantity: 60,
      unit: "상자",
      price: 36000,
      production: 900000,
      sorting: 140000,
      packageCost: 240000,
      shipping: 330000,
      lossRate: 8,
    },
  },
  {
    label: "사과 5kg",
    values: {
      item: "사과 5kg",
      quantity: 100,
      unit: "상자",
      price: 42000,
      production: 1700000,
      sorting: 240000,
      packageCost: 380000,
      shipping: 520000,
      lossRate: 6,
    },
  },
];
const won = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});
export default function Home() {
  const [input, setInput] = useState<Inputs>(defaults);
  const calc = useMemo(() => {
    const sold = Math.max(0, input.quantity * (1 - input.lossRate / 100));
    const revenue = sold * input.price;
    const fee = (revenue * input.feeRate) / 100;
    const fixed =
      input.production +
      input.sorting +
      input.packageCost +
      input.shipping +
      input.other;
    const total = fixed + fee;
    const profit = revenue - total;
    const margin = revenue ? (profit / revenue) * 100 : 0;
    const breakEven = sold ? fixed / (sold * (1 - input.feeRate / 100)) : 0;
    const unitProfit = sold ? profit / sold : 0;
    return {
      sold,
      revenue,
      fee,
      fixed,
      total,
      profit,
      margin,
      breakEven,
      unitProfit,
    };
  }, [input]);
  function set<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }
  function apply(values: Partial<Inputs>) {
    setInput((current) => ({ ...current, ...values }));
  }
  function download() {
    const rows = [
        ["농가 판매 손익·정산 보고서"],
        ["작성일", "2026-08-09"],
        ["품목", input.item],
        ["판매 예정 수량", input.quantity, input.unit],
        ["감모율", `${input.lossRate}%`],
        ["예상 판매 수량", calc.sold.toFixed(1), input.unit],
        ["단위 판매가", input.price],
        ["예상 매출", Math.round(calc.revenue)],
        ["생산·매입비", input.production],
        ["선별·작업비", input.sorting],
        ["포장비", input.packageCost],
        ["배송비", input.shipping],
        ["플랫폼·결제 수수료", Math.round(calc.fee)],
        ["기타비용", input.other],
        ["총비용", Math.round(calc.total)],
        ["예상 이익", Math.round(calc.profit)],
        ["이익률", `${calc.margin.toFixed(1)}%`],
        ["손익분기 단가", Math.round(calc.breakEven)],
      ],
      csv = rows
        .map((row) =>
          row
            .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
            .join(","),
        )
        .join("\n"),
      blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `reportools_${input.item.replace(/\s+/g, "_")}_2026-08-09.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/">
          <span>
            <ReceiptText size={19} />
          </span>
          <strong>reportools</strong>
          <small>농가 판매 손익·정산 보고서</small>
        </a>
        <nav>
          <a href="#calculator">손익 계산</a>
          <a href="#principles">계산 원리</a>
          <a href="https://boribay.com/?utm_source=reportools.com&utm_medium=owned_referral&utm_campaign=farm_profit_report&utm_content=header">
            보리장터
          </a>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div>
            <p>판매가를 정하기 전에 비용부터 합쳐보세요</p>
            <h1>
              농산물 직거래
              <br />
              <em>손익·정산 보고서</em>
            </h1>
            <span>
              생산·선별·포장·배송·수수료와 감모를 넣으면
              <br />
              예상 이익, 이익률, 손익분기 단가를 바로 계산합니다.
            </span>
            <div className="safe">
              <ShieldCheck size={18} />
              <strong>입력값은 이 브라우저에서만 계산</strong>
              <span>회원가입·파일 업로드 없음</span>
            </div>
          </div>
          <aside>
            <p>보고서 기준일</p>
            <strong>2026-08-09</strong>
            <span>세금·회계 신고가 아닌 판매 의사결정용 추정치입니다.</span>
          </aside>
        </section>
        <section className="preset-row" aria-label="품목 예시">
          {presets.map((p) => (
            <button key={p.label} onClick={() => apply(p.values)}>
              {p.label}
            </button>
          ))}
        </section>
        <section id="calculator" className="calculator">
          <div className="input-panel">
            <div className="panel-head">
              <span>
                <Calculator size={21} />
              </span>
              <div>
                <p>1. 판매 조건 입력</p>
                <h2>한 번의 출하·판매 묶음 기준</h2>
              </div>
              <button onClick={() => setInput(defaults)}>
                <RotateCcw size={15} />
                초기화
              </button>
            </div>
            <div className="fields">
              <Field label="품목·규격">
                <input
                  value={input.item}
                  onChange={(e) => set("item", e.target.value)}
                />
              </Field>
              <div className="field-pair">
                <Field label="판매 예정 수량">
                  <input
                    type="number"
                    min="0"
                    value={input.quantity}
                    onChange={(e) => set("quantity", Number(e.target.value))}
                  />
                </Field>
                <Field label="단위">
                  <input
                    value={input.unit}
                    onChange={(e) => set("unit", e.target.value)}
                  />
                </Field>
              </div>
              <Money
                label={`단위 판매가 / ${input.unit}`}
                value={input.price}
                onChange={(v) => set("price", v)}
              />
              <div className="section-label">비용</div>
              <Money
                label="생산·매입비"
                value={input.production}
                onChange={(v) => set("production", v)}
              />
              <Money
                label="선별·작업 인건비"
                value={input.sorting}
                onChange={(v) => set("sorting", v)}
              />
              <Money
                label="포장재·박스 비용"
                value={input.packageCost}
                onChange={(v) => set("packageCost", v)}
              />
              <Money
                label="배송·상하차 비용"
                value={input.shipping}
                onChange={(v) => set("shipping", v)}
              />
              <Money
                label="기타 비용"
                value={input.other}
                onChange={(v) => set("other", v)}
              />
              <div className="field-pair">
                <Field label="결제·플랫폼 수수료">
                  <div className="suffix">
                    <input
                      type="number"
                      step="0.1"
                      value={input.feeRate}
                      onChange={(e) => set("feeRate", Number(e.target.value))}
                    />
                    <b>%</b>
                  </div>
                </Field>
                <Field label="감모·파손 예상">
                  <div className="suffix">
                    <input
                      type="number"
                      step="0.1"
                      value={input.lossRate}
                      onChange={(e) => set("lossRate", Number(e.target.value))}
                    />
                    <b>%</b>
                  </div>
                </Field>
              </div>
            </div>
          </div>
          <div className="report-panel">
            <div className="panel-head">
              <span>
                <BarChart3 size={21} />
              </span>
              <div>
                <p>2. 계산 결과</p>
                <h2>{input.item} 예상 정산</h2>
              </div>
            </div>
            <div className="summary">
              <Metric
                label="예상 매출"
                value={won.format(calc.revenue)}
                icon={<Wheat />}
              />
              <Metric
                label="총비용"
                value={won.format(calc.total)}
                icon={<Truck />}
              />
              <Metric
                label="예상 이익"
                value={won.format(calc.profit)}
                icon={<PackageCheck />}
                tone={calc.profit >= 0 ? "positive" : "negative"}
              />
              <Metric
                label="이익률"
                value={`${calc.margin.toFixed(1)}%`}
                icon={<BarChart3 />}
                tone={calc.margin >= 10 ? "positive" : "negative"}
              />
            </div>
            <div className="break-even">
              <p>손익분기 단가</p>
              <strong>
                {won.format(calc.breakEven)} / {input.unit}
              </strong>
              <span>
                현재 단가보다 {won.format(input.price - calc.breakEven)}{" "}
                {input.price >= calc.breakEven ? "높습니다" : "낮습니다"}.
              </span>
            </div>
            <table>
              <tbody>
                <tr>
                  <th>판매 가능 수량</th>
                  <td>
                    {calc.sold.toFixed(1)} {input.unit}
                  </td>
                </tr>
                <tr>
                  <th>생산·작업·포장·배송·기타</th>
                  <td>{won.format(calc.fixed)}</td>
                </tr>
                <tr>
                  <th>예상 수수료</th>
                  <td>{won.format(calc.fee)}</td>
                </tr>
                <tr>
                  <th>{input.unit}당 예상 이익</th>
                  <td>{won.format(calc.unitProfit)}</td>
                </tr>
              </tbody>
            </table>
            <div className="report-actions">
              <button onClick={download}>
                <Download size={17} />
                CSV 정산표 저장
              </button>
              <a href="https://boribay.com/listings/new?type=FIXED&utm_source=reportools.com&utm_medium=owned_referral&utm_campaign=farm_profit_report&utm_content=calculation_result">
                보리장터 판매 준비 <ArrowRight size={17} />
              </a>
            </div>
            <p className="notice">
              <Info size={16} />
              실제 세금·수수료·보조금·자가노동비·고정비는 농가마다 다릅니다.
              신고와 계약에는 회계·세무 전문가의 최신 기준을 확인하세요.
            </p>
          </div>
        </section>
        <section id="principles" className="principles">
          <div>
            <p>계산 원리</p>
            <h2>판매가보다 빠뜨린 비용이 이익을 바꿉니다</h2>
          </div>
          <ol>
            <li>
              <span>1</span>
              <strong>판매 가능 수량</strong>
              <p>예정 수량에서 감모·파손률을 먼저 뺍니다.</p>
            </li>
            <li>
              <span>2</span>
              <strong>전체 비용</strong>
              <p>생산·선별·포장·배송·수수료·기타 비용을 더합니다.</p>
            </li>
            <li>
              <span>3</span>
              <strong>손익분기 단가</strong>
              <p>전체 비용을 실제 판매 가능 수량과 수수료율로 나눕니다.</p>
            </li>
          </ol>
        </section>
      </main>
      <footer>
        <strong>reportools</strong>
        <span>농가 판매 의사결정을 돕는 무료 계산 도구</span>
        <nav>
          <a href="https://boribay.com/?utm_source=reportools.com&utm_medium=owned_referral&utm_campaign=farm_profit_report&utm_content=footer">
            보리장터
          </a>
        </nav>
      </footer>
    </>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Money({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label}>
      <div className="suffix">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <b>원</b>
      </div>
    </Field>
  );
}
function Metric({
  label,
  value,
  icon,
  tone = "",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: string;
}) {
  return (
    <div className={`metric ${tone}`}>
      <span>{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
