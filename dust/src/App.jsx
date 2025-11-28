import React, { useState, useEffect, useCallback } from "react";
import {
  Wind,
  Heart,
  AlertCircle,
  Cloud,
  MapPin,
  Bell,
  User,
  ChevronRight,
  RefreshCw,
  BarChart3,
  X, // 알림 닫기 버튼용
  Zap, // KHAI 차트 설명용
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // ⭐ Recharts import 추가

// --- 상수 및 유틸리티 함수 ---
const AIR_GRADES = {
  좋음: {
    color: "text-green-600",
    bg: "bg-green-100",
    hex: "getGradeFromPM10",
  }, // hex 값 추가
  보통: { color: "text-yellow-600", bg: "bg-yellow-100", hex: "#f59e0b" }, // hex 값 추가
  나쁨: { color: "text-red-600", bg: "bg-red-100", hex: "#ef4444" }, // hex 값 추가
  매우나쁨: { color: "text-purple-600", bg: "bg-purple-100", hex: "#8b5cf6" }, // hex 값 추가
};

const getGradeFromPM10 = (pm10) => {
  if (pm10 <= 30) return "좋음";
  if (pm10 <= 80) return "보통";
  if (pm10 <= 150) return "나쁨";
  return "매우나쁨";
};

// ⭐ KHAI 등급 유틸리티 함수 추가
const getKhaiGrade = (khai) => {
  if (khai <= 50) return "좋음";
  if (khai <= 100) return "보통";
  if (khai <= 250) return "나쁨";
  return "매우나쁨";
};

// ⭐ API 응답 데이터를 그래프 형식으로 변환하는 함수 추가
const transformDataForChart = (items) => {
  if (!items || items.length === 0) return [];

  // 그래프를 시간 순서대로 표시하기 위해 배열을 뒤집습니다.
  const reversedItems = [...items].reverse();

  return reversedItems.map((item) => {
    const khaiValue = parseInt(item.khaiValue) || 0;

    // dataTime (예: 2025-11-27 15:00)에서 시간 부분만 추출
    const dataTime = item.dataTime ? item.dataTime.split(" ")[1] : "N/A";
    const displayTime = dataTime.substring(0, 5); // 15:00

    return {
      time: displayTime,
      khai: khaiValue,
      grade: getKhaiGrade(khaiValue),
      pm25: parseInt(item.pm25Value) || 0,
      pm10: parseInt(item.pm10Value) || 0,
      "좋음 기준": 50,
      "보통 기준": 100,
    };
  });
};

// --- 공통 컴포넌트 ---
const DashboardCard = ({ title, icon: Icon, children, className = "" }) => (
  <div
    className={`p-6 bg-white rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl ${className}`}
  >
    {title && (
      <div className="flex items-center mb-4 text-gray-700">
        {Icon && <Icon className="w-5 h-5 mr-2 text-blue-500" />}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
    )}
    {children}
  </div>
);

const GradeBadge = ({ grade }) => {
  const gradeInfo = AIR_GRADES[grade] || AIR_GRADES["보통"];
  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${gradeInfo.bg} ${gradeInfo.color} whitespace-nowrap`}
    >
      {grade}
    </span>
  );
};

const AirQualitySummary = ({ grade, pm10, pm25, time, isLoading }) => {
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

// ⭐ HourlyForecast 컴포넌트를 KhaiIndexChart로 대체하고 기존 코드는 삭제합니다.
const KhaiIndexChart = ({ chartData, isLoading }) => {
  // 그래프 선의 색상을 현재(가장 최근) 등급에 따라 동적으로 결정
  const getStrokeColor = (khai) => {
    const grade = getKhaiGrade(khai);
    return AIR_GRADES[grade].hex;
  };

  // Custom Tooltip (마우스 올렸을 때 나타나는 정보 창)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-md text-sm">
          <p className="font-bold text-gray-800 mb-1">시간: {data.time}</p>
          <p className="text-gray-600">
            KHAI 지수: <span className="font-semibold">{data.khai}</span>
          </p>
          <p className="text-gray-600">
            PM2.5: <span className="font-semibold">{data.pm25}㎍/㎥</span>
          </p>
          <p className="text-gray-600">
            등급: <GradeBadge grade={data.grade} />
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading || chartData.length < 2) {
    return (
      <DashboardCard
        title="통합대기질 지수 추이 (24시간)"
        icon={BarChart3}
        className="h-full"
      >
        <div className="flex items-center justify-center h-64 text-gray-500">
          {isLoading ? (
            <>
              <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mr-3" />
              <span>데이터 로딩 중...</span>
            </>
          ) : (
            <span>24시간 추이 데이터를 불러올 수 없습니다.</span>
          )}
        </div>
      </DashboardCard>
    );
  }

  // Y축 도메인 동적 설정 (최대값보다 20 높게 설정)
  const yDomain = [0, Math.max(150, ...chartData.map((d) => d.khai)) + 20];
  const latestKhai = chartData[chartData.length - 1].khai;
  const lineStrokeColor = getStrokeColor(latestKhai);

  return (
    <DashboardCard
      title="통합대기질 지수 추이 (24시간)"
      icon={BarChart3}
      className="h-full"
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e0e0e0"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              interval={Math.max(0, Math.floor(chartData.length / 8) - 1)}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              dataKey="khai"
              tick={{ fontSize: 11 }}
              domain={yDomain}
              allowDataOverflow={true}
              label={{
                value: "KHAI",
                angle: -90,
                position: "insideLeft",
                offset: -5,
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* 실제 KHAI 값 라인 */}
            <Line
              type="monotone"
              dataKey="khai"
              stroke={lineStrokeColor}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 5,
                fill: lineStrokeColor,
                stroke: "white",
                strokeWidth: 2,
              }}
            />

            {/* 기준선: 좋음(50) 및 보통(100) */}
            <Line
              type="monotone"
              dataKey="좋음 기준"
              stroke="#10b981"
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="보통 기준"
              stroke="#f59e0b"
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-gray-500 mt-2 flex items-center space-x-2">
        <Zap className="w-3 h-3 text-blue-500" />
        <p>
          통합대기질지수(KHAI)는 미세먼지 등 6가지 오염도를 종합한 수치입니다.
          (0-50: 좋음, 51-100: 보통)
        </p>
      </div>
    </DashboardCard>
  );
};

const RecommendationCard = ({
  title,
  description,
  icon: Icon,
  isSafe = true,
}) => {
  const color = isSafe
    ? "text-green-500 bg-green-50"
    : "text-red-500 bg-red-50";
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md transition-shadow duration-200 hover:shadow-lg cursor-pointer">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl mr-4 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  );
};

const HealthTipItem = ({ title, description }) => (
  <div className="p-4 bg-gray-50 rounded-lg mb-2 last:mb-0">
    <p className="text-sm font-semibold text-gray-800">{title}</p>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

const Header = ({ onRefresh, isRefreshing }) => (
  <header className="bg-white shadow-sm sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800 flex items-center">
        <Wind className="h-6 w-6 text-blue-500 mr-2" />
        Air-Life Guide Dashboard
      </h1>
      <div className="flex items-center space-x-4">
        <button
          className={`p-2 text-gray-500 hover:text-blue-600 transition duration-150 rounded-full hover:bg-gray-100 ${
            isRefreshing ? "animate-spin" : ""
          }`}
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-blue-600 transition duration-150 rounded-full hover:bg-gray-100">
          <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  </header>
);

// --- 커스텀 아이콘 ---
const MaskIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.542 0 1.054.12 1.516.331l.078.035a4.375 4.375 0 013.882 0l.078-.035c.462-.211.974-.331 1.516-.331a.75.75 0 01.75.75v3.425a.75.75 0 01-.257.545l-4.507 4.145c-.477.442-.816.64-1.298.64H12c-.482 0-.821-.198-1.298-.64l-4.507-4.145a.75.75 0 01-.257-.545V4.69a.75.75 0 01.75-.75zM12 15a4 4 0 00-4 4v.25a.75.75 0 00.75.75h6.5a.75.75 0 00.75-.75V19a4 4 0 00-4-4z"
    />
  </svg>
);

const WaterIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>
);

const AirVentIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v18m0-18h7.5a2.25 2.25 0 012.25 2.25v.75m-9-3h-7.5A2.25 2.25 0 003 5.25v.75M12 21h7.5a2.25 2.25 0 002.25-2.25v-.75m-9 3h-7.5A2.25 2.25 0 013 18.75v-.75"
    />
  </svg>
);

// --- NotificationSystem 컴포넌트 ---
const NotificationSystem = ({ message, type, onClose }) => {
  if (!message) return null;

  let bgColor, iconColor, Icon;

  switch (type) {
    case "warning":
      bgColor = "bg-yellow-500";
      iconColor = "text-yellow-100";
      Icon = AlertCircle;
      break;
    case "error":
      bgColor = "bg-red-600";
      iconColor = "text-red-100";
      Icon = AlertCircle;
      break;
    default:
      bgColor = "bg-blue-500";
      iconColor = "text-blue-100";
      Icon = Bell;
  }

  // fadeInSlideUp 애니메이션이 CSS 파일에 정의되어 있다고 가정합니다.
  return (
    <div className="fixed top-20 right-5 z-50 max-w-sm w-full">
      <div
        className={`flex items-center p-4 rounded-lg shadow-2xl text-white transform transition-all duration-500 ease-in-out fadeInSlideUp ${bgColor}`}
        role="alert"
      >
        <div className={`p-2 rounded-full ${iconColor} bg-opacity-20 mr-3`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="font-medium flex-grow">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// --- UserSettings 컴포넌트 ---
const UserSettings = ({ isAlertSettingOn, setIsAlertSettingOn }) => {
  const SettingItem = ({
    title,
    description,
    icon: Icon,
    isToggle = false,
  }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center">
        <Icon className="w-4 h-4 mr-3 text-gray-500" />
        <div>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      {isToggle ? (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAlertSettingOn}
            onChange={() => setIsAlertSettingOn(!isAlertSettingOn)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-400" />
      )}
    </div>
  );

  return (
    <DashboardCard title="사용자 설정" className="h-full">
      <SettingItem
        title="알림 설정"
        description="미세먼지 경보 및 예보 알림"
        icon={Bell}
        isToggle={true}
      />
      <SettingItem
        title="위치 설정"
        description="현재 위치 및 관심 지역 관리"
        icon={MapPin}
      />
      <SettingItem
        title="건강 프로필"
        description="민감군 및 선호 활동 설정"
        icon={Heart}
      />
    </DashboardCard>
  );
};

// --- 메인 App 컴포넌트 ---
export default function App() {
  // ⭐ 1. 상태 관리: 기존 상태
  const [airData, setAirData] = useState({
    grade: "보통",
    pm10: "45",
    pm25: "28",
    time: "오후 3:23:46",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiKeyWarning, setApiKeyWarning] = useState(true);

  // ⭐ 1. 상태 관리: 추가된 알림 및 설정 상태 및 그래프 데이터 상태 추가
  const [notification, setNotification] = useState({
    message: "",
    type: "default",
  });
  const [isAlertSettingOn, setIsAlertSettingOn] = useState(true);
  const [khaiChartData, setKhaiChartData] = useState([]); // ⭐ 그래프 데이터 상태 추가

  // 🚨 API 키는 여기에 정의되어 있습니다.
  const SERVICE_KEY =
    "7c766ef46d11aaf55f454e201d707bec4da8d614b11ed1132ebfbe21e10c88bd";

  // ⭐ API 호출 함수: 24시간 데이터를 요청하고 SERVICE_KEY를 사용하도록 수정
  const fetchAllAirQualityData = useCallback(
    async (stationName = "종로구") => {
      // API 키가 비어있는지 확인
      if (!SERVICE_KEY) {
        console.warn(
          "❌ SERVICE_KEY가 비어있어 API 호출을 건너뛰고 샘플 데이터를 사용합니다."
        );
        return null;
      }

      try {
        // API 호출 URL: numOfRows를 24로 설정하여 24시간 데이터를 요청
        const apiUrl = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${encodeURIComponent(
          stationName
        )}&dataTerm=DAILY&pageNo=1&numOfRows=24&returnType=json&serviceKey=${SERVICE_KEY}`;

        console.log("🌐 24시간 API 호출 시작:", stationName);
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.response?.body?.items) {
          // 24시간 데이터 배열 전체를 반환
          return data.response.body.items;
        }

        throw new Error("데이터를 가져올 수 없습니다.");
      } catch (error) {
        console.error("❌ 전체 API 호출 오류:", error);
        return null;
      }
    },
    [SERVICE_KEY]
  );

  // ⭐ 2. 새로고침 핸들러 (API 호출 및 그래프 데이터 처리 로직 포함)
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setIsLoading(true);

    setNotification({ message: "" });

    const allData = await fetchAllAirQualityData("종로구"); // 24시간 데이터 가져오기

    let newAirData;

    if (allData && allData.length > 0) {
      console.log(allData);
      // 1. 그래프 데이터 설정: 24시간 데이터를 KHAI 차트 데이터로 변환
      const transformedChartData = transformDataForChart(allData);
      setKhaiChartData(transformedChartData); // ⭐ 그래프 상태 업데이트

      // 2. 대기 현황 요약 데이터 설정 (가장 최근 데이터: 배열의 첫 번째 항목)
      const realtimeData = allData[0];
      const pm10Value = parseInt(realtimeData.pm10Value) || 0;
      const pm25Value = parseInt(realtimeData.pm25Value) || 0;
      const grade = getGradeFromPM10(pm10Value);

      newAirData = {
        grade: grade,
        pm10: pm10Value.toString(),
        pm25: pm25Value.toString(),
        time: realtimeData.dataTime
          ? realtimeData.dataTime.split(" ")[1] // 시간 부분만 추출
          : new Date().toLocaleTimeString("ko-KR"),
      };
      setApiKeyWarning(false); // API 호출 성공 시 경고 제거
    } else {
      // 샘플 데이터 사용 로직 (기존 로직 유지)
      const samplePM10 = Math.floor(Math.random() * 100) + 20;
      const samplePM25 = Math.floor(samplePM10 * 0.6);
      const grade = getGradeFromPM10(samplePM10);

      newAirData = {
        grade: grade,
        pm10: samplePM10.toString(),
        pm25: samplePM25.toString(),
        time: new Date().toLocaleTimeString("ko-KR"),
      };

      // 그래프 데이터를 위한 샘플 (5개 항목)
      const sampleChart = [
        {
          time: "09:00",
          khai: 40,
          grade: "좋음",
          pm25: 10,
          pm10: 20,
          "좋음 기준": 50,
          "보통 기준": 100,
        },
        {
          time: "12:00",
          khai: 55,
          grade: "보통",
          pm25: 20,
          pm10: 40,
          "좋음 기준": 50,
          "보통 기준": 100,
        },
        {
          time: "15:00",
          khai: 70,
          grade: "보통",
          pm25: 35,
          pm10: 60,
          "좋음 기준": 50,
          "보통 기준": 100,
        },
        {
          time: "18:00",
          khai: 110,
          grade: "나쁨",
          pm25: 50,
          pm10: 100,
          "좋음 기준": 50,
          "보통 기준": 100,
        },
        {
          time: "21:00",
          khai: 80,
          grade: "보통",
          pm25: 40,
          pm10: 70,
          "좋음 기준": 50,
          "보통 기준": 100,
        },
      ];
      setKhaiChartData(sampleChart); // ⭐ 샘플 그래프 상태 업데이트

      setApiKeyWarning(true); // API 호출 실패 시 경고 표시
    }

    // 🚨 알림 로직 (기존 로직 유지)
    if (
      isAlertSettingOn &&
      (newAirData.grade === "나쁨" || newAirData.grade === "매우나쁨")
    ) {
      setNotification({
        message: `🚨 현재 대기질이 ${newAirData.grade} 수준입니다! 외출을 자제하고 마스크를 착용하세요.`,
        type: "warning",
      });
    } else {
      setNotification({ message: "" });
    }

    setAirData(newAirData);

    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
    }, 1000);
  }, [fetchAllAirQualityData, isAlertSettingOn]);

  // ⭐ 초기 로드
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // 기존 forecastData는 KhaiIndexChart에서 사용되지 않으므로 유지합니다.
  const forecastData = [
    { time: "09:00", value: "25", grade: "좋음" },
    { time: "12:00", value: "28", grade: "보통" },
    { time: "15:00", value: "35", grade: "보통" },
    { time: "18:00", value: "42", grade: "나쁨" },
    { time: "21:00", value: "30", grade: "보통" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* 3. Header 렌더링 */}
      <Header onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* 4. NotificationSystem 렌더링 */}
      <NotificationSystem
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "" })}
      />

      {/* API 키 경고 */}
      {apiKeyWarning && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <p className="font-semibold mb-1">📌 API 키 설정 필요</p>
                <p>
                  현재 샘플 데이터를 표시하고 있습니다.
                  <a
                    href="https://www.data.go.kr/data/15073861/openapi.do"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    공공데이터포털
                  </a>
                  에서 API 키를 발급받아 코드의 'YOUR_API_KEY_HERE'를
                  교체하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AirQualitySummary {...airData} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-1">
            {/* ⭐ HourlyForecast 대신 KhaiIndexChart 사용 및 데이터 전달 */}
            <KhaiIndexChart chartData={khaiChartData} isLoading={isLoading} />
          </div>
          <DashboardCard
            title="생활 가이드 및 건강"
            icon={Heart}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <RecommendationCard
                title="외출 시 마스크 착용"
                description="KF94 이상 권장"
                icon={MaskIcon}
                isSafe={airData.grade === "좋음" || airData.grade === "보통"}
              />
              <RecommendationCard
                title="실외 활동 자제"
                description="실내 활동 권장"
                icon={MaskIcon}
                isSafe={airData.grade === "좋음"}
              />
              <RecommendationCard
                title="환기 시간 확인"
                description={`오전 9-10시 (현재 대기: ${airData.grade})`}
                icon={AirVentIcon}
                isSafe={airData.grade === "좋음"}
              />
              <RecommendationCard
                title="물 자주 마시기"
                description="하루 2L 이상 (필수)"
                icon={WaterIcon}
                isSafe={true}
              />
            </div>
          </DashboardCard>
          <div className="lg:col-span-1 grid grid-rows-[auto_1fr] gap-6">
            <DashboardCard title="건강 관리 팁" icon={Heart}>
              <div className="space-y-2">
                <HealthTipItem
                  title="호흡기"
                  description="마스크 착용으로 미세먼지 80% 차단"
                />
                <HealthTipItem
                  title="수분섭취"
                  description="하루 8잔 이상의 물 마시기"
                />
                <HealthTipItem
                  title="면역력"
                  description="비타민C가 풍부한 과일 섭취"
                />
                <HealthTipItem
                  title="운동"
                  description="대기질에 따라 강도 조절"
                />
              </div>
            </DashboardCard>
            {/* UserSettings에 상태 전달 */}
            <UserSettings
              isAlertSettingOn={isAlertSettingOn}
              setIsAlertSettingOn={setIsAlertSettingOn}
            />
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-4 text-xs text-gray-400 border-t mt-10">
        © 2024 Air-Life Guide. All rights reserved.
      </footer>
    </div>
  );
}
