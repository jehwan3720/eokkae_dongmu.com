import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/app/admin/applications/LogoutButton";
import PhotoUploader from "./PhotoUploader";

export default async function PhotosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[#1B3F7A] mb-1">
              어깨동무 관리자
            </p>
            <h1 className="text-[1.75rem] font-bold tracking-tight text-[#1A2535]">
              수업 사진 관리
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/applications"
              className="px-4 py-2 text-[0.8125rem] font-medium text-[#8A95A3] border border-[#E8EAED] rounded-[3px] hover:text-[#1A2535] hover:border-[#C0C6CE] transition-colors duration-150"
            >
              ← 문의 관리
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* 안내 배너 */}
        <div className="bg-amber-50 border border-amber-200 rounded-[4px] px-5 py-3.5 mb-8 flex items-start gap-3">
          <span className="text-amber-500 mt-0.5 flex-shrink-0 text-base">⚠️</span>
          <p className="text-[0.8125rem] text-amber-800 leading-relaxed">
            업로드 전 반드시 <strong>학부모 초상권 동의 여부</strong>를 확인해 주세요.
            동의를 받지 않은 사진의 게시는 법적 책임이 발생할 수 있습니다.
          </p>
        </div>

        {/* 업로더 */}
        <PhotoUploader />

      </div>
    </div>
  );
}
