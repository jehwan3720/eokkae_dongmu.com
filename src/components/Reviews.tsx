"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

const reviews = [
  {
    quote:
      "수업 전에는 벌레만 봐도 소리 지르던 아이가, 수업 후에는 사육통을 직접 챙기겠다고 했어요. 그 변화가 저도 놀라웠습니다.",
    author: "○○초등학교 3학년 담임",
    name: "박병환 선생님",
  },
  {
    quote:
      "2022 개정 교육과정의 생태전환교육 목표와 이렇게 잘 맞아 떨어지는 프로그램은 처음이었어요. 학회지 기반이라는 점에서 학부모 안내도 훨씬 수월했습니다.",
    author: "○○초등학교 4학년 담임",
    name: "박원용 선생님",
  },
  {
    quote:
      "키트를 교실에 두었는데 아이들이 먼저 관찰 일지를 꺼내 쓰더라고요. 따로 제가 신경 쓸 것이 없어서 오히려 더 자주 수업에 활용하게 됐습니다.",
    author: "○○초등학교 2학년 담임",
    name: "민희호 선생님",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="bg-[var(--color-off-white)] py-24 md:py-32">
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
            선생님 후기
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--color-text-primary)]"
            variants={slideUp}
          >
            이미 다른 선생님들이<br />경험했습니다
          </motion.h2>
        </motion.div>

        {/* 리뷰 카드 그리드 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {reviews.map(({ quote, author, name }, i) => (
            <motion.div
              key={name}
              className="bg-[var(--color-off-white)] p-10 flex flex-col gap-8"
              variants={slideUpStagger}
              custom={i}
            >
              {/* 장식 인용 부호 */}
              <span
                className="text-[4rem] leading-none select-none text-[var(--color-brand-muted)] font-bold"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              {/* 인용 텍스트 */}
              <p className="text-[0.9375rem] leading-[1.85] text-[var(--color-text-secondary)] flex-1 -mt-6">
                {quote}
              </p>

              {/* 출처 */}
              <div className="pt-6 border-t border-[var(--color-border)]">
                <p className="text-[0.75rem] text-[var(--color-text-muted)] tracking-wide">
                  {author}
                </p>
                <p className="text-[0.875rem] font-semibold text-[var(--color-text-primary)] mt-0.5">
                  {name}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 하단 안내 */}
        <motion.p
          className="mt-8 text-center text-[0.75rem] text-[var(--color-text-muted)] tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          * 실제 선생님 후기로 업데이트 예정입니다. 동의 후 게시됩니다.
        </motion.p>
      </div>
    </section>
  );
}
