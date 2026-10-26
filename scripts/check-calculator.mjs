import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const html = readFileSync(new URL("../static-report/index.html", import.meta.url), "utf8");
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, "운영 정적 계산기 스크립트를 찾지 못했습니다.");

const htmlValues = Object.fromEntries([...html.matchAll(/<input id="([^"]+)"[^>]*?value="([^"]*)"/g)].map(([, id, value]) => [id, value]));

function openCalculator() {
  const elements = new Map();
  const get = (id) => {
    if (!elements.has(id)) {
      const attrs = {};
      elements.set(id, {
        value: htmlValues[id] ?? "",
        textContent: "",
        innerHTML: "",
        attrs,
        setAttribute(name, value) { attrs[name] = value; },
        removeAttribute(name) { delete attrs[name]; },
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
    setTimeout: () => {},
    Blob: class {
      constructor(parts) { csv = parts.join(""); }
    },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    document: {
      getElementById: get,
      querySelectorAll: () => [],
      createElement: () => ({ click() { filename = this.download; } }),
    },
    window: { addEventListener() {}, print() {} },
  });
  vm.runInContext(script, context);
  return {
    get,
    run: (code) => vm.runInContext(code, context),
    set: (id, value) => { get(id).value = String(value); },
    result: () => vm.runInContext("update()", context),
    download: () => {
      vm.runInContext("download()", context);
      return { csv, filename };
    },
  };
}

const byKey = (r) => Object.fromEntries(r.channels.map((c) => [c.key, c]));

test("HTML 기본 입력값은 감자 예시와 같다", () => {
  const calc = openCalculator();
  const potato = calc.run("presets.potato");
  for (const id of ["item", "unit", "unitKg", "quantity", "production", "sorting", "other"]) {
    assert.equal(htmlValues[id], String(potato[id]), id);
  }
  for (const key of ["direct", "wholesale", "online"]) {
    for (const field of ["price", "fee", "loss", "pack", "ship", "extra"]) {
      assert.equal(htmlValues[`${key}-${field}`], String(potato[key][field]), `${key}-${field}`);
    }
  }
});

test("감자 예시: 경로별 이익·손익분기와 페이지의 풀이 숫자가 일치", () => {
  const calc = openCalculator();
  const r = calc.result();
  const c = byKey(r);
  assert.equal(r.common, 740000);
  assert.equal(Math.round(c.direct.profit), 238000);
  assert.equal(Math.round(c.direct.breakEven), 23093);
  assert.equal(Math.round(c.direct.breakEvenKg), 2309);
  assert.equal(Math.round(c.wholesale.profit), 36970);
  assert.equal(Math.round(c.wholesale.breakEven), 20189);
  assert.equal(Math.round(c.online.profit), 195800);
  assert.equal(Math.round(c.online.breakEven), 26316);
  assert.equal(r.best.key, "direct");
  assert.match(calc.get("verdict").textContent, /직거래의 예상 이익이 가장 큽니다: ₩238,000\. 온라인 몰보다 ₩42,200, 도매시장 위탁보다 ₩201,030 많습니다\./);
  for (const text of ["₩238,000", "₩36,970", "₩195,800", "₩23,093 (kg당 ₩2,309)", "₩20,189 (kg당 ₩2,019)", "₩26,316 (kg당 ₩2,632)", "811원 높을 뿐"]) {
    assert.ok(html.includes(text), `예시 풀이에 ${text}가 없습니다`);
  }
  assert.match(calc.get("steps").innerHTML, /손익분기 판매가 = \(₩740,000 \+ ₩360,000 \+ ₩20,000\) ÷ \(48\.5상자 × \(1 − 0%\)\) = ₩23,093 \/ 상자/);
});

test("모든 예시에서 손익분기 판매가와 단위당 이익이 서로 맞는다", () => {
  const calc = openCalculator();
  for (const preset of ["potato", "rice", "peach", "apple"]) {
    const r = calc.run(`apply(presets.${preset})`);
    assert.equal(r.ok.length, 3, preset);
    for (const ch of r.ok) {
      assert.equal(ch.profit > 0, ch.headroom > 0, `${preset} ${ch.key}`);
      assert.ok(Math.abs((ch.price - ch.breakEven) * (1 - ch.fee / 100) - ch.unitProfit) < 1e-6, `${preset} ${ch.key}`);
      assert.ok(Math.abs(ch.breakEvenKg * r.kg - ch.breakEven) < 1e-6, `${preset} ${ch.key}`);
    }
  }
  assert.equal(calc.run("apply(presets.peach)").best.key, "wholesale");
});

test("빈칸·0·100%·음수·초과값을 구분해 안내", () => {
  const calc = openCalculator();
  calc.set("quantity", "");
  let r = calc.result();
  assert.equal(r.ok.length, 0);
  assert.equal(calc.get("verdict").textContent, "출하 수량을 넣으면 결과가 나옵니다.");
  calc.set("quantity", 0);
  calc.result();
  assert.equal(calc.get("verdict").textContent, "출하 수량은 0보다 커야 합니다.");

  calc.set("quantity", 50);
  calc.set("direct-loss", 100);
  calc.set("wholesale-fee", 100);
  r = calc.result();
  let c = byKey(r);
  assert.equal(c.direct.breakEven, null);
  assert.match(c.direct.beReason, /판매 가능 수량이 없어/);
  assert.equal(c.wholesale.breakEven, null);
  assert.match(c.wholesale.beReason, /수수료율이 100%라/);
  assert.match(calc.download().csv, /"손익분기 판매가\(단위당\)","계산 불가","계산 불가"/);

  calc.set("direct-loss", 3);
  calc.set("wholesale-fee", 150);
  calc.set("online-pack", -1);
  r = calc.result();
  c = byKey(r);
  assert.equal(c.wholesale.status, "error");
  assert.equal(calc.get("wholesale-fee").attrs["aria-invalid"], "true");
  assert.equal(c.online.status, "error");
  assert.match(calc.get("notes").innerHTML, /온라인 몰 — 포장재: 0 이상으로 입력하세요/);
  assert.equal(r.ok.length, 1);
  assert.match(calc.get("verdict").textContent, /^직거래만 계산했습니다/);

  calc.set("wholesale-fee", 7);
  calc.set("online-pack", 2600);
  calc.set("online-price", "");
  calc.set("sorting", "");
  calc.set("unitKg", "");
  r = calc.result();
  c = byKey(r);
  assert.equal(calc.get("wholesale-fee").attrs["aria-invalid"], undefined);
  assert.equal(c.online.status, "skip");
  assert.equal(r.common, 660000);
  assert.equal(r.kg, null);
  assert.equal(c.direct.kgProfit, null);
  assert.match(calc.get("notes").innerHTML, /빈칸은 0으로 계산했습니다: 선별·작업 인건비/);
});

test("입력한 품목명은 결과 HTML에 그대로 삽입되지 않는다", () => {
  const calc = openCalculator();
  calc.set("unit", "<b>상자</b>");
  calc.result();
  assert.ok(!calc.get("cards").innerHTML.includes("<b>상자</b>"));
  assert.ok(calc.get("cards").innerHTML.includes("&lt;b&gt;상자&lt;/b&gt;"));
});

test("CSV 작성일과 파일명은 다운로드 시 현지 날짜를 사용", () => {
  const { csv, filename } = openCalculator().download();
  assert.match(csv, /"작성일","2026-09-27"/);
  assert.match(csv, /"예상 이익","238000","36970","195800"/);
  assert.match(csv, /"손익분기 판매가\(단위당\)","23093","20189","26316"/);
  assert.equal(filename, "농가손익_감자_10kg_2026-09-27.csv");
});
