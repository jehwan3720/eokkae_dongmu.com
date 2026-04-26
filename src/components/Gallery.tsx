"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, slideUp, VIEWPORT } from "@/lib/motion";
import type { ActivityPhoto } from "./GallerySection";
import ImageLightbox from "./ImageLightbox";

const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-square", "aspect-[16/9]"];
const PLACEHOLDER_COLORS = ["#C5D8F0", "#D8E8F5", "#B8CCE8", "#D0E0F0"];

function PhotoCard({
  photo,
  index,
  className = "",
  onOpen,
}: {
  photo: ActivityPhoto | null;
  index: number;
  className?: string;
  onOpen?: (src: string, alt: string) => void;
}) {
  const aspect = ASPECTS[index] ?? "aspect-square";
  const placeholderColor = PLACEHOLDER_COLORS[index] ?? "#C5D8F0";
  const caption = photo ? `${photo.activity_step ?? ""} ${photo.grade_class ?? ""}`.trim() : null;

  return (
    <motion.div
      className={`relative overflow-hidden group ${photo ? "cursor-zoom-in" : "cursor-default"} ${className}`}
      whileHover="hover"
      initial="rest"
      onClick={() => photo && onOpen?.(photo.image_url, caption ?? "에듀그리드 장수풍뎅이 생태 교육 수업 현장")}
    >
      <div className={`w-full ${aspect} relative`} style={photo ? {} : { backgroundColor: placeholderColor }}>
        {photo ? (
          <Image
            src={photo.image_url}
            alt={caption ?? "에듀그리드 장수풍뎅이 생태 교육 수업 현장"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[var(--color-brand)] opacity-30 text-xs tracking-widest uppercase select-none">
              Photo
            </span>
          </div>
        )}


        {/* 호버 캡션 오버레이 */}
        <motion.div
          className="absolute inset-0 bg-[var(--color-brand)]/70 flex flex-col justify-end p-4"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1, transition: { duration: 0.25 } },
          }}
        >
          {caption && (
            <p className="text-white text-[0.8125rem] leading-snug italic">
              &ldquo;{caption}&rdquo;
            </p>
          )}
          {photo?.organization && (
            <p className="text-white/60 text-[0.6875rem] mt-1 tracking-wide">
              — {photo.organization}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Gallery({ photos }: { photos: (ActivityPhoto | null)[] }) {
  const slots = photos;
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

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
          <motion.div className="md:row-span-2 hidden md:block" variants={slideUp}>
            <PhotoCard photo={slots[0]} index={0} className="h-full" onOpen={(src, alt) => setLightbox({ src, alt })} />
          </motion.div>

          {/* 모바일에서 Feature */}
          <motion.div className="block md:hidden" variants={slideUp}>
            <PhotoCard photo={slots[0]} index={0} onOpen={(src, alt) => setLightbox({ src, alt })} />
          </motion.div>

          {/* 우측 상단 — 작은 2장 */}
          <motion.div variants={slideUp}>
            <PhotoCard photo={slots[1]} index={1} onOpen={(src, alt) => setLightbox({ src, alt })} />
          </motion.div>
          <motion.div variants={slideUp}>
            <PhotoCard photo={slots[2]} index={2} onOpen={(src, alt) => setLightbox({ src, alt })} />
          </motion.div>

          {/* 우측 하단 — 가로 넓은 Medium */}
          <motion.div className="md:col-span-2" variants={slideUp}>
            <PhotoCard photo={slots[3]} index={3} onOpen={(src, alt) => setLightbox({ src, alt })} />
          </motion.div>
        </motion.div>

      </div>

      <ImageLightbox
        src={lightbox?.src ?? ""}
        alt={lightbox?.alt ?? ""}
        isOpen={!!lightbox}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
}
