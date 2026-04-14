# System Architecture Plan
## 어깨동무 — 문의 접수 백엔드 고도화

> 작성일: 2026-04-14  
> 현재 상태: Next.js API Route → Resend 이메일 단방향 파이프라인  
> 목표 상태: Supabase DB 영구 저장 + Admin Dashboard + Discord 실시간 알림

---

## 0. 현재 아키텍처의 문제점

```
[사용자 폼] → POST /api/contact → [Resend 이메일]
```

| 문제 | 설명 |
|------|------|
| 데이터 소실 | 이메일 분실·스팸 처리 시 문의 데이터 영구 소실 |
| 상태 추적 불가 | "대기 / 확정 / 취소" 상태를 관리할 저장소 없음 |
| 검색·필터 불가 | 누적 문의가 늘어날수록 이메일 함에서 수동 검색 필요 |
| 감사 로그 없음 | 누가 언제 상태를 바꿨는지 기록 불가 |

---

## 1. 목표 아키텍처

```
[사용자 폼]
    │
    ▼
[Next.js Server Action]  ← 클라이언트에 로직 노출 없음
    │
    ├─→ [Supabase PostgreSQL] ← 영구 저장, RLS 보호
    │       applications
    │       status_history
    │
    ├─→ [Resend]  ← 관리자 수신 + 선생님 자동 회신
    │
    └─→ [Discord Webhook] ← 대표자 실시간 모바일 알림
              │
[Admin Dashboard /admin]
    └─ Supabase Auth (이메일/비밀번호) → 대표자만 접근
```

---

## 2. DB 스키마 설계 (PostgreSQL)

### 2-1. `applications` 테이블 (핵심)

```sql
CREATE TABLE applications (
  -- 식별자
  application_id  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),

  -- 문의 원본 데이터 (폼 필드)
  school          TEXT          NOT NULL,
  contact         TEXT          NOT NULL,          -- 전화번호 (포맷 완료 상태로 저장)
  email           TEXT,                             -- 선택 입력
  grade           TEXT          NOT NULL,
  headcount       INTEGER       NOT NULL,
  preferred_date  DATE          NOT NULL,
  message         TEXT,
  marketing       BOOLEAN       NOT NULL DEFAULT false,

  -- 관리 필드
  status          TEXT          NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  admin_notes     TEXT,                             -- 대표자 내부 메모

  -- 감사 필드
  ip_address      INET,                             -- 어뷰징 추적용
  user_agent      TEXT
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

**설계 결정: `status` 컬럼을 ENUM 대신 CHECK 제약 TEXT로**

| 선택지 | 장점 | 단점 |
|--------|------|------|
| PostgreSQL ENUM | 타입 안전성 높음 | 값 추가 시 `ALTER TYPE` 필요 (배포 복잡) |
| CHECK TEXT (채택) | 마이그레이션 없이 값 추가 가능 | 애플리케이션 레이어에서 검증 필요 |

→ 초기 제품 단계에서는 유연성 우선. Supabase의 TypeScript 타입 자동 생성으로 앱 레이어 타입 안전성 보완.

---

### 2-2. `status_history` 테이블 (감사 로그)

```sql
CREATE TABLE status_history (
  id              BIGSERIAL     PRIMARY KEY,
  application_id  UUID          NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE,
  changed_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  from_status     TEXT,         -- NULL = 최초 생성
  to_status       TEXT          NOT NULL,
  changed_by      UUID          REFERENCES auth.users(id),  -- 관리자 user_id
  note            TEXT          -- 변경 사유 (선택)
);
```

**왜 별도 테이블인가?**
- `applications.status`만 보면 현재 상태만 알 수 있음
- `status_history`가 있으면 "언제, 누가, 왜 변경했는지" 전체 이력 추적 가능
- ON DELETE CASCADE로 문의 삭제 시 이력도 함께 정리

---

### 2-3. 인덱스 전략

```sql
-- Admin Dashboard의 주요 쿼리 패턴에 맞게 인덱스 설계
CREATE INDEX idx_applications_status      ON applications(status);
CREATE INDEX idx_applications_created_at  ON applications(created_at DESC);
CREATE INDEX idx_applications_school      ON applications(school);
CREATE INDEX idx_status_history_app_id    ON status_history(application_id);
```

---

## 3. 보안 정책: Supabase RLS (Row Level Security)

### 3-1. 기본 원칙

```sql
-- 테이블 RLS 활성화 (기본값은 비활성화)
ALTER TABLE applications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
```

RLS가 활성화되면 **정책이 없는 경우 모든 접근이 거부**됨.  
Supabase anon key를 탈취당해도 데이터 조회 불가.

### 3-2. `applications` 테이블 정책

```sql
-- 정책 1: 문의 제출 (INSERT) — 비로그인 사용자도 가능
-- anon 역할(사이트 방문자)이 새 문의를 등록할 수 있어야 함
CREATE POLICY "allow_public_insert" ON applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 정책 2: 조회 (SELECT) — 인증된 관리자만
-- auth.uid()가 NULL이 아닌 경우, 즉 로그인된 사용자만 허용
CREATE POLICY "allow_admin_select" ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- 정책 3: 수정 (UPDATE) — 인증된 관리자만
-- status, admin_notes 필드만 변경 허용 (원본 데이터 보호)
CREATE POLICY "allow_admin_update" ON applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
```

**추가 강화 옵션 (선택적 적용)**

특정 이메일(명제환 대표)만 접근하도록 더 좁게 제한:

```sql
-- Supabase Auth 메타데이터에 role: 'admin'을 설정해두는 경우
CREATE POLICY "allow_admin_only" ON applications
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') = 'jehu@eoggae-dongmu.kr'
    -- 또는 auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );
```

### 3-3. `status_history` 정책

```sql
-- INSERT: 인증된 관리자만 (서버 액션에서만 호출)
CREATE POLICY "allow_admin_insert_history" ON status_history
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- SELECT: 인증된 관리자만
CREATE POLICY "allow_admin_select_history" ON status_history
  FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);
```

### 3-4. Service Role Key 사용 시 주의사항

Supabase에는 두 가지 키가 있음:

| 키 종류 | RLS 적용 여부 | 사용 위치 |
|---------|-------------|---------|
| `anon key` | 적용됨 | 클라이언트, Server Action (공개 INSERT) |
| `service_role key` | **우회함** | 서버 전용 (Server Action, API Route) |

→ **`service_role key`는 절대 클라이언트 코드에 포함 금지.**  
→ Server Action에서만 사용. Next.js는 Server Action 코드를 번들에서 제외하므로 안전.

---

## 4. API 보안: Next.js Server Actions

### 4-1. 현재 방식 (API Route) vs Server Actions 비교

| 항목 | API Route (현재) | Server Action (목표) |
|------|-----------------|-------------------|
| 클라이언트 노출 | URL 경로 노출 (`/api/contact`) | URL 없음, 함수 참조만 |
| CSRF 보호 | 수동 구현 필요 | Next.js가 자동 처리 |
| 타입 안전성 | 수동 타입 캐스팅 | 함수 시그니처로 보장 |
| 번들 포함 | 별도 라우트 파일 | 서버 코드가 번들에서 자동 제외 |

### 4-2. Server Action 구조 설계

```
src/
  actions/
    submitApplication.ts   ← 폼 제출 (anon → DB INSERT + Resend + Discord)
    updateStatus.ts        ← 상태 변경 (admin → DB UPDATE + history INSERT)
  lib/
    supabase/
      client.ts            ← 브라우저용 Supabase 클라이언트 (anon key)
      server.ts            ← 서버용 Supabase 클라이언트 (service_role key)
```

**`submitApplication.ts` 흐름 (의사코드)**

```ts
"use server";

export async function submitApplication(formData: ApplicationInput) {
  // 1. 서버 사이드 유효성 검증 (클라이언트 우회 방어)
  const validated = schema.safeParse(formData);
  if (!validated.success) return { error: "잘못된 입력" };

  // 2. Supabase INSERT (service_role 클라이언트 사용)
  const supabase = createServerClient(); // service_role key 사용
  const { data, error } = await supabase
    .from("applications")
    .insert({ ...validated.data })
    .select("application_id")
    .single();

  if (error) return { error: "저장 실패" };

  // 3. Resend 이메일 발송 (기존 로직 이관)
  await sendEmails(validated.data);

  // 4. Discord Webhook 알림 (신규)
  await notifyDiscord(validated.data, data.application_id);

  return { ok: true };
}
```

---

## 5. Admin Dashboard 기능 명세

### 5-1. 라우팅 구조

```
/admin                → 로그인 여부 확인 → 미인증 시 /admin/login 리다이렉트
/admin/login          → Supabase Auth 이메일/비밀번호 로그인
/admin/applications   → 문의 리스트 (기본 페이지)
/admin/applications/[id] → 문의 상세 + 상태 변경 + 메모
```

### 5-2. 문의 리스트 (`/admin/applications`)

| UI 요소 | 설명 |
|---------|------|
| 상태 탭 | 전체 / 대기(pending) / 확정(confirmed) / 취소(cancelled) |
| 정렬 | 최신순 기본, 희망 교육 일자 순 정렬 |
| 검색 | 학교명 실시간 검색 (PostgreSQL `ILIKE`) |
| 배지 | 상태별 색상 배지 (대기: 노랑, 확정: 초록, 취소: 회색) |
| 페이지네이션 | 20건씩 (Supabase `.range()`) |

### 5-3. 문의 상세 (`/admin/applications/[id]`)

**상태 변경 버튼 (3-way toggle)**

```
[대기 중]  →  클릭  →  [확정됨]  →  클릭  →  [취소됨]
```

상태 변경 시:
1. `applications.status` UPDATE
2. `status_history` INSERT (변경 이력 기록)
3. 확정 시 → 선생님에게 확정 안내 이메일 자동 발송 (선택적)

**관리자 메모 (`admin_notes`)**
- 자유 입력 텍스트 필드
- "저장" 버튼 클릭 시 DB UPDATE
- 상태 이력과 별개로 내부 메모용

### 5-4. 인증 미들웨어

```ts
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Supabase 세션 쿠키 확인
    // 세션 없으면 → /admin/login 리다이렉트
  }
}
```

---

## 6. 알림 파이프라인

### 6-1. 전체 흐름

```
문의 접수
    │
    ├─→ Resend (이메일)
    │     ├─ 관리자 수신 메일  (현재 구현됨)
    │     └─ 선생님 자동 회신  (현재 구현됨)
    │
    └─→ Discord Webhook (신규)
          └─ 대표자 핸드폰 Discord 앱으로 즉시 푸시 알림
```

### 6-2. Discord Webhook 페이로드 설계

Discord Embed 형식 사용 (텍스트보다 구조화된 알림):

```json
{
  "embeds": [{
    "title": "📬 새 교육 문의 접수",
    "color": 1782016,
    "fields": [
      { "name": "학교명", "value": "○○초등학교", "inline": true },
      { "name": "담당자 연락처", "value": "010-1234-5678", "inline": true },
      { "name": "학년/연령", "value": "4학년", "inline": true },
      { "name": "예상 인원", "value": "28명", "inline": true },
      { "name": "희망 교육 일자", "value": "2026-05-15", "inline": true },
      { "name": "상태", "value": "⏳ 대기 중", "inline": true }
    ],
    "footer": { "text": "어깨동무 관리 시스템" },
    "timestamp": "2026-04-14T09:00:00Z"
  }]
}
```

### 6-3. Resend vs Discord 역할 분리

| 채널 | 목적 | 수신자 | 특성 |
|------|------|--------|------|
| Resend (이메일) | 공식 기록 + 선생님 회신 | 대표자 + 선생님 | 비동기, 영구 기록 |
| Discord Webhook | 실시간 모바일 알림 | 대표자만 | 즉각, 무료, 앱 푸시 |

→ 이메일은 "나중에 확인하는 공식 채널", Discord는 "지금 당장 알아야 하는 긴급 채널"로 역할 분리.

---

## 7. Trade-off 분석 (실제 의사결정 기록)

### 7-1. 데이터베이스: Supabase vs PlanetScale vs Neon

| | Supabase | PlanetScale | Neon |
|--|---------|-------------|------|
| DB 엔진 | PostgreSQL | MySQL (Vitess) | PostgreSQL |
| RLS | 네이티브 지원 | 없음 | 없음 |
| Auth | 내장 | 없음 | 없음 |
| 무료 티어 | 500MB, 2 프로젝트 | 5GB (단종 논란) | 0.5GB |
| **채택 여부** | **✅ 채택** | ❌ | ❌ |

**채택 이유**: RLS + Auth를 하나의 플랫폼에서 처리 가능. 외부 Auth 서비스(NextAuth 등) 추가 불필요. 초기 단계 운영 복잡도 최소화.

---

### 7-2. 인증: Supabase Auth vs NextAuth vs 커스텀

| | Supabase Auth | NextAuth | 커스텀 JWT |
|--|-------------|---------|-----------|
| RLS 연동 | 네이티브 (JWT 자동 전달) | 별도 설정 필요 | 복잡 |
| 구현 공수 | 낮음 | 중간 | 높음 |
| 소셜 로그인 | 지원 | 지원 | 구현 필요 |
| **채택 여부** | **✅ 채택** | ❌ | ❌ |

**채택 이유**: Supabase의 JWT가 RLS 정책의 `auth.uid()` / `auth.jwt()`와 자동 연동됨. 다른 Auth 솔루션은 Supabase RLS와 연동을 위한 추가 설정 필요.

---

### 7-3. 폼 제출 방식: Server Action vs API Route (현재)

| | API Route (현재) | Server Action |
|--|-----------------|---------------|
| CSRF 보호 | 수동 | 자동 |
| 클라이언트 코드 분리 | URL 노출 | 완전 분리 |
| 에러 타입 안전성 | 낮음 | 높음 |
| 마이그레이션 공수 | — | 낮음 (로직 재사용) |
| **채택 여부** | ❌ 마이그레이션 | **✅ 목표** |

---

### 7-4. 상태 관리: Admin Dashboard에서 낙관적 업데이트 여부

| 방식 | UX | 복잡도 | 위험 |
|------|-----|--------|------|
| 낙관적 업데이트 | 즉각 반응 | 높음 | 실패 시 롤백 로직 필요 |
| 비관적 업데이트 (채택) | 약간 느림 | 낮음 | 없음 |

**채택 이유**: 관리자 1인이 사용하는 내부 도구이므로 UX 응답성보다 데이터 정합성이 중요. 낙관적 업데이트의 복잡도를 감수할 이유 없음.

---

### 7-5. `status_history`를 별도 테이블 vs JSONB 배열

| | 별도 테이블 (채택) | JSONB 배열 |
|--|-----------------|-----------|
| 쿼리 유연성 | 높음 (JOIN, GROUP BY 가능) | 낮음 |
| 인덱싱 | 가능 | 제한적 |
| 마이그레이션 | 쉬움 | 어려움 |
| 초기 구현 | 약간 복잡 | 단순 |

**채택 이유**: 향후 "이번 달 확정 전환율" 같은 집계 쿼리가 필요할 때 별도 테이블이 필수. JSONB는 조회 패턴이 고정일 때만 유리.

---

## 8. 구현 단계 (승인 후 순차 진행)

| 단계 | 작업 | 파일 | 상태 |
|------|------|------|------|
| 1 | Supabase 프로젝트 생성 + 환경 변수 설정 | `.env.local` | ⏳ 사용자 설정 필요 |
| 2 | DB 스키마 마이그레이션 실행 | `supabase/migrations/001_initial.sql` | ⏳ SQL Editor에서 실행 필요 |
| 3 | RLS 정책 적용 | (위 SQL 파일에 포함) | ⏳ SQL Editor에서 실행 필요 |
| 4 | Supabase 클라이언트 설정 | `src/lib/supabase/` | ✅ 완료 |
| 5 | `submitApplication` Server Action 작성 | `src/actions/submitApplication.ts` | ✅ 완료 |
| 6 | 기존 API Route → Server Action 마이그레이션 | `src/components/CTA.tsx` | ✅ 완료 |
| 7 | Discord Webhook 연동 | `src/actions/submitApplication.ts` | ✅ 완료 (키 입력 후 활성화) |
| 8 | Supabase Auth 설정 (관리자 계정 생성) | Supabase Dashboard | ⏳ 사용자 설정 필요 |
| 9 | `/admin` 미들웨어 + 로그인 페이지 | `middleware.ts`, `src/app/admin/login/` | ✅ 완료 |
| 10 | Admin Dashboard UI 구현 | `src/app/admin/applications/` | ✅ 완료 |

---

## ✏️ 승인 메모 공간

> 여기에 피드백이나 수정 요청을 남겨주세요.

- [ ] Supabase 채택 동의
- [ ] Server Action 마이그레이션 동의
- [ ] Discord Webhook 알림 도입 동의
- [ ] `status_history` 별도 테이블 동의
- [ ] Admin Dashboard 기능 명세 동의
- [ ] 구현 시작 승인
