import { PostEditData, RegionsResponse } from '@/lib/database';
import { supabase } from '@/lib/supabaseClient';
import { useMessageModal } from '@/stores/MessageModalStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

function usePostEdit({
  postId,
  postData,
  setPostData,
  regions,
}: {
  postId: string;
  postData: PostEditData;
  setPostData: (data: PostEditData) => void;
  regions: RegionsResponse;
}) {
  const router = useRouter();
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

  return {
    currentPlace,
    representativeImage,
    isEditingPlace,
    editingPlaceId,
    placeCategories,
    stateIds,
    setCurrentPlace,
    setRepresentativeImage,
    handleAddPlace,
    handleEditPlace,
    handleUpdatePlace,
    handleDeletePlace,
    resetPlaceForm,
    handleSubmitPost,
    handleImagesUpload,
    removeImage,
  };
}

export default usePostEdit;
