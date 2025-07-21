'use client';

import ContentTabPlaceCard from '@/components/posts/ContentTabPlaceCard';
import { PostWithUserAction } from '@/types/post.type';
import { Dispatch, SetStateAction } from 'react';

interface ContentTabProps {
  post: PostWithUserAction;
  setPost: Dispatch<SetStateAction<PostWithUserAction | null>>;
}

export default function ContentTab({ post, setPost }: ContentTabProps) {
  return (
    <div className="space-y-8">
      {/* 본문 내용 */}
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed text-lg">{post.content}</p>
      </div>

      {/* 여행지별 상세보기 */}
      <div className="space-y-8">
        <h3 className="text-lg font-bold">여행지 상세보기</h3>

        {post.places.map((place) => {
          return <ContentTabPlaceCard key={place.id} place={place} />;
        })}
      </div>
    </div>
  );
}
