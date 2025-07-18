import { supabase } from '@/lib/supabaseClient';
import { PlaceWithUserAction } from '@/types/place.type';

export const usePlace = () => {
  const getAllPlacesWithUserAction = async (): Promise<PlaceWithUserAction[]> => {
    try {
      const { data, error } = await supabase.rpc('get_places_with_user_action');
      console.log(data);

      if (error) {
        console.error('포스트를 가져오는 중 오류 발생:', error);
        return [];
      }

      // 사용자 정보 없이 포스트만 반환
      const postsWithUsers = ((data as PlaceWithUserAction[]) || []).map((post) => ({
        ...post,
      }));

      return postsWithUsers;
    } catch (error) {
      console.error('포스트를 가져오는 중 오류 발생:', error);
      return [];
    }
  };

  return { getAllPlacesWithUserAction };
};
