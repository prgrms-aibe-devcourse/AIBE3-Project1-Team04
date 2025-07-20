'use client';

import Link from 'next/link';
import usePostEdit from '@/hooks/usePostEdit';
import PostSection from './PostSection';
import PlaceSummary from './PlaceSummary';
import PlaceList from './PlaceList';
import { supabase } from '@/lib/supabaseClient';
import { useMessageModal } from '@/stores/MessageModalStore';
import { useState } from 'react';
import { PostEditData } from '@/types/mypage.type';
// datetime-local 값이 'YYYY-MM-DDTHH:MM' 형식이면 ':00'을 붙여서 'YYYY-MM-DDTHH:MM:SS'로 변환
const fixDateTime = (dt: string) => (dt && dt.length === 16 ? dt + ':00' : dt || null);
const initialPlace = {
  place_id: 0, // places.id
  place_name: '', // places.name
  category: '', // public.place_categories enum
  city_id: 0, // places.city_id
  state_id: 0, // places.state_id
  cost: 0, // places.cost
  images: [], // place_images.image_url[]
  visit_start: '', // places.visit_start_time (ISO timestamp)
  visit_end: '', // places.visit_end_time   (ISO timestamp)
  memo: '', // places.memo
};

export default function PostForm() {
  const { postId, postData, setPostData, regions, router } = usePostEdit();

  const { addModal } = useMessageModal();
  const [currentPlace, setCurrentPlace] = useState<PostEditData['places'][number]>(initialPlace);
  const [representativeImage, setRepresentativeImage] = useState<string | null>(null);
  const [isEditingPlace, setIsEditingPlace] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState<number | null>(null);
  const placeCategories = ['맛집', '관광', '문화', '휴식', '모험', '자연', '기타'];
  // 시/도 select 옵션 렌더링: cities에서 state_name만 unique하게 추출
  const stateIds = Array.from(new Set(Object.keys(regions)));

  //여행지 이미지 업로드
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (currentPlace.images.length + files.length > maxFiles) {
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
        setCurrentPlace((prev) => ({
          ...prev,
          images: [...prev.images, result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setCurrentPlace((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    // 필수 필드 검증
    const requiredFields = [];
    if (!currentPlace.place_name) requiredFields.push('여행지 이름');
    if (!currentPlace.category) requiredFields.push('카테고리');
    if (!currentPlace.state_id) requiredFields.push('시/도');
    if (!currentPlace.city_id) requiredFields.push('시/군/구');
    if (!currentPlace.memo) requiredFields.push('메모');
    if (!currentPlace.visit_start) requiredFields.push('방문 시작 일시');
    if (!currentPlace.visit_end) requiredFields.push('방문 종료 일시');

    // 방문 시작 일시가 방문 종료 일시보다 이후인 경우 검증 실패
    if (
      currentPlace.visit_start &&
      currentPlace.visit_end &&
      currentPlace.visit_start > currentPlace.visit_end
    ) {
      requiredFields.push('방문 시작 일시는 방문 종료 일시보다 이전이어야 합니다.');
    }

    // 등록된 다른 여행지의 여행 시간과 겹치는지 검증
    postData.places.forEach((place) => {
      if (
        (currentPlace.visit_start &&
          currentPlace.visit_end &&
          currentPlace.visit_start < place.visit_start &&
          place.visit_start < currentPlace.visit_end) ||
        (currentPlace.visit_start < place.visit_end && place.visit_end < currentPlace.visit_end)
      ) {
        requiredFields.push('등록된 다른 여행지의 여행 시간과 겹칩니다.');
      }
    });

    // city_id 찾기 (state_name, city.name으로 매칭)
    const selectedCity =
      regions[currentPlace.state_id] &&
      regions[currentPlace.state_id].city_map[currentPlace.city_id];
    if (!selectedCity) {
      requiredFields.push('시/군/구(city) 정보가 올바르지 않습니다.');
    }

    // 필수 필드 검증 실패 시 메시지 표시
    if (requiredFields.length > 0) {
      addModal(`다음 항목을 확인해주세요: ${requiredFields.join(', ')}`);
      return;
    }

    // DB 함수에 전달할 place_data 준비
    const placeData = {
      name: currentPlace.place_name,
      category: currentPlace.category,
      memo: currentPlace.memo,
      cost: currentPlace.cost,
      visit_start_time: fixDateTime(currentPlace.visit_start),
      visit_end_time: fixDateTime(currentPlace.visit_end),
      city_id: currentPlace.city_id,
      state_id: currentPlace.state_id,
    };

    // 이미지 URL 배열 준비 (모든 이미지를 place_images에 저장)
    const imageUrls = currentPlace.images;

    //Supabase DB 함수 호출
    try {
      const { data, error } = await supabase.rpc('add_place_with_images', {
        place_data: placeData,
        image_urls: imageUrls,
      });

      if (error || !data || !data.success) {
        throw new Error(error?.message || data?.error || '여행지 추가에 실패했습니다.');
      }

      // 성공적으로 추가된 place 정보로 상태 업데이트
      const addedPlace: PostEditData['places'][number] = {
        ...currentPlace,
        place_id: data.place_id,
      };
      setRepresentativeImage(currentPlace.images[0]);
      setPostData({ ...postData, places: [...postData.places, addedPlace] });
      resetPlaceForm();

      // 성공 메시지 표시
      addModal('여행지가 성공적으로 추가되었습니다!');
    } catch (error) {
      console.error('Supabase DB 함수 호출 중 오류 발생:', error);
      // 에러 메시지 표시
      let errorMsg = '알 수 없는 오류';
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMsg = (error as any).message;
      }

      addModal(`여행지 추가 중 오류가 발생했습니다: ${errorMsg}`);
    }
  };

  const handleEditPlace = (place: PostEditData['places'][number]) => {
    setCurrentPlace(place);
    setIsEditingPlace(true);
    //NOTE : eidtingPlaceId state가 필요한가?
    setEditingPlaceId(place.place_id);
  };

  //TODO : 함수명과 다르게 여행지 이미지를 수정하는 함수 같음 변경필요? 또한, resetPlaceForm()의 경우 작성중이던 여행지가 있을 경우 강제로 리셋하는데 작성중이던 여행지를 초기화하는 것이 맞는지?
  const handleUpdatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    //NOTE : 왜 Id만 currentPlace.id가 아니고 editingPlaceId인지?
    if (
      currentPlace.place_name &&
      currentPlace.state_id &&
      currentPlace.city_id &&
      currentPlace.memo &&
      editingPlaceId
    ) {
      const updatedPlaces = postData.places.map((place) =>
        place.place_id === editingPlaceId
          ? { ...currentPlace, imageUrl: currentPlace.images[0] || place.images[0] }
          : place
      );
      setPostData({ ...postData, places: updatedPlaces });
      resetPlaceForm();
    }
  };

  //TODO : 마찬가지로 editingPlaceId가 필요한지 여부
  const handleDeletePlace = (placeId: number) => {
    if (confirm('이 여행지를 삭제하시겠습니까?')) {
      setPostData({
        ...postData,
        places: postData.places.filter((place) => place.place_id !== placeId),
      });
      if (editingPlaceId === placeId) {
        resetPlaceForm();
      }
    }
  };

  const resetPlaceForm = () => {
    setCurrentPlace(initialPlace);
    setIsEditingPlace(false);
    setEditingPlaceId(null);
  };

  const handleSubmitPost = (e: React.FormEvent, isViewed: boolean) => {
    e.preventDefault();
    // NOTE : 카테고리, 지역, 여행 날짜에 대한 검증 없음
    if (!postData.title || !postData.content || postData.places.length === 0) {
      addModal('제목, 내용, 그리고 최소 1개의 여행지를 입력해주세요.');
      return;
    }

    const savePostEdit = async (
      postId: string,
      title: string,
      content: string,
      placeIds: number[]
    ) => {
      const { error } = await supabase.rpc('update_editpost', {
        _post_id: postId,
        _title: title,
        _content: content,
        _place_ids: placeIds,
        _is_viewed: isViewed,
      });

      if (error) {
        console.error('update_editpost RPC ERROR:', error);
        throw error;
      }

      addModal('게시글이 성공적으로 수정되었습니다!');
      router.push('/mypage');
    };

    savePostEdit(
      postId,
      postData.title,
      postData.content,
      postData.places.map((place) => place.place_id)
    );
  };

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
