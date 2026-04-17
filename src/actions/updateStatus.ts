"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { ApplicationStatus } from "@/lib/supabase/types";

/** 상태 변경 — 인증된 관리자만 호출 가능 */
export async function updateStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  options?: { note?: string; cancellationReason?: string },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "인증이 필요합니다." };

  const service = createServiceClient();

  // 현재 상태 조회
  const { data: app } = await service
    .from("applications")
    .select("status")
    .eq("application_id", applicationId)
    .single();

  if (!app) return { error: "문의를 찾을 수 없습니다." };

  // 업데이트할 필드 구성
  const updatePayload: Record<string, unknown> = { status: newStatus };
  if (newStatus === "canceled") {
    updatePayload.cancellation_reason = options?.cancellationReason ?? null;
  } else {
    // 취소가 아닌 상태로 바꿀 때는 사유 초기화
    updatePayload.cancellation_reason = null;
  }

  // 상태 업데이트
  const { error: updateError } = await service
    .from("applications")
    .update(updatePayload)
    .eq("application_id", applicationId);

  if (updateError) {
    console.error("[updateStatus] DB UPDATE 실패:", JSON.stringify(updateError));
    return { error: "상태 변경에 실패했습니다." };
  }

  // 이력 기록
  await service.from("status_history").insert({
    application_id: applicationId,
    from_status:    app.status,
    to_status:      newStatus,
    changed_by:     user.id,
    note:           options?.note ?? null,
  });

  return { ok: true };
}

/** 문의 삭제 — 인증된 관리자만 호출 가능 */
export async function deleteApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "인증이 필요합니다." };

  const service = createServiceClient();
  const { error } = await service
    .from("applications")
    .delete()
    .eq("application_id", applicationId);

  if (error) {
    console.error("[deleteApplication] DB DELETE 실패:", JSON.stringify(error));
    return { error: "삭제에 실패했습니다." };
  }

  return { ok: true };
}

/** 관리자 메모 저장 */
export async function saveAdminNotes(applicationId: string, notes: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "인증이 필요합니다." };

  const service = createServiceClient();
  const { error } = await service
    .from("applications")
    .update({ admin_notes: notes })
    .eq("application_id", applicationId);

  if (error) return { error: "메모 저장에 실패했습니다." };
  return { ok: true };
}
