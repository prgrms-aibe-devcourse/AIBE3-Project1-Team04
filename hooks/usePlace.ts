import { supabase } from '@/lib/supabaseClient';
import { PlaceReview, PlaceWithUserAction } from '@/types/place.type';
import { useCallback } from 'react';

export const usePlace = () => {
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

  return { getAllPlacesWithUserAction, getPlaceWithUserAction, getPlaceReviews, createPlaceReivew };
};
