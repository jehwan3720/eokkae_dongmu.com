"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUpStagger, VIEWPORT } from "@/lib/motion";

const items = [
  { icon: "📄", text: "한국곤충학회지 기반 커리큘럼", sub: null },
  { icon: "🏫", text: "누적 8개 학교 도입",             sub: null },
  { icon: "👦", text: "+240명 이상의 학생 참여",           sub: null },
  {
    icon: "💰",
    text: "10,000원 (학급 단위 지원가 기준)",
    sub: "20인 이상 신청 시 운영 효율화에 따른 비용 환원 적용",
  },
  { icon: "🌱", text: "무관리 올인원 키트 제공",        sub: null },
];

export default function TrustBar() {
  return (
    <section className="bg-[var(--color-soft-beige)] border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <motion.ul
          className="grid grid-cols-2 gap-x-6 gap-y-5 py-6 md:flex md:flex-wrap md:justify-between md:items-start md:gap-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {items.map(({ icon, text, sub }, i) => (
            <motion.li
              key={text}
              className={`flex flex-col gap-0.5${i === items.length - 1 && items.length % 2 !== 0 ? " col-span-2" : ""}`}
              variants={slideUpStagger}
              custom={i}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{icon}</span>
                <span className="text-[0.8125rem] font-medium text-[var(--color-text-secondary)] tracking-wide">
                  {text}
                </span>
                {i < items.length - 1 && (
                  <span className="hidden lg:block ml-4 w-px h-4 bg-[var(--color-border)]" />
                )}
              </div>
              {sub && (
                <p className="ml-[1.875rem] text-[0.6rem] text-[var(--color-text-muted)] tracking-wide leading-snug">
                  {sub}
                </p>
              )}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
