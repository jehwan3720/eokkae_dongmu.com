"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  slideUp,
  slideUpStagger,
  staggerContainer,
  cardHover,
  VIEWPORT,
} from "@/lib/motion";

// 수업 시작점: 3령 유충 입식부터 성충 관찰까지
const lifecycle = [
  { stage: "3령 유충", en: "Larva",  period: "입식 후 약 2~4개월" },
  { stage: "번데기",   en: "Pupa",   period: "변태 후 약 3~4주" },
  { stage: "우화",     en: "Eclose", period: "번데기방 탈출 순간" },
  { stage: "성충",     en: "Adult",  period: "관찰·기록 완성" },
];

const steps = [
  {
    step: "01",
    lifecycle: "유충",
    title: "3령 유충 입식",
    badge: "워크숍 · 올인원 키트",
    desc: "자체 제작 유충병에 3령 유충을 직접 입식합니다. 발효 참나무 톱밥이 먹이이자 서식지로 기능하여 추가 관리 없이 번데기까지 자급자족으로 성장합니다.",
    tags: ["#유충입식", "#친환경톱밥", "#무관리키트"],
    img: "/images/유충.jpg",
  },
  {
    step: "02",
    lifecycle: "번데기",
    title: "번데기 변태 관찰",
    badge: "번데기방 자가 조성",
    desc: "유충이 스스로 톱밥을 굳혀 번데기방을 만드는 과정을 관찰합니다. 인위적 개입 없이 진행되는 변태 과정을 일지로 기록하며 생명의 리듬을 몸으로 배웁니다.",
    tags: ["#번데기방", "#변태관찰", "#관찰일지"],
    img: "/images/가로번데기.jpg",
  },
  {
    step: "03",
    lifecycle: "우화",
    title: "우화 순간 포착",
    badge: "생명 전환의 결정적 순간",
    desc: "번데기를 벗고 성충으로 탈바꿈하는 우화 순간을 직접 목격합니다. 껍질을 벗어나는 그 짧은 순간이 아이들에게 생명에 대한 경이로움을 심어주는 핵심 장면입니다.",
    tags: ["#우화포착", "#생명경이", "#체험교육"],
    img: "/images/우화모습.jpg",
  },
  {
    step: "04",
    lifecycle: "성충",
    title: "성충 관찰 완성",
    badge: "가정·교실 연계 기록",
    desc: "완전히 굳은 성충을 직접 만지고 관찰하며 한살이 여정을 마무리합니다. 입식부터 성충까지의 관찰 일지를 완성하며 책임감과 생명 존중 감수성을 내면화합니다.",
    tags: ["#성충관찰", "#책임감", "#한살이완성"],
    img: "/images/성충.jpg",
  },
];

export default function Curriculum() {
  return (
    <section id="curriculum" className="bg-[var(--color-off-white)] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* 섹션 헤더 */}
        <motion.div
          className="mb-8 max-w-xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow mb-4" variants={slideUp}>
            커리큘럼
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--color-text-primary)]"
            variants={slideUp}
          >
            유충 입식부터 우화까지,<br />4단계 관찰 커리큘럼
          </motion.h2>
          <motion.p
            className="mt-4 text-[0.9375rem] text-[var(--color-text-secondary)] leading-relaxed"
            variants={slideUp}
          >
            3령 유충 입식부터 시작해 번데기·우화·성충 관찰까지, 아이들이 직접 목격하는 생명의 변화 전 과정입니다.
          </motion.p>
        </motion.div>

        {/* ── 한살이 타임라인 ───────────────────────── */}
        <motion.div
          className="mb-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* 연결선 + 단계 */}
          <div className="relative flex items-start gap-0">
            {lifecycle.map(({ stage, en, period }, i) => (
              <motion.div
                key={stage}
                className="flex-1 flex flex-col items-center relative"
                variants={slideUpStagger}
                custom={i}
              >
                {/* 가로 연결선 (마지막 제외) */}
                {i < lifecycle.length - 1 && (
                  <div
                    className="absolute top-4 left-1/2 w-full h-px"
                    style={{ backgroundColor: "var(--color-border)" }}
                  />
                )}

                {/* 단계 원 */}
                <div
                  className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.625rem] font-bold tracking-wide mb-3"
                  style={{ backgroundColor: "var(--color-brand)" }}
                >
                  {i + 1}
                </div>

                {/* 텍스트 */}
                <p className="text-[0.875rem] font-bold text-[var(--color-text-primary)] text-center">
                  {stage}
                </p>
                <p
                  className="text-[0.6rem] tracking-wider text-[var(--color-text-muted)] text-center mt-0.5"
                  style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
                >
                  {en}
                </p>
                <p className="mt-2 text-[0.6875rem] text-[var(--color-text-muted)] text-center leading-snug hidden sm:block">
                  {period}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 하단 주석 */}
          <motion.p
            className="mt-6 text-[0.6875rem] text-[var(--color-text-muted)] tracking-wide"
            variants={slideUp}
          >
            * 수업 시작점: 3령 유충 입식 / 생장 기간은 한국곤충학회지(Korean Journal of Applied Entomology) 데이터 기준이며 사육 환경에 따라 차이 있음
          </motion.p>
        </motion.div>

        {/* ── 4단계 카드 그리드 ─────────────────────── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {steps.map(({ step, lifecycle: lc, title, badge, desc, tags, img }, i) => (
            <motion.div
              key={step}
              className="bg-[var(--color-off-white)] flex flex-col cursor-default"
              variants={slideUpStagger}
              custom={i}
              initial="rest"
              whileHover="hover"
            >
              {/* 이미지 */}
              <motion.div
                className="w-full aspect-[4/3] relative overflow-hidden"
                style={{ borderBottom: "1px solid var(--color-border)" }}
                variants={cardHover}
              >
                <Image
                  src={img}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </motion.div>

              {/* 카드 본문 */}
              <div className="p-7 flex flex-col gap-4 flex-1">
                {/* Step + 한살이 단계 */}
                <div className="flex items-baseline justify-between">
                  <motion.span
                    className="text-[3rem] font-bold leading-none tracking-tighter text-[var(--color-brand-muted)] select-none"
                  >
                    {step}
                  </motion.span>
                  <span className="text-[0.6rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] opacity-70">
                    {lc}
                  </span>
                </div>

                {/* Title + badge */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
                    {title}
                  </h3>
                  <span className="inline-block self-start px-2.5 py-1 text-[0.6rem] font-semibold tracking-wide rounded-sm bg-[var(--color-soft-beige)] text-[var(--color-brand)]">
                    {badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[0.8125rem] leading-relaxed text-[var(--color-text-secondary)] flex-1">
                  {desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--color-border)]">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.6rem] text-[var(--color-text-muted)] tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
