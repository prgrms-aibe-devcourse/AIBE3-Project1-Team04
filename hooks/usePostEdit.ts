import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export interface GetPostAndPlacesResult {
  post: {
    title: string;
    content: string;
    representative_place_id: number;
  };
  places: Array<{
    place_id: number;
    currentPlace: {
      name: string;
      category: string;
      city_id: number;
      state_id: number;
      cost: number;
      visit_start_time: string; // ISO timestamp
      visit_end_time: string; // ISO timestamp
      memo: string | null;
      isviewed: boolean;
      rep_image_url: string;
      images: Array<{
        image_url: string;
        is_representative: boolean;
      }>;
    };
  }>;
}

function usePostEdit() {
  const params = useSearchParams();
  const postId = useRef<string>(params.get('post')!);
  const router = useRouter();
  const [resData, setResData] = useState<GetPostAndPlacesResult>({
    post: {
      title: '',
      content: '',
      representative_place_id: 0,
    },
    places: [],
  });

  useEffect(() => {
    if (!postId.current) {
      console.error('유효하지 않은 게시글 ID 입니다.');
      router.replace('/404');
    }
  }, [router]);

  useEffect(() => {
    const getPostData = async () => {
      const { data: postData, error: postError } = await supabase.rpc('get_post_and_places_new', {
        _post_id: postId.current,
      });

      if (postError) {
        console.error('RPC 오류:', postError);
        return;
      }

      setResData(postData);
    };
    getPostData();
  }, [params]);

  return { postId: postId.current, resData, setResData, router };
}

export default usePostEdit;
