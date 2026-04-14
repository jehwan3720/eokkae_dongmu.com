import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Application, StatusHistory } from "@/lib/supabase/types";
import StatusActions from "./StatusActions";

const STATUS_LABEL = { pending: "대기 중", confirmed: "확정됨", canceled: "취소됨" };
const STATUS_STYLE = {
  pending:   "bg-amber-50 text-amber-700 border border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  canceled: "bg-gray-100 text-gray-500 border border-gray-200",
};

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const service = createServiceClient();

  const [{ data: app }, { data: history }] = await Promise.all([
    service.from("applications").select("*").eq("application_id", id).single(),
    service
      .from("status_history")
      .select("*")
      .eq("application_id", id)
      .order("changed_at", { ascending: false }),
  ]);

  if (!app) notFound();

  const application = app as Application;
  const statusHistory = (history ?? []) as StatusHistory[];

  const fields: [string, string][] = [
    ["학교명 / 기관명", application.school],
    ["담당자 연락처",   application.contact],
    ["담당자 이메일",   application.email ?? "미입력"],
    ["학년 / 연령",    application.grade],
    ["예상 인원",      `${application.headcount}명`],
    ["희망 교육 일자", application.preferred_date],
    ["마케팅 동의",    application.marketing ? "동의" : "미동의"],
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* 뒤로 가기 */}
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-1.5 text-[0.8125rem] text-[#8A95A3] hover:text-[#1A2535] transition-colors mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        문의 목록으로
      </Link>

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[1.5rem] font-bold tracking-tight text-[#1A2535]">
            {application.school}
          </h1>
          <p className="text-[0.8125rem] text-[#8A95A3] mt-1">
            접수 ID: {application.application_id.slice(0, 8).toUpperCase()} &nbsp;·&nbsp;{" "}
            {new Date(application.created_at).toLocaleString("ko-KR")}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-[0.75rem] font-semibold ${
            STATUS_STYLE[application.status as keyof typeof STATUS_STYLE]
          }`}
        >
          {STATUS_LABEL[application.status as keyof typeof STATUS_LABEL]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* 왼쪽 — 상세 정보 */}
        <div className="flex flex-col gap-6">
          {/* 문의 내용 */}
          <div
            className="bg-white rounded-[4px] px-7 py-6"
            style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}
          >
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-[#8A95A3] mb-5">
              문의 내용
            </p>
            <dl className="flex flex-col gap-4">
              {fields.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[140px_1fr] gap-4 text-[0.8125rem]">
                  <dt className="text-[#8A95A3] font-medium">{label}</dt>
                  <dd className="text-[#1A2535] font-medium">{value}</dd>
                </div>
              ))}
              {application.message && (
                <div className="pt-4 border-t border-[#F0F1F3]">
                  <dt className="text-[0.6875rem] font-semibold tracking-wide uppercase text-[#8A95A3] mb-2">
                    문의 상세 내용
                  </dt>
                  <dd className="text-[0.875rem] text-[#1A2535] leading-[1.8] whitespace-pre-line">
                    {application.message}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* 변경 이력 */}
          <div
            className="bg-white rounded-[4px] px-7 py-6"
            style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}
          >
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-[#8A95A3] mb-5">
              상태 변경 이력
            </p>
            {statusHistory.length === 0 ? (
              <p className="text-[0.8125rem] text-[#B0B8C1]">이력이 없습니다.</p>
            ) : (
              <ol className="flex flex-col gap-3">
                {statusHistory.map((h) => (
                  <li key={h.id} className="flex items-start gap-3 text-[0.8125rem]">
                    <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-[#C0C6CE]" />
                    <div>
                      <span className="text-[#1A2535] font-medium">
                        {h.from_status
                          ? `${STATUS_LABEL[h.from_status as keyof typeof STATUS_LABEL]} → ${STATUS_LABEL[h.to_status as keyof typeof STATUS_LABEL]}`
                          : `접수 (${STATUS_LABEL[h.to_status as keyof typeof STATUS_LABEL]})`}
                      </span>
                      <span className="ml-2 text-[#B0B8C1]">
                        {new Date(h.changed_at).toLocaleString("ko-KR")}
                      </span>
                      {h.note && (
                        <p className="mt-0.5 text-[#8A95A3]">{h.note}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* 오른쪽 — 상태 변경 + 메모 */}
        <StatusActions
          applicationId={application.application_id}
          currentStatus={application.status as "pending" | "confirmed" | "canceled"}
          initialNotes={application.admin_notes ?? ""}
        />
      </div>
    </div>
  );
}
