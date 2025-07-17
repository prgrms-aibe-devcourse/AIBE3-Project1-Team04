import { Suspense } from 'react';
import AuthPageInner from './AuthPageInner';

export default function AuthPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AuthPageInner />
    </Suspense>
  );
}
