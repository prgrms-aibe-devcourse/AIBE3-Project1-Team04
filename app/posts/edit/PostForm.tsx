'use client';

import Link from 'next/link';
import usePostEdit_getData from '@/hooks/usePostEdit_getData';
import PostSection from './PostSection';
import PlaceSummary from './PlaceSummary';
import PlaceList from './PlaceList';
import usePostEdit from '@/hooks/usePostEdit';

export default function PostForm() {
  const { postId, postData, setPostData, regions } = usePostEdit_getData();
  const {
    currentPlace,
    setCurrentPlace,
    isEditingPlace,
    handleAddPlace,
    handleEditPlace,
    handleUpdatePlace,
    handleDeletePlace,
    resetPlaceForm,
    handleSubmitPost,
    placeCategories,
    stateIds,
    handleImagesUpload,
    removeImage,
    editingPlaceId,
  } = usePostEdit({ postId, postData, setPostData, regions });

  return (
    <div className="space-y-8">
      <PostSection postData={postData} setPostData={setPostData} />

      <PlaceSummary postData={postData} />

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
                  <option value="">카테고리 선택</option>
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
                    setCurrentPlace({ ...currentPlace, state_id: parseInt(e.target.value) || 0 })
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
                    setCurrentPlace({ ...currentPlace, city_id: parseInt(e.target.value) || 0 })
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
              {/* TODO : 방문 시작 일시, 종료 일시 검증 필요 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  방문 시작 일시
                </label>
                <input
                  type="datetime-local"
                  value={currentPlace.visit_start}
                  onChange={(e) =>
                    setCurrentPlace({ ...currentPlace, visit_start: e.target.value })
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

      <PlaceList
        places={postData.places}
        regions={regions}
        isEditingPlace={isEditingPlace}
        editingPlaceId={editingPlaceId}
        handleUpdatePlace={handleUpdatePlace}
        handleDeletePlace={handleDeletePlace}
        handleEditPlace={handleEditPlace}
        handleImagesUpload={handleImagesUpload}
        removeImage={removeImage}
        currentPlace={currentPlace}
        setCurrentPlace={setCurrentPlace}
        resetPlaceForm={resetPlaceForm}
        placeCategories={placeCategories}
        stateIds={stateIds}
      />

      {/* 작성 완료 버튼 */}
      <div className="flex justify-center gap-4">
        <Link
          href="/mypage"
          className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 font-medium whitespace-nowrap cursor-pointer"
        >
          취소
        </Link>
        <button
          onClick={(e) => handleSubmitPost(e, false)}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap cursor-pointer"
        >
          임시 저장
        </button>
        <button
          onClick={(e) => handleSubmitPost(e, true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap cursor-pointer"
        >
          게시글 수정 완료
        </button>
      </div>
    </div>
  );
}
