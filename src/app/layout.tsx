import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://edugrid1649.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "에듀그리드 | 장수풍뎅이 생태 교육 키트 — 누리과정·초등 교과 연계",
  description:
    "장수풍뎅이 애벌레 관찰부터 성충까지! 유치원·어린이집 누리과정 및 초등 2022 개정 교육과정 100% 연계. 냄새·벌레 없는 올인원 생태 교육 키트. 강사비 0원, 행정 서류 즉시 제공.",
  keywords: [
    "에듀그리드", "장수풍뎅이 키트", "장수풍뎅이 애벌레", "생태 교육 교구",
    "누리과정 생태학습", "초등 생태교육", "장수풍뎅이 사육", "생태 체험 교구",
    "유치원 교육 키트", "어린이집 생태교육",
  ],
  openGraph: {
    title: "에듀그리드 | 장수풍뎅이 생태 교육 키트",
    description:
      "장수풍뎅이 애벌레 관찰부터 성충까지! 누리과정·초등 교과 연계 올인원 생태 교육 키트. 냄새·벌레 없음, 행정 서류 즉시 제공.",
    url: BASE_URL,
    siteName: "에듀그리드",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "에듀그리드 | 장수풍뎅이 생태 교육 키트",
    description: "장수풍뎅이 애벌레 관찰부터 성충까지! 누리과정·초등 교과 연계 올인원 생태 교육 키트.",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "K1B2EEK-GDA2uz65bJ98f_Stkfe7EWJbmjqTkY_S1-U",
    other: {
      "naver-site-verification": ["5cf87be89897da8305970f3caa584c0c6a581733"],
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "에듀그리드",
      "url": BASE_URL,
      "description": "유치원·초등학교 대상 장수풍뎅이 생태 교육 키트 전문 브랜드",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "Korean",
      },
    },
    {
      "@type": "Product",
      "@id": `${BASE_URL}/#product`,
      "name": "에듀그리드 장수풍뎅이 올인원 생태 교육 키트",
      "description":
        "장수풍뎅이 애벌레 관찰부터 성충까지. 유치원 누리과정 자연탐구 영역 및 초등 2022 개정 교육과정 연계. 냄새·벌레 없는 발효 톱밥, 관찰 활동지, 수업 PPT 포함.",
      "brand": { "@type": "Brand", "name": "에듀그리드" },
      "category": "생태 교육 교구",
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "teacher",
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "KRW",
        "price": "10000",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "seller": { "@id": `${BASE_URL}/#organization` },
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "에듀그리드",
      "inLanguage": "ko-KR",
      "publisher": { "@id": `${BASE_URL}/#organization` },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
