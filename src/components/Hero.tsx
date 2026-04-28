"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { slideUpStagger, staggerContainer, VIEWPORT } from "@/lib/motion";
import ImageLightbox from "./ImageLightbox";
import { submitFeedback } from "@/actions/submitFeedback";

const heroImages = [
  { src: "/images/풍뎅이.jpg",   alt: "장수풍뎅이 성충" },
  { src: "/images/대표사진.png", alt: "에듀그리드 생태 교육 키트 대표 사진" },
  { src: "/images/키트사진.png", alt: "에듀그리드 생태 교육 키트 구성" },
  { src: "/images/유충수정.png", alt: "장수풍뎅이 유충" },
];

const NAV_LINKS = [
  { label: "교과 연계", href: "#curriculum-mapping" },
  { label: "키트 구성", href: "#curriculum" },
  { label: "수업 현장", href: "#gallery" },
  { label: "비용 안내", href: "#pricing" },
];

const FB_CATEGORIES = ["서비스 요구사항", "민원", "운영 개선 제안", "기타"];
const FB_INIT = { category: FB_CATEGORIES[0], name: "", email: "", content: "" };

function NavFeedbackModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(FB_INIT);
  const [contentError, setContentError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  function inputCls(hasError: boolean) {
    return [
      "w-full px-4 py-3 text-[0.875rem] text-[var(--color-text-primary)]",
      "bg-white rounded-[3px] outline-none transition-all duration-200 placeholder:text-gray-300",
      hasError
        ? "border border-red-400 focus:ring-2 focus:ring-red-400/15"
        : "border border-gray-200 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10",
    ].join(" ");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.content.trim()) { setContentError("내용을 입력해주세요."); return; }
    setContentError("");
    setLoading(true);
    setApiError("");
    const result = await submitFeedback(form);
    setLoading(false);
    if ("error" in result) setApiError(result.error);
    else setSuccess(true);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-[480px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" className="px-8 py-10 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            >
              <div className="w-14 h-14 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center mb-5">
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                  <path d="M1.5 9L8.5 16L22.5 2" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-1.5">접수 완료</p>
              <h3 className="text-[1.125rem] font-bold tracking-tight text-[var(--color-text-primary)] mb-2">의견이 접수되었습니다</h3>
              <p className="text-[0.8125rem] text-[var(--color-text-muted)] leading-relaxed mb-8">
                검토 후 빠르게 처리하겠습니다.<br />감사합니다.
              </p>
              <button onClick={onClose} className="w-full py-3 text-[0.875rem] font-semibold text-white bg-[var(--color-brand)] rounded-[3px] hover:opacity-90 transition-opacity">닫기</button>
            </motion.div>
          ) : (
            <motion.div key="form" className="flex flex-col overflow-hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            >
              <div className="px-6 pt-6 pb-5 border-b border-gray-100 flex-shrink-0">
                <p className="text-[0.625rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-1">에듀그리드</p>
                <h3 className="text-[1.125rem] font-bold tracking-tight text-[var(--color-text-primary)]">의견 · 민원 접수</h3>
                <p className="mt-1 text-[0.8125rem] text-[var(--color-text-muted)] leading-snug">불편하신 점이나 요청사항을 남겨주시면 검토 후 처리해드립니다.</p>
                <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors text-[1rem]" aria-label="닫기">✕</button>
              </div>
              <form className="px-6 py-6 flex flex-col gap-5 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }} onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-1">
                  <p className="text-[0.75rem] font-semibold tracking-wide text-[var(--color-text-secondary)]">분류 <span className="text-[var(--color-brand)]">*</span></p>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-3 text-[0.875rem] text-[var(--color-text-primary)] bg-white border border-gray-200 rounded-[3px] outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all duration-200">
                    {FB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[0.75rem] font-semibold tracking-wide text-[var(--color-text-secondary)]">이름 <span className="text-gray-300 font-normal">(선택)</span></p>
                    <input type="text" placeholder="예) 홍길동" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls(false)} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[0.75rem] font-semibold tracking-wide text-[var(--color-text-secondary)]">이메일 <span className="text-gray-300 font-normal">(선택)</span></p>
                    <input type="email" placeholder="예) example@gmail.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls(false)} />
                    <p className="text-[0.6875rem] text-[var(--color-text-muted)]">답변은 작성하신 메일로 보내드립니다.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[0.75rem] font-semibold tracking-wide text-[var(--color-text-secondary)]">내용 <span className="text-[var(--color-brand)]">*</span></p>
                  <textarea rows={5} placeholder="요청하시는 내용을 자유롭게 작성해주세요." value={form.content}
                    onChange={(e) => { setForm((f) => ({ ...f, content: e.target.value })); if (contentError) setContentError(""); }}
                    className={inputCls(!!contentError) + " resize-none leading-[1.8]"} />
                  {contentError && <p className="text-[0.6875rem] text-red-500">{contentError}</p>}
                </div>
                {apiError && <p className="text-[0.75rem] text-red-500 text-center">{apiError}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 text-white text-[0.875rem] font-bold tracking-tight rounded-[3px] bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2">
                  {loading ? (
                    <><svg className="animate-spin" width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="white" strokeOpacity="0.3" strokeWidth="2"/><path d="M14 8a6 6 0 0 0-6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>전송 중...</>
                  ) : "접수하기"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const [imgIndex, setImgIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoLightbox, setLogoLightbox] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = feedbackOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [feedbackOpen]);

  useEffect(() => {
    if (lightbox) return;
    const delay = imgIndex === 0 ? 2000 : 4000;
    const timer = setTimeout(() => {
      setImgIndex((prev) => (prev + 1) % heroImages.length);
    }, delay);
    return () => clearTimeout(timer);
  }, [imgIndex, lightbox]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="relative bg-[#0F1F3D] overflow-hidden">

      {/* 배경 — 우측 미묘한 블루 광원 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 80% 50%, #1B3F7A44 0%, transparent 70%)",
        }}
      />

      {/* 상단 얇은 브랜드 라인 */}
      <div className="w-full h-px bg-[#1B3F7A]" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* ── 네비게이션 ─────────────────────────────────── */}
        <nav className="flex items-center justify-between py-4 md:py-5 border-b border-white/10">
          <button
            onClick={() => setLogoLightbox(true)}
            aria-label="EDUGRID 로고 확대 보기"
            className="cursor-zoom-in"
          >
            <span className="inline-flex items-center bg-white rounded-sm px-1.5 py-0.5">
              <Image
                src="/images/Logo.png"
                alt="EDUGRID"
                width={143}
                height={48}
                className="h-10 md:h-12 w-auto"
                priority
              />
            </span>
          </button>

          <ul className="hidden md:flex items-center gap-8 text-[0.8125rem] text-white/70 font-medium tracking-wide">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="hover:text-white transition-colors duration-150">{label}</a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setFeedbackOpen(true)}
              className="flex items-center gap-1.5 text-[0.75rem] text-white/35 hover:text-white/70 transition-colors duration-150 tracking-wide"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
                <path d="M6.5 1.5C3.74 1.5 1.5 3.46 1.5 5.875c0 .9.3 1.74.82 2.43L1.5 11l2.84-1.08A5.3 5.3 0 0 0 6.5 10.25c2.76 0 5-1.96 5-4.375S9.26 1.5 6.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              의견·민원
            </button>
            <div className="w-px h-4 bg-white/15" />
            <a
              href="#contact"
              className="inline-flex items-center min-h-[44px] px-5 py-2.5 text-[0.8125rem] font-semibold tracking-wide text-white border border-white/30 hover:bg-white hover:text-[#0F1F3D] transition-all duration-200 rounded-sm"
            >
              교구 납품 문의
            </a>
          </div>

          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col gap-[5px] min-w-[44px] min-h-[44px] items-center justify-center"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            <span className={`block w-5 h-0.5 bg-white/80 transition-all duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white/80 transition-all duration-200 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white/80 transition-all duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </nav>

        {/* 모바일 드롭다운 메뉴 */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="py-3 border-b border-white/10">
                <ul className="flex flex-col">
                  {NAV_LINKS.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center min-h-[52px] text-[0.9375rem] text-white/70 hover:text-white border-b border-white/5 last:border-0 transition-colors duration-150"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 flex items-center justify-center min-h-[52px] w-full text-[0.875rem] font-semibold text-white border border-white/30 rounded-sm hover:bg-white/10 transition-colors duration-200"
                >
                  교구 납품 문의
                </a>
                <button
                  onClick={() => { setMenuOpen(false); setFeedbackOpen(true); }}
                  className="mt-2 flex items-center justify-center gap-2 min-h-[44px] w-full text-[0.8125rem] text-white/40 hover:text-white/70 transition-colors duration-200"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
                    <path d="M6.5 1.5C3.74 1.5 1.5 3.46 1.5 5.875c0 .9.3 1.74.82 2.43L1.5 11l2.84-1.08A5.3 5.3 0 0 0 6.5 10.25c2.76 0 5-1.96 5-4.375S9.26 1.5 6.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  의견·민원 접수
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 히어로 본문 — 2컬럼 레이아웃 ─────────────── */}
        <div className="py-20 md:py-28 lg:py-36 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">

          {/* 좌측 텍스트 */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.p
              className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-[#7EB3F5] mb-5"
              variants={slideUpStagger}
              custom={0}
            >
              대한민국 초등 교과 및 누리과정 100% 연계
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              className="text-[2.25rem] md:text-[3.25rem] lg:text-[3.875rem] font-bold leading-[1.05] tracking-[-0.03em] text-white mb-8"
              variants={slideUpStagger}
              custom={1}
            >
              완성형 생태 교구,<br />
              에듀그리드 올인원 키트
            </motion.h1>

            {/* 서브 카피 */}
            <motion.div
              className="flex flex-col gap-1.5 mb-6"
              variants={slideUpStagger}
              custom={2}
            >
              <p className="text-white/70 text-[0.9375rem] leading-relaxed">
                수업 준비부터 행정 처리까지.<br className="hidden md:block" />
                선생님은 아이들의 관찰에만 집중할 수 있도록<br className="hidden md:block" />
                완벽하게 설계된 올인원 키트를 만나보세요.
              </p>
            </motion.div>

            {/* Badge */}
            <motion.p
              className="text-white/40 text-[0.75rem] tracking-widest mb-10"
              variants={slideUpStagger}
              custom={3}
            >
              2022 개정 교육과정 &nbsp;·&nbsp; 누리과정 &nbsp;·&nbsp; 생태전환교육 목표 부합
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              variants={slideUpStagger}
              custom={4}
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#1B3F7A] hover:bg-[#2A5BAD] text-white text-sm font-semibold tracking-wide rounded-sm transition-colors duration-200"
              >
                교구 납품 견적 문의하기
              </a>
              <a
                href="#curriculum-mapping"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white/70 hover:text-white hover:border-white/50 text-sm font-medium tracking-wide rounded-sm transition-colors duration-200"
              >
                교육과정 연계 확인하기 →
              </a>
            </motion.div>
          </motion.div>

          {/* 우측 — 장수풍뎅이 이미지 플레이스홀더 */}
          <motion.div
            className="hidden lg:flex flex-col gap-3"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            {/* 메인 이미지 */}
            <div
              className="relative w-full aspect-[4/5] rounded-sm overflow-hidden cursor-zoom-in"
              style={{ border: "1px solid #1B3F7A66" }}
              onClick={() => setLightbox(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={imgIndex}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <Image
                    src={heroImages[imgIndex].src}
                    alt={heroImages[imgIndex].alt}
                    fill
                    className="object-cover"
                    sizes="420px"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* 학명 배지 */}
              <div
                className="absolute bottom-4 left-4 right-4 px-4 py-3"
                style={{ backgroundColor: "#0F1F3D99", backdropFilter: "blur(8px)" }}
              >
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: "#7EB3F5" }}>
                  Trypoxylus dichotomus
                </p>
                <p className="text-white/40 text-[0.625rem] tracking-wide mt-0.5">장수풍뎅이 · 딱정벌레목 장수풍뎅이과</p>
              </div>
            </div>

            {/* 한살이 단계 미니 배지 4개 */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { stage: "3령 유충", en: "Larva",  color: "#C5D8F0" },
                { stage: "번데기",   en: "Pupa",   color: "#A8C4E8" },
                { stage: "우화",     en: "Eclose", color: "#8AAFD8" },
                { stage: "성충",     en: "Adult",  color: "#6B9DC8" },
              ].map(({ stage, en, color }) => (
                <div
                  key={stage}
                  className="flex flex-col items-center gap-1 py-3 rounded-[2px]"
                  style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
                >
                  <span className="text-white/80 text-[0.75rem] font-bold">{stage}</span>
                  <span className="text-white/30 text-[0.5rem] tracking-wider">{en}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── 하단 수치 바 — scroll trigger ───────────────── */}
        <motion.div
          className="border-t border-white/10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {[
            { num: "₩ 0",      label: "추가 관리 비용",         sub: null },
            { num: "10,000원", label: "학급 단위 키트 기준가",  sub: "30인 이상 납품 시 단가 자동 할인 적용" },
            { num: "4단계",    label: "한살이 연계 커리큘럼",  sub: null },
            { num: "無관리",   label: "관리가 필요 없는 올인원 사육 키트",      sub: null },
          ].map(({ num, label, sub }, i) => (
            <motion.div
              key={label}
              className="flex flex-col gap-0.5"
              variants={slideUpStagger}
              custom={i}
            >
              <span className="text-white text-xl font-bold tracking-tight">{num}</span>
              <span className="text-white/40 text-[0.75rem] tracking-wide">{label}</span>
              {sub && (
                <span className="text-white/25 text-[0.6rem] tracking-wide leading-snug mt-0.5">{sub}</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── 라이트박스 ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(false)}
          >
            <motion.div
              className="relative w-[90vw] max-w-3xl aspect-[4/5]"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={imgIndex}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <Image
                    src={heroImages[imgIndex].src}
                    alt={heroImages[imgIndex].alt}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* 닫기 */}
              <button
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                onClick={() => setLightbox(false)}
              >
                ✕
              </button>

              {/* 이전 */}
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors text-lg"
                onClick={() => setImgIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
              >
                ‹
              </button>

              {/* 다음 */}
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors text-lg"
                onClick={() => setImgIndex((prev) => (prev + 1) % heroImages.length)}
              >
                ›
              </button>

              {/* 인디케이터 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? "bg-white scale-125" : "bg-white/40"}`}
                    onClick={() => setImgIndex(i)}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImageLightbox
        src="/images/Logo.png"
        alt="EDUGRID 로고"
        isOpen={logoLightbox}
        onClose={() => setLogoLightbox(false)}
      />

      <AnimatePresence>
        {feedbackOpen && <NavFeedbackModal onClose={() => setFeedbackOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
