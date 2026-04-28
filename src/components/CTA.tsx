"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, slideUpStagger, VIEWPORT } from "@/lib/motion";
import { submitApplication } from "@/actions/submitApplication";
import { submitFeedback } from "@/actions/submitFeedback";

/* ────────────────────────────────────────
   타입
──────────────────────────────────────── */
interface FormData {
  school: string;
  contact_name: string;
  contact: string;
  email: string;
  grade: string[];
  headcount: string;
  date: string;
  message: string;
  agreed: boolean;
  marketing: boolean;
}

type TouchedMap = Partial<Record<keyof FormData, boolean>>;
type ErrorMap   = Partial<Record<keyof FormData, string>>;

const GRADE_OPTIONS = [
  "유치원 (5~7세)",
  "초등 1~2학년군",
  "초등 3~4학년군",
  "초등 5~6학년군",
  "중학교 1~3학년",
  "혼합 학년",
];

const INIT: FormData = {
  school: "", contact_name: "", contact: "", email: "", grade: [],
  headcount: "", date: "", message: "", agreed: false, marketing: false,
};

/* ────────────────────────────────────────
   전화번호 자동 포맷
──────────────────────────────────────── */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("02")) {
    const d = digits.slice(0, 10);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`;
  } else {
    const d = digits.slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  }
}

/* ────────────────────────────────────────
   유효성 규칙
──────────────────────────────────────── */
const PHONE_RE = /^0\d{1,2}-\d{3,4}-\d{4}$/;
const NUM_RE   = /^\d+$/;

function validate(f: FormData): ErrorMap {
  const e: ErrorMap = {};
  if (!f.school.trim())                          e.school       = "필수 입력 항목입니다.";
  if (!f.contact_name.trim())                    e.contact_name = "필수 입력 항목입니다.";
  if (!f.contact.trim())                         e.contact      = "필수 입력 항목입니다.";
  else if (!PHONE_RE.test(f.contact.trim()))     e.contact      = "올바른 번호 형식을 입력해주세요. (예: 010-1234-5678)";
  if (f.grade.length === 0)                      e.grade        = "학년을 하나 이상 선택해주세요.";
  if (!f.headcount.trim())                       e.headcount    = "필수 입력 항목입니다.";
  else if (!NUM_RE.test(f.headcount.trim()))     e.headcount    = "숫자만 입력 가능합니다.";
  if (!f.date)                                   e.date         = "희망 교육 일자를 선택해주세요.";
  if (!f.agreed)                                 e.agreed       = "개인정보 수집·이용에 동의해주세요.";
  return e;
}

/* ────────────────────────────────────────
   공통 스타일 헬퍼
──────────────────────────────────────── */
const labelBase =
  "text-[0.75rem] font-semibold tracking-wide text-[var(--color-text-secondary)]";

const sectionLabel =
  "text-[0.625rem] font-semibold tracking-[0.18em] uppercase text-gray-300 mb-4";

function inputCls(hasError: boolean) {
  return [
    "w-full px-4 py-3 text-[0.875rem] text-[var(--color-text-primary)]",
    "bg-white rounded-[3px] outline-none transition-all duration-200",
    "placeholder:text-gray-300",
    hasError
      ? "border border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/15"
      : "border border-gray-200 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10",
  ].join(" ");
}

/* ────────────────────────────────────────
   Field 래퍼
──────────────────────────────────────── */
function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className={labelBase}>
        {label}
        {required && <span className="ml-0.5 text-[var(--color-brand)]"> *</span>}
      </p>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-[0.6875rem] text-red-500 leading-snug"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────
   성공 뷰 (접수 완료 화면)
──────────────────────────────────────── */
function SuccessView({ onClose }: { id: string; onClose: () => void }) {
  return (
    <motion.div
      className="px-5 sm:px-10 py-8 sm:py-10 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 체크 아이콘 */}
      <div className="w-14 h-14 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center mb-5">
        <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
          <path d="M1.5 9L8.5 16L22.5 2" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-1.5">
        접수 완료
      </p>
      <h3 className="text-[1.25rem] font-bold tracking-tight text-[var(--color-text-primary)] mb-1">
        문의가 정상 접수되었습니다
      </h3>
      <p className="text-[0.8125rem] text-[var(--color-text-muted)] leading-relaxed mb-7">
        담당자가 영업일 기준 24시간 이내에 연락드립니다.
      </p>

      {/* 조회 안내 카드 */}
      <div className="w-full bg-[var(--color-brand)]/5 border border-[var(--color-brand)]/15 rounded-lg px-6 py-5 mb-8 text-left">
        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-brand)]/60 mb-2">
          처리 상태 조회 방법
        </p>
        <p className="text-[0.8125rem] text-gray-600 leading-relaxed">
          문의 시 입력하신 <strong className="text-[var(--color-brand)]">이메일</strong>과 <strong className="text-[var(--color-brand)]">연락처</strong>로<br />
          언제든지 처리 상태를 확인하실 수 있습니다.
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="w-full flex flex-col gap-2.5">
        <a
          href="/check"
          className="w-full py-3 text-[0.875rem] font-bold text-white bg-[var(--color-brand)] rounded-[3px] text-center hover:opacity-90 transition-opacity duration-200"
        >
          처리 상태 조회하기
        </a>
        <button
          onClick={onClose}
          className="w-full py-3 text-[0.875rem] font-semibold text-gray-500 border border-gray-200 rounded-[3px] hover:bg-gray-50 transition-colors duration-200"
        >
          닫기
        </button>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────
   모달
──────────────────────────────────────── */
function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm]           = useState<FormData>(INIT);
  const [touched, setTouched]     = useState<TouchedMap>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState<string | null>(null);

  const errors  = validate(form);
  const isValid = Object.keys(errors).length === 0;

  const set = useCallback(
    (key: keyof FormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    []
  );

  const toggleGrade = useCallback((option: string) => {
    setForm((f) => ({
      ...f,
      grade: f.grade.includes(option)
        ? f.grade.filter((g) => g !== option)
        : [...f.grade, option],
    }));
    setTouched((t) => ({ ...t, grade: true }));
  }, []);

  const touch = useCallback(
    (key: keyof FormData) => () => setTouched((t) => ({ ...t, [key]: true })),
    []
  );

  const err = (key: keyof FormData) => (touched[key] ? errors[key] : undefined);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(INIT).map((k) => [k, true])
    ) as TouchedMap;
    setTouched(allTouched);
    if (!isValid) return;

    setLoading(true);
    setApiError(null);
    try {
      const result = await submitApplication({
        school:       form.school,
        contact_name: form.contact_name,
        contact:      form.contact,
        email:        form.email,
        grade:        form.grade.join(", "),
        headcount:    form.headcount,
        date:         form.date,
        message:      form.message,
        marketing:    String(form.marketing),
      });
      if ("error" in result) throw new Error(result.error);
      setSubmittedId((result as { ok: true; id: string }).id);
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 딤 */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
        onClick={onClose}
      />

      {/* 카드 */}
      <motion.div
        className="relative w-full max-w-[580px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onTouchMove={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence mode="wait">
          {submittedId ? (
            /* ── 접수 완료 화면 ── */
            <SuccessView key="success" id={submittedId} onClose={onClose} />
          ) : (
            /* ── 문의 폼 ── */
            <motion.div
              key="form"
              className="flex flex-col overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* 헤더 */}
              <div className="px-5 sm:px-10 pt-6 sm:pt-8 pb-5 border-b border-gray-100 flex-shrink-0">
                <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-1.5">
                  교구 납품 문의
                </p>
                <h3 className="text-[1.25rem] font-bold tracking-tight text-[var(--color-text-primary)]">
                  간편 문의
                </h3>
                <p className="mt-1 text-[0.8125rem] text-[var(--color-text-muted)] leading-snug">
                  담당자가 24시간 이내 연락드립니다.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors text-[1rem] leading-none"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>

              {/* 폼 */}
              <form
                className="px-5 sm:px-10 py-6 sm:py-8 flex flex-col gap-6 overflow-y-auto overscroll-contain"
                style={{ WebkitOverflowScrolling: "touch" }}
                onSubmit={handleSubmit}
                noValidate
              >
                {/* ── 섹션 1: 담당자 정보 ── */}
                <div>
                  <p className={sectionLabel}>담당자 정보</p>
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="학교명 / 기관명" required error={err("school")}>
                        <input
                          type="text"
                          placeholder="예) ○○초등학교"
                          value={form.school}
                          onChange={set("school")}
                          onBlur={touch("school")}
                          className={inputCls(!!err("school"))}
                        />
                      </Field>
                      <Field label="담당자 성함" required error={err("contact_name")}>
                        <input
                          type="text"
                          placeholder="예) 홍길동"
                          value={form.contact_name}
                          onChange={set("contact_name")}
                          onBlur={touch("contact_name")}
                          className={inputCls(!!err("contact_name"))}
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="담당자 연락처" required error={err("contact")}>
                        <input
                          type="tel"
                          placeholder="010-0000-0000"
                          value={form.contact}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, contact: formatPhone(e.target.value) }))
                          }
                          onBlur={touch("contact")}
                          className={inputCls(!!err("contact"))}
                        />
                      </Field>
                      <Field label="담당자 이메일 (자동 회신용)">
                        <input
                          type="email"
                          placeholder="예) teacher@school.kr"
                          value={form.email}
                          onChange={set("email")}
                          className={inputCls(false)}
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* ── 구분선 ── */}
                <div className="border-t border-gray-100" />

                {/* ── 섹션 2: 교육 상세 정보 ── */}
                <div>
                  <p className={sectionLabel}>교육 상세 정보</p>
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                      <Field label="학년 / 연령" required error={err("grade")}>
                        <div
                          className={[
                            "flex flex-col gap-2 px-4 py-3 rounded-[3px] border transition-all duration-200",
                            err("grade") ? "border-red-400" : "border-gray-200",
                          ].join(" ")}
                          onBlur={touch("grade")}
                        >
                          {GRADE_OPTIONS.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-2.5 cursor-pointer group select-none"
                            >
                              <input
                                type="checkbox"
                                checked={form.grade.includes(option)}
                                onChange={() => toggleGrade(option)}
                                className="w-3.5 h-3.5 flex-shrink-0 accent-[var(--color-brand)]"
                              />
                              <span className="text-[0.8125rem] text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors duration-150">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </Field>
                      <Field label="예상 인원" required error={err("headcount")}>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="예) 25"
                          value={form.headcount}
                          onChange={set("headcount")}
                          onBlur={touch("headcount")}
                          className={inputCls(!!err("headcount"))}
                        />
                      </Field>
                    </div>

                    <Field label="희망 교육 일자" required error={err("date")}>
                      <input
                        type="date"
                        value={form.date}
                        onChange={set("date")}
                        onBlur={touch("date")}
                        className={inputCls(!!err("date")) + " text-[var(--color-text-secondary)]"}
                      />
                    </Field>

                    <Field label="문의 상세 내용">
                      <textarea
                        rows={3}
                        placeholder="예산 처리 방식이나 기타 특이사항을 적어주세요."
                        value={form.message}
                        onChange={set("message")}
                        className={inputCls(false) + " resize-none leading-[1.8]"}
                      />
                    </Field>
                  </div>
                </div>

                {/* ── 구분선 ── */}
                <div className="border-t border-gray-100" />

                {/* 개인정보 동의 */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      checked={form.agreed}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, agreed: e.target.checked }));
                        setTouched((t) => ({ ...t, agreed: true }));
                      }}
                      className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 accent-[var(--color-brand)]"
                    />
                    <span className="text-[0.75rem] text-[var(--color-text-muted)] leading-relaxed group-hover:text-[var(--color-text-secondary)] transition-colors">
                      <span className="inline-flex items-center gap-2 flex-wrap">
                        <span>개인정보 수집 및 이용에 동의합니다.{" "}
                          <span className="text-[var(--color-brand)]">*</span>
                        </span>
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[0.625rem] text-slate-400 underline underline-offset-2 hover:text-slate-600 transition-colors duration-150"
                        >
                          전문 보기
                        </a>
                      </span>
                      <span className="block text-[0.6875rem] text-gray-300 mt-0.5 leading-relaxed">
                        수집 항목: 기관명, 연락처 &nbsp;/&nbsp; 목적: 교육 일정 안내 및 상담 &nbsp;/&nbsp; 보유 기간: 문의 처리 완료 후 즉시 파기
                        <br />(동의 거부 시 상담 서비스 이용이 제한될 수 있습니다.)
                      </span>
                    </span>
                  </label>
                  <AnimatePresence>
                    {err("agreed") && (
                      <motion.p
                        className="ml-6 text-[0.6875rem] text-red-500"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                      >
                        {err("agreed")}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* 선택 동의 */}
                <div className="pt-1 border-t border-gray-100">
                  <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      checked={form.marketing}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, marketing: e.target.checked }))
                      }
                      className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 accent-[var(--color-brand)]"
                    />
                    <span className="text-[0.75rem] text-gray-400 leading-relaxed group-hover:text-[var(--color-text-muted)] transition-colors">
                      <span className="text-[0.6875rem] font-semibold tracking-wide text-gray-300 mr-1.5">[선택]</span>
                      신규 생태 교육 커리큘럼 및 교육 자료 업데이트 소식 수신에 동의합니다.
                    </span>
                  </label>
                  <p className="ml-6 mt-1.5 text-[0.625rem] text-gray-300 leading-relaxed">
                    수집 항목: 연락처 &nbsp;/&nbsp; 목적: 신규 프로그램 및 교육 자료 안내 &nbsp;/&nbsp; 보유 기간: 수신 거부 시까지
                    <br />(본 동의는 선택 사항이며 거부하시더라도 문의 접수가 가능합니다.)
                    <br />
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-slate-400 underline underline-offset-2 hover:text-slate-600 transition-colors duration-150"
                    >
                      자세한 사항은 개인정보 처리방침 전문을 참조하세요.
                    </a>
                  </p>
                </div>

                {/* API 오류 메시지 */}
                <AnimatePresence>
                  {apiError && (
                    <motion.p
                      className="text-[0.75rem] text-red-500 text-center leading-snug"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {apiError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* 제출 버튼 */}
                <motion.button
                  type="submit"
                  disabled={!isValid || loading}
                  className={[
                    "mt-1 w-full py-[0.9375rem] text-white text-[0.875rem] font-bold tracking-tighter rounded-[3px] transition-all duration-300 flex items-center justify-center gap-2",
                    isValid && !loading
                      ? "bg-[var(--color-brand)] cursor-pointer"
                      : "bg-slate-300 cursor-not-allowed",
                  ].join(" ")}
                  whileHover={isValid && !loading ? {
                    scale: 1.02,
                    boxShadow: "0 8px 28px rgba(27,63,122,0.35)",
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  } : {}}
                  whileTap={isValid && !loading ? {
                    scale: 0.97,
                    transition: { duration: 0.1 },
                  } : {}}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
                        <path d="M14 8a6 6 0 0 0-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      전송 중...
                    </>
                  ) : "문의 접수하기"}
                </motion.button>

                {/* 하단 안내 */}
                <p className="text-center text-[0.6875rem] text-[var(--color-text-muted)] pb-1 leading-snug">
                  학급 단위 기준가 10,000원 · 30인 이상 납품 시 단가 자동 할인
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────
   질문 모달
──────────────────────────────────────── */
const Q_INIT = { name: "", email: "", content: "" };

function QuestionModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(Q_INIT);
  const [emailError, setEmailError] = useState("");
  const [contentError, setContentError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let hasError = false;
    if (!form.email.trim()) { setEmailError("답변 수신을 위해 이메일을 입력해주세요."); hasError = true; }
    else setEmailError("");
    if (!form.content.trim()) { setContentError("내용을 입력해주세요."); hasError = true; }
    else setContentError("");
    if (hasError) return;

    setLoading(true);
    setApiError("");
    const result = await submitFeedback({ category: "질문·문의", ...form });
    setLoading(false);
    if ("error" in result) setApiError(result.error);
    else setSuccess(true);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" onClick={onClose} />
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
              <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-1.5">전송 완료</p>
              <h3 className="text-[1.125rem] font-bold tracking-tight text-[var(--color-text-primary)] mb-2">질문이 전송되었습니다</h3>
              <p className="text-[0.8125rem] text-[var(--color-text-muted)] leading-relaxed mb-8">
                답변은 작성하신 메일로 보내드립니다.<br />감사합니다.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 text-[0.875rem] font-semibold text-white bg-[var(--color-brand)] rounded-[3px] hover:opacity-90 transition-opacity"
              >닫기</button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className="flex flex-col overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="px-6 pt-6 pb-5 border-b border-gray-100 flex-shrink-0">
                <p className="text-[0.625rem] font-semibold tracking-[0.18em] uppercase text-[var(--color-brand)] mb-1">에듀그리드</p>
                <h3 className="text-[1.125rem] font-bold tracking-tight text-[var(--color-text-primary)]">질문하기</h3>
                <p className="mt-1 text-[0.8125rem] text-[var(--color-text-muted)] leading-snug">
                  궁금하신 내용을 남겨주시면 메일로 답변드립니다.
                </p>
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors text-[1rem]"
                  aria-label="닫기"
                >✕</button>
              </div>
              <form
                className="px-6 py-6 flex flex-col gap-5 overflow-y-auto overscroll-contain"
                style={{ WebkitOverflowScrolling: "touch" }}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <p className={labelBase}>이름 <span className="text-gray-300 font-normal">(선택)</span></p>
                    <input
                      type="text"
                      placeholder="예) 홍길동"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className={inputCls(false)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className={labelBase}>이메일 <span className="ml-0.5 text-[var(--color-brand)]">*</span></p>
                    <input
                      type="email"
                      placeholder="예) example@gmail.com"
                      value={form.email}
                      onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); if (emailError) setEmailError(""); }}
                      className={inputCls(!!emailError)}
                    />
                    {emailError
                      ? <p className="text-[0.6875rem] text-red-500">{emailError}</p>
                      : <p className="text-[0.6875rem] text-[var(--color-text-muted)]">답변은 작성하신 메일로 보내드립니다.</p>
                    }
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className={labelBase}>질문 내용 <span className="ml-0.5 text-[var(--color-brand)]">*</span></p>
                  <textarea
                    rows={5}
                    placeholder="궁금하신 내용을 자유롭게 작성해주세요."
                    value={form.content}
                    onChange={(e) => { setForm((f) => ({ ...f, content: e.target.value })); if (contentError) setContentError(""); }}
                    className={inputCls(!!contentError) + " resize-none leading-[1.8]"}
                  />
                  {contentError && <p className="text-[0.6875rem] text-red-500">{contentError}</p>}
                </div>
                {apiError && <p className="text-[0.75rem] text-red-500 text-center">{apiError}</p>}
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
                  ) : "질문 보내기"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────
   피드백 모달
──────────────────────────────────────── */
const FB_CATEGORIES = ["서비스 요구사항", "민원", "운영 개선 제안", "기타"];
const FB_INIT = { category: FB_CATEGORIES[0], name: "", email: "", content: "" };

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(FB_INIT);
  const [contentError, setContentError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

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

/* ────────────────────────────────────────
   CTA 섹션
──────────────────────────────────────── */
const assurances = [
  "빠른 회신 (평일 24시간 이내)",
  "교육청 공문·견적서 협조 가능",
  "사전 시연 수업 협의 가능",
  "추가 비용 일절 없음",
];

export default function CTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = (modalOpen || questionOpen || feedbackOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen, questionOpen, feedbackOpen]);

  return (
    <>
      <section
        id="contact"
        className="relative bg-[#0F1F3D] overflow-hidden py-24 md:py-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 20% 50%, #1B3F7A44 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            className="max-w-2xl"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            <motion.p
              className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-[#7EB3F5] mb-6"
              variants={slideUpStagger}
              custom={0}
            >
              교구 납품 문의
            </motion.p>

            <motion.h2
              className="text-[2.25rem] md:text-[3.25rem] font-bold leading-[1.1] tracking-[-0.03em] text-white mb-6"
              variants={slideUpStagger}
              custom={1}
            >
              우리 반 아이들과<br />에듀그리드를 시작해보세요.
            </motion.h2>

            <motion.p
              className="text-white/60 text-[0.9375rem] leading-relaxed mb-10"
              variants={slideUpStagger}
              custom={2}
            >
              키트비 10,000원, 수업 자료 전면 무료.<br />
              납품 일정·예산 처리·교육과정 연계까지 편하게 문의해주세요.
            </motion.p>

            <motion.div variants={slideUpStagger} custom={3} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <motion.button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center justify-center px-10 py-5 bg-white text-[var(--color-brand)] text-[0.9375rem] font-bold tracking-tighter rounded-sm"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  }}
                  whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                >
                  지금 교구 납품 문의하기
                </motion.button>

                <button
                  onClick={() => setQuestionOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-4 border border-white/25 text-white/70 text-[0.875rem] font-medium tracking-wide rounded-sm hover:border-white/50 hover:text-white transition-colors duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                    <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  궁금한 내용 문의하기
                </button>

                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-4 border border-white/15 text-white/40 text-[0.875rem] font-medium tracking-wide rounded-sm hover:border-white/35 hover:text-white/70 transition-colors duration-200"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
                    <path d="M6.5 1.5C3.74 1.5 1.5 3.46 1.5 5.875c0 .9.3 1.74.82 2.43L1.5 11l2.84-1.08A5.3 5.3 0 0 0 6.5 10.25c2.76 0 5-1.96 5-4.375S9.26 1.5 6.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  의견·민원 접수
                </button>
              </div>

              <a
                href="/check"
                className="text-[0.8125rem] text-white/40 hover:text-white/70 transition-colors duration-200 underline underline-offset-4 decoration-white/20 hover:decoration-white/50 whitespace-nowrap self-start"
              >
                이미 문의하셨나요? 문의 내역 조회하기
              </a>
            </motion.div>

            <motion.ul
              className="mt-8 flex flex-col sm:flex-row flex-wrap gap-x-7 gap-y-2"
              variants={slideUpStagger}
              custom={4}
            >
              {assurances.map((text) => (
                <li key={text} className="flex items-center gap-1.5 text-[0.75rem] text-white/40">
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="flex-shrink-0 opacity-50">
                    <path d="M1 3.5L3.2 6L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {text}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && <ContactModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {questionOpen && <QuestionModal onClose={() => setQuestionOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
