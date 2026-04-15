"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2, Star, X, CheckCircle } from "lucide-react";
import { deletePhoto, listPhotos } from "@/actions/uploadPhoto";
import { createClient } from "@/lib/supabase/browser";

/* ── 상수 ── */
const STAGES = ["1령 유충", "2령 유충", "3령 유충", "번데기", "우화", "성충"];
const INSTITUTIONS = [
  "OO유치원",
  "OO초등학교",
  "OO어린이집",
  "기타 기관",
];

/* ── 타입 ── */
interface FileItem {
  id: string;
  file: File;
  preview: string;
  progress: number; // 0~100, 100 = 완료, -1 = 오류
  path?: string;
  url?: string;
}

interface GalleryItem {
  name: string;
  path: string;
  url: string;
  size: number;
  isFeatured?: boolean;
}

/* ── Toast ── */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0F1F3D] text-white px-5 py-3.5 rounded-[6px] shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
      <p className="text-[0.875rem] font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}

/* ── 파일 크기 포맷 ── */
function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── 메인 컴포넌트 ── */
export default function PhotoUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState<FileItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [institution, setInstitution] = useState("");
  const [grade, setGrade] = useState("");
  const [stage, setStage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [featured, setFeatured] = useState<string | null>(null);

  /* 기존 사진 목록 로드 */
  useEffect(() => {
    listPhotos().then((res) => {
      if (!("error" in res)) setGallery(res);
    });
  }, []);

  /* 파일 추가 */
  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const items: FileItem[] = imageFiles.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      file: f,
      preview: URL.createObjectURL(f),
      progress: 0,
    }));
    setQueue((prev) => [...prev, ...items]);
  }, []);

  /* 드래그 핸들러 */
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  /* 대기열에서 제거 */
  const removeFromQueue = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  /* 업로드 실행 */
  async function handleUpload() {
    if (!institution || !grade || !stage || !agreed || queue.length === 0) return;
    setUploading(true);

    const supabase = createClient();
    let hasError = false;

    for (const item of queue) {
      // 50% 진행 표시
      setQueue((prev) =>
        prev.map((f) => f.id === item.id ? { ...f, progress: 50 } : f)
      );

      // 파일명 중복 방지: 타임스탬프 + 원본 파일명
      const ext = item.file.name.split(".").pop();
      const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const storagePath = `${institution}/${safeName}`;

      // 1. Supabase Storage 업로드
      const { error: storageError } = await supabase.storage
        .from("photos")
        .upload(storagePath, item.file, { contentType: item.file.type, upsert: false });

      if (storageError) {
        setQueue((prev) =>
          prev.map((f) => f.id === item.id ? { ...f, progress: -1 } : f)
        );
        hasError = true;
        continue;
      }

      // 2. publicUrl 취득
      const { data: { publicUrl } } = supabase.storage
        .from("photos")
        .getPublicUrl(storagePath);

      // 3. activity_photos 테이블 insert
      const { error: dbError } = await supabase
        .from("activity_photos")
        .insert({
          image_url: publicUrl,
          organization: institution,
          grade_class: grade,
          activity_step: stage,
          is_primary: false,
        });

      if (dbError) {
        setQueue((prev) =>
          prev.map((f) => f.id === item.id ? { ...f, progress: -1 } : f)
        );
        hasError = true;
        continue;
      }

      // 4. 완료 처리
      setQueue((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, progress: 100, path: storagePath, url: publicUrl }
            : f
        )
      );
      setGallery((prev) => [{
        name: item.file.name,
        path: storagePath,
        url: publicUrl,
        size: item.file.size,
      }, ...prev]);
    }

    setUploading(false);
    setToast(hasError ? "일부 사진 업로드에 실패했습니다." : "업로드가 완료되었습니다.");

    // 완료된 항목만 대기열에서 제거 후 폼 초기화
    setTimeout(() => {
      setQueue((prev) => {
        prev.filter((f) => f.progress === 100).forEach((f) => URL.revokeObjectURL(f.preview));
        return prev.filter((f) => f.progress !== 100);
      });
      if (!hasError) {
        setInstitution("");
        setGrade("");
        setStage("");
        setAgreed(false);
      }
    }, 1500);
  }

  /* 갤러리 삭제 */
  async function handleDelete(path: string) {
    const res = await deletePhoto(path);
    if ("error" in res) { setToast("삭제에 실패했습니다."); return; }
    setGallery((prev) => prev.filter((g) => g.path !== path));
    if (featured === path) setFeatured(null);
    setToast("사진이 삭제되었습니다.");
  }

  const canUpload = !!institution && !!grade && !!stage && agreed && queue.length > 0 && !uploading;

  return (
    <div className="flex flex-col gap-8">

      {/* ── 업로드 존 ── */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "border-2 border-dashed rounded-xl px-8 py-14 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 select-none",
          isDragging
            ? "border-[#1B3F7A] bg-[#1B3F7A]/[0.04]"
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
          <p className="text-[0.8125rem] text-[#8A95A3]">
            JPG, PNG, WEBP · 파일당 최대 10MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* ── 메타 데이터 폼 ── */}
      <div className="bg-white border border-[#E8EAED] rounded-xl p-6">
        <p className="text-[0.6875rem] font-bold tracking-[0.14em] uppercase text-[#8A95A3] mb-4">
          분류 정보
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* 기관 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-semibold text-[#5A6472]">소속 기관</label>
            <select
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="px-3 py-2.5 text-[0.875rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[6px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 transition-all"
            >
              <option value="">선택하세요</option>
              {INSTITUTIONS.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>

          {/* 학년/반 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-semibold text-[#5A6472]">학년 / 반</label>
            <input
              type="text"
              placeholder="예) 3학년 2반"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="px-3 py-2.5 text-[0.875rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[6px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 transition-all placeholder:text-[#B0B8C1]"
            />
          </div>

          {/* 활동 단계 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-semibold text-[#5A6472]">활동 단계</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="px-3 py-2.5 text-[0.875rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[6px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 transition-all"
            >
              <option value="">선택하세요</option>
              {STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* 초상권 동의 */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 flex-shrink-0 w-4 h-4 accent-[#1B3F7A] cursor-pointer"
          />
          <span className="text-[0.8125rem] leading-relaxed text-[#5A6472] group-hover:text-[#1A2535] transition-colors">
            <span className="font-bold text-red-500">[필수]</span>{" "}
            해당 사진은 학부모(보호자)의 초상권 활용 및 수집 동의를 받은 항목임을 확인합니다.
          </span>
        </label>
      </div>

      {/* ── 대기열 미리보기 ── */}
      {queue.length > 0 && (
        <div>
          <p className="text-[0.6875rem] font-bold tracking-[0.14em] uppercase text-[#8A95A3] mb-3">
            업로드 대기 ({queue.length}장)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {queue.map((item) => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden border border-[#E8EAED] bg-[#F8F9FB]">
                <div className="aspect-square relative">
                  <Image src={item.preview} alt={item.file.name} fill className="object-cover" />

                  {/* 삭제 버튼 */}
                  {item.progress === 0 && (
                    <button
                      onClick={() => removeFromQueue(item.id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  )}

                  {/* 오류 오버레이 */}
                  {item.progress === -1 && (
                    <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                      <p className="text-white text-[0.625rem] font-bold">실패</p>
                    </div>
                  )}
                </div>

                {/* 파일명 */}
                <div className="px-2 py-1.5">
                  <p className="text-[0.625rem] text-[#8A95A3] truncate">{item.file.name}</p>
                  <p className="text-[0.5625rem] text-[#B0B8C1]">{fmtSize(item.file.size)}</p>
                </div>

                {/* Progress Bar */}
                {item.progress > 0 && item.progress < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E8EAED]">
                    <div
                      className="h-full bg-[#1B3F7A] transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.progress === 100 && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 업로드 버튼 ── */}
      <button
        onClick={handleUpload}
        disabled={!canUpload}
        className={[
          "w-full py-3.5 text-[0.9375rem] font-bold rounded-[6px] transition-all duration-200 flex items-center justify-center gap-2",
          canUpload
            ? "bg-[#0F1F3D] text-white hover:bg-[#1B3F7A] cursor-pointer"
            : "bg-[#F0F1F3] text-[#B0B8C1] cursor-not-allowed",
        ].join(" ")}
      >
        <Upload size={16} strokeWidth={2} />
        {uploading ? "업로드 중..." : `업로드 시작 ${queue.length > 0 ? `(${queue.length}장)` : ""}`}
      </button>

      {/* ── 업로드 완료 갤러리 ── */}
      {gallery.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[0.6875rem] font-bold tracking-[0.14em] uppercase text-[#8A95A3]">
              등록된 사진 ({gallery.length}장)
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {gallery.map((item) => (
              <div
                key={item.path}
                className="relative group rounded-lg overflow-hidden border border-[#E8EAED] bg-[#F8F9FB]"
              >
                <div className="aspect-square relative">
                  <Image src={item.url} alt={item.name} fill className="object-cover" />

                  {/* 대표 사진 배지 */}
                  {featured === item.path && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-amber-400 px-1.5 py-0.5 rounded-full">
                      <Star size={9} className="text-white fill-white" />
                      <span className="text-[0.5rem] font-bold text-white">대표</span>
                    </div>
                  )}

                  {/* 호버 액션 오버레이 */}
                  <div className="absolute inset-0 bg-[#0F1F3D]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setFeatured(item.path)}
                      title="대표 사진 설정"
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-amber-400 flex items-center justify-center transition-colors"
                    >
                      <Star size={14} className="text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.path)}
                      title="삭제"
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                </div>

                <div className="px-2 py-1.5">
                  <p className="text-[0.625rem] text-[#8A95A3] truncate">{item.name}</p>
                  <p className="text-[0.5625rem] text-[#B0B8C1]">{fmtSize(item.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
