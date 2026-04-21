"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { slideUpStagger, staggerContainer, VIEWPORT } from "@/lib/motion";

export default function Hero() {
  return (
    <section className="relative bg-[#0F1F3D] overflow-hidden">

      {/* 배경 — 우측 미묘한 블루 광원 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 80% 50%, #1B3F7A44 0%, transparent 70%)",
        }}
      />

      {/* 상단 얇은 브랜드 라인 */}
      <div className="w-full h-px bg-[#1B3F7A]" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* ── 네비게이션 ─────────────────────────────────── */}
        <nav className="flex items-center justify-between py-5 border-b border-white/10">
          <span className="text-white font-bold text-lg tracking-tight">어깨동무</span>

          <ul className="hidden md:flex items-center gap-8 text-[0.8125rem] text-white/70 font-medium tracking-wide">
            {[
              { label: "교과 연계",  href: "#curriculum-mapping" },
              { label: "키트 구성", href: "#curriculum" },
              { label: "수업 현장",  href: "#gallery" },
              { label: "비용 안내",  href: "#pricing" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="hover:text-white transition-colors duration-150">{label}</a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center px-5 py-2.5 text-[0.8125rem] font-semibold tracking-wide text-white border border-white/30 hover:bg-white hover:text-[#0F1F3D] transition-all duration-200 rounded-sm"
          >
            교구 납품 문의
          </a>
        </nav>

        {/* ── 히어로 본문 — 2컬럼 레이아웃 ─────────────── */}
        <div className="py-20 md:py-28 lg:py-36 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">

          {/* 좌측 텍스트 */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.p
              className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-[#7EB3F5] mb-5"
              variants={slideUpStagger}
              custom={0}
            >
              대한민국 초등 교과 및 누리과정 100% 연계
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              className="text-[3rem] md:text-[4.25rem] lg:text-[5rem] font-bold leading-[1.05] tracking-[-0.03em] text-white mb-8"
              variants={slideUpStagger}
              custom={1}
            >
              완성형 생태 교구,<br />
              어깨동무 올인원 키트
            </motion.h1>

            {/* 서브 카피 */}
            <motion.div
              className="flex flex-col gap-1.5 mb-6"
              variants={slideUpStagger}
              custom={2}
            >
              <p className="text-white/70 text-[0.9375rem] leading-relaxed">
                수업 준비부터 행정 처리까지.<br className="hidden md:block" />
                선생님은 아이들의 관찰에만 집중할 수 있도록<br className="hidden md:block" />
                완벽하게 설계된 올인원 키트를 만나보세요.
              </p>
            </motion.div>

            {/* Badge */}
            <motion.p
              className="text-white/40 text-[0.75rem] tracking-widest mb-10"
              variants={slideUpStagger}
              custom={3}
            >
              2022 개정 교육과정 &nbsp;·&nbsp; 누리과정 &nbsp;·&nbsp; 생태전환교육 목표 부합
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              variants={slideUpStagger}
              custom={4}
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#1B3F7A] hover:bg-[#2A5BAD] text-white text-sm font-semibold tracking-wide rounded-sm transition-colors duration-200"
              >
                교구 납품 견적 문의하기
              </a>
              <a
                href="#curriculum-mapping"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white/70 hover:text-white hover:border-white/50 text-sm font-medium tracking-wide rounded-sm transition-colors duration-200"
              >
                교육과정 연계 확인하기 →
              </a>
            </motion.div>
          </motion.div>

          {/* 우측 — 장수풍뎅이 이미지 플레이스홀더 */}
          <motion.div
            className="hidden lg:flex flex-col gap-3"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            {/* 메인 이미지 */}
            <div
              className="relative w-full aspect-[4/5] rounded-sm overflow-hidden"
              style={{ border: "1px solid #1B3F7A66" }}
            >
              <Image
                src="/images/풍뎅이.jpg"
                alt="장수풍뎅이 성충"
                fill
                className="object-cover"
                sizes="420px"
                priority
              />

              {/* 학명 배지 */}
              <div
                className="absolute bottom-4 left-4 right-4 px-4 py-3"
                style={{ backgroundColor: "#0F1F3D99", backdropFilter: "blur(8px)" }}
              >
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: "#7EB3F5" }}>
                  Trypoxylus dichotomus
                </p>
                <p className="text-white/40 text-[0.625rem] tracking-wide mt-0.5">장수풍뎅이 · 딱정벌레목 장수풍뎅이과</p>
              </div>
            </div>

            {/* 한살이 단계 미니 배지 4개 */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { stage: "3령 유충", en: "Larva",  color: "#C5D8F0" },
                { stage: "번데기",   en: "Pupa",   color: "#A8C4E8" },
                { stage: "우화",     en: "Eclose", color: "#8AAFD8" },
                { stage: "성충",     en: "Adult",  color: "#6B9DC8" },
              ].map(({ stage, en, color }) => (
                <div
                  key={stage}
                  className="flex flex-col items-center gap-1 py-3 rounded-[2px]"
                  style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
                >
                  <span className="text-white/80 text-[0.75rem] font-bold">{stage}</span>
                  <span className="text-white/30 text-[0.5rem] tracking-wider">{en}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── 하단 수치 바 — scroll trigger ───────────────── */}
        <motion.div
          className="border-t border-white/10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {[
            { num: "₩ 0",      label: "추가 관리 비용",         sub: null },
            { num: "10,000원", label: "학급 단위 키트 기준가",  sub: "30인 이상 납품 시 단가 자동 할인 적용" },
            { num: "4단계",    label: "한살이 연계 커리큘럼",  sub: null },
            { num: "無관리",   label: "관리가 필요 없는 올인원 사육 키트",      sub: null },
          ].map(({ num, label, sub }, i) => (
            <motion.div
              key={label}
              className="flex flex-col gap-0.5"
              variants={slideUpStagger}
              custom={i}
            >
              <span className="text-white text-xl font-bold tracking-tight">{num}</span>
              <span className="text-white/40 text-[0.75rem] tracking-wide">{label}</span>
              {sub && (
                <span className="text-white/25 text-[0.6rem] tracking-wide leading-snug mt-0.5">{sub}</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
