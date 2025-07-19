'use client';

import { PLACE_CATEGORIES, PLACE_STATES } from '@/consts';
import { useRegion } from '@/hooks/useRegion';
import { Place_City, PlaceImageInputType, PlaceInputType } from '@/types/place.type';
import { useCallback, useEffect, useState } from 'react';

const PlaceForm = () => {
  const [currentPlace, setCurrentPlace] = useState<PlaceInputType>({
    name: '',
    state_id: 0, // number로 변경
    city_id: 0, // number로 변경
    category: '',
    memo: '',
    cost: 0,
    visit_start_time: '',
    visit_end_time: '',
  });
  const [images, setImages] = useState<PlaceImageInputType[]>([]);
  const [cities, setCities] = useState<Place_City[]>([]);

  const { getPlaceCities } = useRegion();

  const fetchPlaceCities = useCallback(async () => {
    try {
      const data = await getPlaceCities();
      setCities(data);
    } catch (error) {
      console.error('게시글 목록을 가져오는 중 오류 발생:', error);
    }
  }, [getPlaceCities]);

  useEffect(() => {
    fetchPlaceCities();
  }, [fetchPlaceCities]);

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(currentPlace);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (images.length + files.length > maxFiles) {
      alert(`최대 ${maxFiles}장까지 업로드할 수 있습니다.`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(`${file.name}은(는) 5MB를 초과하여 업로드할 수 없습니다.`);
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // console.log([...prev.customImages, result]);
        console.log(result);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">여행지 등록1</h2>

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
              {PLACE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시/도</label>
            <select
              value={currentPlace.state_id}
              onChange={(e) =>
                setCurrentPlace({ ...currentPlace, state_id: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
            >
              <option value="">시/도 선택</option>
              {PLACE_STATES.map((state, index) => {
                return (
                  <option key={index} value={index + 1}>
                    {state}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시/군/구</label>
            <select
              value={currentPlace.city_id}
              onChange={(e) =>
                setCurrentPlace({ ...currentPlace, city_id: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
              disabled={!currentPlace.state_id}
            >
              <option value="">시/군/구 선택</option>
              {currentPlace.state_id &&
                cities
                  .filter((city) => city.state_id === currentPlace.state_id)
                  .map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">예상 비용 (원)</label>
            <input
              type="number"
              value={currentPlace.cost || ''}
              onChange={(e) =>
                setCurrentPlace({ ...currentPlace, cost: parseInt(e.target.value) || 0 })
              }
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

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.image_url}
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
              value={currentPlace.visit_start_time}
              onChange={(e) =>
                setCurrentPlace({ ...currentPlace, visit_start_time: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">방문 종료 일시</label>
            <input
              type="datetime-local"
              value={currentPlace.visit_end_time}
              onChange={(e) => setCurrentPlace({ ...currentPlace, visit_end_time: e.target.value })}
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
  );
};

export default PlaceForm;
