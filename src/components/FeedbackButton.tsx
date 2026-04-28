"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitFeedback } from "@/actions/submitFeedback";

const CATEGORIES = ["서비스 요구사항", "민원", "운영 개선 제안", "기타"];

const INIT = { category: CATEGORIES[0], name: "", email: "", content: "" };

function inputCls(hasError: boolean) {
  return [
    "w-full px-4 py-3 text-[0.875rem] text-[var(--color-text-primary)]",
    "bg-white rounded-[3px] outline-none transition-all duration-200 placeholder:text-gray-300",
    hasError
      ? "border border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/15"
      : "border border-gray-200 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10",
  ].join(" ");
}

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INIT);
  const [contentError, setContentError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setForm(INIT);
      setContentError("");
      setApiError("");
      setSuccess(false);
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.content.trim()) {
      setContentError("내용을 입력해주세요.");
      return;
    }
    setLoading(true);
    setApiError("");
    const result = await submitFeedback(form);
    setLoading(false);
    if ("error" in result) {
      setApiError(result.error);
    } else {
      setSuccess(true);
    }
  }

  return (
    <>
      {/* ── Floating Button ── */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-[#0F1F3D] text-white text-[0.75rem] font-semibold tracking-wide rounded-full shadow-lg hover:bg-[#1B3F7A] transition-colors duration-200"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-label="의견·민원 접수"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
          <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        의견·민원 접수
      </motion.button>

      {/* ── Modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {/* 딤 */}
            <div
              className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
              onClick={handleClose}
            />

            {/* 카드 */}
            <motion.div
              className="relative w-full max-w-[480px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {success ? (
                  /* ── 접수 완료 ── */
                  <motion.div
                    key="success"
                    className="px-8 py-10 flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center mb-5">
                      <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                        <path d="M1.5 9L8.5 16L22.5 2" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-1.5">접수 완료</p>
                    <h3 className="text-[1.125rem] font-bold tracking-tight text-[var(--color-text-primary)] mb-2">
                      의견이 접수되었습니다
                    </h3>
                    <p className="text-[0.8125rem] text-[var(--color-text-muted)] leading-relaxed mb-8">
                      검토 후 빠르게 처리하겠습니다.<br />감사합니다.
                    </p>
                    <button
                      onClick={handleClose}
                      className="w-full py-3 text-[0.875rem] font-semibold text-white bg-[var(--color-brand)] rounded-[3px] hover:opacity-90 transition-opacity"
                    >
                      닫기
                    </button>
                  </motion.div>
                ) : (
                  /* ── 폼 ── */
                  <motion.div
                    key="form"
                    className="flex flex-col overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* 헤더 */}
                    <div className="px-6 pt-6 pb-5 border-b border-gray-100 flex-shrink-0">
                      <p className="text-[0.625rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-1">
                        에듀그리드
                      </p>
                      <h3 className="text-[1.125rem] font-bold tracking-tight text-[var(--color-text-primary)]">
                        의견 · 민원 접수
                      </h3>
                      <p className="mt-1 text-[0.8125rem] text-[var(--color-text-muted)] leading-snug">
                        불편하신 점이나 요청사항을 남겨주시면 검토 후 처리해드립니다.
                      </p>
                      <button
                        onClick={handleClose}
                        className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors text-[1rem]"
                        aria-label="닫기"
                      >
                        ✕
                      </button>
                    </div>

                    {/* 폼 */}
                    <form
                      className="px-6 py-6 flex flex-col gap-5 overflow-y-auto overscroll-contain"
                      style={{ WebkitOverflowScrolling: "touch" }}
                      onSubmit={handleSubmit}
                      noValidate
                    >
                      {/* 분류 */}
                      <div className="flex flex-col gap-1">
                        <p className="text-[0.75rem] font-semibold tracking-wide text-[var(--color-text-secondary)]">
                          분류 <span className="text-[var(--color-brand)]">*</span>
                        </p>
                        <select
                          value={form.category}
                          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                          className="w-full px-4 py-3 text-[0.875rem] text-[var(--color-text-primary)] bg-white border border-gray-200 rounded-[3px] outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all duration-200"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* 이름 + 이메일 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-[0.75rem] font-semibold tracking-wide text-[var(--color-text-secondary)]">
                            이름 <span className="text-gray-300 font-normal">(선택)</span>
                          </p>
                          <input
                            type="text"
                            placeholder="예) 홍길동"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className={inputCls(false)}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-[0.75rem] font-semibold tracking-wide text-[var(--color-text-secondary)]">
                            이메일 <span className="text-gray-300 font-normal">(선택)</span>
                          </p>
                          <input
                            type="email"
                            placeholder="예) example@gmail.com"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            className={inputCls(false)}
                          />
                          <p className="text-[0.6875rem] text-[var(--color-text-muted)] leading-snug">
                            답변은 작성하신 메일로 보내드립니다.
                          </p>
                        </div>
                      </div>

                      {/* 내용 */}
                      <div className="flex flex-col gap-1">
                        <p className="text-[0.75rem] font-semibold tracking-wide text-[var(--color-text-secondary)]">
                          내용 <span className="text-[var(--color-brand)]">*</span>
                        </p>
                        <textarea
                          rows={5}
                          placeholder="요청하시는 내용을 자유롭게 작성해주세요."
                          value={form.content}
                          onChange={(e) => {
                            setForm((f) => ({ ...f, content: e.target.value }));
                            if (contentError) setContentError("");
                          }}
                          className={inputCls(!!contentError) + " resize-none leading-[1.8]"}
                        />
                        {contentError && (
                          <p className="text-[0.6875rem] text-red-500">{contentError}</p>
                        )}
                      </div>

                      {/* API 오류 */}
                      {apiError && (
                        <p className="text-[0.75rem] text-red-500 text-center">{apiError}</p>
                      )}

                      {/* 제출 버튼 */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 text-white text-[0.875rem] font-bold tracking-tight rounded-[3px] bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin" width="15" height="15" viewBox="0 0 16 16" fill="none">
                              <circle cx="8" cy="8" r="6" stroke="white" strokeOpacity="0.3" strokeWidth="2"/>
                              <path d="M14 8a6 6 0 0 0-6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            전송 중...
                          </>
                        ) : "접수하기"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
