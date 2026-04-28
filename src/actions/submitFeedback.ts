"use server";

import { Resend } from "resend";

const FROM = process.env.CONTACT_FROM_EMAIL    ?? "EDUGRID <onboarding@resend.dev>";
const TO   = process.env.CONTACT_RECEIVE_EMAIL ?? "edugrid1649@gmail.com";

export interface FeedbackInput {
  category: string;
  name: string;
  email: string;
  content: string;
}

function feedbackHtml(d: FeedbackInput): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:'Apple SD Gothic Neo',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:#1B3F7A;padding:28px 40px;">
          <p style="margin:0;color:#C5D8F0;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">Feedback</p>
          <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700;">[${d.category}] 의견이 접수되었습니다</h1>
        </td></tr>
        <tr><td style="padding:32px 40px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["분류",   d.category],
              ["이름",   d.name  || "익명"],
              ["이메일", d.email || "미입력"],
            ].map(([label, value]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #F0F1F3;width:100px;vertical-align:top;">
                <span style="font-size:12px;font-weight:600;color:#8A95A3;">${label}</span>
              </td>
              <td style="padding:10px 0 10px 16px;border-bottom:1px solid #F0F1F3;vertical-align:top;">
                <span style="font-size:14px;color:#1A2535;font-weight:500;">${value}</span>
              </td>
            </tr>`).join("")}
            <tr><td colspan="2" style="padding:20px 0 0;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#8A95A3;">내용</p>
              <p style="margin:0;font-size:14px;color:#1A2535;line-height:1.85;white-space:pre-line;">${d.content}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#F4F5F7;padding:20px 40px;border-top:1px solid #E8EAED;">
          <p style="margin:0;font-size:11px;color:#B0B8C1;line-height:1.7;">에듀그리드 · 학술 기반 생태 체험 교육 프로그램<br />본 메일은 홈페이지 의견 접수 시스템을 통해 자동 발송되었습니다.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function submitFeedback(input: FeedbackInput): Promise<{ ok: true } | { error: string }> {
  if (!input.content.trim()) return { error: "내용을 입력해주세요." };

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:    FROM,
      to:      TO,
      subject: `[에듀그리드 ${input.category}] ${input.name || "익명"}`,
      html:    feedbackHtml(input),
    });
    return { ok: true };
  } catch (err) {
    console.error("[submitFeedback] 이메일 전송 실패:", err);
    return { error: "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
