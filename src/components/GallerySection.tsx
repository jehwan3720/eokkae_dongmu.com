import { createClient } from "@/lib/supabase/server";
import Gallery from "./Gallery";

export interface ActivityPhoto {
  id: string;
  image_url: string;
  organization: string | null;
  grade_class: string | null;
  activity_step: string | null;
  is_primary: boolean;
  gallery_slot: number | null;
}

export default async function GallerySection() {
  const supabase = await createClient();

  // gallery_slot이 지정된 사진 우선, 없으면 최신 사진으로 채움
  const { data: slotted } = await supabase
    .from("activity_photos")
    .select("id, image_url, organization, grade_class, activity_step, is_primary, gallery_slot")
    .eq("display_location", "gallery")
    .eq("is_visible", true)
    .not("gallery_slot", "is", null)
    .order("gallery_slot", { ascending: true })
    .limit(4);

  const usedSlots = new Set((slotted ?? []).map((p) => p.gallery_slot));

  // 슬롯이 비어있는 자리를 최신 사진으로 채움
  const { data: recent } = await supabase
    .from("activity_photos")
    .select("id, image_url, organization, grade_class, activity_step, is_primary, gallery_slot")
    .eq("display_location", "gallery")
    .eq("is_visible", true)
    .is("gallery_slot", null)
    .order("created_at", { ascending: false })
    .limit(4);

  // 4개 슬롯 배열 구성
  const slots: (ActivityPhoto | null)[] = [null, null, null, null];
  (slotted ?? []).forEach((p) => {
    if (p.gallery_slot !== null && p.gallery_slot >= 0 && p.gallery_slot <= 3) {
      slots[p.gallery_slot] = p as ActivityPhoto;
    }
  });

  // 빈 슬롯을 최신 사진으로 채움
  let fillIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (!slots[i] && recent) {
      while (fillIdx < recent.length && usedSlots.has(recent[fillIdx].gallery_slot)) fillIdx++;
      if (fillIdx < recent.length) {
        slots[i] = recent[fillIdx++] as ActivityPhoto;
      }
    }
  }

  return <Gallery photos={slots} />;
}
