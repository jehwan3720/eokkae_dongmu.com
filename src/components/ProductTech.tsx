"use client";

import { motion } from "framer-motion";
import { Wind, Bug, EyeOff } from "lucide-react";
import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

const features = [
  {
    Icon: Wind,
    title: "냄새 無",
    label: "ODOR FREE",
    desc: "친환경 발효 참나무 톱밥은 유충의 먹이이자 서식지입니다. 특수 배합 공정으로 교실 내 악취가 발생하지 않습니다.",
    detail: "일반 사육 환경과 달리 냄새 발생 원인인 부패를 억제하는 발효 숙성 톱밥을 사용합니다.",
  },
  {
    Icon: Bug,
    title: "벌레 無",
    label: "PEST FREE",
    desc: "유충병 밀봉 구조로 초파리·응애 등 해충의 유입이 원천 차단됩니다. 교실 환경을 오염시키지 않습니다.",
    detail: "뚜껑 구조와 통기 시스템이 병행 설계되어 산소는 공급하되 외부 해충은 차단합니다.",
  },
  {
    Icon: EyeOff,
    title: "관리 無",
    label: "ZERO MAINTENANCE",
    desc: "유충 입식부터 성충 우화까지 추가 먹이 교체·청소·온도 관리가 전혀 필요 없습니다. 관찰만으로 충분합니다.",
    detail: "유충병 한 통 안에 성충까지 성장하는 데 필요한 모든 것이 설계 단계에서 이미 해결되어 있습니다.",
  },
];

export default function ProductTech() {
  return (
    <section id="product-tech" className="bg-[var(--color-soft-beige)] py-24 md:py-32 border-t border-[var(--color-border)]">
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
            무관리 원보틀 시스템
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--color-text-primary)]"
            variants={slideUp}
          >
            냄새도, 벌레도,<br />먹이 교체도 없습니다
          </motion.h2>
          <motion.p
            className="mt-5 text-[0.9375rem] text-[var(--color-text-secondary)] leading-relaxed"
            variants={slideUp}
          >
            덮어두고 관찰만 하면 되는 특수 배합 톱밥 기술 적용.<br className="hidden md:block" />
            교실 환경에 최적화된 유일한 솔루션입니다.
          </motion.p>
        </motion.div>

        {/* 3가지 특징 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {features.map(({ Icon, title, label, desc, detail }, i) => (
            <motion.div
              key={title}
              className="bg-[var(--color-soft-beige)] p-10 flex flex-col gap-6"
              variants={slideUpStagger}
              custom={i}
            >
              {/* 아이콘 + 라벨 */}
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand)]/10 flex items-center justify-center">
                  <Icon size={21} className="text-[var(--color-brand)]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[0.5rem] font-semibold tracking-[0.22em] uppercase text-[var(--color-brand)] opacity-70 mb-1">
                    {label}
                  </p>
                  <h3 className="text-[1.5rem] font-bold tracking-tight text-[var(--color-text-primary)]">
                    {title}
                  </h3>
                </div>
              </div>

              {/* 메인 설명 */}
              <p className="text-[0.9375rem] text-[var(--color-text-secondary)] leading-[1.85]">
                {desc}
              </p>

              {/* 기술 상세 */}
              <p className="text-[0.8125rem] text-[var(--color-text-muted)] leading-[1.85] pt-4 border-t border-[var(--color-border)]">
                {detail}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 교사 안심 문구 */}
        <motion.div
          className="mt-8 bg-[var(--color-brand)] rounded-xl px-8 py-7 text-white"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-white/50 mb-3">
            선생님께 드리는 말씀
          </p>
          <p className="text-[1rem] md:text-[1.0625rem] font-medium leading-[1.85]">
            선생님이 신경 쓰실 것은 없습니다.
          </p>
          <p className="mt-2 text-white/70 text-[0.875rem] leading-[1.85]">
            키트를 교실에 두고 아이들이 관찰 일지를 쓰는 것만으로 교육 목표가 달성됩니다.<br className="hidden md:block" />
            먹이 주기, 청소, 온도 관리 — 이 모든 것은 키트 설계 단계에서 이미 해결되어 있습니다.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
