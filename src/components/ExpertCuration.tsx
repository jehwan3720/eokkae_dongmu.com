"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

const checks = [
  {
    title: "한국곤충학회 연구진의 철저한 성분 검증 완료",
    desc: "발효 참나무 톱밥의 배합 비율부터 수분 함량까지, 학회지 데이터를 기반으로 유충 생존율과 교실 안전성을 이중 검증했습니다.",
  },
  {
    title: "2022 개정 교육과정 성취기준에 최적화된 구성",
    desc: "초등 3학년 '동물의 한살이' 단원 및 누리과정 자연탐구 영역의 성취기준을 분석하여 관찰 순서와 활동지를 설계했습니다.",
  },
  {
    title: "냄새와 벌레 꼬임을 원천 차단하는 독자적 배합 톱밥 기술",
    desc: "부패 억제 발효 공정과 밀봉 통기 구조를 결합하여 교실 환경에서 냄새·초파리·응애 발생을 구조적으로 차단합니다.",
  },
  {
    title: "어린이 제품 안전 기준(KC)을 상회하는 엄격한 품질 관리",
    desc: "KC 인증 기준 이상의 내부 품질 체크리스트를 적용합니다. 유해 물질 부재 및 구조 안전성을 납품 전 전수 검사합니다.",
  },
];

export default function ExpertCuration() {
  return (
    <section
      id="expert-curation"
      className="bg-[#F8F9FB] py-24 md:py-36 border-t border-[#E8EAED]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* ── 섹션 헤더 ── */}
        <motion.div
          className="mb-16 max-w-2xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p
            className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-[var(--color-brand)] mb-4"
            variants={slideUp}
          >
            전문가 큐레이션 및 검증
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.875rem] font-bold leading-[1.1] tracking-[-0.03em] text-[#0F1F3D] mb-6"
            variants={slideUp}
          >
            전문가가 직접 설계한<br />
            가장 완벽한 생태 교육 도구
          </motion.h2>
          <motion.p
            className="text-[0.9375rem] text-[#5A6472] leading-[1.9]"
            variants={slideUp}
          >
            어깨동무의 키트는 한국곤충학회 연구 데이터를 기반으로,
            아이들에게 가장 안전하고 교육적인 환경을 제공하기 위해
            전문가가 직접 성분을 엄선하고 구성품을 배치했습니다.
          </motion.p>
        </motion.div>

        {/* ── 본문 2컬럼 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-20 items-start">

          {/* 좌측 — 체크리스트 */}
          <motion.div
            className="flex flex-col gap-0"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {checks.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                className="flex gap-5 py-7 border-b border-[#E8EAED] first:border-t first:border-[#E8EAED]"
                variants={slideUpStagger}
                custom={i}
                transition={{ duration: 0.9 }}
              >
                {/* 아이콘 */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand)]/8 flex items-center justify-center">
                    <CheckCircle2
                      size={16}
                      className="text-[var(--color-brand)]"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* 텍스트 */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[0.9375rem] font-semibold tracking-tight text-[#0F1F3D] leading-snug">
                    {title}
                  </p>
                  <p className="text-[0.8125rem] text-[#7A8899] leading-[1.85]">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 우측 — 이미지 플레이스홀더 */}
          <motion.div
            className="lg:sticky lg:top-24"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            {/* 메인 이미지 영역 */}
            <div
              className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative flex items-center justify-center"
              style={{ backgroundColor: "#DDE6F0" }}
            >
              {/* 플레이스홀더 레이블 */}
              <div className="flex flex-col items-center gap-2 select-none pointer-events-none">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#C5D4E8" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#8AAFD8" strokeWidth="1.5"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#8AAFD8"/>
                    <path d="M21 15l-5-5L5 21" stroke="#8AAFD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span
                  className="text-[0.625rem] tracking-[0.18em] uppercase"
                  style={{ color: "#8AAFD8" }}
                >
                  전문가 검수 사진
                </span>
              </div>
            </div>

            {/* 하단 인용구 */}
            <div
              className="mt-5 px-6 py-5 rounded-xl border border-[#E0E8F2]"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <p
                className="text-[0.875rem] leading-[1.9] text-[#5A6472]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
              >
                &ldquo;교육 효과는 도구의 안전함과 아이가 느끼는 경이로움이
                동시에 충족될 때 비로소 완성됩니다.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-5 h-px bg-[#C8D4E0]" />
                <cite
                  className="not-italic text-[0.6875rem] tracking-wide"
                  style={{ color: "#A0AEBB" }}
                >
                  어깨동무 키트 개발 원칙
                </cite>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
