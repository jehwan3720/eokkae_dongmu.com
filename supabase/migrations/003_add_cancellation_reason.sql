-- ============================================================
-- 에듀그리드 — 취소 사유 컬럼 추가
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT DEFAULT NULL;

-- 추가 확인
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'applications'
  AND column_name  = 'cancellation_reason';
