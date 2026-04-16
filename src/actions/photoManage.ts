"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export interface PhotoRecord {
  id: string;
  created_at: string;
  image_url: string;
  storage_path: string | null;
  gallery_slot: number | null;
  organization: string | null;
  grade_class: string | null;
  activity_step: string | null;
  is_primary: boolean;
  is_visible: boolean;
  display_location: string; // 'slider' | 'gallery' | 'none'
  display_order: number;
}

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("인증이 필요합니다.");
}

/** 전체 사진 목록 */
export async function listManagedPhotos(): Promise<PhotoRecord[] | { error: string }> {
  try {
    await requireAuth();
    const service = createServiceClient();
    const { data, error } = await service
      .from("activity_photos")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return { error: error.message };
    return (data ?? []) as PhotoRecord[];
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/** 노출/숨김 토글 */
export async function toggleVisibility(
  id: string,
  isVisible: boolean,
): Promise<{ ok: true } | { error: string }> {
  try {
    await requireAuth();
    const service = createServiceClient();
    const { error } = await service
      .from("activity_photos")
      .update({ is_visible: isVisible })
      .eq("id", id);
    if (error) return { error: error.message };
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/** 슬라이더 순서 일괄 업데이트 */
export async function updateSliderOrder(
  items: { id: string; display_order: number }[],
): Promise<{ ok: true } | { error: string }> {
  try {
    await requireAuth();
    const service = createServiceClient();
    for (const item of items) {
      await service
        .from("activity_photos")
        .update({ display_order: item.display_order })
        .eq("id", item.id);
    }
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/** 사진 영구 삭제 (Storage + DB) */
export async function deletePhotoRecord(
  id: string,
  storagePath: string | null,
): Promise<{ ok: true } | { error: string }> {
  try {
    await requireAuth();
    const service = createServiceClient();
    if (storagePath) {
      await service.storage.from("photos").remove([storagePath]);
    }
    const { error } = await service
      .from("activity_photos")
      .delete()
      .eq("id", id);
    if (error) return { error: error.message };
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/** 갤러리 슬롯 일괄 저장 (슬롯 0~3 배치) */
export async function assignGallerySlots(
  assignments: { id: string; slot: number | null }[],
): Promise<{ ok: true } | { error: string }> {
  try {
    await requireAuth();
    const service = createServiceClient();
    // 기존 슬롯 전체 초기화
    await service.from("activity_photos").update({ gallery_slot: null }).not("gallery_slot", "is", null);
    // 새 배치 저장
    for (const { id, slot } of assignments) {
      if (slot === null) continue;
      await service.from("activity_photos").update({ gallery_slot: slot }).eq("id", id);
    }
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
