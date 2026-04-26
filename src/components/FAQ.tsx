"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

/* 스크롤 중 여부를 감지하는 훅 */
function useIsScrolling() {
  const isScrolling = useRef(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      isScrolling.current = true;
      clearTimeout(timer);
      timer = setTimeout(() => { isScrolling.current = false; }, 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  }, []);
  return isScrolling;
}

const categories = [
  {
    label: "비용 & 예산",
    items: [
      {
        q: "에듀그리드 키트는 어떤 교과와 연계되나요?",
        a: "유치원 누리과정 '자연탐구 영역 — 생명체와 자연환경 알아보기', 초등학교 3학년 과학 '동물의 한살이', 교육부 생태전환교육 성취기준과 직접 연계됩니다.\n\n납품 시 교육청 제출 기준의 수업 지도안과 교과 연계 근거 자료를 함께 제공하므로 별도 준비가 필요 없습니다.",
      },
      {
        q: "키트가 10,000원인 이유는 무엇인가요?",
        a: "한 번에 많은 인원이 참여할수록 부자재 수급 비용이 낮아집니다. 저희는 그 차액을 수익으로 남기지 않고, 교육비 하향 책정을 통해 현장의 부담을 덜어드리는 데 사용합니다. 대량 수급과 물류 최적화를 통해 절감된 원가가 가격에 반영된 것입니다.",
      },
      {
        q: "키트 비용을 학교 예산으로 처리할 수 있나요?",
        a: "가능합니다. '교육활동 재료비' 또는 '체험학습 소모품비' 항목으로 처리하실 수 있습니다. 간이 견적서·세금계산서 발행 가능합니다.",
      },
      {
        q: "학급 전체 참여 시 총 비용이 얼마인가요?",
        a: "25명 학급 기준 총 250,000원입니다. 강사비는 별도 청구되지 않으므로 재료비 항목 내에서 처리 가능합니다.",
      },
      {
        q: "교육청 지원금이나 방과후 예산으로도 신청 가능한가요?",
        a: "네, 방과후·교육복지·학교 특색사업 예산으로도 신청 가능합니다. 예산 유형에 맞는 서류 협조를 요청해주시면 함께 준비해드립니다.",
      },
    ],
  },
  {
    label: "수업 운영",
    items: [
      {
        q: "몇 학년부터 수업이 가능한가요?",
        a: "유치원부터 중학교까지 모두 가능하며, 학년별 눈높이에 맞춰 진행합니다.",
      },
      {
        q: "수업 시간은 얼마나 걸리나요?",
        a: "기본 1회 40~50분(1교시), 2교시 연속 심화 수업도 협의 가능합니다.",
      },
      {
        q: "사전 준비물이나 교실 세팅이 필요한가요?",
        a: "없습니다. 키트에 모든 구성품(유충병, 발효 톱밥, 유충, 관찰 활동지)이 포함되어 납품됩니다. 교실에 놓아두기만 하면 바로 수업에 활용할 수 있습니다.",
      },
    ],
  },
  {
    label: "생물 관리 & 안전",
    items: [
      {
        q: "수업 후 유충 관리가 어렵지 않나요? 선생님이 매일 챙겨야 하나요?",
        a: "아닙니다. 에듀그리드 키트는 '무관리 성장 시스템'으로 설계되었습니다. 유충병 한 통 안에서 성충까지 성장하는 데 필요한 모든 것이 포함되어 추가 먹이 급여, 톱밥 교체 등 어떤 보충 작업도 필요하지 않습니다. 선생님이 하실 일은 아이들의 관찰 일지 작성을 독려하는 것뿐입니다.",
      },
      {
        q: "교실에 두면 냄새가 나거나 위생 문제가 있지 않나요?",
        a: "친환경 발효 참나무 톱밥과 밀봉 구조의 유충병을 사용하여 냄새·오염이 최소화된 설계입니다. 특수 배합 공정으로 부패가 억제되어 교실 환경에서도 전혀 문제가 없습니다.",
      },
      {
        q: "생물 알레르기가 있는 아이도 참여할 수 있나요?",
        a: "직접 접촉은 자발적으로 선택합니다. 알레르기 이력이 있는 경우 사전에 알려주시면 개별 배려합니다.",
      },
    ],
  },
];

function AccordionItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [locked, setLocked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const isScrolling = useIsScrolling();
  const open = locked || (hovered && !blocked);

  return (
    <motion.div
      className="border-b border-[var(--color-border)]"
      variants={slideUpStagger}
      custom={index}
      onHoverStart={() => { if (isScrolling.current) return; setHovered(true); setBlocked(false); }}
      onHoverEnd={() => { setHovered(false); setBlocked(false); }}
    >
      <button
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        onClick={() => {
          if (locked) {
            setLocked(false);
            setBlocked(true); // 커서가 위에 있어도 즉시 닫힘
          } else {
            setLocked(true);
            setBlocked(false);
          }
        }}
      >
        <span className="text-[0.9375rem] font-medium text-[var(--color-text-primary)] leading-snug group-hover:text-[var(--color-brand)] transition-colors duration-150">
          {q}
        </span>
        <motion.span
          className="flex-shrink-0 mt-0.5 text-[var(--color-text-muted)] text-lg leading-none select-none"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-[0.875rem] leading-[1.9] text-[var(--color-text-secondary)] whitespace-pre-line">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="bg-[var(--color-soft-beige)] py-24 md:py-32">
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
            자주 묻는 질문
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--color-text-primary)]"
            variants={slideUp}
          >
            도입 전에 궁금한<br />모든 것
          </motion.h2>
        </motion.div>

        {/* 카테고리별 아코디언 */}
        <div className="flex flex-col gap-14">
          {categories.map(({ label, items }) => (
            <motion.div
              key={label}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              <motion.p
                className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-6"
                variants={slideUp}
              >
                {label}
              </motion.p>

              <div>
                {items.map(({ q, a }, i) => (
                  <AccordionItem key={q} q={q} a={a} index={i} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
