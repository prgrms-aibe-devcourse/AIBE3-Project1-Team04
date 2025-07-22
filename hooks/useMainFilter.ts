import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { PlaceWithUserAction } from '@/types/place.type';
import { supabase } from '@/lib/supabaseClient';
import { PostWithUserAction } from '@/types/post.type';
import { useMainFilterStore } from '@/stores/mainFilterStore';

export const useMainFilter = () => {
  const { user } = useAuth();
  const searchTerm = useMainFilterStore((state) => state.searchTerm);

  /** 여행지 전체 조회 */
  const getBestPlacesWithUserAction = useCallback(async (): Promise<PlaceWithUserAction[]> => {
    try {
      let query = supabase.rpc('get_places_with_user_action', {
        _user_id: user?.id ?? null,
      });
      query = query.order('like_count', { ascending: false });
      query = query.limit(30);
      if (searchTerm && searchTerm.trim() !== '') {
        query = query.like('name', `%${searchTerm.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('베스트 여행지를 가져오는 중 오류 발생:', error);
        return [];
      }

      // 사용자 정보 없이 포스트만 반환
      const placesWithUserActions = ((data as PlaceWithUserAction[]) || []).map((place) => ({
        ...place,
      }));

      return placesWithUserActions;
    } catch (error) {
      console.error('베스트 여행지를 가져오는 중 오류 발생:', error);
      return [];
    }
  }, [user, searchTerm]);

  const getBestPostsWithUserAction = useCallback(async (): Promise<PostWithUserAction[]> => {
    try {
      let query = supabase.rpc('get_posts_with_user_action', {
        _user_id: user?.id ?? null,
      });

      query = query.order('like_count', { ascending: false });
      query = query.limit(30);
      if (searchTerm && searchTerm.trim() !== '') {
        query = query.like('title', `%${searchTerm.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('베스트 게시글을 가져오는 중 오류 발생:', error);
        return [];
      }

      // 사용자 정보 없이 포스트만 반환
      const postsWithUserActions = ((data as PostWithUserAction[]) || []).map((post) => ({
        ...post,
      }));

      return postsWithUserActions;
    } catch (error) {
      console.error('베스트 게시글을 가져오는 중 오류 발생:', error);
      return [];
    }
  }, [user, searchTerm]);

  return { getBestPlacesWithUserAction, getBestPostsWithUserAction };
};
