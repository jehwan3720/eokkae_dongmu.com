"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateStatus } from "@/actions/updateStatus";
import type { ApplicationStatus } from "@/lib/supabase/types";

const OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "pending",   label: "대기 중" },
  { value: "confirmed", label: "확정됨"  },
  { value: "canceled",  label: "취소됨"  },
];

const SELECT_STYLE: Record<ApplicationStatus, string> = {
  pending:   "bg-amber-50   text-amber-700  border-amber-300",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-400",
  canceled:  "bg-gray-100   text-gray-500   border-gray-300",
};

const PRESET_REASONS = [
  "요청하신 일자에 교육 일정이 모두 마감되었습니다.",
  "신청하신 인원수가 교육 진행 기준과 맞지 않습니다.",
  "학교/기관 측의 요청으로 취소 처리되었습니다.",
  "기타",
] as const;

/* ── 취소 사유 모달 ── */
function CancelModal({
  onConfirm,
  onClose,
  isPending,
  initialReason,
}: {
  onConfirm: (reason: string) => void;
  onClose: () => void;
  isPending: boolean;
  initialReason?: string | null;
}) {
  const matchesPreset =
    !!initialReason &&
    (PRESET_REASONS as readonly string[]).includes(initialReason) &&
    initialReason !== "기타";

  const [selected, setSelected] = useState<string>(
    matchesPreset ? initialReason! : initialReason ? "기타" : PRESET_REASONS[0]
  );
  const [custom, setCustom] = useState(
    matchesPreset || !initialReason ? "" : initialReason
  );

  const isEditing = !!initialReason;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const isCustom    = selected === "기타";
  const finalReason = isCustom ? custom.trim() : selected;
  const canConfirm  = isCustom ? custom.trim().length > 0 : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(10,22,40,0.65)", backdropFilter: "blur(3px)" }}>
      <div
        ref={dialogRef}
        className="w-full max-w-[420px] bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* 헤더 */}
        <div className="px-7 py-5 border-b border-gray-100">
          <p className="text-[0.625rem] font-semibold tracking-[0.18em] uppercase text-red-400 mb-1">취소 처리</p>
          <h2 className="text-[1.0625rem] font-bold text-[#1A2535]">
            {isEditing ? "취소 사유를 수정해주세요" : "취소 사유를 선택해주세요"}
          </h2>
        </div>

        {/* 본문 */}
        <div className="px-7 py-5 flex flex-col gap-3">
          {PRESET_REASONS.map((reason) => (
            <label
              key={reason}
              className="flex items-start gap-3 cursor-pointer group select-none"
            >
              <input
                type="radio"
                name="cancel-reason"
                value={reason}
                checked={selected === reason}
                onChange={() => setSelected(reason)}
                className="mt-0.5 flex-shrink-0 accent-[#1B3F7A]"
              />
              <span className={[
                "text-[0.8125rem] leading-relaxed transition-colors duration-150",
                selected === reason ? "text-[#1A2535] font-semibold" : "text-[#8A95A3] group-hover:text-[#5A6472]",
              ].join(" ")}>
                {reason}
              </span>
            </label>
          ))}

          {/* 직접 입력 */}
          {isCustom && (
            <textarea
              rows={3}
              placeholder="취소 사유를 직접 입력해주세요."
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              autoFocus
              className="ml-6 w-[calc(100%-1.5rem)] px-3 py-2.5 text-[0.8125rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[3px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 resize-none leading-[1.8] placeholder:text-gray-300 transition-all duration-150"
            />
          )}
        </div>

        {/* 버튼 */}
        <div className="px-7 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 text-[0.875rem] font-semibold text-[#8A95A3] border border-[#E8EAED] rounded-[3px] hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50"
          >
            닫기
          </button>
          <button
            onClick={() => canConfirm && onConfirm(finalReason)}
            disabled={!canConfirm || isPending}
            className={[
              "flex-1 py-2.5 text-[0.875rem] font-bold rounded-[3px] transition-all duration-150",
              canConfirm && !isPending
                ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed",
            ].join(" ")}
          >
            {isPending ? "처리 중..." : isEditing ? "사유 수정 확정" : "취소 처리 확정"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 인라인 상태 드롭다운 ── */
export default function InlineStatusSelect({
  applicationId,
  currentStatus,
  cancellationReason,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
  cancellationReason?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState<ApplicationStatus>(currentStatus);
  const [showModal, setShowModal]     = useState(false);
  const [errorMsg, setErrorMsg]       = useState<string | null>(null);

  // 서버 prop 동기화
  if (localStatus !== currentStatus && !isPending && !showModal) {
    setLocalStatus(currentStatus);
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ApplicationStatus;
    if (next === localStatus) return;
    setErrorMsg(null);

    if (next === "canceled") {
      setShowModal(true);
      e.target.value = localStatus;
    } else {
      setLocalStatus(next);
      startTransition(async () => {
        try {
          const res = await updateStatus(applicationId, next);
          if ("error" in res) {
            setLocalStatus(currentStatus);
            setErrorMsg(res.error ?? null);
          } else {
            router.refresh();
          }
        } catch {
          setLocalStatus(currentStatus);
          setErrorMsg("상태 변경에 실패했습니다. 다시 시도해주세요.");
        }
      });
    }
  }

  function handleCancelConfirm(reason: string) {
    startTransition(async () => {
      try {
        const res = await updateStatus(applicationId, "canceled", { cancellationReason: reason });
        if ("error" in res) {
          setErrorMsg(res.error ?? null);
        } else {
          setLocalStatus("canceled");
          setShowModal(false);
          router.refresh();
        }
      } catch {
        setErrorMsg("취소 처리에 실패했습니다. 다시 시도해주세요.");
      }
    });
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <select
            value={localStatus}
            onChange={handleChange}
            disabled={isPending}
            className={[
              "text-[0.75rem] font-semibold px-2.5 py-1 rounded-full border outline-none transition-all duration-150",
              isPending ? "opacity-50 cursor-wait" : "cursor-pointer",
              errorMsg
                ? "border-red-400 bg-red-50 text-red-600"
                : SELECT_STYLE[localStatus],
            ].join(" ")}
          >
            {OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* 취소 상태일 때 사유 수정 버튼 */}
          {localStatus === "canceled" && !isPending && (
            <button
              onClick={() => { setErrorMsg(null); setShowModal(true); }}
              title="취소 사유 수정"
              className="flex-shrink-0 text-[#8A95A3] hover:text-[#1B3F7A] transition-colors duration-150"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* 취소 사유 표시 */}
        {localStatus === "canceled" && cancellationReason && (
          <p className="mt-0.5 text-[0.6875rem] text-red-500/80 leading-relaxed break-keep whitespace-normal">
            {cancellationReason}
          </p>
        )}

        {errorMsg && (
          <p className="text-[0.625rem] text-red-500 leading-snug max-w-[120px]">
            {errorMsg}
          </p>
        )}
      </div>

      {showModal && (
        <CancelModal
          onConfirm={handleCancelConfirm}
          onClose={() => setShowModal(false)}
          isPending={isPending}
          initialReason={localStatus === "canceled" ? cancellationReason : null}
        />
      )}
    </>
  );
}
