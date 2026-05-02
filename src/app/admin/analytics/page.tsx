import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import LogoutButton from "../applications/LogoutButton";

interface PageView {
  id: string;
  visited_at: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  ip: string | null;
  device: string | null;
}

function formatDevice(device: string | null) {
  if (device === "mobile") return "📱 모바일";
  return "🖥 PC";
}

function formatReferrer(ref: string | null) {
  if (!ref) return "직접 접속";
  try {
    const url = new URL(ref);
    if (url.hostname.includes("naver")) return "네이버";
    if (url.hostname.includes("google")) return "구글";
    if (url.hostname.includes("kakao") || url.hostname.includes("kakaotalk")) return "카카오톡";
    if (url.hostname.includes("instagram")) return "인스타그램";
    return url.hostname;
  } catch {
    return "직접 접속";
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function showIp(ip: string | null) {
  return ip || "-";
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const service = createServiceClient();

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now);
  monthStart.setDate(now.getDate() - 30);
  const chartStart = new Date(now);
  chartStart.setDate(now.getDate() - 13);
  chartStart.setHours(0, 0, 0, 0);

  const [{ count: total }, { count: today }, { count: week }, { count: month }, { data: recent }, { data: chartData }] =
    await Promise.all([
      service.from("page_views").select("*", { count: "exact", head: true }),
      service.from("page_views").select("*", { count: "exact", head: true }).gte("visited_at", todayStart.toISOString()),
      service.from("page_views").select("*", { count: "exact", head: true }).gte("visited_at", weekStart.toISOString()),
      service.from("page_views").select("*", { count: "exact", head: true }).gte("visited_at", monthStart.toISOString()),
      service.from("page_views").select("*").order("visited_at", { ascending: false }).limit(100),
      service.from("page_views").select("visited_at").gte("visited_at", chartStart.toISOString()).order("visited_at", { ascending: true }),
    ]);

  // 14일 일별 집계
  const days: { label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push({
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count: 0,
    });
  }
  (chartData ?? []).forEach((row: { visited_at: string }) => {
    const d = new Date(row.visited_at);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const found = days.find((day) => day.label === label);
    if (found) found.count++;
  });
  const maxCount = Math.max(...days.map((d) => d.count), 1);

  const rows = (recent ?? []) as PageView[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 overflow-x-hidden">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[#1B3F7A] mb-1">
            에듀그리드 관리자
          </p>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-[#1A2535]">
            방문자 통계
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/applications"
            className="px-3 py-2 text-[0.8125rem] font-medium text-[#8A95A3] border border-[#E8EAED] rounded-[3px] hover:text-[#1A2535] hover:border-[#C0C6CE] transition-colors duration-150"
          >
            문의 관리
          </Link>
          <Link
            href="/admin/photos"
            className="px-3 py-2 text-[0.8125rem] font-medium text-[#8A95A3] border border-[#E8EAED] rounded-[3px] hover:text-[#1A2535] hover:border-[#C0C6CE] transition-colors duration-150"
          >
            사진 관리
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "오늘",   value: today  ?? 0, color: "text-[#1B3F7A]" },
          { label: "7일",    value: week   ?? 0, color: "text-emerald-600" },
          { label: "30일",   value: month  ?? 0, color: "text-amber-600" },
          { label: "누적",   value: total  ?? 0, color: "text-[#1A2535]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-[4px] px-4 py-4 sm:px-6 sm:py-5" style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}>
            <p className="text-[0.6875rem] font-semibold tracking-wide text-[#8A95A3] uppercase mb-1">{label}</p>
            <p className={`text-[2rem] font-bold leading-none ${color}`}>{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* 일별 차트 */}
      <div className="bg-white rounded-[4px] px-4 sm:px-6 py-6 mb-6 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}>
        <p className="text-[0.75rem] font-semibold tracking-wide text-[#8A95A3] uppercase mb-5">
          <span className="sm:hidden">최근 7일 방문자</span>
          <span className="hidden sm:inline">최근 14일 방문자</span>
        </p>
        <div className="flex items-end gap-1.5 h-28">
          {days.map(({ label, count }, index) => (
            <div key={label} className={`flex-1 flex flex-col items-center gap-1${index < 7 ? " hidden sm:flex" : ""}`}>
              <span className="text-[0.6rem] text-[#8A95A3]">{count > 0 ? count : ""}</span>
              <div
                className="w-full rounded-t-[2px] bg-[#1B3F7A] transition-all duration-300"
                style={{ height: `${Math.max((count / maxCount) * 80, count > 0 ? 4 : 0)}px` }}
              />
              <span className="text-[0.6rem] text-[#B0B8C1] whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 방문 목록 */}
      <div className="bg-white rounded-[4px] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}>
        <div className="overflow-x-auto">
        <table className="w-full text-[0.8125rem] min-w-[500px]">
          <thead>
            <tr className="border-b border-[#F0F1F3]">
              {[
                { label: "시각",     cls: "" },
                { label: "기기",     cls: "" },
                { label: "유입 경로", cls: "" },
                { label: "페이지",   cls: "hidden sm:table-cell" },
                { label: "IP",       cls: "hidden sm:table-cell" },
              ].map(({ label, cls }) => (
                <th key={label} className={`px-3 sm:px-5 py-3 text-left text-[0.6875rem] font-semibold tracking-wide text-[#8A95A3] uppercase ${cls}`.trim()}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-[#B0B8C1]">아직 방문 기록이 없습니다.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[#F4F5F7] last:border-0 hover:bg-[#FAFBFC] transition-colors duration-100">
                  <td className="px-3 sm:px-5 py-3 text-[#1A2535] whitespace-nowrap">{formatTime(row.visited_at)}</td>
                  <td className="px-3 sm:px-5 py-3 text-[#4A5568] whitespace-nowrap">{formatDevice(row.device)}</td>
                  <td className="px-3 sm:px-5 py-3 text-[#4A5568]">{formatReferrer(row.referrer)}</td>
                  <td className="px-3 sm:px-5 py-3 text-[#4A5568] font-mono text-[0.75rem] hidden sm:table-cell">{row.path}</td>
                  <td className="px-3 sm:px-5 py-3 text-[#8A95A3] font-mono text-[0.75rem] hidden sm:table-cell">{showIp(row.ip)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
      <p className="mt-4 text-[0.6875rem] text-[#B0B8C1] text-right">최근 100건 표시</p>
    </div>
  );
}
