import { supabase } from '@/lib/supabaseClient';
import { PlaceWithUserAction } from '@/types/place.type';
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
      const postsWithUsers = ((data as PlaceWithUserAction[]) || []).map((post) => ({
        ...post,
      }));

      return postsWithUsers;
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

  return { getAllPlacesWithUserAction, getPlaceWithUserAction };
};
