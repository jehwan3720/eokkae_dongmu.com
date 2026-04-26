"use server";

import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/service";

const FROM = process.env.CONTACT_FROM_EMAIL    ?? "EDUGRID <onboarding@resend.dev>";
const TO   = process.env.CONTACT_RECEIVE_EMAIL ?? "edugrid1649@gmail.com";

/* ── 입력 타입 ── */
export interface ApplicationInput {
  school: string;
  contact_name: string;
  contact: string;
  email: string;
  grade: string;
  headcount: string;
  date: string;
  message: string;
  marketing: string; // "true" | "false"
}

/* ──────────────────────────────────────────────────────────
   [수정 1] 필드 기본값 정규화
   DB의 NOT NULL 컬럼에 빈 값이 들어오면 기본값으로 대체
────────────────────────────────────────────────────────── */
function normalize(input: ApplicationInput) {
  return {
    school:         input.school?.trim()        || "미기입",
    contact_name:   input.contact_name?.trim()  || "미기입",
    contact:        input.contact?.trim()       || "000-0000-0000",
    email:          input.email?.trim()         || null,
    grade:          input.grade                 || "미기입",
    headcount:      parseInt(input.headcount, 10) || 0,
    preferred_date: input.date                  || new Date().toISOString().slice(0, 10),
    message:        input.message?.trim()       || null,
    marketing:      input.marketing === "true",
  };
}

/* ── 관리자 수신 이메일 ── */
function adminHtml(d: ApplicationInput & { id: string }) {
  const n = normalize(d);
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:'Apple SD Gothic Neo',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:#1B3F7A;padding:28px 40px;">
          <p style="margin:0;color:#C5D8F0;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">New Inquiry</p>
          <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700;">교육 일정 문의가 접수되었습니다</h1>
        </td></tr>
        <tr><td style="padding:32px 40px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["접수 ID",       d.id.slice(0, 8).toUpperCase()],
              ["학교명 / 기관명", n.school],
              ["담당자 성함",    n.contact_name],
              ["담당자 연락처",   n.contact],
              ["담당자 이메일",   n.email || "미입력"],
              ["학년 / 연령",    n.grade],
              ["예상 인원",      n.headcount + "명"],
              ["희망 교육 일자", n.preferred_date],
            ].map(([label, value]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #F0F1F3;width:140px;vertical-align:top;">
                <span style="font-size:12px;font-weight:600;color:#8A95A3;">${label}</span>
              </td>
              <td style="padding:10px 0 10px 16px;border-bottom:1px solid #F0F1F3;vertical-align:top;">
                <span style="font-size:14px;color:#1A2535;font-weight:500;">${value}</span>
              </td>
            </tr>`).join("")}
            ${n.message ? `
            <tr><td colspan="2" style="padding:16px 0 0;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#8A95A3;">문의 상세 내용</p>
              <p style="margin:0;font-size:14px;color:#1A2535;line-height:1.8;white-space:pre-line;">${n.message}</p>
            </td></tr>` : ""}
          </table>
        </td></tr>
        <tr><td style="padding:0 40px 24px;">
          <p style="margin:0;font-size:12px;color:#B0B8C1;">마케팅 수신 동의: <strong>${d.marketing === "true" ? "동의" : "미동의"}</strong></p>
        </td></tr>
        <tr><td style="background:#F4F5F7;padding:20px 40px;border-top:1px solid #E8EAED;">
          <p style="margin:0;font-size:11px;color:#B0B8C1;line-height:1.7;">에듀그리드 · 학술 기반 생태 체험 교육 프로그램<br />본 메일은 홈페이지 문의 양식을 통해 자동 발송되었습니다.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/* ── 선생님 자동 회신 이메일 ── */
function replyHtml(d: ApplicationInput) {
  const n = normalize(d);
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:'Apple SD Gothic Neo',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:#1B3F7A;padding:28px 40px;">
          <p style="margin:0;color:#C5D8F0;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">에듀그리드</p>
          <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700;">문의가 정상 접수되었습니다</h1>
        </td></tr>
        <tr><td style="padding:32px 40px 24px;">
          <p style="margin:0 0 16px;font-size:15px;color:#1A2535;line-height:1.8;">
            안녕하세요, <strong>${n.school}</strong> 선생님.<br />에듀그리드 생태 교육 문의를 남겨주셔서 감사합니다.
          </p>
          <p style="margin:0 0 24px;font-size:14px;color:#5A6472;line-height:1.9;">
            담당자가 확인 후 <strong>영업일 기준 24시간 이내</strong>에 연락처(<strong>${n.contact}</strong>)로 연락드리겠습니다.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FB;border-radius:4px;border:1px solid #E8EAED;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#8A95A3;letter-spacing:0.12em;text-transform:uppercase;">접수 내용 요약</p>
              ${[
                ["학년 / 연령", n.grade],
                ["예상 인원",   n.headcount + "명"],
                ["희망 일자",   n.preferred_date],
              ].map(([label, value]) => `
              <p style="margin:0 0 6px;font-size:13px;color:#5A6472;">
                <span style="color:#8A95A3;min-width:80px;display:inline-block;">${label}</span>
                <strong style="color:#1A2535;">${value}</strong>
              </p>`).join("")}
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 40px 32px;">
          <p style="margin:0;font-size:13px;color:#8A95A3;line-height:1.8;">
            추가 문의: <a href="mailto:${TO}" style="color:#1B3F7A;font-weight:600;">${TO}</a>
          </p>
        </td></tr>
        <tr><td style="background:#F4F5F7;padding:20px 40px;border-top:1px solid #E8EAED;">
          <p style="margin:0;font-size:11px;color:#B0B8C1;line-height:1.7;">
            에듀그리드 · 강사비 0원 · 키트비 10,000원<br />본 메일은 자동 발송 메일입니다. 직접 회신하지 마세요.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/* ── Discord Webhook 알림 ── */
async function notifyDiscord(d: ReturnType<typeof normalize>, id: string) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url || url.includes("PASTE")) {
    console.log("[Discord] DISCORD_WEBHOOK_URL 미설정 — 스킵");
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "📬 새 교육 문의 접수",
          color: 0x2ecc71,
          fields: [
            { name: "학교명",        value: d.school,           inline: true },
            { name: "담당자 성함",    value: d.contact_name,     inline: true },
            { name: "담당자 연락처",  value: d.contact,          inline: true },
            { name: "학년 / 연령",   value: d.grade,            inline: true },
            { name: "예상 인원",      value: d.headcount + "명", inline: true },
            { name: "희망 교육 일자", value: d.preferred_date,   inline: true },
            { name: "상태",          value: "⏳ 대기 중",        inline: false },
            ...(d.message ? [{ name: "📝 문의 상세 내용", value: d.message.slice(0, 1024), inline: false }] : []),
          ],
          footer: { text: `접수 ID: ${id.slice(0, 8).toUpperCase()} · 에듀그리드 관리 시스템` },
          timestamp: new Date().toISOString(),
        }],
      }),
    });
    if (!res.ok) {
      console.error(`[Discord] 전송 실패 — HTTP ${res.status}:`, await res.text());
    } else {
      console.log("[Discord] 알림 전송 완료");
    }
  } catch (err) {
    console.error("[Discord] 전송 중 예외 발생:", err);
  }
}

/* ──────────────────────────────────────────────────────────
   메인 Server Action
────────────────────────────────────────────────────────── */
export async function submitApplication(input: ApplicationInput) {
  console.log("[submitApplication] 접수 시작:", {
    school: input.school || "(빈값→기본값 사용)",
    grade:  input.grade,
    date:   input.date,
  });

  // [수정 1] 필수 검증 완화 — 빈 값은 normalize()에서 기본값으로 처리
  // grade, date는 UI에서 선택 필수이므로 유지
  if (!input.grade || !input.date) {
    console.error("[submitApplication] 검증 실패 — grade 또는 date 없음");
    return { error: "학년과 희망 교육 일자는 필수 항목입니다." };
  }

  // 기본값 적용
  const normalized = normalize(input);
  console.log("[submitApplication] 정규화 완료:", normalized);

  // ── Step 1: Supabase INSERT ──────────────────────────────
  let applicationId: string;
  try {
    const supabase = createServiceClient();
    const { data, error: dbError } = await supabase
      .from("applications")
      .insert(normalized)
      .select("application_id")
      .single();

    if (dbError) {
      console.error("[submitApplication] ❌ DB INSERT 실패:", dbError);
      return { error: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
    }

    applicationId = data.application_id as string;
    console.log("[submitApplication] ✅ DB INSERT 성공 — ID:", applicationId.slice(0, 8).toUpperCase());

    // 최초 status_history 기록
    const { error: histError } = await supabase.from("status_history").insert({
      application_id: applicationId,
      from_status:    null,
      to_status:      "pending",
    });
    if (histError) {
      console.error("[submitApplication] ⚠️ status_history INSERT 실패 (비치명적):", histError);
    }
  } catch (err) {
    console.error("[submitApplication] ❌ DB 단계 예외:", err);
    return { error: "데이터베이스 연결 오류가 발생했습니다." };
  }

  // ── Step 2: Resend 이메일 발송 ───────────────────────────
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 관리자 수신 메일 (TO = 환경변수 고정 주소)
    const adminResult = await resend.emails.send({
      from:    FROM,
      to:      TO,
      subject: `[에듀그리드 문의] ${normalized.school} — ${normalized.grade} ${normalized.headcount}명`,
      html:    adminHtml({ ...input, id: applicationId }),
    });
    console.log("[Resend] ✅ 관리자 메일 발송 완료:", adminResult.data?.id ?? adminResult.error);

    // ──────────────────────────────────────────────────────
    // [수정 2] 선생님 자동 회신 — Resend 샌드박스 모드 대응
    //
    // 샌드박스(onboarding@resend.dev)는 Resend 가입 이메일로만 발송 가능.
    // 도메인 인증 완료 전까지 선생님 이메일 대신 관리자 이메일(TO)로 고정.
    //
    // TODO: 도메인 인증 후 아래 주석 해제 + 그 위 줄 제거
    // ──────────────────────────────────────────────────────
    if (normalized.email) {
      // [샌드박스 대응] 실제 선생님 이메일 대신 관리자 수신함으로 발송
      const replyTarget = TO; // 도메인 인증 후: normalized.email
      const replyResult = await resend.emails.send({
        from:    FROM,
        to:      replyTarget,
        subject: `[에듀그리드] 자동 회신 테스트 — ${normalized.school} 선생님께 발송 예정`,
        html:    replyHtml(input),
      });
      console.log(`[Resend] ✅ 자동 회신 발송 완료 (→ ${replyTarget}):`, replyResult.data?.id ?? replyResult.error);
    } else {
      console.log("[Resend] 이메일 미입력 — 자동 회신 스킵");
    }
  } catch (err) {
    // 이메일 실패는 DB 저장 완료 후이므로 사용자에게는 성공 반환
    console.error("[Resend] ❌ 이메일 발송 예외 (비치명적):", err);
  }

  // ── Step 3: Discord Webhook ──────────────────────────────
  await notifyDiscord(normalized, applicationId);

  console.log("[submitApplication] 🎉 접수 완료 — ID:", applicationId.slice(0, 8).toUpperCase());
  return { ok: true, id: applicationId };
}
