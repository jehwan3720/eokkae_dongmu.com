"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

const tiers = [
  {
    label: "학급 단독 참여",
    sub: "1 ~ 29인",
    price: "14,000",
    unit: "원 / 인",
    desc: "단일 학급 소규모 신청 기준",
    badge: null,
    highlight: false,
  },
  {
    label: "학급 연합 상생가",
    sub: "30 ~ 49인",
    price: "10,000",
    unit: "원 / 인",
    desc: "옆 반과 함께 신청 시 적용 (품의 추천)",
    badge: "가장 많이 선택해요",
    highlight: true,
  },
  {
    label: "학년·기관 특별가",
    sub: "50인 이상",
    price: "9,000",
    unit: "원 / 인",
    desc: "학년 단위 신청 시 예산 최적화",
    badge: null,
    highlight: false,
  },
];


const kitFeatures = [
  {
    icon: "◎",
    title: "유충병 1통으로 완결",
    ecoBasis: "장수풍뎅이 유충의 생태적 특성",
    desc: "3령 유충은 발효 참나무 톱밥을 먹이이자 서식지로 사용합니다. 톱밥 속에서 스스로 먹고 자라며, 번데기방도 직접 만들기 때문에 인위적 개입이 필요하지 않습니다.",
  },
  {
    icon: "✕",
    title: "추가 급여·교체 없음",
    ecoBasis: "발효 톱밥의 이중 기능",
    desc: "친환경 발효 톱밥은 유충의 먹이(균류·유기물)이자 서식 공간입니다. 유충이 톱밥을 소화하며 스스로 환경을 조성해, 외부에서 먹이를 공급하거나 청소할 필요가 없습니다.",
  },
  {
    icon: "◉",
    title: "관찰이 곧 교육",
    ecoBasis: "우화까지 자급자족 시스템",
    desc: "번데기방 조성 → 번데기 → 우화 후 성충 대기까지 밀폐 환경에서 안정적으로 진행됩니다. 아이들은 개입 없이 생명의 변화 전 과정을 목격하는 관찰자가 됩니다.",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[var(--color-off-white)] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* ── 섹션 헤드라인 ───────────────────────────── */}
        <motion.div
          className="mb-14 max-w-2xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow mb-4" variants={slideUp}>
            비용 구조
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--color-text-primary)] mb-6"
            variants={slideUp}
          >
            전문 강사 수업료는 0원입니다.
          </motion.h2>
          <motion.p
            className="text-[0.9375rem] text-[var(--color-text-secondary)] leading-[1.9]"
            variants={slideUp}
          >
            단순한 관찰 키트가 아닙니다. 강사 파견부터 뒷정리, 행정 처리까지.
            선생님의 학급 운영 부담을 &lsquo;0&rsquo;으로 만드는
            <span className="font-semibold text-[var(--color-text-primary)]"> All-in-One 생태 교육 솔루션</span>입니다.
          </motion.p>
        </motion.div>

        {/* ── 강사비 0원 카드 ─────────────────────────── */}
        <motion.div
          className="mb-px"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div
            className="bg-[#0F1F3D] px-6 md:px-10 py-7 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
            variants={slideUp}
          >
            <div>
              <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-white/40 mb-2">
                Instructor Fee
              </p>
              <p className="text-[2.5rem] font-bold leading-none tracking-tighter text-white">
                ₩ 0
              </p>
              <p className="mt-3 text-white/60 text-[0.875rem] leading-relaxed">
                전문 강사 파견 · 수업 진행 · 교구 설명 · 사후 가이드
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 md:text-right">
              {["출장비 없음", "준비비 없음", "인건비 청구 없음"].map((t) => (
                <span key={t} className="text-[0.75rem] text-white/30 tracking-wide flex items-center gap-1.5">
                  <span className="text-white/20 text-[0.5rem]">✓</span>{t}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── 키트 단가 테이블 ─────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* 테이블 헤더 */}
          <motion.div
            className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_160px_180px] items-center px-6 py-3 border-b border-[var(--color-border)]"
            variants={slideUp}
          >
            <span className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
              키트 구분
            </span>
            <span className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-[var(--color-text-muted)] text-right hidden md:block">
              적용 인원
            </span>
            <span className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-[var(--color-text-muted)] text-right">
              교육 지원가
            </span>
          </motion.div>

          {/* 3단계 가격 행 */}
          {tiers.map(({ label, sub, price, unit, desc, badge, highlight }, i) => (
            <motion.div
              key={label}
              className={[
                "grid grid-cols-1 md:grid-cols-[1fr_160px_180px] items-start md:items-center gap-2 md:gap-0 px-6 py-4 md:py-6 border-b transition-colors",
                highlight
                  ? "bg-[#1B3F7A]/[0.04] border-[#1B3F7A]/20 border-l-4 border-l-[#1B3F7A]"
                  : "border-[var(--color-border)] bg-white border-l-4 border-l-transparent",
              ].join(" ")}
              variants={slideUpStagger}
              custom={i}
            >
              {/* 구분명 + 설명 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`text-[0.9375rem] font-semibold tracking-tight ${highlight ? "text-[#1B3F7A]" : "text-[var(--color-text-primary)]"}`}>
                    {label}
                  </span>
                  {sub && (
                    <span className={`md:hidden inline-flex items-center px-2 py-0.5 text-[0.625rem] tracking-wide rounded-sm ${highlight ? "text-[#1B3F7A] bg-[#1B3F7A]/10" : "text-[var(--color-text-muted)] bg-[var(--color-border)]/60"}`}>
                      {sub}
                    </span>
                  )}
                  {badge && (
                    <span className="inline-flex items-center px-2.5 py-1 text-[0.5625rem] font-bold tracking-wider bg-[#1B3F7A] text-white rounded-[2px]">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-[0.8125rem] text-[var(--color-text-muted)] leading-snug">
                  {desc}
                </p>
              </div>

              {/* 적용 인원 */}
              <div className="hidden md:flex items-center justify-end">
                <span className={`text-[0.8125rem] tracking-wide ${highlight ? "text-[#1B3F7A] font-medium" : "text-[var(--color-text-muted)]"}`}>
                  {sub}
                </span>
              </div>

              {/* 단가 */}
              <div className="flex items-baseline gap-1 md:justify-end">
                <span className={`text-[1.625rem] font-bold tracking-tight ${highlight ? "text-[#1B3F7A]" : "text-[var(--color-text-primary)]"}`}>
                  {price}
                </span>
                <span className={`text-[0.75rem] ${highlight ? "text-[#1B3F7A]/60" : "text-[var(--color-text-muted)]"}`}>
                  {unit}
                </span>
              </div>
            </motion.div>
          ))}

          {/* 테이블 하단 — 연합 신청 유도 */}
          <motion.div
            className="bg-[var(--color-soft-beige)] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            variants={slideUp}
          >
            <p className="text-[0.8125rem] text-[var(--color-text-secondary)] leading-relaxed">
              <span className="font-semibold text-[var(--color-text-primary)]">옆 반과 함께하면 예산이 절약됩니다</span>
              &nbsp;— 한 학급 평균 18인 기준, 단독 신청 시 252,000원 →
              <span className="font-semibold text-[#1B3F7A]"> 30인 연합 신청 시 300,000원으로 12명 더 참여</span> 가능합니다.
            </p>
            <div className="flex-shrink-0 text-right whitespace-nowrap">
              <p className="text-[0.6875rem] text-[var(--color-text-muted)] tracking-wide">연합 신청 절감 효과</p>
              <p className="text-[0.9375rem] font-bold text-[#1B3F7A]">인당 4,000원 절감</p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── 무관리 성장 시스템 — Kit Feature Block ── */}
        <motion.div
          className="mt-20 md:mt-28"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div
            className="mb-12 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-10 items-center"
            variants={staggerContainer}
          >
            <motion.div variants={slideUp}>
              <p className="eyebrow mb-4">One-Bottle System</p>
              <h3 className="text-[1.75rem] md:text-[2.25rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--color-text-primary)] mb-4">
                관찰만으로 충분합니다.
              </h3>
              <p className="text-[0.9375rem] text-[var(--color-text-secondary)] leading-relaxed mb-5">
                아이들이 생명의 성장을 묵묵히 지켜볼 수 있도록,
                복잡한 관리는 저희가 설계한 키트가 대신합니다.
              </p>
              <div className="border-l-2 border-[var(--color-brand-muted)] pl-5 py-1">
                <p className="text-[0.75rem] font-semibold text-[var(--color-brand)] mb-1 tracking-wide">
                  왜 무관리가 가능한가?
                </p>
                <p className="text-[0.8125rem] text-[var(--color-text-secondary)] leading-[1.85]">
                  장수풍뎅이(<span style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>Trypoxylus dichotomus</span>) 3령 유충은
                  발효 참나무 톱밥을 먹이이자 서식지로 사용하며,
                  번데기방을 스스로 만드는 생태적 특성을 가집니다.
                  이 특성 덕분에 유충 입식부터 우화까지 유충병 한 통 안에서 완결됩니다.
                </p>
              </div>
            </motion.div>

            <motion.div className="hidden md:flex flex-col gap-2" variants={slideUp}>
              <div
                className="w-full aspect-[2/3] relative overflow-hidden"
                style={{ border: "1px solid var(--color-border)" }}
              >
                <Image
                  src="/images/유충병.png"
                  alt="유충병 단면 구조"
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
              <p className="text-[0.6rem] text-center text-[var(--color-text-muted)] tracking-wide">
                자체 제작 전용 유충병 · 친환경 발효 참나무 톱밥 충진
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 md:overflow-x-visible md:grid md:grid-cols-3 md:gap-px md:bg-[var(--color-border)]"
            variants={staggerContainer}
          >
            {kitFeatures.map(({ icon, title, ecoBasis, desc }, i) => (
              <motion.div
                key={title}
                className="snap-start flex-shrink-0 w-[78vw] border border-[var(--color-border)] md:border-0 md:w-auto bg-[var(--color-off-white)] p-5 md:p-8 flex flex-col gap-3 md:gap-4"
                variants={slideUpStagger}
                custom={i}
              >
                <span className="text-2xl text-[var(--color-brand-muted)] select-none font-mono">{icon}</span>
                <div>
                  <h4 className="text-base font-bold text-[var(--color-text-primary)] tracking-tight mb-1">{title}</h4>
                  <span className="text-[0.6rem] tracking-wide text-[var(--color-brand)] opacity-70 font-medium">근거: {ecoBasis}</span>
                </div>
                <p className="text-[0.875rem] leading-relaxed text-[var(--color-text-secondary)]">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="mt-px bg-[var(--color-soft-beige)] px-8 py-8" variants={slideUp}>
            <p className="text-[var(--color-text-primary)] font-semibold text-[0.9375rem] mb-3">
              선생님이 신경 쓰실 것은 없습니다.
            </p>
            <p className="text-[0.875rem] text-[var(--color-text-secondary)] leading-relaxed">
              키트를 교실에 두고 아이들이 관찰 일지를 쓰는 것만으로 교육 목표가 달성됩니다.
              <br className="hidden md:block" />
              먹이 주기, 청소, 온도 관리 — 이 모든 것은 키트 설계 단계에서 이미 해결되어 있습니다.
            </p>
          </motion.div>
        </motion.div>

        {/* ── 가격 철학 블록 ──────────────────────────── */}
        <motion.div
          className="mt-16 border-l-[3px] border-[var(--color-brand)] pl-7 py-2"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[0.9375rem] font-semibold text-[var(--color-text-primary)] mb-3">
            어떻게 이 가격이 가능한가요?
          </p>
          <p className="text-[0.875rem] text-[var(--color-text-secondary)] leading-[1.85]">
            학급·학년 단위로 신청 인원이 늘어날수록 부자재 대량 수급 단가가 낮아집니다.
            저희는 이 운영 효율화에 따른 절감분을 수익으로 남기지 않고,
            교육 지원가 하향 조정을 통해 학교 현장에 그대로 환원합니다.
            <br /><br />
            강사 운영 체계의 효율화와 물류 최적화를 통해
            절감된 비용은 모두 교육 현장으로 환원됩니다.
          </p>
        </motion.div>

        {/* ── 예산 처리 안내 배너 ─────────────────────── */}
        <motion.div
          className="mt-10 bg-[var(--color-soft-beige)] border border-[var(--color-border)] px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="text-[0.75rem] font-semibold tracking-wide text-[var(--color-brand)] mb-2">
              📋 &nbsp;학교 예산으로 간편하게 처리하실 수 있습니다.
            </p>
            <p className="text-[0.875rem] text-[var(--color-text-secondary)] leading-relaxed">
              키트 비용은 학교 회계의 &apos;교육활동 재료비&apos; 또는 &apos;체험학습 소모품비&apos; 항목으로 처리 가능합니다.
              <br />
              필요 시 간이 견적서·세금계산서 발행 가능하오니 문의해주세요.
            </p>
          </div>
          <a
            href="#contact"
            className="flex-shrink-0 inline-flex items-center justify-center min-h-[48px] px-6 py-3.5 w-full sm:w-auto border border-[var(--color-brand)] text-[var(--color-brand)] text-[0.8125rem] font-semibold tracking-wide hover:bg-[var(--color-brand)] hover:text-white transition-all duration-200"
          >
            견적서 요청하기 →
          </a>
        </motion.div>

      </div>
    </section>
  );
}
