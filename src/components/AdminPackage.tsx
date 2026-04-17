"use client";

import { motion } from "framer-motion";
import { FileText, Building2, Landmark, BookOpen } from "lucide-react";
import { staggerContainer, slideUp, slideUpStagger, VIEWPORT } from "@/lib/motion";

const documents = [
  {
    Icon: FileText,
    title: "견적서",
    desc: "품목·단가·합계가 명시된 공식 견적서. 학교 예산 품의에 즉시 사용 가능합니다.",
    tag: "즉시 발급",
    downloadHref: "/assets/docs/견적서(9).doc",
    downloadName: "어깨동무_생태교육_견적서.doc",
  },
  {
    Icon: Building2,
    title: "사업자등록증",
    desc: "국세청 등록 사업자 정보 원본. 계약·지출 결의 첨부 서류로 활용됩니다.",
    tag: "공식 서류",
    downloadHref: null,
    downloadName: null,
  },
  {
    Icon: Landmark,
    title: "통장 사본",
    desc: "대금 지급을 위한 공식 계좌 정보. 학교 회계 담당자 확인용으로 제공됩니다.",
    tag: "즉시 제공",
    downloadHref: null,
    downloadName: null,
  },
  {
    Icon: BookOpen,
    title: "수업 계획서",
    desc: "교육과정 연계 근거와 차시 구성이 포함된 공문 제출용 계획서입니다.",
    tag: "교육청 기준",
    downloadHref: null,
    downloadName: null,
  },
];

export default function AdminPackage() {
  return (
    <section className="bg-[#F8F9FB] py-24 md:py-32 border-t border-[#E8EAED]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* ── 텍스트 영역 ── */}
        <motion.div
          className="max-w-2xl mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p className="eyebrow mb-4" variants={slideUp}>
            원클릭 행정 패키지
          </motion.p>
          <motion.h2
            className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[#0F172A] mb-6"
            variants={slideUp}
          >
            행정의 완결성,<br className="hidden md:block" />
            클릭 한 번으로 끝나는 투명한 시스템
          </motion.h2>
          <motion.p
            className="text-[0.9375rem] text-[#5A6472] leading-[1.85]"
            variants={slideUp}
          >
            학교 예산 처리에 필요한 모든 증빙 서류.
            교육청 가이드라인에 맞춘 완벽한 폼으로 수업 전 즉시 제공됩니다.
            <br className="hidden md:block" />
            선생님은 오직 아이들에게만 집중하십시오.
          </motion.p>
        </motion.div>

        {/* ── 문서 카드 그리드 ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {documents.map(({ Icon, title, desc, tag, downloadHref, downloadName }, i) => {
            const cardClass = "group bg-white border border-[#E8EAED] rounded-2xl p-7 flex flex-col gap-5 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(15,31,61,0.10)] active:scale-[0.97] transition-all duration-300";

            const inner = (
              <>
                {/* 아이콘 */}
                <div className="w-11 h-11 rounded-xl bg-[#0F1F3D] flex items-center justify-center flex-shrink-0">
                  <Icon size={19} className="text-white" strokeWidth={1.6} />
                </div>

                {/* 텍스트 */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-[1rem] font-bold tracking-tight text-[#0F172A]">
                    {title}
                  </h3>
                  <p className="text-[0.8125rem] text-[#8A95A3] leading-[1.8]">
                    {desc}
                  </p>
                </div>

                {/* 태그 */}
                <span className="self-start inline-flex items-center px-2.5 py-1 rounded-full text-[0.625rem] font-bold tracking-[0.12em] uppercase border border-[#1B3F7A]/20 text-[#1B3F7A] bg-[#1B3F7A]/[0.06]">
                  {tag}
                </span>
              </>
            );

            return downloadHref ? (
              <motion.a
                key={title}
                href={downloadHref}
                download={downloadName ?? true}
                variants={slideUpStagger}
                custom={i}
                className={`${cardClass} cursor-pointer`}
              >
                {inner}
              </motion.a>
            ) : (
              <motion.div
                key={title}
                variants={slideUpStagger}
                custom={i}
                className={`${cardClass} cursor-default`}
              >
                {inner}
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#0F1F3D] text-white text-[0.875rem] font-semibold tracking-tight rounded-[6px] hover:bg-[#1B3F7A] transition-colors duration-200"
          >
            행정 서류 패키지 미리보기
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p className="text-[0.8125rem] text-[#B0B8C1] leading-snug">
            문의 접수 즉시 이메일로 전송됩니다.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
