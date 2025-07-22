import { supabase } from '@/lib/supabaseClient';

export async function searchAllByKeyword(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) return [];

  const keywordFilter = `%${trimmedQuery}%`;

  try {
    // 게시글 검색
    const { data: postData, error: postError } = await supabase
      .rpc('get_posts_with_user_action', { _user_id: null })
      .like('title', keywordFilter);

    if (postError) throw postError;

    const posts = (postData || []).map((post: any) => ({
      ...post,
      source: 'post',
    }));

    // 여행지 검색
    const { data: placeData, error: placeError } = await supabase
      .rpc('get_places_with_user_action', { _user_id: null })
      .like('name', keywordFilter);

    if (placeError) throw placeError;

    const places = (placeData || []).map((place: any) => ({
      ...place,
      source: 'place',
    }));

    // 통합 결과 반환
    return [...posts, ...places];
  } catch (error) {
    console.error('통합 검색 오류:', error);
    return [];
  }
}
