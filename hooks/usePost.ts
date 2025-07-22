import { SortOption } from '@/components/posts/SortButton';
import { supabase } from '@/lib/supabaseClient';
import { PostWithUserAction, PostReview, PostInputType, FilterOption } from '@/types/post.type';
import { useCallback } from 'react';
import { useAuth } from './useAuth';

export const usePost = () => {
  const { user } = useAuth();

  const getAllPostsWithUserAction = useCallback(
    async (sortBy?: SortOption, filter?: FilterOption): Promise<PostWithUserAction[]> => {
      try {
        let query = supabase.rpc('get_posts_with_user_action', {
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
          }
        }

        if (filter?.searchTerm && filter.searchTerm.trim() !== '') {
          query = query.like('title', `%${filter.searchTerm.trim()}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('게시글을 가져오는 중 오류 발생:', error);
          return [];
        }

        // 사용자 정보 없이 포스트만 반환
        let postsWithUserActions = ((data as PostWithUserAction[]) || []).map((post) => ({
          ...post,
        }));

        if (sortBy === 'cost') {
          postsWithUserActions = postsWithUserActions.slice().sort((a, b) => {
            const aCost = a.places.reduce((sum, place) => sum + (place.cost || 0), 0);
            const bCost = b.places.reduce((sum, place) => sum + (place.cost || 0), 0);
            return aCost - bCost;
          });
        }

        return postsWithUserActions;
      } catch (error) {
        console.error('게시글을 가져오는 중 오류 발생:', error);
        return [];
      }
    },
    [user]
  );

  const getPostWithUserAction = useCallback(
    async (postId: string): Promise<PostWithUserAction | null> => {
      try {
        const { data, error } = await supabase
          .rpc('get_posts_with_user_action', {
            _user_id: user?.id ?? null,
          })
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
    [user]
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

  const createPost = useCallback(async (postData: PostInputType) => {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: postData.title,
        content: postData.content,
        representative_place_id: postData.representative_place_id,
        user_id: postData.user_id,
        isviewed: postData.isviewd,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`게시글 등록 실패: ${error?.message}`);
    }

    return data;
  }, []);

  const linkPostToPlaces = useCallback(async (postId: number, placeIds: number[]) => {
    const insertData = placeIds.map((id) => ({
      post_id: postId,
      place_id: id,
    }));

    const { error } = await supabase.from('post_places').insert(insertData);

    if (error) {
      throw new Error(`여행지 연결 실패: ${error.message}`);
    }
  }, []);

  /** 좋아요 토글 */
  const togglePostLike = useCallback(
    async (
      postId: number,
      isLiked: boolean,
      onSuccess: () => void,
      onError?: (error: any) => void
    ) => {
      if (!user) return;

      try {
        if (isLiked) {
          const { error } = await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('post_likes')
            .upsert(
              { post_id: postId, user_id: user.id },
              { onConflict: 'post_id, user_id', ignoreDuplicates: true }
            );

          if (error) throw error;
        }

        onSuccess();
      } catch (error) {
        console.error('게시글 좋아요 기능 에러:', error);
        onError?.(error);
      }
    },
    [user]
  );

  /** 즐겨찾기 토글 */
  const togglePostFavorite = useCallback(
    async (
      postId: number,
      isFavorite: boolean,
      onSuccess: () => void,
      onError?: (error: any) => void
    ) => {
      if (!user) return;

      try {
        if (isFavorite) {
          const { error } = await supabase
            .from('post_favorites')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('post_favorites')
            .upsert(
              { post_id: postId, user_id: user.id },
              { onConflict: 'post_id, user_id', ignoreDuplicates: true }
            );

          if (error) throw error;
        }

        onSuccess();
      } catch (error) {
        console.error('게시글 즐겨찾기 기능 에러:', error);
        onError?.(error);
      }
    },
    [user]
  );

  /** 게시글글 조회 */
  const viewPost = useCallback(
    async (postId: string) => {
      const { error } = await supabase
        .from('post_view_logs')
        .insert({ post_id: postId, user_id: user?.id ?? null });

      if (error) throw error;
    },
    [user]
  );

  return {
    getAllPostsWithUserAction,
    getPostWithUserAction,
    getPostReviews,
    createPostReivew,
    createPost,
    linkPostToPlaces,
    togglePostLike,
    togglePostFavorite,
    viewPost,
  };
};
