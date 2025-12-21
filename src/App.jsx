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
  X,
  Zap,
  Leaf,
  CloudDrizzle,
  Sun,
  Flame,
  CheckCircle,
  MinusCircle,
  Shield,
  Home,
  LogOut,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Login 컴포넌트 임포트 (실제로는 별도 파일)
const Login = ({ onClose, onSwitchToSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = storedUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      onLoginSuccess(user);
      onClose();
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">로그인</h2>
          <p className="text-gray-500">Air-Life Guide에 오신 것을 환영합니다</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="example@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <X className="w-5 h-5" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            로그인
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            계정이 없으신가요?{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-blue-500 hover:text-blue-600 font-semibold transition"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Signup 컴포넌트 임포트 (실제로는 별도 파일)
const Signup = ({ onClose, onSwitchToLogin, onSignupSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!name || !email || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (storedUsers.some((u) => u.email === email)) {
      setError("이미 등록된 이메일입니다.");
      return;
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    onSignupSuccess(newUser);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">회원가입</h2>
          <p className="text-gray-500">새로운 계정을 만들어보세요</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="홍길동"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="example@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <X className="w-5 h-5" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              최소 6자 이상 입력해주세요
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <X className="w-5 h-5" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            회원가입
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-500 hover:text-blue-600 font-semibold transition"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 상수 및 유틸리티 함수 ---
const AIR_GRADES = {
  좋음: { color: "text-green-600", bg: "bg-green-100", lineColor: "#10b981" },
  보통: { color: "text-yellow-600", bg: "bg-yellow-100", lineColor: "#f59e0b" },
  나쁨: { color: "text-red-600", bg: "bg-red-100", lineColor: "#ef4444" },
  매우나쁨: {
    color: "text-purple-600",
    bg: "bg-purple-100",
    lineColor: "#8b5cf6",
  },
  "자료 미수집": {
    color: "text-gray-500",
    bg: "bg-gray-100",
    lineColor: "#9ca3af",
  },
};

const getGradeFromPM10 = (pm10) => {
  if (pm10 <= 30) return "좋음";
  if (pm10 <= 80) return "보통";
  if (pm10 <= 150) return "나쁨";
  return "매우나쁨";
};

const getKhaiGrade = (khai) => {
  if (khai <= 50) return "좋음";
  if (khai <= 100) return "보통";
  if (khai <= 250) return "나쁨";
  return "매우나쁨";
};

const getGradeFromGas = (type, value) => {
  const v = parseFloat(value);
  if (isNaN(v) || v < 0) return "자료 미수집";
  switch (type) {
    case "CO":
      if (v <= 2.0) return "좋음";
      if (v <= 9.0) return "보통";
      if (v <= 15.0) return "나쁨";
      return "매우나쁨";
    case "NO2":
      if (v <= 0.03) return "좋음";
      if (v <= 0.06) return "보통";
      if (v <= 0.2) return "나쁨";
      return "매우나쁨";
    case "SO2":
      if (v <= 0.02) return "좋음";
      if (v <= 0.05) return "보통";
      if (v <= 0.15) return "나쁨";
      return "매우나쁨";
    case "O3":
      if (v <= 0.03) return "좋음";
      if (v <= 0.09) return "보통";
      if (v <= 0.15) return "나쁨";
      return "매우나쁨";
    default:
      return "자료 미수집";
  }
};

const transformDataForChart = (items) => {
  if (!items || items.length === 0) return [];
  const reversedItems = [...items].reverse();
  return reversedItems.map((item) => {
    const khaiValue = parseInt(item.khaiValue) || 0;
    const dataTime = item.dataTime ? item.dataTime.split(" ")[1] : "N/A";
    const displayTime = dataTime.substring(0, 5);
    return {
      time: displayTime,
      khai: khaiValue,
      grade: getKhaiGrade(khaiValue),
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

const PollutantDetailCard = ({
  title,
  value,
  unit,
  type,
  icon: Icon,
  isLoading,
}) => {
  const grade = getGradeFromGas(type, value);
  const gradeInfo = AIR_GRADES[grade] || AIR_GRADES["자료 미수집"];
  const displayValue = isNaN(parseFloat(value)) ? "N/A" : value;

  return (
    <div
      className={`p-4 rounded-xl flex items-center shadow-sm hover:shadow-md transition-all duration-200 bg-white`}
    >
      <div className={`p-3 rounded-full mr-4 ${gradeInfo.bg} flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${gradeInfo.color}`} />
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-gray-800">
            {isLoading ? (
              <span className="animate-pulse bg-gray-200 w-12 h-6 inline-block rounded"></span>
            ) : (
              <span>
                {displayValue}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {unit}
                </span>
              </span>
            )}
          </p>
          <GradeBadge grade={grade} />
        </div>
      </div>
    </div>
  );
};

const RecommendationMessage = ({ grade }) => {
  const gradeInfo = AIR_GRADES[grade] || AIR_GRADES["보통"];
  let message = "";
  let Icon = CheckCircle;

  switch (grade) {
    case "좋음":
      message = "모든 실외 활동에 적합합니다. 쾌적한 야외 활동을 즐기세요.";
      Icon = CheckCircle;
      break;
    case "보통":
      message =
        "민감군을 제외한 일반인은 실외 활동이 가능합니다. 장시간 무리한 활동은 자제하세요.";
      Icon = Shield;
      break;
    case "나쁨":
      message =
        "모든 실외 활동을 자제하고, 외출 시 KF94 마스크를 반드시 착용하세요.";
      Icon = AlertCircle;
      break;
    case "매우나쁨":
      message =
        "실외 활동을 금지하고, 실내 공기청정기를 가동하며 창문은 닫아주세요.";
      Icon = Home;
      break;
    default:
      message = "자료 미수집 또는 알 수 없는 등급입니다. 안전에 유의하세요.";
      Icon = MinusCircle;
  }

  return (
    <div className={`p-3 mt-4 rounded-lg flex items-start ${gradeInfo.bg}`}>
      <Icon
        className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${gradeInfo.color}`}
      />
      <p className={`text-sm font-medium ${gradeInfo.color}`}>{message}</p>
    </div>
  );
};

const AirQualitySummary = ({ grade, pm10, co, time, isLoading }) => {
  const gradeInfo = AIR_GRADES[grade] || AIR_GRADES["좋음"];

  if (isLoading) {
    return (
      <DashboardCard title="대기 현황 요약" className="h-full">
        <div className="flex items-center justify-center h-40">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-500">데이터 로딩 중...</span>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="대기 현황 요약"
      className="h-full flex flex-col justify-between"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="mr-6 flex-shrink-0">
          <p
            className={`text-5xl sm:text-6xl font-extrabold ${gradeInfo.color} mb-2`}
          >
            {grade}
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p className="text-xs">업데이트: {time}</p>
            <p className="flex items-center text-xs">
              <MapPin className="w-3 h-3 mr-1 text-gray-400" />
              측정소: 종로구
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow min-w-[180px] sm:min-w-[220px]">
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg shadow-inner h-20">
            <p className="text-xs text-gray-500 mb-0.5">미세먼지 PM10</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {pm10}
              <span className="text-sm font-normal">㎍/㎥</span>
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg shadow-inner h-20">
            <p className="text-xs text-gray-500 mb-0.5">일산화탄소 CO</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">
              {co}
              <span className="text-sm font-normal">ppm</span>
            </p>
          </div>
        </div>
      </div>
      <RecommendationMessage grade={grade} />
    </DashboardCard>
  );
};

const KhaiIndexChart = ({ chartData, isLoading }) => {
  const latestKhai =
    chartData.length > 0 ? chartData[chartData.length - 1].khai : 0;
  const grade = getKhaiGrade(latestKhai);
  const lineStrokeColor = AIR_GRADES[grade].lineColor;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-md text-sm">
          <p className="font-bold text-gray-800 mb-1">시간: {data.time}</p>
          <p className="text-gray-600">
            KHAI 지수: <span className="font-semibold">{data.khai}</span>
          </p>
          <p className="text-gray-600">
            PM10: <span className="font-semibold">{data.pm10}㎍/㎥</span>
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

  const yDomain = [0, Math.max(150, ...chartData.map((d) => d.khai)) + 20];

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
  grade,
  recommendedGrade = "좋음",
}) => {
  const isRecommended = grade === recommendedGrade;
  const isNeutral = recommendedGrade === "모든";

  let color;
  if (isNeutral) {
    color = "text-blue-500 bg-blue-50";
  } else if (isRecommended) {
    color = "text-green-500 bg-green-50";
  } else if (grade === "나쁨" || grade === "매우나쁨") {
    color = "text-red-500 bg-red-50";
  } else {
    color = "text-yellow-500 bg-yellow-50";
  }

  return (
    <div className="flex flex-col p-5 bg-white rounded-xl shadow-md transition-shadow duration-200 hover:shadow-lg cursor-pointer h-full items-center text-center justify-between">
      <div className={`p-3 rounded-xl mb-4 flex-shrink-0 ${color}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex-grow flex flex-col justify-center">
        <p className="text-base font-bold text-gray-800 leading-snug mb-1">
          {title}
        </p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

const HealthTipItem = ({ title, description }) => (
  <div className="p-4 bg-gray-50 rounded-lg mb-2 last:mb-0">
    <p className="text-sm font-semibold text-gray-800">{title}</p>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

const Header = ({
  onRefresh,
  isRefreshing,
  currentUser,
  onUserClick,
  onLogout,
}) => (
  <header className="bg-white shadow-md sticky top-0 z-10">
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
        {currentUser ? (
          <div className="relative group">
            <button className="p-2 text-gray-500 hover:text-blue-600 transition duration-150 rounded-full hover:bg-gray-100 flex items-center">
              <User className="w-6 h-6" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-3 border-b">
                <p className="text-sm font-semibold text-gray-800">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onUserClick}
            className="p-2 text-gray-500 hover:text-blue-600 transition duration-150 rounded-full hover:bg-gray-100"
          >
            <User className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  </header>
);

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

  return (
    <div className="fixed top-20 right-5 z-50 max-w-sm w-full">
      <div
        className={`flex items-center p-4 rounded-lg shadow-2xl text-white transform transition-all duration-500 ease-in-out translate-y-0 opacity-100 ${bgColor}`}
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

export default function App() {
  const [airData, setAirData] = useState({
    grade: "보통",
    pm10: "45",
    co: "0.5",
    no2: "0.021",
    so2: "0.003",
    o3: "0.023",
    time: "오후 3:23:46",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiKeyWarning, setApiKeyWarning] = useState(true);
  const [notification, setNotification] = useState({
    message: "",
    type: "default",
  });
  const [isAlertSettingOn, setIsAlertSettingOn] = useState(true);
  const [khaiChartData, setKhaiChartData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const SERVICE_KEY =
    "7c766ef46d11aaf55f454e201d707bec4da8d614b11ed1132ebfbe21e10c88bd";

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setNotification({
      message: `환영합니다, ${user.name}님!`,
      type: "default",
    });
    setTimeout(() => setNotification({ message: "" }), 3000);
  };

  const handleSignupSuccess = (user) => {
    setCurrentUser(user);
    setNotification({
      message: `회원가입이 완료되었습니다. 환영합니다, ${user.name}님!`,
      type: "default",
    });
    setTimeout(() => setNotification({ message: "" }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setNotification({ message: "로그아웃되었습니다.", type: "default" });
    setTimeout(() => setNotification({ message: "" }), 3000);
  };

  const handleUserClick = () => {
    setShowLogin(true);
  };

  const fetchAllAirQualityData = useCallback(
    async (stationName = "종로구") => {
      if (!SERVICE_KEY) {
        console.warn(
          "❌ SERVICE_KEY가 비어있어 API 호출을 건너뛰고 샘플 데이터를 사용합니다."
        );
        return null;
      }

      try {
        const apiUrl = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${encodeURIComponent(
          stationName
        )}&dataTerm=DAILY&pageNo=1&numOfRows=24&returnType=json&serviceKey=${SERVICE_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (
          data.response?.body?.items &&
          Array.isArray(data.response.body.items) &&
          data.response.body.items.length > 0
        ) {
          setApiKeyWarning(false);
          return data.response.body.items;
        }

        setApiKeyWarning(true);
        return null;
      } catch (error) {
        console.error("❌ 전체 API 호출 오류:", error);
        setApiKeyWarning(true);
        return null;
      }
    },
    [SERVICE_KEY]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setNotification({ message: "" });

    const allData = await fetchAllAirQualityData("종로구");
    let newAirData;

    if (allData && allData.length > 0) {
      const transformedChartData = transformDataForChart(allData);
      setKhaiChartData(transformedChartData);
      const realtimeData = allData[0];
      const pm10Value = parseInt(realtimeData.pm10Value) || 0;
      const coValue =
        realtimeData.coValue !== "-" && realtimeData.coValue
          ? parseFloat(realtimeData.coValue).toFixed(3)
          : "N/A";
      const no2Value =
        realtimeData.no2Value !== "-" && realtimeData.no2Value
          ? parseFloat(realtimeData.no2Value).toFixed(3)
          : "N/A";
      const so2Value =
        realtimeData.so2Value !== "-" && realtimeData.so2Value
          ? parseFloat(realtimeData.so2Value).toFixed(3)
          : "N/A";
      const o3Value =
        realtimeData.o3Value !== "-" && realtimeData.o3Value
          ? parseFloat(realtimeData.o3Value).toFixed(3)
          : "N/A";
      const grade = getGradeFromPM10(pm10Value);

      newAirData = {
        grade: grade,
        pm10: pm10Value.toString(),
        co: coValue,
        no2: no2Value,
        so2: so2Value,
        o3: o3Value,
        time: realtimeData.dataTime
          ? realtimeData.dataTime.split(" ")[1]
          : new Date().toLocaleTimeString("ko-KR"),
      };
    } else {
      const samplePM10 = Math.floor(Math.random() * 100) + 20;
      const sampleCO = (Math.random() * 1).toFixed(3);
      const grade = getGradeFromPM10(samplePM10);

      newAirData = {
        grade: grade,
        pm10: samplePM10.toString(),
        co: sampleCO,
        no2: (Math.random() * 0.05).toFixed(3),
        so2: (Math.random() * 0.01).toFixed(3),
        o3: (Math.random() * 0.04).toFixed(3),
        time: new Date().toLocaleTimeString("ko-KR"),
      };

      const sampleChart = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, "0");
        const khai = Math.floor(Math.random() * 150);
        return {
          time: `${hour}:00`,
          khai: khai,
          grade: getKhaiGrade(khai),
          pm10: Math.floor(khai * 0.5),
          "좋음 기준": 50,
          "보통 기준": 100,
        };
      });
      setKhaiChartData(sampleChart);
      setApiKeyWarning(true);
    }

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
    }, 500);
  }, [fetchAllAirQualityData, isAlertSettingOn]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans">
      <Header
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        currentUser={currentUser}
        onUserClick={handleUserClick}
        onLogout={handleLogout}
      />

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          onSignupSuccess={handleSignupSuccess}
        />
      )}

      <NotificationSystem
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "" })}
      />

      {apiKeyWarning && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <p className="font-semibold mb-1">
                  📌 API 키 설정 또는 데이터 로딩 실패
                </p>
                <p>
                  현재 샘플 데이터를 표시하고 있습니다. API 서버 상태를 확인해
                  주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <AirQualitySummary {...airData} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-1">
            <KhaiIndexChart chartData={khaiChartData} isLoading={isLoading} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <DashboardCard
            title="세부 오염물질 농도 현황 (가스)"
            icon={CloudDrizzle}
            className="col-span-1"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PollutantDetailCard
                title="일산화탄소 (CO)"
                value={airData.co}
                unit="ppm"
                type="CO"
                icon={Flame}
                isLoading={isLoading}
              />
              <PollutantDetailCard
                title="이산화질소 (NO₂)"
                value={airData.no2}
                unit="ppm"
                type="NO2"
                icon={CloudDrizzle}
                isLoading={isLoading}
              />
              <PollutantDetailCard
                title="아황산가스 (SO₂)"
                value={airData.so2}
                unit="ppm"
                type="SO2"
                icon={Leaf}
                isLoading={isLoading}
              />
              <PollutantDetailCard
                title="오존 (O₃)"
                value={airData.o3}
                unit="ppm"
                type="O3"
                icon={Sun}
                isLoading={isLoading}
              />
            </div>
          </DashboardCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="생활 가이드 및 권장 사항"
            icon={Heart}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <RecommendationCard
                title="KF94 마스크 착용"
                description={`현재 등급: ${airData.grade} / 외출 시 필수 착용`}
                icon={MaskIcon}
                grade={airData.grade}
                recommendedGrade="나쁨"
              />
              <RecommendationCard
                title="무리한 실외 활동 자제"
                description={`장시간 야외 운동을 자제하고 휴식 필요`}
                icon={MaskIcon}
                grade={airData.grade}
                recommendedGrade="좋음"
              />
              <RecommendationCard
                title="실내 환기 타이밍 확인"
                description={`대기 좋음 시 3분 이내로 짧게 환기`}
                icon={AirVentIcon}
                grade={airData.grade}
                recommendedGrade="좋음"
              />
              <RecommendationCard
                title="충분한 물 섭취"
                description="미세먼지 배출을 위해 수분 보충"
                icon={WaterIcon}
                grade={airData.grade}
                recommendedGrade="모든"
              />
            </div>

            <DashboardCard
              title="👶 민감군(호흡기 환자, 노약자) 가이드"
              icon={User}
              className="mt-6 border-2 border-red-200 bg-red-50"
            >
              <div className="p-2">
                <p className="text-sm font-semibold text-red-700 flex items-center mb-2">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  대기질이 나쁨 이상일 때:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                  <li>**실외 활동은 무조건 금지**하고 실내에서 머무세요.</li>
                  <li>필요시 주치의와 상담하세요.</li>
                  <li>실내 공기청정기 **'강' 모드**로 가동을 권장합니다.</li>
                </ul>
              </div>
            </DashboardCard>
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
