import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "reportools | 도매꾹 미니 스카우트",
  description: "도매꾹/도매매 상품 후보를 가볍게 점수화해 쿠팡 판매 전 검토 시간을 줄이는 개인용 도구"
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
