"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, BookOpen, FileText, Trophy, Heart } from "lucide-react";
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
];

const credentials = [
  { Icon: BookOpen, text: "사범대학 역사교육 전공 (교육학적 기초)" },
  { Icon: FileText, text: "곤충 생태 관련 학술 논문 저자" },
  { Icon: Trophy,   text: "전국 곤충학회 곤충 연구대회 대상" },
  { Icon: Heart,    text: "생태 교육 봉사 활동 기획 및 자발적 참여" },
];

const careerDetails = [
  {
    category: "연구 및 학술",
    items: [
      "수서 생물 종간 포식 관계 및 생태적 메커니즘 분석 연구 진행",
      "원주과학관 곤충 학술대회 대상 수상",
    ],
  },
  {
    category: "공공 및 관리",
    items: [
      "화천군 생태 오염원 저감 습지(Biotope) 관리장 역임 및 모니터링 수행",
    ],
  },
  {
    category: "전시 및 교육",
    items: [
      "'잠자리: 찰나의 궤적' 개인 사진 전시회 주최",
      "청소년 생태 학습권 보장을 위한 곤충 지식 큐레이션 플랫폼 운영",
    ],
  },
];

const quote = `토론 대회 준비를 위해 생태계를 공부하던 날들, 그리고 아이들과 함께한 봉사 현장에서 처음 장수풍뎅이를 손에 쥐어준 순간을 잊지 못합니다. 그 아이의 눈빛이 바뀌는 데는 단 3초도 걸리지 않았습니다. 저는 그 3초를 더 많은 아이들에게 전하고 싶습니다.`;

export default function ExpertCuration() {
  return (
    <section
      id="expert-curation"
      className="bg-[#F8F9FB] py-24 md:py-36 border-t border-[#E8EAED]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* ── 섹션 헤더 ── */}
        <motion.div
          className="mb-10 max-w-2xl"
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

        {/* ── 검증 체크리스트 + 프로필 카드 ── */}
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 -mb-10">

          {/* 좌측 — 체크리스트 */}
          <motion.div
            className="flex-1 min-w-0 flex flex-col gap-0"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {checks.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                className="flex gap-5 py-12 border-b border-[#E8EAED] first:border-t first:border-[#E8EAED] first:pt-0"
                variants={slideUpStagger}
                custom={i}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand)]/[0.08] flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-[var(--color-brand)]" strokeWidth={2} />
                  </div>
                </div>
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

          {/* 우측 — 전문가 프로필 카드 */}
          <div className="w-full lg:w-[380px] flex-shrink-0 lg:-mt-40" style={{ alignSelf: 'flex-start' }}>
            <motion.div
              className="bg-white border border-[#E8EAED] rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              {/* 프로필 상단 */}
              <div className="flex flex-col items-center gap-4 px-8 pt-8 pb-6 border-b border-[#E8EAED]">
                <div className="w-24 h-24 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image
                    src="/images/김태욱.jpg"
                    alt="김태욱"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="text-center">
                  <p className="text-[1rem] font-bold tracking-tight text-[#0F1F3D]">김태욱</p>
                  <p className="text-[0.75rem] text-[#8A95A3] mt-0.5 tracking-wide">
                    생태교육 총괄 디렉터 · 키트 설계자
                  </p>
                </div>
              </div>

              {/* 자격 목록 */}
              <ul className="flex flex-col gap-3 px-8 py-6 border-b border-[#E8EAED]">
                {credentials.map(({ Icon, text }, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.8125rem] text-[#5A6472] leading-snug">
                    <Icon size={13} className="flex-shrink-0 text-[#B0BCC8] mt-0.5" strokeWidth={1.75} />
                    {text}
                  </li>
                ))}
              </ul>

              {/* 인용구 */}
              <div className="relative px-8 py-6 bg-[#F8F9FB]">
                <span
                  aria-hidden="true"
                  className="absolute top-3 left-6 text-[3.5rem] leading-none text-[var(--color-brand)] select-none pointer-events-none"
                  style={{ opacity: 0.10, fontFamily: "Georgia, serif" }}
                >
                  &ldquo;
                </span>
                <p
                  className="text-[0.8125rem] text-[#374151] relative z-10"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", lineHeight: 1.8 }}
                >
                  {quote}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-4 h-px bg-[#C8D4E0]" />
                  <cite className="not-italic text-[0.625rem] text-[#A0AEBB] tracking-wide">
                    김태욱 · 생태교육 총괄 디렉터
                  </cite>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── 상세 경력 3열 ── */}
        <motion.div
          className="pt-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p
            className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-8"
            variants={slideUp}
          >
            상세 경력
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {careerDetails.map(({ category, items }, i) => (
              <motion.div key={category} variants={slideUpStagger} custom={i}>
                <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-[#0F1F3D] mb-4">
                  {category}
                </p>
                <ul className="flex flex-col gap-3">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[0.8125rem] text-[#5A6472] leading-relaxed">
                      <span className="flex-shrink-0 mt-[0.4rem] w-1 h-1 rounded-full bg-[#B0BCC8]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
