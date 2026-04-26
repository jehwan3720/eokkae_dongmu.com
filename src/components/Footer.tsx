"use client";

import Link from "next/link";

const navLinks = [
  { label: "프로그램 소개", href: "#curriculum" },
  { label: "수업 현장", href: "#gallery" },
  { label: "강사 소개", href: "#instructor" },
  { label: "비용 안내", href: "#pricing" },
  { label: "자주 묻는 질문", href: "#faq" },
  { label: "문의 내역 조회", href: "/check" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-20">

          {/* 브랜드 & 사업자 정보 */}
          <div className="flex flex-col gap-4">
            <p className="text-white font-bold text-base tracking-tight">
              에듀그리드
            </p>
            <p className="text-white/30 text-[0.75rem] leading-[1.9] tracking-wide">
              학술 기반 생태 체험 교육 프로그램<br />
              사업자등록번호: 150-21-02079 &nbsp;·&nbsp; 대표: 명제환<br />
              문의: edugrid1649@gmail.com
            </p>
            <p className="text-white/20 text-[0.6875rem] tracking-wide mt-2">
              © 2026 에듀그리드. All rights reserved.
            </p>
          </div>

          {/* 네비게이션 */}
          <nav>
            <ul className="flex flex-col gap-3">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith("/") ? (
                    <Link
                      href={href}
                      className="text-[0.8125rem] text-white/40 hover:text-white/80 transition-colors duration-150 tracking-wide"
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="text-[0.8125rem] text-white/40 hover:text-white/80 transition-colors duration-150 tracking-wide"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 구분선 & 하단 법적 고지 */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-white/20 text-[0.6875rem] tracking-wide">
            한국곤충학회지(Korean Journal of Applied Entomology) 기반 커리큘럼
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-white/20 text-[0.6875rem] hover:text-white/50 transition-colors duration-150"
            >
              개인정보처리방침
            </Link>
            <a
              href="#"
              className="text-white/20 text-[0.6875rem] hover:text-white/50 transition-colors duration-150"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
