import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Application, ApplicationStatus } from "@/lib/supabase/types";
import LogoutButton from "./LogoutButton";
import ApplicationTable from "./ApplicationTable";

const STATUS_COUNT_STYLE: Record<ApplicationStatus, string> = {
  pending:   "text-amber-600",
  confirmed: "text-emerald-600",
  canceled:  "text-gray-400",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  // 인증 확인
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const filter = params.status ?? "all";

  // 문의 목록 조회
  const service = createServiceClient();
  let query = service
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data: applications } = await query;
  const rows = (applications ?? []) as Application[];

  // 통계
  const { data: counts } = await service
    .from("applications")
    .select("status");

  const stats = { all: 0, pending: 0, confirmed: 0, canceled: 0 };
  (counts ?? []).forEach((r: { status: string }) => {
    stats.all++;
    if (r.status in stats) stats[r.status as ApplicationStatus]++;
  });

  const tabs: { key: string; label: string; count: number }[] = [
    { key: "all",       label: "전체",   count: stats.all },
    { key: "pending",   label: "대기 중", count: stats.pending },
    { key: "confirmed", label: "확정됨",  count: stats.confirmed },
    { key: "canceled",  label: "취소됨",  count: stats.canceled },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[#1B3F7A] mb-1">
            어깨동무 관리자
          </p>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-[#1A2535]">
            교육 문의 관리
          </h1>
        </div>
        <LogoutButton />
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "전체", value: stats.all,       color: "text-[#1A2535]" },
          { label: "대기", value: stats.pending,   color: STATUS_COUNT_STYLE.pending },
          { label: "확정", value: stats.confirmed, color: STATUS_COUNT_STYLE.confirmed },
          { label: "취소", value: stats.canceled,  color: STATUS_COUNT_STYLE.canceled },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-[4px] px-6 py-5"
            style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}
          >
            <p className="text-[0.6875rem] font-semibold tracking-wide text-[#8A95A3] uppercase mb-1">
              {label}
            </p>
            <p className={`text-[2rem] font-bold leading-none ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-1 mb-4 border-b border-[#E8EAED]">
        {tabs.map(({ key, label, count }) => (
          <Link
            key={key}
            href={key === "all" ? "/admin/applications" : `/admin/applications?status=${key}`}
            className={[
              "px-4 py-2.5 text-[0.8125rem] font-medium transition-colors duration-150 border-b-2 -mb-px",
              filter === key
                ? "border-[#1B3F7A] text-[#1B3F7A]"
                : "border-transparent text-[#8A95A3] hover:text-[#1A2535]",
            ].join(" ")}
          >
            {label}
            <span className="ml-1.5 text-[0.6875rem] text-[#B0B8C1]">{count}</span>
          </Link>
        ))}
      </div>

      {/* 테이블 */}
      <div
        className="bg-white rounded-[4px] overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}
      >
        <ApplicationTable rows={rows} />
      </div>

      {/* 하단 안내 */}
      <p className="mt-4 text-[0.6875rem] text-[#B0B8C1] text-right">
        행 클릭 → 상세 정보 보기
      </p>
    </div>
  );
}
