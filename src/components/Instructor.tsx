"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, FileText, Trophy, Heart, ChevronDown } from "lucide-react";
import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

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

const about = `역사 교육이 인간의 시간을 이해하는 학문이라면, 생태 교육은 생명의 시간을 이해하는 학문입니다. 사범대학에서 역사교육을 전공하며 쌓은 서사적 교육 방법론과, 곤충 생태 연구를 통해 얻은 과학적 전문성을 결합하여 아이들이 단순히 '보는' 것을 넘어 생명의 흐름을 깊이 있게 '이해'하는 수업을 설계합니다.`;

const quote = `토론 대회 준비를 위해 생태계를 공부하던 날들, 그리고 아이들과 함께한 봉사 현장에서 처음 장수풍뎅이를 손에 쥐어준 순간을 잊지 못합니다. 그 아이의 눈빛이 바뀌는 데는 단 3초도 걸리지 않았습니다. 저는 그 3초를 더 많은 아이들에게 전하고 싶습니다.`;

export default function Instructor() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="instructor" className="bg-neutral-50 py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* ── 섹션 헤더 ───────────────────────────────── */}
        <motion.div
          className="mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p
            className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-3"
            variants={slideUp}
          >
            강사 소개
          </motion.p>
          <motion.h2
            className="text-[2.5rem] md:text-[3.25rem] font-bold tracking-tighter leading-[1.1] text-[var(--color-text-primary)]"
            variants={slideUp}
          >
            이 수업을 이끄는 전문가
          </motion.h2>
        </motion.div>

        {/* ── 메인 프로필 카드 ─────────────────────────── */}
        <motion.div
          className="bg-white overflow-hidden"
          style={{ boxShadow: "0 1px 4px rgba(15,31,61,0.06), 0 8px 32px rgba(15,31,61,0.04)" }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">

            {/* 좌측 — 프로필 사진 + 자격 */}
            <motion.div
              className="flex flex-col items-center gap-6 px-10 py-12 border-b lg:border-b-0 lg:border-r border-neutral-100"
              variants={slideUpStagger}
              custom={0}
            >
              {/* 프로필 사진 */}
              <div className="w-36 h-36 rounded-full overflow-hidden flex-shrink-0 relative">
                <Image
                  src="/images/김태욱.jpg"
                  alt="김태욱"
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </div>

              {/* 이름 + 직함 */}
              <div className="text-center">
                <p className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                  김태욱
                </p>
                <p className="text-[0.8125rem] text-neutral-500 mt-1 tracking-wide">
                  생태교육 총괄 디렉터
                </p>
              </div>

              <div className="w-8 h-px bg-neutral-200" />

              {/* 자격 & 이력 */}
              <ul className="w-full flex flex-col gap-4">
                {credentials.map(({ Icon, text }, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.8125rem] text-neutral-600 leading-snug">
                    <Icon size={13} className="flex-shrink-0 text-neutral-300 mt-0.5" strokeWidth={1.75} />
                    {text}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 우측 — About + Vision */}
            <div className="flex flex-col">

              {/* About */}
              <motion.div
                className="px-10 pt-12 pb-10 border-b border-neutral-100"
                variants={slideUpStagger}
                custom={1}
              >
                <p className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-neutral-400 mb-5">
                  About
                </p>
                <p className="text-[0.9375rem] text-neutral-600 leading-[1.95]">
                  {about}
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                className="relative px-10 py-10 flex-1 bg-neutral-50/60"
                variants={slideUpStagger}
                custom={2}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-6 left-8 text-[5rem] leading-none text-[var(--color-brand)] select-none pointer-events-none"
                  style={{ opacity: 0.10, fontFamily: "Georgia, serif" }}
                >
                  &ldquo;
                </span>
                <p className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-neutral-400 mb-5">
                  Vision
                </p>
                <blockquote>
                  <p
                    className="text-[1rem] md:text-[1.0625rem] leading-[1.95] text-neutral-600 italic relative z-10"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {quote}
                  </p>
                  <footer className="mt-7 flex items-center gap-3">
                    <div className="w-6 h-px bg-neutral-300" />
                    <cite className="not-italic text-[0.75rem] text-neutral-400 tracking-wide">
                      김태욱 &nbsp;·&nbsp; 생태교육 총괄 디렉터
                    </cite>
                  </footer>
                </blockquote>
              </motion.div>
            </div>
          </div>

          {/* ── 경력 더 보기 버튼 ─────────────────────── */}
          <div className="border-t border-neutral-100">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full flex items-center justify-center gap-2 py-4 text-[0.8125rem] font-medium text-neutral-400 hover:text-[var(--color-brand)] hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <span>{expanded ? "상세 경력 접기" : "상세 경력 더 보기"}</span>
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <ChevronDown size={15} strokeWidth={2} />
              </motion.span>
            </button>
          </div>

          {/* ── 확장 영역 ─────────────────────────────── */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="bg-[#F9FAFB] border-t border-neutral-100 px-10 py-10">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                    {careerDetails.map(({ category, items }) => (
                      <div key={category}>
                        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-brand)] mb-4">
                          {category}
                        </p>
                        <ul className="flex flex-col gap-2.5">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[0.8125rem] text-neutral-500 leading-relaxed">
                              <span className="flex-shrink-0 mt-[0.35rem] w-1 h-1 rounded-full bg-neutral-300" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </section>
  );
}
