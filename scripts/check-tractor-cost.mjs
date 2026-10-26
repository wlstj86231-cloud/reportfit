import assert from "node:assert/strict";
import { test } from "node:test";
import vm from "node:vm";
import { tractorCostPages } from "../static-report/tractor-cost.mjs";

const html = Object.values(tractorCostPages)[0];
const script = html.match(/<script>([\s\S]*?)<\/script><\/body>/)?.[1];
assert.ok(script, "트랙터 계산기 스크립트를 찾지 못했습니다.");

function open() {
  const stub = () => ({ value: "", addEventListener() {}, append() {}, replaceChildren() {} });
  const context = vm.createContext({ Intl, Math, Number, String, document: { getElementById: stub }, window: {}, location: {} });
  vm.runInContext(script, context);
  return (code) => vm.runInContext(code, context);
}

test("가상 예시: 구입 총액·보유 총비용·연평균·시간당 비용과 페이지 표가 일치", () => {
  const run = open();
  const r = run("computeTco({years:example.years,hours:example.hours,rent:example.rent,a:example.a,b:example.b})");
  const [a, b] = r.cands;
  assert.equal(r.errors.length, 0);
  assert.equal(a.buyTotal, 29900000);
  assert.equal(b.buyTotal, 30400000);
  assert.equal(a.operating, 14500000);
  assert.equal(b.operating, 17500000);
  assert.equal(a.total, 29400000);
  assert.equal(b.total, 36900000);
  assert.equal(a.perYear, 5880000);
  assert.equal(a.perHour, 23520);
  assert.equal(b.perHour, 29520);
  for (const text of ["₩29,900,000", "₩30,400,000", "₩29,400,000", "₩36,900,000", "₩5,880,000", "₩7,380,000", "₩23,520", "₩29,520", "연 12만 원", "연 138만 원", "750만 원"]) {
    assert.ok(html.includes(text), `예시 설명에 ${text}가 없습니다`);
  }
});

test("미확인·범위 밖 입력을 구분", () => {
  const run = open();
  const blank = "{price:null,transport:null,repair:null,attachment:null,other:null,fuel:null,maint:null,insure:null,interest:null,resale:null}";
  let r = run(`computeTco({years:null,hours:null,rent:null,a:{...${blank},price:1000},b:{...${blank},price:2000}})`);
  assert.equal(r.own, false);
  assert.equal(r.cands[0].buyMissing.length, 4);
  r = run(`computeTco({years:0,hours:-1,rent:null,a:{...${blank},price:1000},b:{...${blank},price:null}})`);
  assert.equal(r.errors.length, 3);
  r = run(`computeTco({years:5,hours:null,rent:null,a:{...${blank},price:1000,resale:-5},b:{...${blank},price:1000}})`);
  assert.match(r.errors.join(), /후보 A 예상 처분가: 0원 이상의 정수/);
  r = run(`computeTco({years:5,hours:null,rent:null,a:{...${blank},price:1000},b:{...${blank},price:1000}})`);
  assert.equal(r.cands[0].perHour, null);
  assert.equal(r.cands[0].runMissing.length, 5);
});
