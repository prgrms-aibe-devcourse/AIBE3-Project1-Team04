import { supabase } from '@/lib/supabaseClient';
import { PostWithUserAction, PostReview } from '@/types/post.type';
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

  const getPostWithUserAction = useCallback(
    async (postId: string): Promise<PostWithUserAction | null> => {
      try {
        const { data, error } = await supabase
          .rpc('get_posts_with_user_action')
          .eq('id', postId)
          .single();
        if (error) {
          console.error('해당 게시글을 가져오는 중 오류 발생:', error);
          return null;
        }

        // 사용자 정보 없이 포스트만 반환
        return data ? { ...(data as PostWithUserAction) } : null;
      } catch (error) {
        console.error('해당 게시글을 가져오는 중 오류 발생:', error);
        return null;
      }
    },
    []
  );

  const getPostReviews = useCallback(async (postId: string): Promise<PostReview[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_post_reviews_with_user')
        .eq('post_id', postId);
      if (error) {
        console.error('여행지 리뷰 목록을을 가져오는 중 오류 발생:', error);
        return [];
      }

      // 사용자 정보 없이 포스트만 반환
      const PostReviews = ((data as PostReview[]) || []).map((review) => ({
        ...review,
      }));

      return PostReviews;
    } catch (error) {
      console.error('여행지 리뷰 목록을을 가져오는 중 오류 발생:', error);
      return [];
    }
  }, []);

  const createPostReivew = useCallback(
    async (
      review: Omit<PostReview, 'id' | 'created_at' | 'modified_at' | 'user_name' | 'avatar_url'>
    ) => {
      try {
        const { data, error } = await supabase
          .from('post_reviews')
          .insert([review])
          .select()
          .single();

        if (error) {
          console.error('게시글 리뷰 생성 중 오류 발생:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('게시글 리뷰 생성 중 오류 발생:', error);
        return null;
      }
    },
    []
  );

  return { getAllPostsWithUserAction, getPostWithUserAction, getPostReviews, createPostReivew };
};
