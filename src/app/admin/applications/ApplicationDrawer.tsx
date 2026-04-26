"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Application } from "@/lib/supabase/types";
import InlineStatusSelect from "./InlineStatusSelect";
import { deleteApplication, saveAdminNotes } from "@/actions/updateStatus";


function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[0.625rem] font-semibold tracking-[0.14em] uppercase text-[#8A95A3] mb-0.5">
        {label}
      </p>
      <p className="text-[0.875rem] text-[#1A2535] leading-relaxed break-keep">
        {value ?? <span className="text-[#B0B8C1]">—</span>}
      </p>
    </div>
  );
}

/* ── 삭제 확인 모달 ── */
function DeleteConfirmModal({
  schoolName,
  onConfirm,
  onClose,
  isPending,
}: {
  schoolName: string;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(10,22,40,0.65)", backdropFilter: "blur(3px)" }}
    >
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-7 py-5 border-b border-gray-100">
          <p className="text-[0.625rem] font-semibold tracking-[0.18em] uppercase text-red-400 mb-1">
            삭제 확인
          </p>
          <h2 className="text-[1.0625rem] font-bold text-[#1A2535]">
            이 문의를 삭제하시겠습니까?
          </h2>
        </div>
        <div className="px-7 py-5">
          <p className="text-[0.875rem] text-[#5A6472] leading-relaxed">
            <span className="font-semibold text-[#1A2535]">{schoolName}</span> 의 문의가
            영구 삭제됩니다. 이 작업은 복구할 수 없습니다.
          </p>
        </div>
        <div className="px-7 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 text-[0.875rem] font-semibold text-[#8A95A3] border border-[#E8EAED] rounded-[3px] hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 text-[0.875rem] font-bold bg-red-500 text-white rounded-[3px] hover:bg-red-600 transition-colors duration-150 disabled:opacity-50"
          >
            {isPending ? "삭제 중..." : "영구 삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationDrawer({
  app,
  onClose,
}: {
  app: Application | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  // 메모 상태
  const [notes, setNotes] = useState(app?.admin_notes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [isSavingNotes, startSavingNotes] = useTransition();

  // Esc 키 닫기
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !showDeleteModal) onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, showDeleteModal]);

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = app ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [app]);

  function handleDelete() {
    if (!app) return;
    startDelete(async () => {
      const res = await deleteApplication(app.application_id);
      if ("error" in res) {
        setDeleteError(res.error ?? "삭제에 실패했습니다.");
        setShowDeleteModal(false);
      } else {
        setShowDeleteModal(false);
        onClose();
        router.refresh();
      }
    });
  }

  function handleSaveNotes() {
    if (!app) return;
    setNotesSaved(false);
    setNotesError(null);
    startSavingNotes(async () => {
      const res = await saveAdminNotes(app.application_id, notes);
      if ("error" in res) {
        setNotesError(res.error ?? "저장에 실패했습니다.");
      } else {
        setNotesSaved(true);
        router.refresh();
      }
    });
  }

  const isOpen = !!app;

  return (
    <>
      {/* 오버레이 */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Drawer */}
      <div
        className={[
          "fixed top-0 right-0 z-50 h-full w-[480px] bg-white shadow-2xl flex flex-col",
          "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {app && (
          <>
            {/* 헤더 */}
            <div className="flex items-start justify-between px-7 py-5 border-b border-[#F0F1F3] flex-shrink-0">
              <div>
                <p className="text-[0.625rem] font-semibold tracking-[0.18em] uppercase text-[#8A95A3] mb-1">
                  {new Date(app.created_at).toLocaleDateString("ko-KR", {
                    year: "numeric", month: "long", day: "numeric",
                  })} 접수
                </p>
                <h2 className="text-[1.125rem] font-bold text-[#1A2535] leading-tight">
                  {app.school}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="mt-0.5 flex-shrink-0 text-[#B0B8C1] hover:text-[#1A2535] transition-colors duration-150"
                aria-label="닫기"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* 본문 — 스크롤 가능 */}
            <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-6">

              {/* 상태 */}
              <div>
                <p className="text-[0.625rem] font-semibold tracking-[0.14em] uppercase text-[#8A95A3] mb-2">
                  처리 상태
                </p>
                <InlineStatusSelect
                  applicationId={app.application_id}
                  currentStatus={app.status}
                  cancellationReason={app.cancellation_reason}
                />
              </div>

              <hr className="border-[#F0F1F3]" />

              {/* 담당자 정보 */}
              <div>
                <p className="text-[0.6875rem] font-bold tracking-wide uppercase text-[#1B3F7A] mb-3">
                  담당자 정보
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <Field label="성함"   value={app.contact_name} />
                  <Field label="연락처" value={app.contact} />
                  <div className="col-span-2">
                    <Field label="이메일" value={
                      app.email
                        ? <a href={`mailto:${app.email}`} className="text-[#1B3F7A] underline underline-offset-2 hover:opacity-70 transition-opacity">{app.email}</a>
                        : null
                    } />
                  </div>
                </div>
              </div>

              <hr className="border-[#F0F1F3]" />

              {/* 교육 상세 */}
              <div>
                <p className="text-[0.6875rem] font-bold tracking-wide uppercase text-[#1B3F7A] mb-3">
                  교육 상세
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <Field label="학년 / 연령"  value={app.grade} />
                  <Field label="예상 인원"    value={`${app.headcount}명`} />
                  <div className="col-span-2">
                    <Field label="희망 교육 일자" value={app.preferred_date} />
                  </div>
                </div>
              </div>

              {/* 추가 문의사항 */}
              {app.message && (
                <>
                  <hr className="border-[#F0F1F3]" />
                  <div>
                    <p className="text-[0.6875rem] font-bold tracking-wide uppercase text-[#1B3F7A] mb-3">
                      추가 문의사항
                    </p>
                    <p className="text-[0.875rem] text-[#5A6472] leading-relaxed whitespace-pre-wrap break-keep bg-[#F8F9FB] rounded-[4px] px-4 py-3">
                      {app.message}
                    </p>
                  </div>
                </>
              )}

              {/* 취소 사유 */}
              {app.status === "canceled" && app.cancellation_reason && (
                <>
                  <hr className="border-[#F0F1F3]" />
                  <div>
                    <p className="text-[0.6875rem] font-bold tracking-wide uppercase text-red-400 mb-2">
                      취소 사유
                    </p>
                    <p className="text-[0.875rem] text-red-500/80 leading-relaxed break-keep">
                      {app.cancellation_reason}
                    </p>
                  </div>
                </>
              )}

              <hr className="border-[#F0F1F3]" />

              {/* 관리자 메모 */}
              <div>
                <p className="text-[0.6875rem] font-bold tracking-wide uppercase text-[#1B3F7A] mb-3">
                  관리자 메모
                </p>
                <textarea
                  rows={4}
                  placeholder="내부 메모를 입력하세요. (예: 4월 22일 교장 통화 완료, 5월 확정 예정)"
                  value={notes}
                  onChange={(e) => { setNotes(e.target.value); setNotesSaved(false); }}
                  className="w-full px-3 py-2.5 text-[0.8125rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[3px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 resize-none leading-[1.8] placeholder:text-[#C0C6CE] transition-all duration-150"
                />
                <div className="flex items-center justify-between mt-2">
                  {notesError && (
                    <p className="text-[0.6875rem] text-red-500">{notesError}</p>
                  )}
                  {notesSaved && !notesError && (
                    <p className="text-[0.6875rem] text-emerald-600">저장되었습니다.</p>
                  )}
                  {!notesError && !notesSaved && <span />}
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-4 py-1.5 text-[0.75rem] font-semibold bg-[#1B3F7A] text-white rounded-[3px] hover:bg-[#163266] transition-colors duration-150 disabled:opacity-50 flex-shrink-0"
                  >
                    {isSavingNotes ? "저장 중..." : "메모 저장"}
                  </button>
                </div>
              </div>

              <hr className="border-[#F0F1F3]" />

              {/* 접수 메타 */}
              <div>
                <p className="text-[0.6875rem] font-bold tracking-wide uppercase text-[#1B3F7A] mb-3">
                  접수 정보
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <Field
                    label="접수 일시"
                    value={new Date(app.created_at).toLocaleString("ko-KR", {
                      year: "numeric", month: "2-digit", day: "2-digit",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  />
                  <Field label="Application ID" value={
                    <span className="text-[0.75rem] font-mono text-[#8A95A3] break-all">
                      {app.application_id}
                    </span>
                  } />
                </div>
              </div>

              {/* 삭제 에러 */}
              {deleteError && (
                <p className="text-[0.6875rem] text-red-500 text-center">{deleteError}</p>
              )}

            </div>

            {/* 하단 삭제 버튼 */}
            <div className="flex-shrink-0 px-7 py-4 border-t border-[#F0F1F3] bg-white">
              <button
                onClick={() => { setDeleteError(null); setShowDeleteModal(true); }}
                className="w-full py-2.5 text-[0.8125rem] font-semibold text-red-400 border border-red-200 rounded-[3px] hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-150"
              >
                이 문의 삭제
              </button>
            </div>
          </>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && app && (
        <DeleteConfirmModal
          schoolName={app.school}
          onConfirm={handleDelete}
          onClose={() => setShowDeleteModal(false)}
          isPending={isDeleting}
        />
      )}
    </>
  );
}
