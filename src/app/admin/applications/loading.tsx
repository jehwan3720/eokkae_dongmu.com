export default function ApplicationsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 animate-pulse">

      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="h-2.5 w-20 bg-gray-200 rounded mb-2.5" />
          <div className="h-7 w-36 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-20 bg-gray-200 rounded-[3px]" />
          <div className="h-9 w-20 bg-gray-200 rounded-[3px]" />
          <div className="h-9 w-20 bg-gray-200 rounded-[3px]" />
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-[4px] px-4 py-4 sm:px-6 sm:py-5" style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}>
            <div className="h-2.5 w-8 bg-gray-200 rounded mb-3" />
            <div className="h-8 w-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div className="flex gap-1 mb-4 border-b border-[#E8EAED]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 w-16 bg-gray-200 rounded-t-[3px]" />
        ))}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-[4px] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(15,31,61,0.06)" }}>
        <div className="flex gap-6 px-5 py-3 border-b border-[#E8EAED] bg-[#F8F9FB]">
          {[12, 20, 12, 16, 18, 10].map((w, i) => (
            <div key={i} className="h-2.5 bg-gray-200 rounded flex-shrink-0" style={{ width: `${w * 4}px` }} />
          ))}
        </div>
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex gap-6 px-5 py-4 border-b border-[#F0F1F3] last:border-0 items-center">
            <div className="h-3 w-12 bg-gray-200 rounded flex-shrink-0" />
            <div className="h-3 w-20 bg-gray-200 rounded flex-shrink-0" />
            <div className="h-3 w-12 bg-gray-200 rounded flex-shrink-0" />
            <div className="h-3 w-16 bg-gray-200 rounded flex-shrink-0" />
            <div className="h-3 w-14 bg-gray-200 rounded flex-shrink-0" />
            <div className="h-6 w-14 bg-gray-200 rounded-full flex-shrink-0" />
          </div>
        ))}
      </div>

    </div>
  );
}
