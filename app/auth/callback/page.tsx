// /app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error('로그인 실패:', error.message);
      }
      router.replace('/');
    };

    handleCallback();
  }, []);

  return <p>로그인 처리 중입니다...</p>;
}
