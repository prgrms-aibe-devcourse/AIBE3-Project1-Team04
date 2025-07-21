import { supabase } from '@/lib/supabaseClient';
import {
  Place,
  PlaceFileType,
  PlaceImageInputType,
  PlaceInputType,
  PlaceReview,
  PlaceWithUserAction,
} from '@/types/place.type';
import { PlaceImage } from '@/types/place_image.type';
import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useAuth } from './useAuth';
import { SortOption } from '@/components/places/SortButton';

export const usePlace = () => {
  const { user } = useAuth();

  /** 여행지 전체 조회 */
  const getAllPlacesWithUserAction = useCallback(
    async (sortBy?: SortOption): Promise<PlaceWithUserAction[]> => {
      try {
        let query = supabase.rpc('get_places_with_user_action', {
          _user_id: user?.id ?? null,
        });
        if (sortBy) {
          switch (sortBy) {
            case 'latest': //최신순
              query = query.order('created_at', { ascending: false });
              break;
            case 'popular': //인기순(조회순)
              query = query.order('view_count', { ascending: false });
              break;
            case 'rating': //평점순
              query = query.order('average_rating', { ascending: false, nullsFirst: false });
              break;
            case 'likes': //좋아요순
              query = query.order('like_count', { ascending: false });
              break;
            case 'cost': //비용순
              query = query.order('cost', { ascending: true, nullsFirst: false });
              break;
          }
        }

        const { data, error } = await query;

        if (error) {
          console.error('여행지를 가져오는 중 오류 발생:', error);
          return [];
        }

        // 사용자 정보 없이 포스트만 반환
        const placesWithUserActions = ((data as PlaceWithUserAction[]) || []).map((place) => ({
          ...place,
        }));

        return placesWithUserActions;
      } catch (error) {
        console.error('여행지를 가져오는 중 오류 발생:', error);
        return [];
      }
    },
    [user]
  );

  /** 여행지 단일 조회 */
  const getPlaceWithUserAction = useCallback(
    async (placeId: string): Promise<PlaceWithUserAction | null> => {
      try {
        const { data, error } = await supabase
          .rpc('get_places_with_user_action', {
            _user_id: user?.id ?? null,
          })
          .eq('id', placeId)
          .single();

        if (error) {
          console.error('해당 여행지를 가져오는 중 오류 발생:', error);
          return null;
        }

        // 사용자 정보 없이 포스트만 반환
        return data ? { ...(data as PlaceWithUserAction) } : null;
      } catch (error) {
        console.error('해당 여행지를 가져오는 중 오류 발생:', error);
        return null;
      }
    },
    [user]
  );

  /** 여행지 리뷰 조회 */
  const getPlaceReviews = useCallback(async (placeId: string): Promise<PlaceReview[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_place_reviews_with_user')
        .eq('place_id', placeId);
      if (error) {
        console.error('여행지 리뷰 목록을을 가져오는 중 오류 발생:', error);
        return [];
      }

      // 사용자 정보 없이 포스트만 반환
      const placeReviews = ((data as PlaceReview[]) || []).map((review) => ({
        ...review,
      }));

      return placeReviews;
    } catch (error) {
      console.error('여행지 리뷰 목록을을 가져오는 중 오류 발생:', error);
      return [];
    }
  }, []);

  /** 여행지 리뷰 생성 */
  const createPlaceReivew = useCallback(
    async (
      review: Omit<PlaceReview, 'id' | 'created_at' | 'modified_at' | 'user_name' | 'avatar_url'>
    ) => {
      try {
        const { data, error } = await supabase
          .from('place_reviews')
          .insert([review])
          .select()
          .single();

        if (error) {
          console.error('여행지 리뷰 생성 중 오류 발생:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('여행지 리뷰 생성 중 오류 발생:', error);
        return null;
      }
    },
    []
  );

  /** 여행지 생성 */
  const createPlace = async (placeData: PlaceInputType): Promise<Place> => {
    const { data, error } = await supabase.from('places').insert(placeData).select().single();
    if (error) throw error;
    return data as Place;
  };

  /** 여행지 이미지 등록 */
  const uploadPlaceImage = async (postId: number, imageData: PlaceFileType[]) => {
    const uploadedUrls: PlaceImageInputType[] = [];
    const failedFiles: string[] = [];

    for (const data of imageData) {
      const { image_file: file, is_representative } = data;
      try {
        const ext = file.name.split('.').pop();
        const safeName = `${Date.now()}_${nanoid()}.${ext}`;
        const filePath = `places/${postId}/${safeName}`;

        // 1. Storage에 이미지 업로드
        const { error: uploadError } = await supabase.storage
          .from('place-images')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error(`[UPLOAD ERROR] ${file.name}:`, uploadError.message);
          failedFiles.push(file.name);
          continue;
        }

        // 2. public URL 생성
        const { data: publicData } = supabase.storage.from('place-images').getPublicUrl(filePath);

        if (!publicData?.publicUrl) {
          console.error(`[URL ERROR] ${file.name}: URL 생성 실패패`);
          failedFiles.push(file.name);
          continue;
        }

        uploadedUrls.push({ image_url: publicData.publicUrl, place_id: postId, is_representative });
      } catch (err) {
        console.error(`[UNEXPECTED ERROR] ${file.name}:`, err);
        failedFiles.push(file.name);
      }
    }
    // 실패한 파일이 전부일 경우 중단
    if (uploadedUrls.length === 0) {
      throw new Error(`이미지 업로드에 모두 실패했습니다. (${failedFiles.join(', ')})`);
    }
    // 3. DB 저장
    try {
      const { data, error } = await supabase.from('place_images').insert(uploadedUrls).select();

      if (error) {
        console.error('[DB INSERT ERROR]:', error.message);
        throw new Error('이미지 URL 저장에 실패했습니다.');
      }

      // 결과 및 실패 파일 함께 반환
      return {
        success: true,
        saved: data as PlaceImage[],
        failed: failedFiles,
      };
    } catch (err) {
      console.error('[UNEXPECTED DB ERROR]:', err);
      throw err;
    }
  };

  /** 여행지 대표 이미지 업데이트트 */
  const setRepresentativeImage = async (placeId: number, imageId: number) => {
    const { error } = await supabase
      .from('places')
      .update({ thumbnail_image_id: imageId })
      .eq('id', placeId);
    if (error) throw error;
  };

  /** 여행지 수정정 */
  const updatePlace = async (place_id: number, placeData: PlaceInputType): Promise<Place> => {
    const { data, error } = await supabase
      .from('places')
      .update(placeData)
      .eq('id', place_id)
      .select()
      .single();
    if (error) throw error;
    return data as Place;
  };

  const deleteAllPlaceImages = async (placeId: number) => {
    // 1. 썸네일 이미지 참조 해제
    const { error: nullifyError } = await supabase
      .from('places')
      .update({ thumbnail_image_id: null })
      .eq('id', placeId);

    if (nullifyError) throw new Error('썸네일 초기화 실패: ' + nullifyError.message);
    // 2. 기존 이미지 목록 조회
    const { data: existingImages, error: fetchError } = await supabase
      .from('place_images')
      .select('id, image_url')
      .eq('place_id', placeId);

    if (fetchError) throw new Error('기존 이미지 조회 실패: ' + fetchError.message);
    if (!existingImages || existingImages.length === 0) return; // 삭제할 이미지 없음

    // 3. DB에서 이미지 삭제
    const imageIds = existingImages.map((img) => img.id);
    const { error: dbDeleteError } = await supabase
      .from('place_images')
      .delete()
      .in('id', imageIds);

    if (dbDeleteError) throw new Error('DB 이미지 삭제 실패: ' + dbDeleteError.message);

    // 4. 스토리지에서 이미지 삭제
    const paths = existingImages.map((img) => {
      const url = new URL(img.image_url);
      return decodeURIComponent(
        url.pathname.replace('/storage/v1/object/public/place-images/', '')
      );
    });

    const { error: storageDeleteError } = await supabase.storage.from('place-images').remove(paths);

    if (storageDeleteError)
      throw new Error('스토리지 이미지 삭제 실패: ' + storageDeleteError.message);
  };

  return {
    getAllPlacesWithUserAction,
    getPlaceWithUserAction,
    getPlaceReviews,
    createPlaceReivew,
    createPlace,
    uploadPlaceImage,
    setRepresentativeImage,
    updatePlace,
    deleteAllPlaceImages,
  };
};
