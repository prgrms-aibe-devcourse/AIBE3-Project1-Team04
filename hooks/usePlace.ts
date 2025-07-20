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

export const usePlace = () => {
  /** 여행지 전체 조회 */
  const getAllPlacesWithUserAction = useCallback(async (): Promise<PlaceWithUserAction[]> => {
    try {
      const { data, error } = await supabase.rpc('get_places_with_user_action');

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
  }, []);

  /** 여행지 단일 조회 */
  const getPlaceWithUserAction = useCallback(
    async (placeId: string): Promise<PlaceWithUserAction | null> => {
      try {
        const { data, error } = await supabase
          .rpc('get_places_with_user_action')
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
    []
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
        const filePath = `places/${postId}/${Date.now()}_${file.name}`;

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
      .update({ representative_image_id: imageId })
      .eq('id', placeId);
    if (error) throw error;
  };

  return {
    getAllPlacesWithUserAction,
    getPlaceWithUserAction,
    getPlaceReviews,
    createPlaceReivew,
    createPlace,
    uploadPlaceImage,
    setRepresentativeImage,
  };
};
