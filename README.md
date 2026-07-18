# reportools

도매꾹/도매매 상품 후보를 가볍게 선별하는 개인용 미니 스카우트입니다.

## 핵심 기능

- 도매꾹/도매매 상품 검색
- MOQ, 배송비, 원가, 예상 판매가, 예상 마진 기반 점수화
- 리스크 태그와 다음 행동 제안
- CSV 내보내기
- `REPORTOOLS_PASSWORD` 기반 비밀번호 잠금

## 실행

```powershell
copy .env.example .env
# .env에 REPORTOOLS_PASSWORD 입력
# 도매꾹 API 키가 있으면 DOMEGGOOK_API_KEY 입력
npm run dev
```

`DOMEGGOOK_API_KEY`가 없으면 샘플 데이터로 동작합니다.
