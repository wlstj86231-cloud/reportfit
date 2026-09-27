import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const html = readFileSync(new URL("../static-report/index.html", import.meta.url), "utf8");
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, "운영 정적 계산기 스크립트를 찾지 못했습니다.");

function openCalculator() {
  const values = {
    item: "감자 10kg", quantity: 50, unit: "상자", price: 28000,
    production: 620000, sorting: 80000, packageCost: 110000,
    shipping: 250000, feeRate: 3.5, lossRate: 5, other: 40000,
  };
  const elements = new Map();
  const get = (id) => {
    if (!elements.has(id)) {
      elements.set(id, {
        value: values[id] ?? "",
        textContent: "",
        className: "",
        addEventListener() {},
      });
    }
    return elements.get(id);
  };
  let csv = "";
  let filename = "";
  class FixedDate extends Date {
    constructor(...args) {
      super(...(args.length ? args : [2026, 8, 27, 23, 30]));
    }
  }
  const context = vm.createContext({
    Date: FixedDate,
    Intl,
    Math,
    Number,
    String,
    Blob: class {
      constructor(parts) { csv = parts.join(""); }
    },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    document: {
      getElementById: get,
      querySelectorAll: () => [],
      createElement: () => ({ click() { filename = this.download; } }),
    },
    window: { addEventListener() {} },
  });
  vm.runInContext(script, context);
  return {
    get,
    run: (code) => vm.runInContext(code, context),
    set: (id, value) => { get(id).value = value; },
    download: () => {
      vm.runInContext("download()", context);
      return { csv, filename };
    },
  };
}

test("기본 표시와 네 품목 예시의 손익분기 방향", () => {
  const calculator = openCalculator();
  assert.match(html, /id="break-even">₩23,998/);
  assert.match(html, /id="difference-note">현재 단가보다 ₩4,002 낮습니다/);
  assert.equal(calculator.get("break-even").textContent, "₩23,998");
  assert.equal(calculator.get("difference-note").textContent, "현재 단가보다 ₩4,002 낮습니다.");
  for (const preset of ["potato", "rice", "peach", "apple"]) {
    calculator.run(`apply(presets.${preset})`);
    assert.match(calculator.get("difference-note").textContent, /낮습니다\.$/, preset);
    assert.equal(calculator.get("profit-card").className, "metric positive", preset);
  }
});

test("손실, 동일 단가, 계산 불가 입력을 구분", () => {
  const calculator = openCalculator();
  calculator.set("price", 20000);
  calculator.run("calculate()");
  assert.equal(calculator.get("profit-card").className, "metric negative");
  assert.equal(calculator.get("difference-note").textContent, "현재 단가보다 ₩3,998 높습니다.");

  calculator.set("quantity", 1);
  calculator.set("price", 10000);
  calculator.set("feeRate", 0);
  calculator.set("lossRate", 0);
  calculator.set("production", 10000);
  for (const id of ["sorting", "packageCost", "shipping", "other"]) calculator.set(id, 0);
  calculator.run("calculate()");
  assert.equal(calculator.get("difference-note").textContent, "현재 단가와 같습니다.");

  for (const [id, value] of [["quantity", 0], ["lossRate", 100], ["feeRate", 100]]) {
    calculator.set("quantity", 1);
    calculator.set("lossRate", 0);
    calculator.set("feeRate", 0);
    calculator.set(id, value);
    calculator.run("calculate()");
    assert.equal(calculator.get("break-even").textContent, "계산 불가", id);
    assert.equal(calculator.get("break-unit").textContent, "", id);
    assert.match(calculator.get("difference-note").textContent, /계산할 수 없습니다\.$/, id);
    assert.match(calculator.download().csv, /"손익분기 단가","계산 불가"/, id);
  }
});

test("CSV 작성일과 파일명은 다운로드 시 현지 날짜를 사용", () => {
  const { csv, filename } = openCalculator().download();
  assert.match(csv, /"작성일","2026-09-27"/);
  assert.equal(filename, "reportools_감자_10kg_2026-09-27.csv");
});
