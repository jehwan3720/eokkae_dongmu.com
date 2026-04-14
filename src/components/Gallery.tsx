"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUp, VIEWPORT } from "@/lib/motion";

const photos = [
  {
    id: "feature",
    caption: "처음엔 무서웠는데, 이름을 붙여줬어요.",
    credit: "3학년 이○○",
    aspect: "aspect-[3/4]",
  },
  {
    id: "sm-1",
    caption: "선생님, 이 친구 심장이 뛰어요.",
    credit: "4학년 박○○",
    aspect: "aspect-square",
  },
  {
    id: "sm-2",
    caption: "집에서도 보고 싶어요.",
    credit: "2학년 김○○",
    aspect: "aspect-square",
  },
  {
    id: "medium",
    caption: "선생님과 함께 관찰 일지를 씁니다.",
    credit: null,
    aspect: "aspect-[16/9]",
  },
  {
    id: "sm-3",
    caption: "조심조심 손에 올려봐요.",
    credit: "3학년 최○○",
    aspect: "aspect-square",
  },
];

// 플레이스홀더 색상 (실제 사진으로 교체 예정)
const placeholderColors: Record<string, string> = {
  feature: "#C5D8F0",
  "sm-1": "#D8E8F5",
  "sm-2": "#B8CCE8",
  medium: "#D0E0F0",
  "sm-3": "#C8D8EC",
};

function PhotoCard({
  photo,
  className = "",
}: {
  photo: (typeof photos)[number];
  className?: string;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden group cursor-default ${className}`}
      whileHover="hover"
      initial="rest"
    >
      {/* 사진 영역 (플레이스홀더) */}
      <div
        className={`w-full ${photo.aspect} relative`}
        style={{ backgroundColor: placeholderColors[photo.id] }}
      >
        {/* 실제 이미지 교체 시: <Image src={...} fill className="object-cover" /> */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[var(--color-brand)] opacity-30 text-xs tracking-widest uppercase select-none">
            Photo
          </span>
        </div>

        {/* 호버 캡션 오버레이 */}
        <motion.div
          className="absolute inset-0 bg-[var(--color-brand)]/70 flex flex-col justify-end p-4"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1, transition: { duration: 0.25 } },
          }}
        >
          {photo.caption && (
            <p className="text-white text-[0.8125rem] leading-snug italic">
              &ldquo;{photo.caption}&rdquo;
            </p>
          )}
          {photo.credit && (
            <p className="text-white/60 text-[0.6875rem] mt-1 tracking-wide">
              — {photo.credit}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  return (
    <section id="gallery" className="bg-[var(--color-off-white)] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* 섹션 헤더 */}
        <motion.div
          className="mb-12 max-w-lg"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow mb-4" variants={slideUp}>
            수업 현장
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--color-text-primary)]"
            variants={slideUp}
          >
            수업이 끝난 뒤에도<br />남는 것들
          </motion.h2>
          <motion.p
            className="mt-4 text-[0.9375rem] text-[var(--color-text-secondary)] leading-relaxed"
            variants={slideUp}
          >
            아이들이 장수풍뎅이와 나눈 작은 순간들
          </motion.p>
        </motion.div>

        {/* 갤러리 그리드 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* 데스크탑: Feature Shot (왼쪽 큰 사진) */}
          <motion.div
            className="md:row-span-2 hidden md:block"
            variants={slideUp}
          >
            <PhotoCard photo={photos[0]} className="h-full" />
          </motion.div>

          {/* 모바일에서 Feature */}
          <motion.div className="block md:hidden" variants={slideUp}>
            <PhotoCard photo={photos[0]} />
          </motion.div>

          {/* 우측 상단 — 작은 2장 */}
          <motion.div variants={slideUp}>
            <PhotoCard photo={photos[1]} />
          </motion.div>
          <motion.div variants={slideUp}>
            <PhotoCard photo={photos[2]} />
          </motion.div>

          {/* 우측 하단 — 가로 넓은 Medium */}
          <motion.div className="md:col-span-2" variants={slideUp}>
            <PhotoCard photo={photos[3]} />
          </motion.div>
        </motion.div>

        {/* 하단 안내 */}
        <motion.p
          className="mt-8 text-center text-[0.75rem] text-[var(--color-text-muted)] tracking-wide"
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          * 사진은 보호자 동의 하에 게시됩니다. 실제 수업 사진으로 업데이트 예정입니다.
        </motion.p>
      </div>
    </section>
  );
}
