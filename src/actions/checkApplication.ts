"use server";

import { createServiceClient } from "@/lib/supabase/service";

export interface ApplicationResult {
  application_id: string;
  school: string;
  contact_name: string;
  grade: string;
  headcount: number;
  preferred_date: string;
  status: "pending" | "confirmed" | "canceled";
  admin_notes: string | null;
  cancellation_reason: string | null;
  created_at: string;
}

/* ── 전화번호 정규화: 숫자만 추출 후 저장 형식으로 복원 ── */
function normalizePhone(raw: string): string {
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

export async function checkApplication(
  email: string,
  contact: string
): Promise<{ data: ApplicationResult[] } | { error: string }> {
  const trimEmail   = email.trim().toLowerCase();
  const trimContact = normalizePhone(contact);

  if (!trimEmail || !trimContact) {
    return { error: "이메일과 연락처를 모두 입력해주세요." };
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_RE.test(trimEmail)) {
    return { error: "올바른 이메일 형식을 입력해주세요." };
  }

  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("applications")
      .select(
        "application_id, school, contact_name, grade, headcount, preferred_date, status, admin_notes, cancellation_reason, created_at"
      )
      .ilike("email", trimEmail)
      .eq("contact", trimContact)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[checkApplication] DB 오류:", error);
      return { error: "조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
    }

    if (!data || data.length === 0) {
      return { error: "조회된 문의 내역이 없습니다. 입력하신 정보를 다시 확인해 주세요." };
    }

    return { data: data as ApplicationResult[] };
  } catch (err) {
    console.error("[checkApplication] 예외:", err);
    return { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
