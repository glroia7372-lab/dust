import React, { useState } from "react";
import { LocateFixed, X, Settings } from "lucide-react";

// LocationSettingModal 컴포넌트 정의
// 이 컴포넌트는 모달의 UI와 상태 변경 로직을 담당합니다.
const LocationSettingModal = ({
  isOpen,
  onClose,
  currentCity,
  onSaveLocation,
}) => {
  const [selectedCity, setSelectedCity] = useState(currentCity);

  // 모달이 열려있지 않으면 렌더링하지 않습니다.
  if (!isOpen) {
    return null;
  }

  // 임시 도시 목록
  const availableCities = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
  ];

  const handleSave = () => {
    onSaveLocation(selectedCity);
    onClose();
  };

  return (
    // 모달 배경 (오버레이)
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 transition-opacity duration-300">
      {/* 모달 내용 컨테이너 */}
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100 opacity-100 border border-gray-200 dark:border-gray-700"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            id="modal-title"
            className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"
          >
            <Settings className="w-6 h-6 mr-2 text-indigo-500" />
            위치 설정
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 현재 위치 표시 */}
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-900">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
            현재 설정된 위치:
          </p>
          <p className="text-xl font-semibold text-indigo-800 dark:text-indigo-200 mt-1">
            {currentCity}
          </p>
        </div>

        {/* 도시 선택 드롭다운 */}
        <div className="mb-8">
          <label
            htmlFor="city-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            새로운 위치 선택
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition duration-150"
          >
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
          >
            위치 저장
          </button>
        </div>
      </div>
    </div>
  );
};

// 메인 App 컴포넌트
const App = () => {
  // 모달 표시 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 현재 위치 상태 관리
  const [currentLocation, setCurrentLocation] = useState("서울");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveLocation = (newCity) => {
    setCurrentLocation(newCity);
    console.log(`새로운 위치가 ${newCity}로 설정되었습니다.`);
    // 실제 백엔드 저장 로직은 여기에 추가될 수 있습니다.
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* 메인 카드 */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg w-full text-center border border-gray-200 dark:border-gray-700">
        <LocateFixed className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          위치 설정 관리자
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          현재 위치는{" "}
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {currentLocation}
          </span>
          입니다.
        </p>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 transform hover:scale-[1.02]"
        >
          <Settings className="w-5 h-5 mr-2" />
          위치 설정 변경하기
        </button>
      </div>

      {/* 분리된 모달 컴포넌트 렌더링 */}
      <LocationSettingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentCity={currentLocation}
        onSaveLocation={handleSaveLocation}
      />
    </div>
  );
};

export default App;
