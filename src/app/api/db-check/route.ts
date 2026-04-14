import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. 환경변수 확인
  results.env = {
    supabase_url:      process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 40) + "...",
    anon_key_set:      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("PASTE"),
    service_key_set:   !!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("PASTE"),
    resend_key_set:    !!process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("PASTE"),
    discord_url_set:   !!process.env.DISCORD_WEBHOOK_URL && !process.env.DISCORD_WEBHOOK_URL.includes("PASTE"),
  };

  // 2. Supabase 연결 + 테이블 존재 여부
  try {
    const supabase = createServiceClient();

    // applications 테이블 조회
    const { data, error } = await supabase
      .from("applications")
      .select("application_id")
      .limit(1);

    if (error) {
      results.applications_table = { status: "ERROR", code: error.code, message: error.message };
    } else {
      results.applications_table = { status: "OK", row_count_sample: data?.length ?? 0 };
    }

    // status_history 테이블 조회
    const { error: histError } = await supabase
      .from("status_history")
      .select("id")
      .limit(1);

    if (histError) {
      results.status_history_table = { status: "ERROR", code: histError.code, message: histError.message };
    } else {
      results.status_history_table = { status: "OK" };
    }
  } catch (err) {
    results.supabase_connection = {
      status: "FAILED",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // 3. 진단 메시지
  const appOk = (results.applications_table as { status?: string })?.status === "OK";
  const histOk = (results.status_history_table as { status?: string })?.status === "OK";

  results.diagnosis = appOk && histOk
    ? "✅ 모든 테이블 정상 — 폼 제출이 작동해야 합니다."
    : "❌ 테이블 미생성 — Supabase SQL Editor에서 supabase/migrations/001_initial.sql 을 실행하세요.";

  return NextResponse.json(results, { status: 200 });
}
