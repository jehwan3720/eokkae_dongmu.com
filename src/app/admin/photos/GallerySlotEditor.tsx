"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, CheckCircle, Upload, Trash2, ZoomIn } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { assignGallerySlots, deletePhotoRecord, type PhotoRecord } from "@/actions/photoManage";

/* ── 슬롯 메타 ── */
const SLOT_META = [
  { index: 0, label: "① 대표 사진",   desc: "왼쪽 세로 대형", aspect: "aspect-[3/4]",  gridClass: "md:row-span-2" },
  { index: 1, label: "② 우상단 1",    desc: "정방형",          aspect: "aspect-square", gridClass: "" },
  { index: 2, label: "③ 우상단 2",    desc: "정방형",          aspect: "aspect-square", gridClass: "" },
  { index: 3, label: "④ 하단 와이드", desc: "가로형 (16:9)",   aspect: "aspect-[16/9]", gridClass: "md:col-span-2" },
];

interface Props {
  galleryPhotos: PhotoRecord[];
}

export default function GallerySlotEditor({ galleryPhotos }: Props) {
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const activeSlotRef = useRef<number | null>(null); // 클릭한 슬롯 인덱스 기억

  const [slots, setSlots] = useState<(PhotoRecord | null)[]>(() => {
    const arr: (PhotoRecord | null)[] = [null, null, null, null];
    galleryPhotos.forEach((p) => {
      if (p.gallery_slot !== null && p.gallery_slot >= 0 && p.gallery_slot <= 3) {
        arr[p.gallery_slot] = p;
      }
    });
    return arr;
  });

  const [uploading, setUploading]   = useState<number | null>(null); // 업로드 중인 슬롯 인덱스
  const [progress, setProgress]     = useState(0);
  const [dragSource, setDragSource] = useState<
    | { from: "pool"; photo: PhotoRecord }
    | { from: "slot"; slotIndex: number; photo: PhotoRecord }
    | null
  >(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [preview, setPreview] = useState<PhotoRecord | null>(null);
  const [pool, setPool]     = useState<PhotoRecord[]>(() => {
    const usedIds = new Set(
      galleryPhotos
        .filter((p) => p.gallery_slot !== null && p.gallery_slot >= 0 && p.gallery_slot <= 3)
        .map((p) => p.id)
    );
    return galleryPhotos.filter((p) => !usedIds.has(p.id));
  });

  /* ── 슬롯 클릭 → 파일 선택 → 즉시 업로드 ── */
  function handleSlotClick(slotIndex: number, hasPhoto: boolean) {
    if (hasPhoto) return; // 사진 있으면 클릭 무시 (드래그로만 이동)
    activeSlotRef.current = slotIndex;
    fileInputRef.current?.click();
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const slotIndex = activeSlotRef.current;
    e.target.value = "";
    if (!file || slotIndex === null) return;
    if (!file.type.startsWith("image/")) return;

    setUploading(slotIndex);
    setProgress(20);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const dateFolder = new Date().toISOString().slice(0, 10);
    const storagePath = `uploads/${dateFolder}/${safeName}`;

    const { error: storageErr } = await supabase.storage
      .from("photos")
      .upload(storagePath, file, { contentType: file.type, upsert: false });

    if (storageErr) {
      console.error("[SLOT UPLOAD] Storage 에러:", storageErr.message);
      setUploading(null);
      return;
    }

    setProgress(70);
    const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(storagePath);

    const { data: inserted, error: dbErr } = await supabase
      .from("activity_photos")
      .insert({
        image_url: publicUrl,
        storage_path: storagePath,
        display_location: "gallery",
        gallery_slot: slotIndex,
        display_order: 0,
        is_visible: true,
        is_primary: false,
      })
      .select()
      .single();

    if (dbErr) {
      console.error("[SLOT UPLOAD] DB 에러:", dbErr.message);
      setUploading(null);
      return;
    }

    setProgress(100);
    setTimeout(() => {
      const record = inserted as PhotoRecord;
      setSlots((prev) => {
        const next = [...prev];
        // 기존 슬롯 사진은 풀로 이동
        const displaced = next[slotIndex];
        if (displaced) addToPool(displaced);
        next[slotIndex] = record;
        return next;
      });
      setUploading(null);
      setProgress(0);
    }, 400);
  }

  /* ── 드래그 핸들러 ── */
  function onDragStartPool(photo: PhotoRecord) {
    setDragSource({ from: "pool", photo });
  }
  function onDragStartSlot(slotIndex: number, photo: PhotoRecord) {
    setDragSource({ from: "slot", slotIndex, photo });
  }
  function onDragOverSlot(e: React.DragEvent, slotIndex: number) {
    e.preventDefault();
    setDragOverSlot(slotIndex);
  }
  function onDropSlot(slotIndex: number) {
    if (!dragSource) return;
    setSlots((prev) => {
      const next = [...prev];
      const displaced = next[slotIndex];
      if (dragSource.from === "slot") {
        next[dragSource.slotIndex] = displaced ?? null;
        if (displaced) {
          /* 교환: 기존 사진 → 원래 슬롯으로 */
        } else {
          next[dragSource.slotIndex] = null;
        }
      } else {
        // pool → slot: 기존 사진이 있으면 풀로
        if (displaced) addToPool(displaced);
        setPool((p) => p.filter((x) => x.id !== dragSource.photo.id));
      }
      next[slotIndex] = dragSource.photo;
      return next;
    });
    setDragSource(null);
    setDragOverSlot(null);
  }
  function onDropPool(e: React.DragEvent) {
    e.preventDefault();
    if (!dragSource || dragSource.from !== "slot") return;
    setSlots((prev) => {
      const next = [...prev];
      next[dragSource.slotIndex] = null;
      return next;
    });
    addToPool(dragSource.photo);
    setDragSource(null);
    setDragOverSlot(null);
  }
  function onDragEnd() { setDragSource(null); setDragOverSlot(null); }

  /* 중복 없이 풀에 추가 */
  function addToPool(photo: PhotoRecord) {
    setPool((p) => p.some((x) => x.id === photo.id) ? p : [...p, photo]);
  }

  /* Esc 키로 모달 닫기 */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setPreview(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* 풀에서 영구 삭제 */
  async function handlePoolDelete(photo: PhotoRecord) {
    if (!confirm("사진을 영구 삭제하시겠습니까?")) return;
    setPool((p) => p.filter((x) => x.id !== photo.id));
    setPreview(null);
    await deletePhotoRecord(photo.id, photo.storage_path);
  }

  /* 슬롯 제거 */
  function clearSlot(slotIndex: number) {
    const photo = slots[slotIndex];
    if (photo) addToPool(photo);
    setSlots((prev) => { const n = [...prev]; n[slotIndex] = null; return n; });
  }

  /* 저장 */
  async function handleSave() {
    setSaving(true);
    const assignments = slots
      .map((photo, slot) => photo ? { id: photo.id, slot } : null)
      .filter(Boolean) as { id: string; slot: number }[];
    const res = await assignGallerySlots(assignments);
    setSaving(false);
    if (!("error" in res)) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* ── 레이아웃 미리보기 ── */}
      <div>
        <p className="text-[0.75rem] font-semibold text-[#5A6472] mb-3">
          홈페이지 갤러리 레이아웃
          <span className="ml-2 text-[#B0B8C1] font-normal">— 빈 슬롯 클릭하거나 사진을 드래그해 배치하세요</span>
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-2"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropPool}
        >
          {SLOT_META.map((slot) => {
            const photo      = slots[slot.index];
            const isOver     = dragOverSlot === slot.index;
            const isDragging = dragSource?.from === "slot" && dragSource.slotIndex === slot.index;
            const isUploading = uploading === slot.index;

            return (
              <div
                key={slot.index}
                className={slot.gridClass}
                onDragOver={(e) => onDragOverSlot(e, slot.index)}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={() => onDropSlot(slot.index)}
              >
                <motion.div
                  animate={{ opacity: isDragging ? 0.35 : 1 }}
                  onClick={() => handleSlotClick(slot.index, !!photo)}
                  className={[
                    `relative w-full ${slot.aspect} rounded-xl overflow-hidden border-2 transition-all duration-200`,
                    !photo && !isUploading ? "cursor-pointer" : "",
                    isOver
                      ? "border-[#1B3F7A] shadow-lg shadow-[#1B3F7A]/20"
                      : photo
                        ? "border-transparent"
                        : "border-dashed border-[#D1D8E0] hover:border-[#1B3F7A]/60 hover:bg-[#EEF4FF]",
                    photo ? "bg-[#0F1F3D]" : "bg-[#F0F4FA]",
                  ].join(" ")}
                >
                  {/* 사진 있을 때 */}
                  {photo && !isUploading && (
                    <>
                      <Image src={photo.image_url} alt="" fill className="object-cover" sizes="500px" />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#0F1F3D]/70 text-white text-[0.6rem] font-bold backdrop-blur-sm">
                          {slot.label}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); clearSlot(slot.index); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-red-500 flex items-center justify-center transition-colors z-10"
                      >
                        <X size={12} className="text-white" />
                      </button>
                      {/* 드래그 핸들 */}
                      <div
                        draggable
                        onDragStart={(e) => { e.stopPropagation(); onDragStartSlot(slot.index, photo); }}
                        onDragEnd={onDragEnd}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                      />
                    </>
                  )}

                  {/* 업로드 중 */}
                  {isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F0F4FA]">
                      <div className="w-10 h-10 rounded-full border-2 border-[#1B3F7A]/20 border-t-[#1B3F7A] animate-spin" />
                      <span className="text-[0.6875rem] font-semibold text-[#1B3F7A]">업로드 중...</span>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8EAED] rounded-b-xl overflow-hidden">
                        <motion.div
                          className="h-full bg-[#1B3F7A]"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 빈 슬롯 */}
                  {!photo && !isUploading && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-colors ${isOver ? "bg-[#1B3F7A]/5" : ""}`}>
                      <div className={`w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${isOver ? "border-[#1B3F7A] bg-[#1B3F7A]/10" : "border-[#C0C8D0]"}`}>
                        <Upload size={16} className={isOver ? "text-[#1B3F7A]" : "text-[#B0B8C1]"} />
                      </div>
                      <span className={`text-[0.6875rem] font-semibold ${isOver ? "text-[#1B3F7A]" : "text-[#8A95A3]"}`}>
                        {slot.label}
                      </span>
                      <span className="text-[0.5625rem] text-[#B0B8C1]">
                        클릭하여 업로드 또는 드래그
                      </span>
                      <span className="text-[0.5rem] text-[#C8D0D8]">{slot.desc}</span>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 사진 풀 ── */}
      <div onDragOver={(e) => e.preventDefault()} onDrop={onDropPool}>
        <p className="text-[0.75rem] font-semibold text-[#5A6472] mb-3">
          갤러리 사진 풀 ({pool.length}장)
          <span className="ml-2 text-[#B0B8C1] font-normal">— 위 슬롯으로 드래그하세요</span>
        </p>

        {pool.length === 0 ? (
          <div className="py-6 text-center text-[0.8125rem] text-[#B0B8C1] border border-dashed border-[#E8EAED] rounded-xl">
            {galleryPhotos.length === 0
              ? "갤러리 사진이 없습니다. 빈 슬롯을 클릭해 바로 업로드하세요."
              : "모든 사진이 슬롯에 배치되었습니다."}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-4 bg-[#F8F9FB] border border-[#E8EAED] rounded-xl">
            <AnimatePresence>
              {pool.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  draggable
                  onDragStart={() => onDragStartPool(photo)}
                  onDragEnd={onDragEnd}
                  className="relative aspect-square rounded-lg overflow-hidden border border-[#E8EAED] hover:border-[#1B3F7A] hover:shadow-md transition-all duration-150 select-none group"
                  title={`${photo.organization ?? ""} · ${photo.grade_class ?? ""}`}
                >
                  <Image src={photo.image_url} alt="" fill className="object-cover" sizes="80px" />
                  {/* 호버 시 돋보기 아이콘 (클릭 유도) */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreview(photo); }}
                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    title="크게 보기"
                  >
                    <ZoomIn size={18} className="text-white drop-shadow" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── 사진 미리보기 모달 ── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-xl w-full"
            >
              {/* 상단 바 */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F0F1F3]">
                <div>
                  <p className="text-[0.8125rem] font-bold text-[#1A2535]">
                    {preview.organization ?? "—"} · {preview.grade_class ?? "—"}
                  </p>
                  <p className="text-[0.6875rem] text-[#8A95A3]">{preview.activity_step ?? "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handlePoolDelete(preview)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-[0.75rem] font-bold transition-colors duration-150"
                  >
                    <Trash2 size={13} />
                    삭제
                  </button>
                  {/* 닫기 버튼 */}
                  <button
                    onClick={() => setPreview(null)}
                    className="w-8 h-8 rounded-full bg-[#F0F1F3] hover:bg-[#E0E2E6] flex items-center justify-center transition-colors"
                  >
                    <X size={15} className="text-[#5A6472]" />
                  </button>
                </div>
              </div>

              {/* 사진 */}
              <div className="relative w-full aspect-[4/3] bg-[#F8F9FB]">
                <Image
                  src={preview.image_url}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="600px"
                />
              </div>

              {/* 하단 안내 */}
              <div className="px-5 py-3 bg-[#F8F9FB] text-center">
                <p className="text-[0.6875rem] text-[#B0B8C1]">ESC 또는 배경 클릭으로 닫기</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 저장 ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0F1F3D] text-white text-[0.875rem] font-bold rounded-[6px] hover:bg-[#1B3F7A] transition-colors disabled:opacity-60"
        >
          {saving
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : saved
              ? <CheckCircle size={15} className="text-emerald-400" />
              : <Save size={15} />}
          {saving ? "저장 중..." : saved ? "저장됨" : "홈페이지에 반영"}
        </button>
        <p className="text-[0.75rem] text-[#8A95A3]">저장 즉시 홈페이지 갤러리에 반영됩니다.</p>
      </div>
    </div>
  );
}
