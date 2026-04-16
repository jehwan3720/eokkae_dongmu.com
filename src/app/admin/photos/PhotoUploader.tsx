"use client";

import { useRef, useState, useCallback, useEffect, useTransition } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, Eye, EyeOff, X, CheckCircle, GripVertical, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import GallerySlotEditor from "./GallerySlotEditor";
import {
  listManagedPhotos,
  toggleVisibility,
  updateSliderOrder,
  deletePhotoRecord,
  updateDisplayLocation,
  type PhotoRecord,
} from "@/actions/photoManage";

/* ── 상수 ── */
const STAGES = ["1령 유충", "2령 유충", "3령 유충", "번데기", "우화", "성충"];
const INSTITUTIONS = ["OO유치원", "OO초등학교", "OO어린이집", "기타 기관"];
const DISPLAY_LOCATIONS = [
  { value: "slider", label: "수업이 끝나고 남는 것들 — 롤링 슬라이더" },
  { value: "gallery", label: "갤러리 섹션" },
  { value: "none",   label: "업로드만 (홈페이지 미노출)" },
];

/* ── 타입 ── */
interface FileItem {
  id: string;
  file: File;
  preview: string;
  progress: number; // 0~100, -1=오류
}

/* ── 유틸 ── */
function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getStoragePathFromUrl(url: string): string | null {
  try {
    const marker = "/object/public/photos/";
    const idx = url.indexOf(marker);
    return idx >= 0 ? url.slice(idx + marker.length) : null;
  } catch {
    return null;
  }
}

/* ── Badge ── */
function StatusBadge({ photo }: { photo: PhotoRecord }) {
  if (!photo.is_visible) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold tracking-wide bg-gray-100 text-gray-500 border border-gray-200">
        숨김
      </span>
    );
  }
  if (photo.display_location === "slider") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold tracking-wide bg-blue-50 text-blue-700 border border-blue-200">
        슬라이더
      </span>
    );
  }
  if (photo.display_location === "gallery") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
        갤러리
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
      미노출
    </span>
  );
}

/* ── Toast ── */
function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-[8px] shadow-2xl ${
        type === "success" ? "bg-[#0F1F3D] text-white" : "bg-red-600 text-white"
      }`}
    >
      {type === "success"
        ? <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
        : <AlertCircle size={16} className="text-red-200 flex-shrink-0" />}
      <p className="text-[0.875rem] font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </motion.div>
  );
}

/* ── Slider Reorder Item ── */
function SliderItem({
  photo,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  photo: PhotoRecord;
  onRemove: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDrop: (id: string) => void;
  isDragOver: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(photo.id)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(photo.id); }}
      onDrop={(e) => { e.preventDefault(); onDrop(photo.id); }}
      className={[
        "flex items-center gap-3 bg-white border rounded-[8px] px-3 py-2.5 select-none cursor-grab active:cursor-grabbing transition-all duration-150",
        isDragOver ? "border-[#1B3F7A] shadow-md scale-[1.01]" : "border-[#E8EAED]",
      ].join(" ")}
    >
      <div className="text-[#B0B8C1] hover:text-[#5A6472] transition-colors flex-shrink-0">
        <GripVertical size={16} />
      </div>
      <div className="relative w-10 h-10 rounded-[4px] overflow-hidden flex-shrink-0 bg-[#F0F1F3]">
        <Image src={photo.image_url} alt="" fill className="object-cover" sizes="40px" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.75rem] font-semibold text-[#1A2535] truncate">
          {photo.organization ?? "—"} · {photo.grade_class ?? "—"}
        </p>
        <p className="text-[0.6875rem] text-[#8A95A3] truncate">{photo.activity_step ?? "—"}</p>
      </div>
      <button
        onClick={() => onRemove(photo.id)}
        className="flex-shrink-0 text-[#B0B8C1] hover:text-red-500 transition-colors"
        title="슬라이더에서 제거"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* ══ 메인 컴포넌트 ══ */
export default function PhotoUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging]     = useState(false);
  const [queue, setQueue]               = useState<FileItem[]>([]);
  const [gallery, setGallery]           = useState<PhotoRecord[]>([]);
  const [sliderPhotos, setSliderPhotos] = useState<PhotoRecord[]>([]);
  const [institution, setInstitution]   = useState("");
  const [grade, setGrade]               = useState("");
  const [stage, setStage]               = useState("");
  const [displayLocation, setDisplayLocation] = useState("slider");
  const [agreed, setAgreed]             = useState(false);
  const [uploading, setUploading]       = useState(false);
  const [toast, setToast]               = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [sliderDragId, setSliderDragId] = useState<string | null>(null);
  const [sliderOverId, setSliderOverId] = useState<string | null>(null);
  const [isPending, startTransition]    = useTransition();

  const showToast = (msg: string, type: "success" | "error" = "success") =>
    setToast({ msg, type });

  /* 초기 로드 */
  useEffect(() => {
    startTransition(async () => {
      const res = await listManagedPhotos();
      if (!("error" in res)) {
        setGallery(res);
        setSliderPhotos(res.filter((p) => p.display_location === "slider" && p.is_visible));
      }
    });
  }, []);

  /* 파일 추가 */
  const addFiles = useCallback((files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    setQueue((prev) => [
      ...prev,
      ...imgs.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        preview: URL.createObjectURL(f),
        progress: 0,
      })),
    ]);
  }, []);

  /* 드래그 핸들러 */
  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop      = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };
  const removeFromQueue = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  /* 업로드 */
  async function handleUpload() {
    if (!institution || !grade || !stage || !agreed || queue.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    let hasError = false;

    for (const item of queue) {
      setQueue((prev) => prev.map((f) => f.id === item.id ? { ...f, progress: 40 } : f));

      const ext = item.file.name.split(".").pop();
      const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const dateFolder = new Date().toISOString().slice(0, 10);
      const storagePath = `uploads/${dateFolder}/${safeName}`;

      const { error: storageError } = await supabase.storage
        .from("photos")
        .upload(storagePath, item.file, { contentType: item.file.type, upsert: false });

      if (storageError) {
        console.error("[UPLOAD] Storage 에러:", storageError.message);
        setQueue((prev) => prev.map((f) => f.id === item.id ? { ...f, progress: -1 } : f));
        hasError = true;
        continue;
      }

      setQueue((prev) => prev.map((f) => f.id === item.id ? { ...f, progress: 80 } : f));

      const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(storagePath);

      const nextOrder = sliderPhotos.length;
      const { data: inserted, error: dbError } = await supabase
        .from("activity_photos")
        .insert({
          image_url: publicUrl,
          storage_path: storagePath,
          organization: institution,
          grade_class: grade,
          activity_step: stage,
          display_location: displayLocation,
          display_order: displayLocation === "slider" ? nextOrder : 0,
          is_visible: true,
          is_primary: false,
        })
        .select()
        .single();

      if (dbError) {
        console.error("[UPLOAD] DB 에러:", dbError.message);
        setQueue((prev) => prev.map((f) => f.id === item.id ? { ...f, progress: -1 } : f));
        hasError = true;
        continue;
      }

      setQueue((prev) => prev.map((f) => f.id === item.id ? { ...f, progress: 100 } : f));

      if (inserted) {
        const record = inserted as PhotoRecord;
        setGallery((prev) => [record, ...prev]);
        if (displayLocation === "slider") {
          setSliderPhotos((prev) => [...prev, record]);
        }
      }
    }

    setUploading(false);
    showToast(hasError ? "일부 사진 업로드에 실패했습니다." : "업로드가 완료되었습니다.", hasError ? "error" : "success");

    setTimeout(() => {
      setQueue((prev) => {
        prev.filter((f) => f.progress === 100).forEach((f) => URL.revokeObjectURL(f.preview));
        return prev.filter((f) => f.progress !== 100);
      });
      if (!hasError) { setInstitution(""); setGrade(""); setStage(""); setAgreed(false); }
    }, 1200);
  }

  /* 노출/숨김 토글 */
  async function handleToggleVisibility(photo: PhotoRecord) {
    const next = !photo.is_visible;
    setGallery((prev) => prev.map((p) => p.id === photo.id ? { ...p, is_visible: next } : p));
    if (photo.display_location === "slider") {
      setSliderPhotos((prev) =>
        next ? [...prev, { ...photo, is_visible: true }] : prev.filter((p) => p.id !== photo.id)
      );
    }
    const res = await toggleVisibility(photo.id, next);
    if ("error" in res) {
      setGallery((prev) => prev.map((p) => p.id === photo.id ? { ...p, is_visible: !next } : p));
      showToast("상태 변경에 실패했습니다.", "error");
    } else {
      showToast(next ? "사진을 노출했습니다." : "사진을 숨겼습니다.");
    }
  }

  /* 삭제 */
  async function handleDelete(photo: PhotoRecord) {
    if (!confirm("사진을 영구 삭제하시겠습니까?")) return;
    setGallery((prev) => prev.filter((p) => p.id !== photo.id));
    setSliderPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    const storagePath = photo.storage_path ?? getStoragePathFromUrl(photo.image_url);
    const res = await deletePhotoRecord(photo.id, storagePath);
    if ("error" in res) {
      showToast("삭제에 실패했습니다.", "error");
      const all = await listManagedPhotos();
      if (!("error" in all)) setGallery(all);
    } else {
      showToast("사진이 삭제되었습니다.");
    }
  }

  /* 슬라이더 HTML5 드래그 핸들러 */
  function handleSliderDragStart(id: string) {
    setSliderDragId(id);
  }
  function handleSliderDragOver(id: string) {
    setSliderOverId(id);
  }
  function handleSliderDrop(targetId: string) {
    if (!sliderDragId || sliderDragId === targetId) {
      setSliderDragId(null);
      setSliderOverId(null);
      return;
    }
    setSliderPhotos((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((p) => p.id === sliderDragId);
      const toIdx   = next.findIndex((p) => p.id === targetId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setSliderDragId(null);
    setSliderOverId(null);
  }

  /* 슬라이더 순서 변경 저장 */
  async function handleReorderComplete(newOrder: PhotoRecord[]) {
    setSliderPhotos(newOrder);
    await updateSliderOrder(newOrder.map((p, i) => ({ id: p.id, display_order: i })));
  }

  /* 슬라이더에서 제거 (display_location → none) */
  async function removeFromSlider(id: string) {
    setSliderPhotos((prev) => prev.filter((p) => p.id !== id));
    setGallery((prev) => prev.map((p) => p.id === id ? { ...p, display_location: "none" } : p));
    const res = await updateDisplayLocation(id, "none");
    if ("error" in res) {
      showToast("슬라이더 제거에 실패했습니다.", "error");
      const all = await listManagedPhotos();
      if (!("error" in all)) {
        setGallery(all);
        setSliderPhotos(all.filter((p) => p.display_location === "slider" && p.is_visible));
      }
    } else {
      showToast("슬라이더에서 제거했습니다.");
    }
  }

  const canUpload = !!institution && !!grade && !!stage && agreed && queue.length > 0 && !uploading;

  return (
    <div className="flex flex-col gap-10">

      {/* ══ A. 업로드 구역 ══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-5 rounded-full bg-[#0F1F3D] text-white text-[0.625rem] font-black flex items-center justify-center flex-shrink-0">A</span>
          <h2 className="text-[0.875rem] font-bold text-[#1A2535] tracking-tight">사진 업로드</h2>
        </div>

        {/* 드롭존 */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            "border-2 border-dashed rounded-xl px-8 py-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 select-none mb-5",
            isDragging
              ? "border-[#1B3F7A] bg-[#1B3F7A]/[0.05] scale-[1.005]"
              : "border-[#D1D8E0] bg-[#F8F9FB] hover:border-[#1B3F7A]/40 hover:bg-[#F0F4FA]",
          ].join(" ")}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200 ${isDragging ? "bg-[#1B3F7A]" : "bg-[#E8EAED]"}`}>
            <Upload size={24} className={isDragging ? "text-white" : "text-[#8A95A3]"} strokeWidth={1.6} />
          </div>
          <div className="text-center">
            <p className="text-[0.9375rem] font-semibold text-[#1A2535] mb-1">
              여기로 사진을 끌어다 놓거나, 클릭하여 파일을 선택하세요
            </p>
            <p className="text-[0.8125rem] text-[#8A95A3]">JPG, PNG, WEBP · 파일당 최대 10MB</p>
          </div>
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput} />
        </div>

        {/* 메타데이터 폼 */}
        <div className="bg-white border border-[#E8EAED] rounded-xl p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-semibold text-[#5A6472]">소속 기관</label>
              <select value={institution} onChange={(e) => setInstitution(e.target.value)}
                className="px-3 py-2.5 text-[0.875rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[6px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 transition-all">
                <option value="">선택하세요</option>
                {INSTITUTIONS.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-semibold text-[#5A6472]">학년 / 반</label>
              <input type="text" placeholder="예) 3학년 2반" value={grade} onChange={(e) => setGrade(e.target.value)}
                className="px-3 py-2.5 text-[0.875rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[6px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 transition-all placeholder:text-[#B0B8C1]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-semibold text-[#5A6472]">활동 단계</label>
              <select value={stage} onChange={(e) => setStage(e.target.value)}
                className="px-3 py-2.5 text-[0.875rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[6px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 transition-all">
                <option value="">선택하세요</option>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* 노출 위치 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-semibold text-[#5A6472]">홈페이지 노출 위치</label>
            <select value={displayLocation} onChange={(e) => setDisplayLocation(e.target.value)}
              className="px-3 py-2.5 text-[0.875rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[6px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 transition-all">
              {DISPLAY_LOCATIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>

          {/* 초상권 동의 */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 flex-shrink-0 w-4 h-4 accent-[#1B3F7A] cursor-pointer" />
            <span className="text-[0.8125rem] leading-relaxed text-[#5A6472] group-hover:text-[#1A2535] transition-colors">
              <span className="font-bold text-red-500">[필수]</span>{" "}
              해당 사진은 학부모(보호자)의 초상권 활용 및 수집 동의를 받은 항목임을 확인합니다.
            </span>
          </label>
        </div>

        {/* 대기열 */}
        {queue.length > 0 && (
          <div className="mt-5">
            <p className="text-[0.6875rem] font-bold tracking-[0.14em] uppercase text-[#8A95A3] mb-3">
              업로드 대기 ({queue.length}장)
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {queue.map((item) => (
                <div key={item.id} className="relative group rounded-lg overflow-hidden border border-[#E8EAED] bg-[#F8F9FB]">
                  <div className="aspect-square relative">
                    <Image src={item.preview} alt={item.file.name} fill className="object-cover" sizes="100px" />
                    {item.progress === 0 && (
                      <button onClick={() => removeFromQueue(item.id)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                        <X size={10} className="text-white" />
                      </button>
                    )}
                    {item.progress === -1 && (
                      <div className="absolute inset-0 bg-red-500/75 flex items-center justify-center">
                        <p className="text-white text-[0.625rem] font-bold">실패</p>
                      </div>
                    )}
                  </div>
                  <div className="px-1.5 py-1">
                    <p className="text-[0.5625rem] text-[#8A95A3] truncate">{item.file.name}</p>
                    <p className="text-[0.5rem] text-[#B0B8C1]">{fmtSize(item.file.size)}</p>
                  </div>
                  {item.progress > 0 && item.progress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E8EAED]">
                      <motion.div className="h-full bg-[#1B3F7A]" animate={{ width: `${item.progress}%` }} transition={{ duration: 0.4 }} />
                    </div>
                  )}
                  {item.progress === 100 && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-500" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 업로드 버튼 */}
        <button onClick={handleUpload} disabled={!canUpload}
          className={[
            "mt-5 w-full py-3.5 text-[0.9375rem] font-bold rounded-[8px] transition-all duration-200 flex items-center justify-center gap-2",
            canUpload ? "bg-[#0F1F3D] text-white hover:bg-[#1B3F7A] cursor-pointer" : "bg-[#F0F1F3] text-[#B0B8C1] cursor-not-allowed",
          ].join(" ")}
        >
          <Upload size={16} strokeWidth={2} />
          {uploading ? "업로드 중..." : `업로드 시작${queue.length > 0 ? ` (${queue.length}장)` : ""}`}
        </button>
      </section>

      <div className="border-t border-[#F0F1F3]" />

      {/* ══ B. 전체 갤러리 ══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-5 rounded-full bg-[#0F1F3D] text-white text-[0.625rem] font-black flex items-center justify-center flex-shrink-0">B</span>
          <h2 className="text-[0.875rem] font-bold text-[#1A2535] tracking-tight">
            전체 사진 관리
          </h2>
          <span className="ml-auto text-[0.75rem] text-[#8A95A3]">{gallery.length}장</span>
        </div>

        {gallery.length === 0 && !isPending ? (
          <div className="py-16 text-center text-[0.875rem] text-[#B0B8C1] border border-dashed border-[#E8EAED] rounded-xl">
            업로드된 사진이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {gallery.map((photo) => (
              <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-[#E8EAED] bg-[#F8F9FB]">
                <div className="aspect-square relative">
                  <Image src={photo.image_url} alt="" fill className="object-cover" sizes="200px" />

                  {/* 상태 배지 */}
                  <div className="absolute top-1.5 left-1.5">
                    <StatusBadge photo={photo} />
                  </div>

                  {/* 숨김 오버레이 */}
                  {!photo.is_visible && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
                  )}

                  {/* 호버 액션 오버레이 */}
                  <div className="absolute inset-0 bg-[#0F1F3D]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <motion.button
                      onClick={() => handleToggleVisibility(photo)}
                      title={photo.is_visible ? "숨기기" : "노출하기"}
                      whileTap={{ scale: 0.9 }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                        photo.is_visible ? "bg-white/20 hover:bg-amber-400" : "bg-white/20 hover:bg-emerald-500"
                      }`}
                    >
                      {photo.is_visible
                        ? <EyeOff size={15} className="text-white" />
                        : <Eye size={15} className="text-white" />}
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(photo)}
                      title="영구 삭제"
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={15} className="text-white" />
                    </motion.button>
                  </div>
                </div>
                <div className="px-2.5 py-2">
                  <p className="text-[0.6875rem] font-semibold text-[#1A2535] truncate">{photo.organization ?? "—"}</p>
                  <p className="text-[0.625rem] text-[#8A95A3] truncate">{photo.grade_class} · {photo.activity_step}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="border-t border-[#F0F1F3]" />

      {/* ══ C. 슬라이더 순서 관리 ══ */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 rounded-full bg-[#0F1F3D] text-white text-[0.625rem] font-black flex items-center justify-center flex-shrink-0">C</span>
          <h2 className="text-[0.875rem] font-bold text-[#1A2535] tracking-tight">
            롤링 슬라이더 순서 관리
          </h2>
          <span className="ml-auto text-[0.75rem] text-[#8A95A3]">{sliderPhotos.length}장</span>
        </div>
        <p className="text-[0.8125rem] text-[#8A95A3] mb-4 ml-7">
          아래 목록을 드래그하여 홈페이지 슬라이더 노출 순서를 변경하세요.
        </p>

        {sliderPhotos.length === 0 ? (
          <div className="py-10 text-center text-[0.875rem] text-[#B0B8C1] border border-dashed border-[#E8EAED] rounded-xl">
            슬라이더로 설정된 사진이 없습니다.<br />
            <span className="text-[0.75rem]">업로드 시 노출 위치를 "롤링 슬라이더"로 선택하세요.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sliderPhotos.map((photo) => (
              <SliderItem
                key={photo.id}
                photo={photo}
                onRemove={removeFromSlider}
                onDragStart={handleSliderDragStart}
                onDragOver={handleSliderDragOver}
                onDrop={handleSliderDrop}
                isDragOver={sliderOverId === photo.id}
              />
            ))}
          </div>
        )}

        {sliderPhotos.length > 0 && (
          <button
            onClick={() => handleReorderComplete(sliderPhotos)}
            className="mt-4 px-5 py-2.5 bg-[#0F1F3D] text-white text-[0.8125rem] font-bold rounded-[6px] hover:bg-[#1B3F7A] transition-colors"
          >
            순서 저장
          </button>
        )}
      </section>

      <div className="border-t border-[#F0F1F3]" />

      {/* ══ D. 갤러리 슬롯 배치 편집기 ══ */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 rounded-full bg-[#0F1F3D] text-white text-[0.625rem] font-black flex items-center justify-center flex-shrink-0">D</span>
          <h2 className="text-[0.875rem] font-bold text-[#1A2535] tracking-tight">
            갤러리 사진 배치 편집기
          </h2>
        </div>
        <p className="text-[0.8125rem] text-[#8A95A3] mb-5 ml-7">
          홈페이지 갤러리 레이아웃을 미리 보면서 각 슬롯에 사진을 드래그해 배치하세요.
        </p>
        <GallerySlotEditor
          galleryPhotos={gallery.filter((p) => p.display_location === "gallery")}
        />
      </section>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
