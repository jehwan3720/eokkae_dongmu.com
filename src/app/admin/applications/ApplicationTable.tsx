"use client";

import { useState } from "react";
import Link from "next/link";
import type { Application, ApplicationStatus } from "@/lib/supabase/types";
import InlineStatusSelect from "./InlineStatusSelect";
import ApplicationDrawer from "./ApplicationDrawer";

const STATUS_COUNT_STYLE: Record<ApplicationStatus, string> = {
  pending:   "text-amber-600",
  confirmed: "text-emerald-600",
  canceled:  "text-gray-400",
};

export default function ApplicationTable({ rows }: { rows: Application[] }) {
  const [selected, setSelected] = useState<Application | null>(null);

  if (rows.length === 0) {
    return (
      <div className="py-20 text-center text-[0.875rem] text-[#B0B8C1]">
        문의가 없습니다.
      </div>
    );
  }

  return (
    <>
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

                {/* 학교명 */}
                <td className="px-5 py-4 font-medium text-[#1A2535]">
                  <span className="hover:text-[#1B3F7A] transition-colors">
                    {app.school}
                  </span>
                </td>

                {/* 담당자 성함 */}
                <td className="px-5 py-4 text-[#5A6472]">
                  {app.contact_name ?? "—"}
                </td>

                {/* 연락처 */}
                <td className="px-5 py-4 text-[#5A6472] whitespace-nowrap">
                  {app.contact}
                </td>

                {/* 희망 교육 일자 */}
                <td className="px-5 py-4 text-[#5A6472] whitespace-nowrap">
                  {app.preferred_date}
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
