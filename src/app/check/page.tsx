"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { checkApplication, ApplicationResult } from "@/actions/checkApplication";

/* ── 전화번호 자동 포맷 ── */
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

/* ── 상태 배지 설정 ── */
const STATUS_MAP = {
  pending:   { label: "대기 중", bg: "bg-amber-400/20",  text: "text-amber-300",  dot: "bg-amber-400"  },
  confirmed: { label: "확정",    bg: "bg-emerald-400/20", text: "text-emerald-300", dot: "bg-emerald-400" },
  canceled: { label: "취소",    bg: "bg-red-400/20",    text: "text-red-400",    dot: "bg-red-400"    },
} as const;

function StatusBadge({ status }: { status: ApplicationResult["status"] }) {
  const s = STATUS_MAP[status];
  return (
    <span className={["inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-semibold", s.bg, s.text].join(" ")}>
      <span className={["w-1.5 h-1.5 rounded-full flex-shrink-0", s.dot].join(" ")} />
      {s.label}
    </span>
  );
}

/* ── 상태 안내 메시지 ── */
function StatusNote({
  status,
  cancellationReason,
}: {
  status: ApplicationResult["status"];
  cancellationReason: string | null;
}) {
  if (status === "pending")
    return <p className="text-[0.8125rem] text-white/40 leading-relaxed">담당자가 검토 중입니다. 영업일 기준 24시간 이내에 연락드립니다.</p>;
  if (status === "confirmed")
    return <p className="text-[0.8125rem] text-emerald-400/80 leading-relaxed">교육 일정이 확정되었습니다. 담당자님에게 별도 안내가 발송됩니다.</p>;

  // canceled
  const reason = cancellationReason ?? "일정 조율이 어려워 취소 처리되었습니다.";
  return (
    <p className="text-[0.8125rem] text-red-400 leading-relaxed">
      {reason}
    </p>
  );
}

/* ── 결과 카드 ── */
function ResultCard({ item, index }: { item: ApplicationResult; index: number }) {
  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 카드 헤더 */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.625rem] font-semibold tracking-[0.16em] uppercase text-white/30 mb-0.5">
            {item.created_at.slice(0, 10)} 접수
          </p>
          <p className="text-[1rem] font-bold text-white">{item.school}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {/* 카드 상세 */}
      <div className="px-6 py-4 grid grid-cols-2 gap-x-6 gap-y-3">
        {[
          ["담당자",    item.contact_name],
          ["학년 / 연령", item.grade],
          ["예상 인원",  `${item.headcount}명`],
          ["희망 교육 일자", item.preferred_date],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[0.625rem] font-semibold tracking-wide uppercase text-white/30 mb-0.5">{label}</p>
            <p className="text-[0.875rem] text-white/80 font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* 상태 안내 */}
      <div className="px-6 pb-5">
        <StatusNote status={item.status} cancellationReason={item.cancellation_reason} />
      </div>
    </motion.div>
  );
}

/* ── 메인 페이지 ── */
export default function CheckPage() {
  const [email,   setEmail]   = useState("");
  const [contact, setContact] = useState("");
  const [results, setResults] = useState<ApplicationResult[] | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);

    startTransition(async () => {
      const res = await checkApplication(email.trim(), contact.trim());
      if ("error" in res) {
        setError(res.error);
      } else {
        setResults(res.data);
      }
    });
  }

  function reset() {
    setResults(null);
    setError(null);
  }

  const inputCls =
    "w-full px-4 py-3 text-[0.875rem] text-white bg-white/5 border border-white/15 rounded-[4px] outline-none placeholder:text-white/20 transition-all duration-200 focus:border-[#7EB3F5]/60 focus:ring-2 focus:ring-[#7EB3F5]/10";

  return (
    <main className="min-h-screen bg-[#0F1F3D] px-4 py-16">

      {/* 배경 그라디언트 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse 60% 70% at 20% 20%, #1B3F7A33 0%, transparent 70%)" }}
      />

      <div className="relative max-w-[520px] mx-auto">

        {/* 헤더 */}
        <div className="mb-10">
          <a href="/" className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-[#7EB3F5] mb-6 hover:text-white transition-colors duration-150">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M13 5H1M1 5L5 1M1 5L5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            메인으로
          </a>
          <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-[#7EB3F5] mb-3">어깨동무</p>
          <h1 className="text-[1.875rem] font-bold tracking-tight text-white mb-2">
            문의 내역 조회
          </h1>
          <p className="text-[0.875rem] text-white/40 leading-relaxed">
            문의 시 입력하신 이메일과 연락처로 처리 상태를 확인하세요.
          </p>
        </div>

        {/* 조회 폼 */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-white/40">
              담당자 이메일
            </label>
            <input
              type="email"
              placeholder="예) teacher@school.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-white/40">
              담당자 연락처
            </label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              value={contact}
              onChange={(e) => setContact(formatPhone(e.target.value))}
              className={inputCls}
              autoComplete="tel"
            />
          </div>

          <motion.button
            type="submit"
            disabled={!email.trim() || !contact.trim() || isPending}
            className={[
              "w-full py-3.5 text-[0.875rem] font-bold rounded-[4px] transition-all duration-200 flex items-center justify-center gap-2",
              email.trim() && contact.trim() && !isPending
                ? "bg-white text-[#1B3F7A] cursor-pointer hover:bg-white/90"
                : "bg-white/10 text-white/30 cursor-not-allowed",
            ].join(" ")}
            whileTap={email.trim() && contact.trim() && !isPending ? { scale: 0.98 } : {}}
          >
            {isPending ? (
              <>
                <svg className="animate-spin" width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                  <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                조회 중...
              </>
            ) : "문의 내역 조회"}
          </motion.button>
        </form>

        {/* 오류 메시지 */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-[4px]"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <p className="text-[0.875rem] text-red-400 leading-snug">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 결과 목록 */}
        <AnimatePresence>
          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* 결과 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-[0.75rem] font-semibold text-white/40">
                  총 <span className="text-white font-bold">{results.length}건</span>의 문의 내역
                </p>
                <button
                  onClick={reset}
                  className="text-[0.75rem] text-[#7EB3F5] hover:text-white transition-colors duration-150"
                >
                  다시 조회
                </button>
              </div>

              {/* 결과 카드 목록 */}
              <div className="flex flex-col gap-3">
                {results.map((item, i) => (
                  <ResultCard key={item.application_id} item={item} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 하단 안내 */}
        {!results && (
          <p className="text-center text-[0.6875rem] text-white/20 leading-relaxed mt-6">
            이메일을 입력하지 않으셨거나 정보를 분실하신 경우<br />
            <a href="mailto:eokkae0202@gmail.com" className="text-[#7EB3F5]/60 hover:text-[#7EB3F5] transition-colors duration-150 underline underline-offset-2">
              eokkae0202@gmail.com
            </a>
            으로 직접 문의해 주세요.
          </p>
        )}

      </div>
    </main>
  );
}
