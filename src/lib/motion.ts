/**
 * 어깨동무 — 전역 애니메이션 시스템
 * 기준: Soft Slide-up + Fade-in / duration 0.8s / easeOut
 */

// ── 기본 Ease 커브 ──────────────────────────────────────────
// circOut에 가까운 커스텀 bezier (빠르게 올라와 부드럽게 정착)
export const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];
// 조금 더 쫀쫀한 느낌 (KMAC 느낌)
export const EASE_SOFT = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── 공통 viewport 설정 ─────────────────────────────────────
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// ── Variants ───────────────────────────────────────────────

/** 기본 Slide-up Fade-in */
export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

/** 순차 지연용 — custom prop에 index 전달 */
export const slideUpStagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT, delay: i * 0.12 },
  }),
};

/** 컨테이너: 자식 요소들을 순서대로 띄움 */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** 좌측에서 슬라이드 (이미지/배지 등) */
export const slideRight = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

/** 단순 페이드 (배경, 오버레이 등) */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** 카드 hover — 미묘한 scale-up */
export const cardHover = {
  rest: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  hover: {
    y: -4,
    boxShadow: "0 12px 32px rgba(15,31,61,0.10)",
    transition: { duration: 0.3, ease: EASE_SOFT },
  },
};
