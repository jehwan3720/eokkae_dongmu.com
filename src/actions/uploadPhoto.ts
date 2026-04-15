"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export interface PhotoMeta {
  institution: string;
  grade: string;
  stage: string;
}

/** Supabase Storage photos 버킷에 업로드 */
export async function uploadPhoto(
  formData: FormData,
  meta: PhotoMeta,
): Promise<{ path: string; url: string } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "인증이 필요합니다." };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "파일이 없습니다." };

  const ext = file.name.split(".").pop();
  const date = new Date().toISOString().slice(0, 10);
  const slug = `${meta.institution}/${date}/${meta.stage}_${Date.now()}.${ext}`;

  const service = createServiceClient();
  const { error } = await service.storage
    .from("photos")
    .upload(slug, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[uploadPhoto]", error);
    return { error: "업로드에 실패했습니다." };
  }

  const { data: { publicUrl } } = service.storage
    .from("photos")
    .getPublicUrl(slug);

  return { path: slug, url: publicUrl };
}

/** 특정 파일 삭제 */
export async function deletePhoto(
  path: string,
): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "인증이 필요합니다." };

  const service = createServiceClient();
  const { error } = await service.storage.from("photos").remove([path]);
  if (error) return { error: "삭제에 실패했습니다." };
  return { ok: true };
}

/** 버킷 파일 목록 조회 */
export async function listPhotos(
  folder = "",
): Promise<{ name: string; path: string; url: string; size: number }[] | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "인증이 필요합니다." };

  const service = createServiceClient();
  const { data, error } = await service.storage
    .from("photos")
    .list(folder, { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  if (error) return { error: "목록 조회에 실패했습니다." };

  return (data ?? [])
    .filter((f) => f.id) // 폴더 제외
    .map((f) => {
      const path = folder ? `${folder}/${f.name}` : f.name;
      const { data: { publicUrl } } = service.storage.from("photos").getPublicUrl(path);
      return {
        name: f.name,
        path,
        url: publicUrl,
        size: f.metadata?.size ?? 0,
      };
    });
}
