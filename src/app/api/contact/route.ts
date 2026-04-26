import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const FROM = process.env.CONTACT_FROM_EMAIL    ?? "EDUGRID <onboarding@resend.dev>";
const TO   = process.env.CONTACT_RECEIVE_EMAIL ?? "edugrid1649@gmail.com";

/* ── 관리자 수신 이메일 HTML ── */
function adminHtml(d: Record<string, string>) {
  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:'Apple SD Gothic Neo',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- 헤더 -->
        <tr>
          <td style="background:#1B3F7A;padding:28px 40px;">
            <p style="margin:0;color:#C5D8F0;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">New Inquiry</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em;">교육 일정 문의가 접수되었습니다</h1>
          </td>
        </tr>

        <!-- 본문 -->
        <tr>
          <td style="padding:32px 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                ["학교명 / 기관명", d.school],
                ["담당자 연락처",   d.contact],
                ["담당자 이메일",   d.email || "미입력"],
                ["학년 / 연령",    d.grade],
                ["예상 인원",      d.headcount + "명"],
                ["희망 교육 일자", d.date || "미선택"],
              ].map(([label, value]) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #F0F1F3;width:140px;vertical-align:top;">
                  <span style="font-size:12px;font-weight:600;color:#8A95A3;letter-spacing:0.05em;">${label}</span>
                </td>
                <td style="padding:10px 0 10px 16px;border-bottom:1px solid #F0F1F3;vertical-align:top;">
                  <span style="font-size:14px;color:#1A2535;font-weight:500;">${value}</span>
                </td>
              </tr>`).join("")}
              ${d.message ? `
              <tr>
                <td colspan="2" style="padding:16px 0 0;">
                  <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#8A95A3;letter-spacing:0.05em;">문의 상세 내용</p>
                  <p style="margin:0;font-size:14px;color:#1A2535;line-height:1.8;white-space:pre-line;">${d.message}</p>
                </td>
              </tr>` : ""}
            </table>
          </td>
        </tr>

        <!-- 마케팅 동의 여부 -->
        <tr>
          <td style="padding:0 40px 24px;">
            <p style="margin:0;font-size:12px;color:#B0B8C1;">
              마케팅 수신 동의: <strong>${d.marketing === "true" ? "동의" : "미동의"}</strong>
            </p>
          </td>
        </tr>

        <!-- 푸터 -->
        <tr>
          <td style="background:#F4F5F7;padding:20px 40px;border-top:1px solid #E8EAED;">
            <p style="margin:0;font-size:11px;color:#B0B8C1;line-height:1.7;">
              에듀그리드 · 학술 기반 생태 체험 교육 프로그램<br />
              본 메일은 홈페이지 문의 양식을 통해 자동 발송되었습니다.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── 선생님 자동 회신 HTML ── */
function replyHtml(d: Record<string, string>) {
  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:'Apple SD Gothic Neo',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- 헤더 -->
        <tr>
          <td style="background:#1B3F7A;padding:28px 40px;">
            <p style="margin:0;color:#C5D8F0;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">에듀그리드</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em;">문의가 정상 접수되었습니다</h1>
          </td>
        </tr>

        <!-- 인사말 -->
        <tr>
          <td style="padding:32px 40px 24px;">
            <p style="margin:0 0 16px;font-size:15px;color:#1A2535;line-height:1.8;">
              안녕하세요, <strong>${d.school}</strong> 선생님.<br />
              에듀그리드 생태 교육 문의를 남겨주셔서 감사합니다.
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#5A6472;line-height:1.9;">
              담당자가 확인 후 <strong>영업일 기준 24시간 이내</strong>에 연락처(<strong>${d.contact}</strong>)로 연락드리겠습니다.
            </p>

            <!-- 접수 내용 요약 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FB;border-radius:4px;border:1px solid #E8EAED;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#8A95A3;letter-spacing:0.12em;text-transform:uppercase;">접수 내용 요약</p>
                ${[
                  ["학년 / 연령", d.grade],
                  ["예상 인원",   d.headcount + "명"],
                  ["희망 일자",   d.date || "미선택"],
                ].map(([label, value]) => `
                <p style="margin:0 0 6px;font-size:13px;color:#5A6472;">
                  <span style="color:#8A95A3;min-width:80px;display:inline-block;">${label}</span>
                  <strong style="color:#1A2535;">${value}</strong>
                </p>`).join("")}
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="margin:0;font-size:13px;color:#8A95A3;line-height:1.8;">
              추가 문의 사항이 있으시면 아래 이메일로 연락 주세요.<br />
              <a href="mailto:${TO}" style="color:#1B3F7A;font-weight:600;">${TO}</a>
            </p>
          </td>
        </tr>

        <!-- 푸터 -->
        <tr>
          <td style="background:#F4F5F7;padding:20px 40px;border-top:1px solid #E8EAED;">
            <p style="margin:0;font-size:11px;color:#B0B8C1;line-height:1.7;">
              에듀그리드 · 강사비 0원 · 키트비 10,000원 · 무관리 올인원 키트<br />
              본 메일은 자동 발송 메일입니다. 직접 회신하지 마세요.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── POST 핸들러 ── */
export async function POST(req: NextRequest) {
  // Resend 인스턴스를 핸들러 내부에서 생성 (빌드 타임 초기화 방지)
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await req.json() as Record<string, string>;
    const { school, contact, email, grade, headcount, date, message, marketing } = body;

    // 필수값 서버 검증
    if (!school || !contact || !grade || !headcount || !date) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const data = { school, contact, email: email ?? "", grade, headcount, date, message: message ?? "", marketing: marketing ?? "false" };

    // 1) 관리자 수신 메일
    await resend.emails.send({
      from:    FROM,
      to:      TO,
      subject: `[에듀그리드 문의] ${school} — ${grade} ${headcount}명`,
      html:    adminHtml(data),
    });

    // 2) 선생님 자동 회신 (이메일 입력 시에만)
    if (email && email.includes("@")) {
      await resend.emails.send({
        from:    FROM,
        to:      email,
        subject: "[에듀그리드] 교육 문의가 정상 접수되었습니다",
        html:    replyHtml(data),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] 이메일 전송 오류:", err);
    return NextResponse.json({ error: "이메일 전송 중 오류가 발생했습니다." }, { status: 500 });
  }
}
