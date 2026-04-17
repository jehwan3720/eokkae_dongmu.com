"use client";

import { useState } from "react";
import type { Application } from "@/lib/supabase/types";
import InlineStatusSelect from "./InlineStatusSelect";
import ApplicationDrawer from "./ApplicationDrawer";

/* ── D-day 계산 ── */
function DdayBadge({ dateStr }: { dateStr: string }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return null; // 지난 날짜는 표시 안 함

  let label = "";
  let cls = "";

  if (diff === 0) {
    label = "D-Day";
    cls = "bg-red-100 text-red-600";
  } else if (diff <= 7) {
    label = `D-${diff}`;
    cls = "bg-orange-100 text-orange-600";
  } else if (diff <= 14) {
    label = `D-${diff}`;
    cls = "bg-amber-100 text-amber-600";
  } else {
    return null;
  }

  return (
    <span className={`ml-2 inline-block text-[0.625rem] font-bold px-1.5 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

/* ── CSV 내보내기 ── */
function exportCSV(rows: Application[]) {
  const headers = ["접수일", "학교명", "담당자", "연락처", "이메일", "학년", "인원", "희망일자", "상태", "취소사유", "메모"];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = [
    headers.join(","),
    ...rows.map((r) => [
      new Date(r.created_at).toLocaleDateString("ko-KR"),
      r.school,
      r.contact_name ?? "",
      r.contact,
      r.email ?? "",
      r.grade,
      r.headcount,
      r.preferred_date,
      r.status === "pending" ? "대기 중" : r.status === "confirmed" ? "확정됨" : "취소됨",
      r.cancellation_reason ?? "",
      r.admin_notes ?? "",
    ].map(escape).join(",")),
  ];
  const bom = "\uFEFF";
  const blob = new Blob([bom + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `어깨동무_문의_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ApplicationTable({ rows }: { rows: Application[] }) {
  const [selected, setSelected] = useState<Application | null>(null);

  // 학교별 접수 건수 집계
  const schoolCount: Record<string, number> = {};
  rows.forEach((r) => {
    schoolCount[r.school] = (schoolCount[r.school] ?? 0) + 1;
  });

  if (rows.length === 0) {
    return (
      <div className="py-20 text-center text-[0.875rem] text-[#B0B8C1]">
        문의가 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* CSV 내보내기 버튼 */}
      <div className="flex justify-end px-5 pt-4 pb-1">
        <button
          onClick={() => exportCSV(rows)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium text-[#8A95A3] border border-[#E8EAED] rounded-[3px] hover:text-[#1A2535] hover:border-[#C0C6CE] transition-colors duration-150"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8m0 0L5 7m3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          CSV 내보내기
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[0.8125rem]">
          <thead>
            <tr className="border-b border-[#E8EAED] bg-[#F8F9FB]">
              {["신청 날짜", "학교명 / 기관명", "담당자 성함", "연락처", "희망 교육 일자", "상태"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[0.6875rem] font-semibold tracking-wide uppercase text-[#8A95A3] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((app) => (
              <tr
                key={app.application_id}
                onClick={() => setSelected(app)}
                className="border-b border-[#F0F1F3] last:border-0 hover:bg-[#F8F9FB] transition-colors duration-100 cursor-pointer"
              >
                {/* 신청 날짜 */}
                <td className="px-5 py-4 text-[#8A95A3] whitespace-nowrap">
                  {new Date(app.created_at).toLocaleDateString("ko-KR", {
                    year: "2-digit", month: "2-digit", day: "2-digit",
                  })}
                </td>

                {/* 학교명 + 중복 배지 */}
                <td className="px-5 py-4 font-medium text-[#1A2535]">
                  <span className="hover:text-[#1B3F7A] transition-colors">
                    {app.school}
                  </span>
                  {schoolCount[app.school] > 1 && (
                    <span className="ml-2 inline-block text-[0.625rem] font-bold px-1.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#1B3F7A]">
                      {schoolCount[app.school]}건
                    </span>
                  )}
                </td>

                {/* 담당자 성함 */}
                <td className="px-5 py-4 text-[#5A6472]">
                  {app.contact_name ?? "—"}
                </td>

                {/* 연락처 */}
                <td className="px-5 py-4 text-[#5A6472] whitespace-nowrap">
                  {app.contact}
                </td>

                {/* 희망 교육 일자 + D-day */}
                <td className="px-5 py-4 text-[#5A6472] whitespace-nowrap">
                  {app.preferred_date}
                  <DdayBadge dateStr={app.preferred_date} />
                </td>

                {/* 상태 */}
                <td
                  className="px-5 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <InlineStatusSelect
                    applicationId={app.application_id}
                    currentStatus={app.status}
                    cancellationReason={app.cancellation_reason}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ApplicationDrawer app={selected} onClose={() => setSelected(null)} />
    </>
  );
}
