
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Place {
  id: string;
  name: string;
  state: string;
  city: string;
  category: string;
  memo: string;
  cost: number;
  visitStartDateTime: string;
  visitEndDateTime: string;
  imageUrl: string;
  customImages: string[];
}

export default function PostForm() {
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    category: '',
    region: '',
    startDate: '',
    endDate: '',
    duration: ''
  });

  const [places, setPlaces] = useState<Place[]>([]);
  const [currentPlace, setCurrentPlace] = useState<Place>({
    id: '',
    name: '',
    state: '',
    city: '',
    category: '',
    memo: '',
    cost: 0,
    visitStartDateTime: '',
    visitEndDateTime: '',
    imageUrl: '',
    customImages: []
  });
  const [isEditingPlace, setIsEditingPlace] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const categories = ['가족여행', '커플여행', '자연여행', '문화여행', '맛집여행', '액티비티'];
  //TODO : 하드코딩 대신 데이터베이스에서 가져오는 방식으로 변경
  const regions = ['서울특별시', '부산광역시', '인천광역시', '대구광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'];
  const placeCategories = ['맛집', '관광', '문화', '휴식', '모험', '자연', '기타'];

  // cities 상태: id, name, state_id, state_name
  const [cities, setCities] = useState<{ city_id: number, name: string, state_id: number, state_name: string }[]>([]);

  // state와 city DB에서 불러오기
  useEffect(() => {
    async function fetchCities() {
      const { data, error } = await supabase
        .from('regions_city')
        .select('id, name, state_id, regions_state(name)');
      if (!error && data) {
        // state_name 평탄화
        const citiesWithState = data.map(city => ({
          city_id: city.id,
          name: city.name,
          state_id: city.state_id,
          state_name: city.regions_state.name
        }));
        setCities(citiesWithState);
      }
    }
    fetchCities();
  }, []);

  const totalPlaces = places.length;
  const totalCost = places.reduce((sum, place) => sum + place.cost, 0);

  //여행지 이미지 업로드
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (currentPlace.customImages.length + files.length > maxFiles) {
      alert(`최대 ${maxFiles}장까지 업로드할 수 있습니다.`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name}은(는) 5MB를 초과하여 업로드할 수 없습니다.`);
        return false;
      }
      return true;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCurrentPlace(prev => ({
          ...prev,
          customImages: [...prev.customImages, result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setCurrentPlace(prev => ({
      ...prev,
      customImages: prev.customImages.filter((_, i) => i !== index)
    }));
  };

  const handleAddPlace = async (e: React.FormEvent) => { // async 키워드 추가
    e.preventDefault();
    // 필수 필드 검증
    const requiredFields = [];
    if (!currentPlace.name) requiredFields.push('여행지 이름');
    if (!currentPlace.category) requiredFields.push('카테고리');
    if (!currentPlace.state) requiredFields.push('시/도');
    if (!currentPlace.city) requiredFields.push('시/군/구');
    if (!currentPlace.memo) requiredFields.push('메모');
    if (!currentPlace.visitStartDateTime) requiredFields.push('방문 시작 일시');
    if (!currentPlace.visitEndDateTime) requiredFields.push('방문 종료 일시');

    // 방문 시작 일시가 방문 종료 일시보다 이후인 경우 검증 실패
    if (currentPlace.visitStartDateTime && currentPlace.visitEndDateTime && currentPlace.visitStartDateTime > currentPlace.visitEndDateTime) {
      requiredFields.push('방문 시작 일시는 방문 종료 일시보다 이전이어야 합니다.');
    }

    // city_id 찾기 (state_name, city.name으로 매칭)
    const selectedCity = cities.find(city => city.name === currentPlace.city && city.state_name === currentPlace.state);
    if (!selectedCity) {
      requiredFields.push('시/군/구(city) 정보가 올바르지 않습니다.');
    }

    // 필수 필드 검증 실패 시 메시지 표시
    if (requiredFields.length > 0) {
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = `다음 항목을 확인해주세요: ${requiredFields.join(', ')}`;
      document.body.appendChild(errorMessage);

      // 3초 후 메시지 제거(if문은 방어적 프로그래밍)
      setTimeout(() => {
        if (document.body.contains(errorMessage)) {
          document.body.removeChild(errorMessage);
        }
      }, 3000);
      return;
    }

    // city_id로 저장, city name은 DB에 저장하지 않음
    const newPlace = {
      ...currentPlace,
      city_id: selectedCity!.city_id,
      imageUrl: currentPlace.customImages[0] || generatePlaceImage(currentPlace.name, currentPlace.category)
    };

    //Supabase에 데이터 추가하는 코드 시작 
    try {
      const { data, error } = await supabase
        .from('places')
        .insert([newPlace])
        .select();

      if (error) {
        throw error; // 에러 발생 시 throw
      }

      //방어적인 코드(DB에 저장이 성공됐지만 data를 제대로 전달받지 못한 경우)
      const addedPlace = data ? data[0] : newPlace;

      setPlaces([...places, addedPlace]); // Supabase에서 반환된 데이터를 상태에 추가
      resetPlaceForm();

      // 성공 메시지 표시
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = '여행지가 성공적으로 추가되었습니다!';
      document.body.appendChild(successMessage);

      // 3초 후 메시지 제거
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);

    } catch (error) {
      console.error('Supabase에 여행지 추가 중 오류 발생:', error);
      // 에러 메시지 표시
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = `여행지 추가 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`;
      document.body.appendChild(errorMessage);

      setTimeout(() => {
        if (document.body.contains(errorMessage)) {
          document.body.removeChild(errorMessage);
        }
      }, 3000);
    }
    // 🌟 Supabase에 데이터 추가하는 코드 끝 🌟
  };

  const handleEditPlace = (place: Place) => {
    setCurrentPlace(place);
    setIsEditingPlace(true);
    //NOTE : eidtingPlaceId state가 필요한가?
    setEditingPlaceId(place.id);
  };

  //TODO : 함수명과 다르게 여행지 이미지를 수정하는 함수 같음 변경필요? 또한, resetPlaceForm()의 경우 작성중이던 여행지가 있을 경우 강제로 리셋하는데 작성중이던 여행지를 초기화하는 것이 맞는지?
  const handleUpdatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    //NOTE : 왜 Id만 currentPlace.id가 아니고 editingPlaceId인지?
    if (currentPlace.name && currentPlace.state && currentPlace.city && currentPlace.memo && editingPlaceId) {
      const updatedPlaces = places.map(place =>
        place.id === editingPlaceId
          ? { ...currentPlace, imageUrl: currentPlace.customImages[0] || place.imageUrl }
          : place
      );
      setPlaces(updatedPlaces);
      resetPlaceForm();
    }
  };

  //TODO : 마찬가지로 editingPlaceId가 필요한지 여부
  const handleDeletePlace = (placeId: string) => {
    if (confirm('이 여행지를 삭제하시겠습니까?')) {
      setPlaces(places.filter(place => place.id !== placeId));
      if (editingPlaceId === placeId) {
        resetPlaceForm();
      }
    }
  };

  const resetPlaceForm = () => {
    setCurrentPlace({
      id: '',
      name: '',
      state: '',
      city: '',
      category: '',
      memo: '',
      cost: 0,
      visitStartDateTime: '',
      visitEndDateTime: '',
      imageUrl: '',
      customImages: []
    });
    setIsEditingPlace(false);
    setEditingPlaceId(null);
  };

  const generatePlaceImage = (name: string, category: string) => {
    const imagePrompts = {
      '관광지': 'Famous tourist attraction landmark with beautiful architecture, scenic views, clear blue sky, professional travel photography, vibrant colors, welcoming atmosphere',
      '맛집': 'Delicious Korean traditional food restaurant interior, appetizing dishes, cozy dining atmosphere, warm lighting, authentic Korean cuisine presentation',
      '카페': 'Modern cozy coffee shop interior, beautiful latte art, comfortable seating, natural lighting, minimalist design, peaceful atmosphere',
      '숙박': 'Comfortable hotel room or traditional Korean hanok accommodation, clean bedding, welcoming interior design, relaxing atmosphere',
      '쇼핑': 'Modern shopping district or traditional market, colorful storefronts, busy shopping street, vibrant commercial atmosphere',
      '액티비티': 'Exciting outdoor activity location, adventure sports, natural landscape, active lifestyle, fun recreational atmosphere',
      '문화시설': 'Beautiful museum or cultural center, traditional Korean architecture, educational exhibits, cultural heritage site',
      '자연': 'Stunning natural landscape, mountains, forests, or beaches, pristine nature, peaceful environment, scenic beauty'
    };

    //NOTE : prompt 사용되지 않고 있음
    const prompt = imagePrompts[category as keyof typeof imagePrompts] || imagePrompts['관광지'];
    const seq = `place-${Date.now()}`;

    return `https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28prompt%29%7D&width=400&height=300&seq=${seq}&orientation=landscape`;
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE : 카테고리, 지역, 여행 날짜에 대한 검증 없음
    if (postData.title && postData.content && places.length > 0) {
      alert('게시글이 성공적으로 작성되었습니다!');
      console.log('게시글 데이터:', { ...postData, places });
    } else {
      alert('제목, 내용, 그리고 최소 1개의 여행지를 입력해주세요.');
    }
  };

  // 시/도 select 옵션 렌더링: cities에서 state_name만 unique하게 추출
  const uniqueStates = Array.from(new Set((Array.isArray(cities) ? cities : []).map(city => city.state_name)));

  return (
    <div className="space-y-8">
      {/* 게시글 기본 정보 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">기본 정보</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="여행 제목을 입력하세요"
              // NOTE : maxLength 확인 필요
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1">{postData.title.length}/100자</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <select
              value={postData.category}
              onChange={(e) => setPostData({ ...postData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
            >
              <option value="">카테고리 선택</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
            <select
              value={postData.region}
              onChange={(e) => setPostData({ ...postData, region: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
            >
              <option value="">지역 선택</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* NOTE :여행 날짜 선택은 여행지 추가에 의해 의존하도록? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">여행 시작일</label>
            <input
              type="date"
              value={postData.startDate}
              onChange={(e) => setPostData({ ...postData, startDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">여행 종료일</label>
            <input
              type="date"
              value={postData.endDate}
              onChange={(e) => setPostData({ ...postData, endDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">여행 내용</label>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData({ ...postData, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="여행 경험과 팁을 자세히 공유해주세요..."
              // NOTE : maxLength 확인 필요
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 mt-1">{postData.content.length}/2000자</div>
          </div>
        </div>
      </div>

      {/* 여행 요약 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
        <h2 className="text-xl font-bold mb-4">여행 요약</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{totalPlaces}</div>
            <div className="text-sm opacity-90">등록된 여행지</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{totalCost.toLocaleString()}</div>
            <div className="text-sm opacity-90">총 예상 비용 (원)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {postData.startDate && postData.endDate
                ? Math.ceil((new Date(postData.endDate).getTime() - new Date(postData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                : 0
              }
            </div>
            <div className="text-sm opacity-90">총 여행 기간 (일)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {totalPlaces > 0 ? Math.round(totalCost / totalPlaces).toLocaleString() : 0}
            </div>
            <div className="text-sm opacity-90">여행 비용 (원)</div>
          </div>
        </div>
      </div>

      {/* 여행지 등록 (수정 모드가 아닐 때만 표시) */}
      {!isEditingPlace && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">여행지 등록</h2>

          <form onSubmit={handleAddPlace} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">여행지 이름</label>
                <input
                  type="text"
                  value={currentPlace.name}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="여행지 이름을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                <select
                  value={currentPlace.category}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
                >
                  <option value="">카테고리 선택</option>
                  {placeCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시/도</label>
                <select
                  value={currentPlace.state}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, state: e.target.value, city: '' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
                >
                  <option value="">시/도 선택</option>
                  {uniqueStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시/군/구</label>
                <select
                  value={currentPlace.city}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
                  disabled={!currentPlace.state}
                >
                  <option value="">시/군/구 선택</option>
                  {currentPlace.state && cities.filter(city => city.state_name === currentPlace.state).map(city => (
                    <option key={city.city_id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">예상 비용 (원)</label>
                <input
                  type="number"
                  value={currentPlace.cost || ''}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, cost: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예상 비용을 입력하세요 (무료인 경우 0)"
                  min="0"
                />
              </div>
              {/* TODO : 사진 등록 대표이미지 선정 필요 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사진 등록</label>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      {/* TODO : 사진등록 UI 수정 필요 */}
                      <div className="text-center">
                        <i className="ri-image-add-line text-2xl text-gray-400 mb-2"></i>
                        <div className="text-sm text-gray-600">사진을 선택하거나 드래그하세요</div>
                        <div className="text-xs text-gray-500 mt-1">최대 5장, 각 5MB 이하</div>
                      </div>
                    </label>
                  </div>

                  {currentPlace.customImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {currentPlace.customImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`미리보기 ${index + 1}`}
                            className="w-full h-24 object-cover object-top rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* TODO : 방문 시작 일시, 종료 일시 검증 필요 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">방문 시작 일시</label>
                <input
                  type="datetime-local"
                  value={currentPlace.visitStartDateTime}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, visitStartDateTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">방문 종료 일시</label>
                <input
                  type="datetime-local"
                  value={currentPlace.visitEndDateTime}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, visitEndDateTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                <textarea
                  value={currentPlace.memo}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, memo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="이 여행지에 대한 설명이나 팁을 적어주세요..."
                  required
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">{currentPlace.memo.length}/500자</div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap cursor-pointer"
              >
                여행지 추가
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 등록된 여행지 목록 */}
      {places.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">등록된 여행지 ({places.length}개)</h2>

          <div className="space-y-4">
            {places.map((place, index) => (
              <div key={place.id}>
                {/* 여행지 카드 */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover object-top rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg">{place.name}</h4>
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {place.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center"></i>
                              {place.state} {place.city}
                            </span>
                            {(place.visitStartDateTime || place.visitEndDateTime) && (
                              <span className="flex items-center gap-1">
                                <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
                                {place.visitStartDateTime && place.visitEndDateTime
                                  ? `${formatDateTime(place.visitStartDateTime)} - ${formatDateTime(place.visitEndDateTime)}`
                                  : formatDateTime(place.visitStartDateTime || place.visitEndDateTime)
                                }
                              </span>
                            )}
                          </div>
                          {place.customImages.length > 1 && (
                            <div className="flex gap-2 mb-2">
                              {place.customImages.slice(0, 3).map((image, idx) => (
                                <img
                                  key={idx}
                                  src={image}
                                  alt={`${place.name} ${idx + 1}`}
                                  className="w-12 h-12 object-cover object-top rounded border"
                                />
                              ))}
                              {place.customImages.length > 3 && (
                                <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                                  +{place.customImages.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600 mb-2">
                            {place.cost === 0 ? '무료' : `${place.cost.toLocaleString()}원`}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditPlace(place)}
                              className="text-blue-600 hover:text-blue-700 p-1 cursor-pointer"
                              title="수정"
                            >
                              <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                            <button
                              onClick={() => handleDeletePlace(place.id)}
                              className="text-red-600 hover:text-red-700 p-1 cursor-pointer"
                              title="삭제"
                            >
                              <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed">{place.memo}</p>
                    </div>
                  </div>
                </div>

                {/* 해당 여행지의 수정 패널 (해당 여행지가 수정 중일 때만 표시) */}
                {isEditingPlace && editingPlaceId === place.id && (
                  <div className="bg-blue-50 rounded-lg shadow-sm p-4 border-2 border-blue-200 mt-3">
                    <h3 className="text-lg font-bold mb-4 text-blue-800">여행지 수정</h3>

                    <form onSubmit={handleUpdatePlace} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">여행지 이름</label>
                          <input
                            type="text"
                            value={currentPlace.name}
                            onChange={(e) => setCurrentPlace({ ...currentPlace, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="여행지 이름을 입력하세요"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                          <select
                            value={currentPlace.category}
                            onChange={(e) => setCurrentPlace({ ...currentPlace, category: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
                          >
                            {placeCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">시/도</label>
                          <select
                            value={currentPlace.state}
                            onChange={(e) => {
                              setCurrentPlace({ ...currentPlace, state: e.target.value, city: '' });
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
                          >
                            {regions.map(region => (
                              <option key={region} value={region}>{region}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">시/군/구</label>
                          <select
                            value={currentPlace.city}
                            onChange={(e) => setCurrentPlace({ ...currentPlace, city: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
                            disabled={!currentPlace.state}
                          >
                            <option value="">시/군/구 선택</option>
                            {currentPlace.state && cities.filter(city => city.state_name === currentPlace.state).map(city => (
                              <option key={city.city_id} value={city.name}>{city.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">예상 비용 (원)</label>
                          <input
                            type="number"
                            value={currentPlace.cost || ''}
                            onChange={(e) => setCurrentPlace({ ...currentPlace, cost: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="예상 비용을 입력하세요 (무료인 경우 0)"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">사진 등록</label>
                          <div className="space-y-3">
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImagesUpload}
                                className="hidden"
                                id="image-upload-edit"
                              />
                              <label
                                htmlFor="image-upload-edit"
                                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                              >
                                <div className="text-center">
                                  <i className="ri-image-add-line text-2xl text-gray-400 mb-2"></i>
                                  <div className="text-sm text-gray-600">사진을 선택하거나 드래그하세요</div>
                                  <div className="text-xs text-gray-500 mt-1">최대 5장, 각 5MB 이하</div>
                                </div>
                              </label>
                            </div>

                            {currentPlace.customImages.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {currentPlace.customImages.map((image, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={image}
                                      alt={`미리보기 ${index + 1}`}
                                      className="w-full h-24 object-cover object-top rounded-lg border"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">방문 시작 일시</label>
                          <input
                            type="datetime-local"
                            value={currentPlace.visitStartDateTime}
                            onChange={(e) => setCurrentPlace({ ...currentPlace, visitStartDateTime: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">방문 종료 일시</label>
                          <input
                            type="datetime-local"
                            value={currentPlace.visitEndDateTime}
                            onChange={(e) => setCurrentPlace({ ...currentPlace, visitEndDateTime: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                          <textarea
                            value={currentPlace.memo}
                            onChange={(e) => setCurrentPlace({ ...currentPlace, memo: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="이 여행지에 대한 설명이나 팁을 적어주세요..."
                            required
                            maxLength={500}
                          />
                          <div className="text-xs text-gray-500 mt-1">{currentPlace.memo.length}/500자</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap cursor-pointer"
                        >
                          수정 완료
                        </button>
                        <button
                          type="button"
                          onClick={resetPlaceForm}
                          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium whitespace-nowrap cursor-pointer"
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 작성 완료 버튼 */}
      <div className="flex justify-center gap-4">
        <Link
          href="/posts"
          className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 font-medium whitespace-nowrap cursor-pointer"
        >
          취소
        </Link>
        <button
          onClick={handleSubmitPost}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap cursor-pointer"
        >
          게시글 작성 완료
        </button>
      </div>
    </div>
  );
}
