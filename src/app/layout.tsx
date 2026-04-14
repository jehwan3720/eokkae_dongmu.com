import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "어깨동무 — 학술 기반 생태 체험 교육",
  description:
    "한국곤충학회지(Korean Journal of Applied Entomology) 연구 데이터를 기반으로 설계된 장수풍뎅이 한살이 교육 프로그램. 2022 개정 교육과정 생태전환교육 목표 부합.",
  keywords: ["생태교육", "초등교육", "장수풍뎅이", "체험학습", "생태전환교육"],
  openGraph: {
    title: "어깨동무 — 학술 기반 생태 체험 교육",
    description: "살아있는 생명과 눈을 맞추는 수업",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
