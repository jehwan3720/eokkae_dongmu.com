-- ============================================================
-- 에듀그리드 — 초기 DB 스키마 (v2)
-- Supabase SQL Editor에서 전체 선택 후 Run 하세요
-- ============================================================

-- ── applications 테이블 ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applications (
  application_id  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),

  school          TEXT          NOT NULL DEFAULT '미기입',
  contact         TEXT          NOT NULL DEFAULT '000-0000-0000',
  email           TEXT,
  grade           TEXT          NOT NULL DEFAULT '미기입',
  headcount       INTEGER       NOT NULL DEFAULT 0,
  preferred_date  DATE          NOT NULL DEFAULT CURRENT_DATE,
  message         TEXT,
  marketing       BOOLEAN       NOT NULL DEFAULT false,

  status          TEXT          NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  admin_notes     TEXT,

  ip_address      TEXT,
  user_agent      TEXT
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_applications_updated_at ON public.applications;
CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── status_history 테이블 ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.status_history (
  id              BIGSERIAL     PRIMARY KEY,
  application_id  UUID          NOT NULL REFERENCES public.applications(application_id) ON DELETE CASCADE,
  changed_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  from_status     TEXT,
  to_status       TEXT          NOT NULL,
  changed_by      UUID,         -- auth.users FK 제거 (호환성)
  note            TEXT
);

-- ── 인덱스 ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_applications_status     ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_school     ON public.applications(school);
CREATE INDEX IF NOT EXISTS idx_status_history_app_id   ON public.status_history(application_id);

-- ── RLS 활성화 ───────────────────────────────────────────────
ALTER TABLE public.applications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

-- 기존 정책 제거 후 재생성 (중복 방지)
DROP POLICY IF EXISTS "public_can_insert"         ON public.applications;
DROP POLICY IF EXISTS "admin_can_select"           ON public.applications;
DROP POLICY IF EXISTS "admin_can_update"           ON public.applications;
DROP POLICY IF EXISTS "admin_can_insert_history"   ON public.status_history;
DROP POLICY IF EXISTS "admin_can_select_history"   ON public.status_history;

-- applications: 비로그인 INSERT, 로그인 SELECT/UPDATE
CREATE POLICY "public_can_insert"  ON public.applications
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "admin_can_select"   ON public.applications
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_can_update"   ON public.applications
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- status_history: 로그인 INSERT/SELECT
CREATE POLICY "admin_can_insert_history" ON public.status_history
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "admin_can_select_history" ON public.status_history
  FOR SELECT TO authenticated USING (true);

-- ── 완료 확인 ────────────────────────────────────────────────
SELECT
  table_name,
  'OK' AS status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('applications', 'status_history')
ORDER BY table_name;
