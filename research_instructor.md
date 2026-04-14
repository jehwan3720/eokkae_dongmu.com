# Research: Instructor 섹션 구조 분석

> 작성일: 2026-04-13  
> 대상 파일: `src/components/Instructor.tsx`

---

## 1. 데이터 레이어 구조

컴포넌트 상단에 4개의 모듈 레벨 상수가 선언되어 있다.

| 상수명 | 타입 | 역할 |
|--------|------|------|
| `credentials` | `{ Icon, text }[]` | 좌측 패널에 항상 노출되는 4줄 요약 자격 목록 |
| `careerDetails` | `{ category, items[] }[]` | 확장 영역(더 보기)에 나타나는 그리드 데이터 |
| `about` | `string` | 우측 패널 About 섹션 단락 |
| `quote` | `string` | 우측 패널 Vision 섹션 인용문 |

**현재 `careerDetails` 구성 (4개 카테고리)**

```
학력 (2항목) | 수상 (3항목) | 경력 (4항목) | 활동 (3항목)
```

---

## 2. UI 레이어 구조

### 2-1. 섹션 전체 레이아웃

```
<section>
  섹션 헤더 (강사 소개 / 이 수업을 이끄는 전문가)
  <메인 카드>
    <grid lg:grid-cols-[300px_1fr]>
      좌측 패널 (프로필 사진 + 이름 + credentials)
      우측 패널 (About + Vision)
    </grid>
    경력 더 보기 버튼
    AnimatePresence (확장 영역)
  </메인 카드>
</section>
```

### 2-2. 좌측 패널 (`300px` 고정)

- `border-r border-neutral-100` (lg 이상에서 우측 경계선)
- `border-b` (모바일에서 하단 경계선)
- 프로필 사진: `w-36 h-36 rounded-full` 플레이스홀더
- 이름/직함: `text-xl font-bold` / `text-[0.8125rem] text-neutral-500`
- credentials: `flex items-start gap-3`, 아이콘 `size={13}` + 텍스트

### 2-3. 우측 패널 (1fr)

**About 블록**
- `px-10 pt-12 pb-10 border-b border-neutral-100`
- 레이블: `text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-neutral-400`
- 본문: `text-[0.9375rem] text-neutral-600 leading-[1.95]`

**Vision 블록**
- `relative px-10 py-10 flex-1 bg-neutral-50/60`
- 대형 인용 부호: `absolute top-6 left-8`, `opacity: 0.10`, `fontFamily: Georgia`
- blockquote 본문: `italic`, `fontFamily: Georgia`, `text-[1rem] md:text-[1.0625rem]`
- 출처: `cite` 태그, `text-[0.75rem] text-neutral-400`

### 2-4. 더 보기 버튼

```tsx
<button onClick={() => setExpanded((v) => !v)}>
  <span>{expanded ? "상세 경력 접기" : "상세 경력 더 보기"}</span>
  <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
    <ChevronDown />
  </motion.span>
</button>
```

- 전체 너비(`w-full`), 중앙 정렬
- 호버 시 `text-[var(--color-brand)]` 전환 (200ms)
- ChevronDown 아이콘: Framer Motion `rotate` 애니메이션

### 2-5. 확장 영역 (AnimatePresence)

```tsx
<AnimatePresence initial={false}>
  {expanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="bg-[#F9FAFB] border-t border-neutral-100 px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {careerDetails.map(({ category, items }) => (...))}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

**현재 그리드**: `grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-4`

---

## 3. 애니메이션 레이어

| 애니메이션 | 설정 |
|-----------|------|
| 섹션 헤더 진입 | `staggerContainer` + `slideUp` variants |
| 메인 카드 진입 | `staggerContainer` + `slideUpStagger` (custom 0/1/2) |
| 경력 확장 | `height: 0 → auto`, `opacity: 0 → 1`, 0.45s, `ease: [0.16,1,0.3,1]` |
| 버튼 아이콘 | `rotate: 0 → 180`, 0.3s |

공용 variants는 `@/lib/motion`에서 import (`staggerContainer`, `slideUp`, `slideUpStagger`, `VIEWPORT`).

---

## 4. 확장 시 고려해야 할 점

### 4-1. 그리드 열 수 변경 영향
- 현재 `lg:grid-cols-4` → 3개 카테고리이므로 `lg:grid-cols-3`으로 변경 필요
- `sm:grid-cols-2`는 3개 카테고리에서도 그대로 유지 가능

### 4-2. 레이아웃 밀림 방지
- `AnimatePresence` + `height: 0→auto` 패턴은 **카드 내부 확장**이므로 카드 하단 요소가 없어 페이지 밀림 없음
- `overflow-hidden`이 motion.div에 적용되어 있어 확장 도중 스크롤 발생 없음

### 4-3. 데이터 교체 범위
- `careerDetails` 배열만 교체하면 렌더링 로직(`careerDetails.map(...)`) 변경 불필요
- 카테고리 제목 스타일(`text-[var(--color-brand)]`)과 불릿 스타일은 그대로 재사용

### 4-4. 모바일 반응형
- 3컬럼이라도 `sm:grid-cols-2`에서 마지막 항목이 왼쪽 정렬로 단독 표시됨
- 선택지: `sm:grid-cols-3` (바로 3열)로 전환하거나 그대로 유지
- 현재 텍스트 길이(화천군 습지 관리 등)는 sm 뷰포트에서도 충분히 읽힘 → 그대로 유지 권장

### 4-5. 항목 수 불균형
- 3개 카테고리 항목 수: 연구(2~3) / 공공(1~2) / 전시(2)
- 그리드 높이는 가장 긴 열 기준으로 자동 조정되므로 별도 처리 불필요
