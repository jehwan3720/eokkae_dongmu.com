"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

const rows = [
  {
    label: "교육 근거",
    generic: "강사 재량 커리큘럼",
    ours: "한국곤충학회지 기반 이론 병행",
    highlight: false,
  },
  {
    label: "교육 형태",
    generic: "1회성 이벤트",
    ours: "4단계 연속 커리큘럼",
    highlight: false,
  },
  {
    label: "체계성",
    generic: "비표준화",
    ours: "표준화된 교육 방법론",
    highlight: false,
  },
  {
    label: "사후 연계",
    generic: "사후 관리 없음",
    ours: "가정·교실 연계 관찰 가이드",
    highlight: false,
  },
  {
    label: "비용",
    generic: "고비용 패키지",
    ours: "강사비 0원 + 키트비만 부담",
    highlight: false,
  },
  {
    label: "사후 관리",
    generic: "교사가 먹이·청소 담당",
    ours: "무관리 올인원 키트 — 관찰만",
    highlight: true,
    note: "유충병 1통 · 추가 급여 없음 · 톱밥 교체 없음",
  },
];

export default function Differentiation() {
  return (
    <section
      id="differentiation"
      className="bg-[var(--color-soft-beige)] py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* 섹션 헤더 */}
        <motion.div
          className="mb-16 max-w-xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow mb-4" variants={slideUp}>
            차별성
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--color-text-primary)]"
            variants={slideUp}
          >
            일반 생태 체험과<br />어깨동무가 다른 이유
          </motion.h2>
        </motion.div>

        {/* 비교 테이블 */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* 헤더 행 */}
          <motion.div
            className="grid grid-cols-[auto_1fr_1fr] border-b border-[var(--color-border)] pb-3 mb-1"
            variants={slideUp}
          >
            <div className="w-28 md:w-40" />
            <div className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-text-muted)] px-4">
              일반 생태 체험
            </div>
            <div className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] px-4">
              어깨동무
            </div>
          </motion.div>

          {/* 데이터 행 */}
          {rows.map(({ label, generic, ours, highlight, note }, i) => (
            <motion.div
              key={label}
              className={`grid grid-cols-[auto_1fr_1fr] transition-colors duration-200 cursor-default ${
                highlight
                  ? "border-y-2 border-[var(--color-brand)]/30 bg-[var(--color-brand)]/5"
                  : "border-b border-[var(--color-border)]"
              }`}
              variants={slideUpStagger}
              custom={i}
              whileHover={{
                scale: 1.012,
                transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              {/* 행 레이블 */}
              <div className="w-28 md:w-40 py-4 pr-4 flex items-center gap-2">
                <span
                  className={`text-[0.75rem] font-semibold tracking-tighter ${
                    highlight
                      ? "text-[var(--color-brand)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {label}
                </span>
                {highlight && (
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wide bg-[var(--color-brand)] text-white rounded-[3px]">
                    핵심
                  </span>
                )}
              </div>

              {/* 일반 */}
              <div
                className={`py-4 px-4 text-[0.875rem] leading-relaxed ${
                  highlight
                    ? "text-[var(--color-text-muted)]"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                {generic}
              </div>

              {/* 어깨동무 */}
              <div
                className={`py-4 px-4 text-[0.875rem] leading-relaxed font-medium ${
                  highlight
                    ? "text-[var(--color-brand)]"
                    : "text-[var(--color-text-primary)]"
                }`}
              >
                {ours}
                {note && (
                  <p className="mt-1 text-[0.6875rem] font-normal text-[var(--color-text-muted)] tracking-wide">
                    {note}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
