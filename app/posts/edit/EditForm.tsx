import { PostEditData, RegionsResponse } from '@/lib/database';

function EditForm({
  place,
  regions,
  isEditingPlace,
  editingPlaceId,
  handleUpdatePlace,
  currentPlace,
  setCurrentPlace,
  resetPlaceForm,
  placeCategories,
  stateIds,
  handleImagesUpload,
  removeImage,
}: {
  place: PostEditData['places'][number];
  regions: RegionsResponse;
  isEditingPlace: boolean;
  editingPlaceId: number | null;
  handleUpdatePlace: (e: React.FormEvent) => void;
  currentPlace: PostEditData['places'][number];
  setCurrentPlace: (place: PostEditData['places'][number]) => void;
  resetPlaceForm: () => void;
  placeCategories: string[];
  stateIds: string[];
  handleImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}) {
  return (
    <>
      {/* 해당 여행지의 수정 패널 (해당 여행지가 수정 중일 때만 표시) */}
      {isEditingPlace && editingPlaceId === place.place_id && (
        <div className="bg-blue-50 rounded-lg shadow-sm p-4 border-2 border-blue-200 mt-3">
          <h3 className="text-lg font-bold mb-4 text-blue-800">여행지 수정</h3>

          <form onSubmit={handleUpdatePlace} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">여행지 이름</label>
                <input
                  type="text"
                  value={currentPlace.place_name}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, place_name: e.target.value })}
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
                  {placeCategories.map((category) => (
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
                    setCurrentPlace({
                      ...currentPlace,
                      state_id: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
                >
                  <option value="">시/도 선택</option>
                  {stateIds.map((stateId) => {
                    const stateName = regions[stateId as keyof typeof regions].state_name;
                    return (
                      <option key={stateId} value={stateId}>
                        {stateName}
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
                    setCurrentPlace({
                      ...currentPlace,
                      city_id: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
                  disabled={!currentPlace.state_id}
                >
                  <option value="">시/군/구 선택</option>
                  {currentPlace.state_id &&
                    Object.entries(regions[currentPlace.state_id].city_map).map(
                      ([city_id, city_name]) => (
                        <option key={city_id} value={city_id}>
                          {city_name}
                        </option>
                      )
                    )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  예상 비용 (원)
                </label>
                <input
                  type="number"
                  value={currentPlace.cost || ''}
                  onChange={(e) =>
                    setCurrentPlace({
                      ...currentPlace,
                      cost: parseInt(e.target.value) || 0,
                    })
                  }
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

                  {currentPlace.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {currentPlace.images.map((image, index) => (
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  방문 시작 일시
                </label>
                <input
                  type="datetime-local"
                  value={currentPlace.visit_start}
                  onChange={(e) =>
                    setCurrentPlace({
                      ...currentPlace,
                      visit_start: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  방문 종료 일시
                </label>
                <input
                  type="datetime-local"
                  value={currentPlace.visit_end}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, visit_end: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                <textarea
                  value={currentPlace.memo ?? ''}
                  onChange={(e) => setCurrentPlace({ ...currentPlace, memo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="이 여행지에 대한 설명이나 팁을 적어주세요..."
                  required
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {currentPlace.memo?.length ?? 0}/500자
                </div>
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
    </>
  );
}

export default EditForm;
