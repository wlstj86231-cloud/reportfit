import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "reportools | 상품 소싱 분석",
  description: "도매꾹/도매매 상품 후보를 점수화해 쿠팡 판매 전 검토 시간을 줄이는 리서치 도구"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
