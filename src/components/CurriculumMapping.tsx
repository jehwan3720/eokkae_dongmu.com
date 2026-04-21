"use client";

import { motion } from "framer-motion";
import { CheckCircle2, BookOpen, Leaf, GraduationCap } from "lucide-react";
import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

const mappings = [
  {
    Icon: Leaf,
    badge: "유치원",
    curriculum: "누리과정",
    area: "자연탐구 영역",
    standard: "생명체와 자연환경 알아보기",
    detail:
      "동식물의 특성과 한살이를 관찰하고 탐구하는 내용 요소에 직접 부합합니다. 아이들이 생명체를 직접 관찰하며 경이로움을 경험하는 목표와 일치합니다.",
    points: ["자연탐구 영역 연계", "생명 존중 태도 함양", "관찰·탐구 역량 강화"],
  },
  {
    Icon: BookOpen,
    badge: "초등 3~4학년",
    curriculum: "2022 개정 교육과정 과학",
    area: "생명 과학 영역",
    standard: "동물의 한살이 / 동물의 생활",
    detail:
      "초등학교 3학년 '동물의 한살이' 단원과 완벽히 연계됩니다. 알·유충·번데기·성충의 4단계 변태 과정을 실물로 관찰하며 교과 성취기준을 달성합니다.",
    points: ["3학년 과학 성취기준 직접 연계", "한살이 4단계 실물 관찰", "기록·탐구 활동 포함"],
  },
  {
    Icon: GraduationCap,
    badge: "전 학년",
    curriculum: "생태전환교육",
    area: "교육부 정책 방향",
    standard: "생태감수성 · 생명 존중 · 지속가능성",
    detail:
      "교육부 생태전환교육 중점 학교 기준에 부합합니다. 한국곤충학회지(Korean Journal of Applied Entomology) 연구 데이터를 기반으로 설계된 커리큘럼입니다.",
    points: ["생태전환교육 목표 부합", "학술 데이터 기반 설계", "교육청 공문 제출 가능"],
  },
];

export default function CurriculumMapping() {
  return (
    <section id="curriculum-mapping" className="bg-[var(--color-soft-beige)] py-24 md:py-32 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* 섹션 헤더 */}
        <motion.div
          className="mb-16 max-w-2xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow mb-4" variants={slideUp}>
            교과 연계 검증
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--color-text-primary)]"
            variants={slideUp}
          >
            한국곤충학회 연구 데이터 기반,<br />
            공교육 교과 과정에 완벽히 맞춘<br className="hidden md:block" />
            4단계 관찰 커리큘럼
          </motion.h2>
          <motion.p
            className="mt-5 text-[0.9375rem] text-[var(--color-text-secondary)] leading-relaxed"
            variants={slideUp}
          >
            수업 지도안은 교육청 제출 기준으로 즉시 활용 가능합니다.
          </motion.p>
        </motion.div>

        {/* 연계 카드 3개 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {mappings.map(({ Icon, badge, curriculum, area, standard, detail, points }, i) => (
            <motion.div
              key={badge}
              className="bg-white border border-[var(--color-border)] rounded-2xl p-8 flex flex-col gap-6"
              variants={slideUpStagger}
              custom={i}
            >
              {/* 아이콘 + 배지 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)] flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-white" strokeWidth={1.6} />
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.625rem] font-bold tracking-[0.12em] uppercase border border-[var(--color-brand)]/20 text-[var(--color-brand)] bg-[var(--color-brand)]/[0.06]">
                  {badge}
                </span>
              </div>

              {/* 과정명 */}
              <div className="flex flex-col gap-1">
                <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-text-muted)]">
                  {curriculum}
                </p>
                <p className="text-[0.75rem] text-[var(--color-text-muted)]">{area}</p>
                <h3 className="text-[1rem] font-bold tracking-tight text-[var(--color-text-primary)] mt-1">
                  {standard}
                </h3>
              </div>

              {/* 설명 */}
              <p className="text-[0.8125rem] text-[var(--color-text-secondary)] leading-[1.85] flex-1">
                {detail}
              </p>

              {/* 연계 포인트 */}
              <ul className="flex flex-col gap-2 pt-4 border-t border-[var(--color-border)]">
                {points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-[0.75rem] text-[var(--color-text-secondary)]">
                    <CheckCircle2 size={13} className="flex-shrink-0 text-[var(--color-brand)]" strokeWidth={2} />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* 하단 학술 출처 */}
        <motion.p
          className="mt-8 text-[0.6875rem] text-[var(--color-text-muted)] tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
        >
          커리큘럼 근거 데이터: Korean Journal of Applied Entomology (한국응용곤충학회지) &nbsp;·&nbsp; 2022 개정 교육과정 교과서 성취기준
        </motion.p>

      </div>
    </section>
  );
}
