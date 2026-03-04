import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모바일 우선 맛집 탐색 서비스",
  description: "오늘 뭐먹지? 근처 맛집을 빠르게 찾아보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
