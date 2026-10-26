# 농가 손익 계산기 (www.reportools.com)

농산물 판매 경로별(직거래·도매시장 위탁·온라인 몰) 손익과 손익분기 판매가, 중고 트랙터 구입·보유 총비용을 계산하는 정적 사이트입니다. 운영: 제이 미디어(J MEDIA, 보리장터와 같은 운영자).

## 소스

- `static-report/index.html` — 첫 화면 계산기
- `static-report/guides.mjs` — `/guides/` 정산 가이드
- `static-report/tractor-cost.mjs` — `/tools/used-tractor-total-cost/`
- `static-report/about.mjs` — `/about/` 소개·운영자·정정 요청
- `static-report/mn.mjs` — `/mn/` 몽골어 계산기
- `scripts/site-files.mjs` — 두 호스트가 함께 쓰는 페이지·sitemap·robots·404 정의

`app/`, `lib/`의 Next.js 코드는 예전 도매꾹 스카우트 앱이며 두 호스트 어디에도 배포되지 않습니다.

## 빌드와 배포

```sh
node scripts/build-sites-static.mjs   # dist/server/index.js (apex reportools.com Worker, 커밋 대상)
node scripts/export-pages-static.mjs  # dist/pages + public/ (www, Cloudflare Pages가 main 푸시 때 생성)
```

`build-sites-static.mjs`는 `dist/`를 지우므로 먼저 실행합니다. apex Worker는 `wrangler.sites.jsonc`로만 배포합니다(`wrangler.jsonc` 아님).

## 검사

```sh
node --test scripts/check-calculator.mjs scripts/check-tractor-cost.mjs
node scripts/check-c2c-howto-inbound.mjs
```
