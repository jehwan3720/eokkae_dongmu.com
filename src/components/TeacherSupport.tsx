"use client";

import { motion } from "framer-motion";
import { Presentation, FileText, ClipboardList } from "lucide-react";
import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

const packages = [
  {
    Icon: Presentation,
    title: "수업용 PPT",
    desc: "한살이 4단계를 다루는 전문 수업용 슬라이드. 교실에서 즉시 띄울 수 있도록 구성되어 있으며, 애니메이션 효과와 질문 유도 슬라이드가 포함되어 있습니다.",
    tag: "전면 무료 제공",
    points: ["4단계 한살이 전문 슬라이드", "질문 유도·토론 슬라이드 포함", "키트 납품 시 이메일로 전송"],
  },
  {
    Icon: FileText,
    title: "학생 활동지",
    desc: "아이들이 직접 기록하는 관찰 일지와 생명 존중 체크리스트. 학급 수에 맞춰 인쇄 가능한 PDF 형태로 제공됩니다.",
    tag: "전면 무료 제공",
    points: ["관찰 일지 + 생명 존중 체크리스트", "학급 수 맞춤 인쇄본 제공", "2022 개정 교육과정 성취기준 반영"],
  },
  {
    Icon: ClipboardList,
    title: "수업 지도안",
    desc: "교육청 공문 제출 기준으로 작성된 차시별 수업 계획서. 교과 연계 근거와 성취기준이 포함되어 있어 별도 작업 없이 바로 활용 가능합니다.",
    tag: "교육청 기준",
    points: ["공문 제출 기준 차시 계획서", "교과 연계 근거·성취기준 포함", "누리과정·초등 과학 모두 포함"],
  },
];

export default function TeacherSupport() {
  return (
    <section id="teacher-support" className="bg-[var(--color-off-white)] py-24 md:py-32">
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
            교사 지원 패키지
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--color-text-primary)]"
            variants={slideUp}
          >
            선생님의 수업 준비 시간 0분,<br />
            키트 하나로 모든 준비 끝
          </motion.h2>
          <motion.p
            className="mt-5 text-[0.9375rem] text-[var(--color-text-secondary)] leading-relaxed"
            variants={slideUp}
          >
            제품 납품 시 현장에서 즉시 활용 가능한 전문 수업용 PPT와 활동지를 전면 무료 제공합니다.
          </motion.p>
        </motion.div>

        {/* 패키지 카드 3개 */}
        <motion.div
          className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 mb-8 md:mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {packages.map(({ Icon, title, desc, tag, points }, i) => (
            <motion.div
              key={title}
              className="bg-white border border-[var(--color-border)] rounded-xl p-4 md:rounded-2xl md:p-8 flex flex-col gap-3 md:gap-5 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,31,61,0.10)] transition-all duration-300"
              variants={slideUpStagger}
              custom={i}
            >
              {/* 아이콘 */}
              <div className="w-11 h-11 rounded-xl bg-[var(--color-brand)] flex items-center justify-center flex-shrink-0">
                <Icon size={19} className="text-white" strokeWidth={1.6} />
              </div>

              {/* 텍스트 */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-[1rem] font-bold tracking-tight text-[var(--color-text-primary)]">
                  {title}
                </h3>
                <p className="text-[0.8125rem] text-[var(--color-text-secondary)] leading-[1.85]">
                  {desc}
                </p>
              </div>

              {/* 포인트 목록 */}
              <ul className="flex flex-col gap-1.5 pt-4 border-t border-[var(--color-border)]">
                {points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-[0.75rem] text-[var(--color-text-secondary)]">
                    <span className="flex-shrink-0 w-1 h-1 rounded-full bg-[var(--color-brand)]" />
                    {pt}
                  </li>
                ))}
              </ul>

              {/* 태그 */}
              <span className="self-start inline-flex items-center px-2.5 py-1 rounded-full text-[0.625rem] font-bold tracking-[0.12em] uppercase border border-[var(--color-brand)]/20 text-[var(--color-brand)] bg-[var(--color-brand)]/[0.06]">
                {tag}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* 안내 배너 */}
        <motion.div
          className="bg-[var(--color-soft-beige)] border border-[var(--color-border)] rounded-xl px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex-1">
            <p className="text-[0.875rem] font-semibold text-[var(--color-text-primary)] mb-1">
              키트 납품 확정 후 24시간 이내 이메일 발송
            </p>
            <p className="text-[0.8125rem] text-[var(--color-text-secondary)] leading-relaxed">
              PPT · 활동지 · 수업 지도안 모두 포함된 교사 지원 패키지를 PDF 및 PPT 원본 파일로 제공합니다.
            </p>
          </div>
          <a
            href="#contact"
            className="flex-shrink-0 inline-flex items-center gap-2 min-h-[48px] px-6 py-3.5 bg-[var(--color-brand)] text-white text-[0.875rem] font-semibold tracking-tight rounded-[6px] hover:bg-[var(--color-brand-light)] transition-colors duration-200 w-full sm:w-auto justify-center"
          >
            납품 문의하기
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
