import { guidePages } from "../static-report/guides.mjs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const expected = [
  ["listing-price-fields", "produce-listing-three-fields", "판매글 가격칸과 정산표를 같은 단위로"],
  ["meetup-parcel-cost", "meetup-vs-direct-shipping-choice", "방문 0원과 택배비를 손익에 넣는 법"],
  ["seasonal-price-window", "kimjang-rice-listing-dates", "김장·햅쌀 글의 가격 유효일"],
];
const errors = [];

for (const [slug, dest, h1] of expected) {
  const html = guidePages[`/guides/${slug}/`];
  const header = html.slice(html.indexOf("<header"), html.indexOf("</header>") + 9);
  if (header.includes("보리장터")) errors.push(`${slug}: header has 보리장터`);
  if (!html.includes(`<h1>${h1}</h1>`)) errors.push(`${slug}: H1 mismatch`);
  if (!html.includes("utm_campaign=c2c_howto_202609")) errors.push(`${slug}: missing campaign`);
  if (!html.includes(`utm_content=${slug}`)) errors.push(`${slug}: missing utm_content`);
  if (!html.includes(`https://boribay.com/guides/${dest}?`)) errors.push(`${slug}: missing dest ${dest}`);
  if ((html.match(/boribay.com\/guides\//g) || []).length !== 1) errors.push(`${slug}: expected 1 boribay guide href`);
  if (html.includes("garak-market-price-lookup") || html.includes("garak-cabbage-price-lookup")) errors.push(`${slug}: Garak dest`);
  if (html.includes("occultworldcup") || html.includes("yomiwiki") || html.includes("goatool") || html.includes("scamreader")) errors.push(`${slug}: satellite-to-satellite`);
}

const kg = guidePages["/guides/kg-price-margin/"];
if (!kg.includes("utm_campaign=farm_settlement_guides")) errors.push("kg-price-margin campaign rewritten");
if (!kg.includes("garak-grape-price-lookup")) errors.push("kg-price-margin grape dest missing");

const auction = guidePages["/guides/auction-net-proceeds/"];
if (!auction.includes("garak-market-price-lookup")) errors.push("auction Garak hub dest missing");

const home = await readFile(join(dirname(fileURLToPath(import.meta.url)), "../static-report/index.html"), "utf8");
const homeHeader = home.slice(home.indexOf("<header"), home.indexOf("</header>") + 9);
if (homeHeader.includes("보리장터")) errors.push("home header has 보리장터");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`reportools c2c inbound ok: ${expected.length} pages`);
