"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

const steps = [
  {
    num: "01",
    title: "방문 및 전문 교육",
    desc: "전문 강사가 직접 학교를 방문하여 곤충 생태와 생명 존중의 가치를 스토리텔링으로 전달합니다.",
  },
  {
    num: "02",
    title: "유충 키트 배부",
    desc: "아이들이 직접 3령 유충을 입식하며, 추가 관리가 필요 없는 '자기 완결형 키트'를 개인별로 전달합니다.",
  },
  {
    num: "03",
    title: "관찰 및 사후 지원",
    desc: "관찰 일지 작성법을 교육하고, 우화까지의 전 과정에서 발생하는 궁금증을 온/오프라인으로 실시간 지원합니다.",
  },
];

export default function Process() {
  return (
    <section className="bg-[#F4F5F7] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* 섹션 헤더 */}
        <motion.div
          className="mb-14 max-w-xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow mb-4" variants={slideUp}>
            교육 진행 방식
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--color-text-primary)]"
            variants={slideUp}
          >
            전문가가 함께하는<br />체계적인 생태 교육 공정
          </motion.h2>
        </motion.div>

        {/* 3단계 리스트 */}
        <motion.div
          className="flex flex-col divide-y divide-[var(--color-border)]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {steps.map(({ num, title, desc }, i) => (
            <motion.div
              key={num}
              className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_200px_1fr] items-start gap-4 py-8"
              variants={slideUpStagger}
              custom={i}
            >
              {/* 스텝 번호 */}
              <span
                className="text-[2rem] md:text-[2.5rem] font-bold leading-none tracking-[-0.04em]"
                style={{ color: "var(--color-brand)", opacity: 0.25 }}
              >
                {num}
              </span>

              {/* 타이틀 */}
              <p className="pt-1 text-[0.9375rem] font-semibold text-[var(--color-text-primary)] tracking-tight leading-snug">
                {title}
              </p>

              {/* 설명 */}
              <p className="pt-1 text-[0.875rem] leading-[1.85] text-[var(--color-text-secondary)]">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 하단 신뢰 문구 */}
        <motion.p
          className="mt-10 text-[0.75rem] text-[var(--color-text-muted)] tracking-wide border-t border-[var(--color-border)] pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={VIEWPORT}
        >
          선생님의 관리 부담 0% — 모든 과정은 전문가가 주도합니다
        </motion.p>

      </div>
    </section>
  );
}
