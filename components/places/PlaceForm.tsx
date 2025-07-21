'use client';

import { MAX_FILE_COUNT, MAX_FILE_SIZE, MEGA_BYTE, PLACE_CATEGORIES, PLACE_STATES } from '@/consts';
import { useRegion } from '@/hooks/useRegion';
import { usePostPlacesStore } from '@/stores/PostPlacesStore';
import { format } from 'date-fns';
import { FaStar } from 'react-icons/fa';

interface PlaceFormPorps {
  type: string;
  callback: (e: React.FormEvent, isviewd?: boolean) => Promise<void>;
}

const PlaceForm = ({ type, callback }: PlaceFormPorps) => {
  const currentPlace = usePostPlacesStore((state) => state.currentPlace);
  const setCurrentPlace = usePostPlacesStore((state) => state.setCurrentPlace);
  const images = usePostPlacesStore((state) => state.images);
  const addImages = usePostPlacesStore((state) => state.addImages);
  const removeImage = usePostPlacesStore((state) => state.removeImage);
  const toggleRepresentativeImage = usePostPlacesStore((state) => state.toggleRepresentativeImage);
  const initPlaceFormData = usePostPlacesStore((state) => state.initPlaceFormData);
  const cancelEditingPlace = usePostPlacesStore((state) => state.cancelEditingPlace);
  const { cities } = useRegion();

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > MAX_FILE_COUNT) {
      alert(`최대 ${MAX_FILE_COUNT}장까지 업로드할 수 있습니다.`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}은(는) 5MB를 초과하여 업로드할 수 없습니다.`);
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const image = {
          image_file: file,
          image_string: result,
          is_representative: false,
        };
        addImages(image);
      };
      reader.readAsDataURL(file);
    });
  };

  const resetPlaceForm = () => {
    initPlaceFormData();
    cancelEditingPlace();
  };

  return (
    <form onSubmit={callback} className="space-y-4">
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
                  <div className="text-xs text-gray-500 mt-1">{`최대 ${MAX_FILE_COUNT}장, 각 ${
                    MAX_FILE_SIZE / MEGA_BYTE
                  }MB 이하`}</div>
                </div>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer group"
                    onClick={() => toggleRepresentativeImage(index)}
                  >
                    {image.is_representative && (
                      <div className="absolute top-1 left-1 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full shadow">
                        대표
                      </div>
                    )}
                    <img
                      src={image.image_string}
                      alt={`미리보기 ${index + 1}`}
                      className="w-full h-24 object-cover object-top rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
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
            value={format(currentPlace.visit_start_time, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) =>
              setCurrentPlace({ ...currentPlace, visit_start_time: new Date(e.target.value) })
            }
            max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">방문 종료 일시</label>
          <input
            type="datetime-local"
            value={format(currentPlace.visit_end_time, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) =>
              setCurrentPlace({ ...currentPlace, visit_end_time: new Date(e.target.value) })
            }
            max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
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
          {type === 'new' ? '여행지 추가' : '수정완료'}
        </button>
        <button
          type="button"
          onClick={(e) => {
            callback(e, false);
          }}
          className="bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600 font-medium whitespace-nowrap cursor-pointer"
        >
          임시 저장
        </button>
        {type === 'edit' && (
          <button
            type="button"
            onClick={resetPlaceForm}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium whitespace-nowrap cursor-pointer"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default PlaceForm;
