-- ============================================================
-- 에듀그리드 — 담당자 성함 컬럼 추가
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS contact_name TEXT NOT NULL DEFAULT '미기입';

-- 추가 확인
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'applications'
  AND column_name  = 'contact_name';
