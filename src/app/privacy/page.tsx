import Link from "next/link";

const sections = [
  {
    num: "제1조",
    title: "개인정보의 수집 및 이용 목적",
    body: `에듀그리드(이하 '운영자')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는 다음 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.

① 교육 일정 상담 및 문의 응대
② 교육 프로그램 안내 및 일정 조율
③ 견적서·공문 등 행정 서류 발급 협조
④ 신규 프로그램 및 교육 자료 안내 (마케팅 수신 동의자에 한함)`,
  },
  {
    num: "제2조",
    title: "수집하는 개인정보 항목 및 수집 방법",
    body: `운영자는 서비스 제공을 위해 아래의 개인정보를 수집합니다.

[필수 항목]
· 학교명 / 기관명
· 담당자 연락처 (전화번호)
· 학년 / 연령대
· 예상 교육 인원
· 희망 교육 일자

[선택 항목]
· 담당자 연락처 (신규 프로그램 안내 수신 동의 시)
· 문의 상세 내용

[수집 방법]
홈페이지 내 '교육 일정 문의' 양식을 통해 정보주체가 직접 입력하는 방식으로 수집합니다.`,
  },
  {
    num: "제3조",
    title: "개인정보의 보유 및 이용 기간",
    body: `운영자는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.

① 교육 상담 목적으로 수집된 정보: 문의 처리 완료 후 즉시 파기
② 신규 프로그램 안내 수신 동의 정보: 수신 거부(동의 철회) 시 즉시 파기

단, 관계 법령에 따라 보존할 필요가 있는 경우에는 해당 기간 동안 보유합니다.

[전자상거래 등에서의 소비자보호에 관한 법률]
· 계약 또는 청약철회 등에 관한 기록: 5년
· 대금결제 및 재화 등의 공급에 관한 기록: 5년
· 소비자 불만 또는 분쟁 처리에 관한 기록: 3년

[통신비밀보호법]
· 서비스 이용 관련 로그 기록: 3개월`,
  },
  {
    num: "제4조",
    title: "개인정보의 제3자 제공",
    body: `운영자는 정보주체의 개인정보를 제1조에서 명시한 목적 범위 내에서만 처리하며, 정보주체의 동의 없이 제3자에게 제공하지 않습니다.

단, 아래의 경우에는 예외로 합니다.
· 정보주체가 사전에 동의한 경우
· 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차에 따라 국가기관의 요구가 있는 경우
· 통계 작성, 학술 연구 또는 시장 조사를 위하여 필요한 경우로서 특정 개인을 알아볼 수 없는 형태로 가공하여 제공하는 경우`,
  },
  {
    num: "제5조",
    title: "개인정보 처리의 위탁",
    body: `운영자는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다. 현재 별도의 위탁 처리 업체는 없으며, 향후 발생 시 사전 고지 후 동의를 받겠습니다.

위탁 업체가 생기는 경우 아래 사항을 고지합니다.
· 위탁 받는 자 (수탁자)
· 위탁하는 업무의 내용
· 위탁 기간`,
  },
  {
    num: "제6조",
    title: "개인정보의 파기 절차 및 방법",
    body: `운영자는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.

[파기 절차]
운영자는 파기 사유가 발생한 개인정보를 선정하고, 운영자의 개인정보 보호책임자 승인을 받아 개인정보를 파기합니다.

[파기 방법]
· 전자적 파일 형태로 저장된 정보: 기록을 재생할 수 없는 기술적 방법으로 삭제
· 종이에 출력된 정보: 분쇄기로 분쇄하거나 소각`,
  },
  {
    num: "제7조",
    title: "정보주체의 권리·의무 및 행사 방법",
    body: `정보주체는 운영자에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.

① 개인정보 열람 요구
② 오류 등이 있을 경우 정정 요구
③ 삭제 요구
④ 처리 정지 요구

권리 행사는 이메일(edugrid1649@gmail.com)을 통해 언제든 요청하실 수 있으며, 운영자는 지체 없이 조치하겠습니다. 정보주체는 개인정보 보호법 등 관계 법령을 위반하여 운영자가 처리하고 있는 정보주체 본인이나 타인의 개인정보 및 사생활을 침해하여서는 안 됩니다.`,
  },
  {
    num: "제8조",
    title: "자동 수집 장치의 설치·운영 및 거부에 관한 사항",
    body: `운영자는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 '쿠키(Cookie)'를 사용할 수 있습니다.

[쿠키란?]
웹사이트를 운영하는 데 이용되는 서버가 이용자의 컴퓨터 브라우저에 보내는 소량의 정보이며, 이용자의 PC 컴퓨터 내 하드디스크에 저장될 수 있습니다.

[쿠키의 사용 목적]
이용자의 접속 빈도나 방문 시간 등을 분석하여 서비스 개선 및 이용자 맞춤 정보 제공에 활용합니다.

[쿠키 설치·운영 및 거부]
이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.

단, 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.`,
  },
  {
    num: "제9조",
    title: "개인정보의 안전성 확보 조치",
    body: `운영자는 「개인정보 보호법」 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적·관리적 및 물리적 조치를 취하고 있습니다.

① 개인정보 취급 직원의 최소화 및 교육
   개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화하여 개인정보를 관리하는 대책을 시행합니다.

② 개인정보에 대한 접근 제한
   개인정보를 처리하는 데이터베이스 시스템에 대한 접근 권한의 부여·변경·말소를 통하여 개인정보에 대한 접근을 통제합니다.

③ 접속 기록의 보관 및 위변조 방지
   개인정보 처리 시스템에 접속한 기록을 최소 6개월 이상 보관·관리합니다.`,
  },
  {
    num: "제10조",
    title: "개인정보 보호책임자",
    body: `운영자는 개인정보 처리에 관한 업무를 총괄하여 책임지고, 정보주체의 개인정보 관련 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

▸ 개인정보 보호책임자
  · 성명: 명제환
  · 직책: 대표
  · 전화번호: 010-7934-9379
  · 이메일: edugrid1649@gmail.com

정보주체께서는 운영자의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만 처리, 피해 구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.

또한 개인정보 침해에 대한 신고나 상담이 필요하신 경우 아래 기관에 문의하실 수 있습니다.
· 개인정보분쟁조정위원회: (국번없이) 1833-6972 / www.kopico.go.kr
· 개인정보침해신고센터: (국번없이) 118 / privacy.kisa.or.kr
· 대검찰청: (국번없이) 1301 / www.spo.go.kr
· 경찰청: (국번없이) 182 / ecrm.cyber.go.kr`,
  },
  {
    num: "제11조",
    title: "개인정보 처리방침의 변경",
    body: `이 개인정보 처리방침은 2026년 4월 13일부터 적용됩니다.

개인정보 처리방침 내용의 추가·삭제 및 변경이 있을 경우에는 변경 사항의 시행 최소 7일 전부터 홈페이지 공지사항을 통하여 고지합니다. 다만, 정보주체의 권리에 중요한 변경이 있을 경우에는 최소 30일 전에 고지합니다.

· 공고일: 2026년 4월 13일
· 시행일: 2026년 4월 13일`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white" style={{ scrollBehavior: "smooth" }}>

      {/* 헤더 */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 z-10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-[#1B3F7A] font-bold text-[0.9375rem] tracking-tight hover:opacity-60 transition-opacity duration-150"
          >
            에듀그리드
          </Link>
          <span className="text-[0.6875rem] font-medium text-slate-400 tracking-[0.1em] uppercase">
            Privacy Policy
          </span>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">

        {/* 페이지 타이틀 */}
        <div className="mb-14 pb-10 border-b border-slate-100">
          <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[#1B3F7A] mb-4">
            Legal Document
          </p>
          <h1 className="text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-slate-900 mb-5">
            개인정보 처리방침
          </h1>
          <p className="text-[0.9375rem] text-slate-500 leading-[1.85] max-w-2xl">
            에듀그리드(이하 &apos;운영자&apos;)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고
            이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>
          <div className="mt-6 flex items-center gap-6 text-[0.75rem] text-slate-400">
            <span>공고일: 2026년 4월 13일</span>
            <span className="w-px h-3 bg-slate-200" />
            <span>시행일: 2026년 4월 13일</span>
          </div>
        </div>

        {/* 목차 */}
        <nav className="mb-14 p-6 bg-slate-50 rounded-[4px]">
          <p className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-slate-400 mb-4">
            목차
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
            {sections.map(({ num, title }) => (
              <li key={num}>
                <a
                  href={`#${num}`}
                  className="flex items-baseline gap-2 text-[0.8125rem] text-slate-500 hover:text-[#1B3F7A] transition-colors duration-150"
                >
                  <span className="text-[0.625rem] font-bold text-slate-300 flex-shrink-0">{num}</span>
                  <span>{title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 조항 */}
        <div className="flex flex-col divide-y divide-slate-100">
          {sections.map(({ num, title, body }) => (
            <div
              key={num}
              id={num}
              className="py-12 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-12 scroll-mt-20"
            >
              {/* 조항 번호 + 제목 */}
              <div className="flex-shrink-0">
                <span className="inline-block text-[0.625rem] font-bold tracking-[0.14em] text-[#1B3F7A] bg-[#1B3F7A]/8 px-2 py-0.5 rounded-[2px] mb-2">
                  {num}
                </span>
                <p className="text-[0.9375rem] font-semibold text-slate-800 leading-snug">
                  {title}
                </p>
              </div>

              {/* 조항 내용 */}
              <p className="text-[0.875rem] leading-[2.1] text-slate-500 whitespace-pre-line">
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* 홈으로 버튼 */}
        <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.75rem] text-slate-300">
            본 방침은 법령 또는 서비스 정책에 따라 변경될 수 있습니다.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-[#1B3F7A] text-[#1B3F7A] text-[0.8125rem] font-semibold tracking-wide rounded-[3px] hover:bg-[#1B3F7A] hover:text-white transition-all duration-200"
          >
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
              <path d="M4.5 1L1 5L4.5 9M1 5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            홈으로 돌아가기
          </Link>
        </div>
      </main>

      {/* 하단 */}
      <footer className="border-t border-slate-100 mt-8">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[0.6875rem] text-slate-300 tracking-wide">
            © 2026 에듀그리드. All rights reserved.
          </p>
          <p className="text-[0.6875rem] text-slate-300 tracking-wide">
            문의: eokkae0202@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}
