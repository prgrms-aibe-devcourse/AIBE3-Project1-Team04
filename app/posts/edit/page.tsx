'use client';

import Header from '@/components/Header';
import PostForm from './PostForm';
import { Suspense } from 'react';

export default function EditPostPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">게시글 수정</h1>
          <p className="text-gray-600">여행 경험을 공유하고 다른 여행자들에게 도움을 주세요</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <PostForm />
        </Suspense>
      </div>
    </div>
  );
}
