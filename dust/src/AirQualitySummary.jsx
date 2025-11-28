const AirQualitySummary = ({ grade, pm10, pm25, time, isLoading }) => {
  // --- 상수 및 유틸리티 함수 ---
  const AIR_GRADES = {
    좋음: { color: "text-green-600", bg: "bg-green-100", hex: "#4ade80" }, // hex 값 추가
    보통: { color: "text-yellow-600", bg: "bg-yellow-100", hex: "#f59e0b" }, // hex 값 추가
    나쁨: { color: "text-red-600", bg: "bg-red-100", hex: "#ef4444" }, // hex 값 추가
    매우나쁨: { color: "text-purple-600", bg: "bg-purple-100", hex: "#8b5cf6" }, // hex 값 추가
  };

  const gradeInfo = AIR_GRADES[grade] || AIR_GRADES["좋음"];

  if (isLoading) {
    return (
      <DashboardCard title="대기 현황 요약" className="h-full">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-500">데이터 로딩 중...</span>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="대기 현황 요약" className="h-full">
      <div className="flex flex-wrap items-start justify-between">
        <div className="mb-4 sm:mb-0">
          <p className={`text-5xl font-extrabold ${gradeInfo.color} mb-2`}>
            {grade}
          </p>
          <p className="text-xs text-gray-500">업데이트: {time}</p>
        </div>
        <div className="flex space-x-3 sm:space-x-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg min-w-[90px]">
            <p className="text-xs text-gray-500 mb-1">미세먼지 PM10</p>
            <p className="text-xl font-bold text-gray-800">
              {pm10}
              <span className="text-sm font-normal">㎍/㎥</span>
            </p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg min-w-[90px]">
            <p className="text-xs text-gray-500 mb-1">초미세먼지 PM2.5</p>
            <p className="text-xl font-bold text-gray-800">
              {pm25}
              <span className="text-sm font-normal">㎍/㎥</span>
            </p>
          </div>
        </div>
        <div className="hidden lg:block text-blue-500 mt-1 ml-4">
          <Cloud className="w-12 h-12" />
        </div>
      </div>
    </DashboardCard>
  );
};

export default AirQualitySummary;
