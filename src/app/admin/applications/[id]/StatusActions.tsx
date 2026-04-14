"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStatus, saveAdminNotes } from "@/actions/updateStatus";
import type { ApplicationStatus } from "@/lib/supabase/types";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; style: string }[] = [
  { value: "pending",   label: "⏳ 대기 중", style: "border-amber-300 bg-amber-50 text-amber-700" },
  { value: "confirmed", label: "✅ 확정됨",  style: "border-emerald-400 bg-emerald-50 text-emerald-700" },
  { value: "canceled", label: "✕ 취소됨",  style: "border-gray-300 bg-gray-100 text-gray-500" },
];

export default function StatusActions({
  applicationId,
  currentStatus,
  initialNotes,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
  initialNotes: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes]       = useState(initialNotes);
  const [saveMsg, setSaveMsg]   = useState<string | null>(null);
  const [statusErr, setStatusErr] = useState<string | null>(null);

  function handleStatusChange(newStatus: ApplicationStatus) {
    if (newStatus === currentStatus) return;
    setStatusErr(null);
    startTransition(async () => {
      const result = await updateStatus(applicationId, newStatus);
      if ("error" in result) {
        setStatusErr(result.error);
      } else {
        router.refresh();
      }
    });
  }

  async function handleSaveNotes() {
    setSaveMsg(null);
    const result = await saveAdminNotes(applicationId, notes);
    if ("error" in result) {
      setSaveMsg("저장 실패: " + result.error);
    } else {
      setSaveMsg("저장되었습니다.");
      setTimeout(() => setSaveMsg(null), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 상태 변경 */}
      <div
        className="bg-white rounded-[4px] px-6 py-6"
        style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}
      >
        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-[#8A95A3] mb-4">
          상태 변경
        </p>
        <div className="flex flex-col gap-2.5">
          {STATUS_OPTIONS.map(({ value, label, style }) => (
            <button
              key={value}
              onClick={() => handleStatusChange(value)}
              disabled={isPending}
              className={[
                "w-full px-4 py-2.5 rounded-[3px] border text-[0.8125rem] font-semibold text-left transition-all duration-150",
                currentStatus === value
                  ? style + " ring-2 ring-offset-1 ring-current/30"
                  : "border-[#E8EAED] bg-white text-[#8A95A3] hover:border-[#C0C6CE] hover:text-[#1A2535]",
                isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              {label}
              {currentStatus === value && (
                <span className="ml-2 text-[0.625rem] font-bold tracking-wide uppercase opacity-60">현재</span>
              )}
            </button>
          ))}
        </div>
        {statusErr && (
          <p className="mt-2 text-[0.75rem] text-red-500">{statusErr}</p>
        )}
      </div>

      {/* 관리자 메모 */}
      <div
        className="bg-white rounded-[4px] px-6 py-6"
        style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}
      >
        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-[#8A95A3] mb-4">
          관리자 메모
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="내부 메모를 입력하세요."
          className="w-full px-3 py-2.5 text-[0.8125rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[3px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 resize-none leading-[1.8] transition-all duration-150 placeholder:text-gray-300"
        />
        <button
          onClick={handleSaveNotes}
          className="mt-3 w-full py-2.5 bg-[#1B3F7A] text-white text-[0.8125rem] font-bold rounded-[3px] hover:bg-[#163260] transition-colors duration-150"
        >
          메모 저장
        </button>
        {saveMsg && (
          <p className={`mt-2 text-[0.75rem] text-center ${saveMsg.startsWith("저장되") ? "text-emerald-600" : "text-red-500"}`}>
            {saveMsg}
          </p>
        )}
      </div>
    </div>
  );
}
