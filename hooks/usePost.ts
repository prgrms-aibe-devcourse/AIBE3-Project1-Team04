import { supabase } from '@/lib/supabaseClient';
import { PostWithUserAction } from '@/types/post.type';
import { useCallback } from 'react';

export const usePost = () => {
  const getAllPostsWithUserAction = useCallback(async (): Promise<PostWithUserAction[]> => {
    try {
      const { data, error } = await supabase.rpc('get_posts_with_user_action');

      if (error) {
        console.error('게시글을 가져오는 중 오류 발생:', error);
        return [];
      }

      // 사용자 정보 없이 포스트만 반환
      const placesWithUserActions = ((data as PostWithUserAction[]) || []).map((post) => ({
        ...post,
      }));

      return placesWithUserActions;
    } catch (error) {
      console.error('게시글을 가져오는 중 오류 발생:', error);
      return [];
    }
  }, []);
  return { getAllPostsWithUserAction };
};
