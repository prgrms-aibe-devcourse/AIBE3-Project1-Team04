import { PostEditData, RegionsResponse } from '@/types/mypage.type';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function usePostEdit() {
  const params = useSearchParams();
  const postId = useRef<string>(params.get('post')!);
  const router = useRouter();

  const [postData, setPostData] = useState<PostEditData>({
    title: '',
    content: '',
    stats: {
      place_count: 0,
      total_days: 0,
      total_cost: 0,
    },
    places: [],
  });
  const [regions, setRegions] = useState<RegionsResponse>({});

  useEffect(() => {
    if (!postId.current) {
      console.error('유효하지 않은 게시글 ID 입니다.');
      router.replace('/404');
    }
  }, [router]);

  useEffect(() => {
    const getPostData = async () => {
      const { data: regionData, error: regionError } = await supabase.rpc('get_regions');

      if (regionError) {
        console.error('RPC 오류:', regionError);
        return;
      }

      const { data: postData, error: postError } = await supabase.rpc('get_post_edit_data', {
        _post_id: postId.current,
      });

      if (postError) {
        console.error('RPC 오류:', postError);
        return;
      }

      setRegions(regionData);
      setPostData(postData);
    };
    getPostData();
  }, [params]);

  return { postId: postId.current, postData, setPostData, regions, router };
}

export default usePostEdit;
