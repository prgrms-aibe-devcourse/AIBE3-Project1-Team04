'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // ✅ 로그인 세션 확인
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error('로그인 실패:', error?.message || '유저 없음');
        return;
      }

      // ✅ user_metadata에서 name, avatar_url 등 가져오기
      const meta = user.user_metadata;
      const name = meta.name || meta.nickname || meta.full_name || '익명 유저';
      const avatar_url = meta.avatar_url || meta.picture || null;

      // ✅ Supabase DB에 upsert
      const { error: upsertError } = await supabase.from('user_profiles').upsert({
        id: user.id,
        name,
        avatar_url,
      });

      if (upsertError) {
        console.error('프로필 저장 실패:', upsertError.message);
      }

      // ✅ 홈으로 이동
      router.replace('/');
    };

    handleCallback();
  }, [router]);

  return <p>로그인 처리 중입니다...</p>;
}
