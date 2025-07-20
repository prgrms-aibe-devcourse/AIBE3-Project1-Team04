'use client';

import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export interface FullPlace {
  place: {
    id: number;
    name: string;
    state_name: string;
    city_name: string;
    cost: number;
    created_at: string;
    modified_at: string;
    visit_start_time: string;
    visit_end_time: string;
    category: string;
    memo: string;
    isviewed: boolean;
    user_id: string;
    user_nickname: string;
    representive_images: string | null;
    average_rating: string;
    rating_count: number;
    view_count: number;
    like_count: number;
    liked_by_me: boolean;
  };
}

export default function PlaceCard({ place }: FullPlace) {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState<number>(place.like_count ?? 0); // 좋아요 수
  const [isLiked, setIsLiked] = useState<boolean>(place.liked_by_me ?? false); // 좋아요 했는지

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const stayTime = (from: Date | string, to: Date | string = new Date()): string => {
    const start = typeof from === 'string' ? new Date(from) : from;
    const end = typeof to === 'string' ? new Date(to) : to;

    const diffMs = end.getTime() - start.getTime();

    const hourMs = 1000 * 60 * 60;
    const dayMs = hourMs * 24;

    // 1시간 이내
    if (diffMs <= hourMs) {
      return '1시간 이내';
    }

    // 1시간 ~ 23시간
    if (diffMs < dayMs) {
      const hours = Math.floor(diffMs / hourMs);
      return `${hours}시간`;
    }

    // 24시간 이상 → n박n일
    const nights = Math.floor(diffMs / dayMs);
    const days = nights + 1;
    return `${nights}박${days}일`;
  };

  const formatCost = (cost: number) => {
    if (cost === 0) return '무료';
    if (cost >= 10000) {
      return `${(cost / 10000).toFixed(0)}만원`;
    }
    return `${cost.toLocaleString()}원`;
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      // 이미 좋아요 눌렸으면 취소: 삭제
      const { error } = await supabase
        .from('place_likes')
        .delete()
        .eq('place_id', place.id)
        .eq('user_id', user.id);

      if (!error) {
        setLikes(likes - 1);
        setIsLiked(false);
      } else {
        console.error('좋아요 취소 중 에러', error);
      }
    } else {
      // 좋아요 추가: 삽입
      const { error } = await supabase
        .from('place_likes')
        .insert({ place_id: place.id, user_id: user.id });

      if (!error) {
        setLikes(likes + 1);
        setIsLiked(true);
      } else {
        console.error('좋아요 중 에러', error);
      }
    }
  };

  return (
    <Link href={`/places/${place.id}`}>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative">
          <img
            src={place.representive_images}
            alt={place.name}
            className="w-full h-48 object-cover object-top"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              {place.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-black/50 text-white text-xs font-medium rounded-full">
              {place.state_name}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{place.name}</h3>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <i className="ri-map-pin-line mr-1 w-4 h-4 flex items-center justify-center" />
            <span className="line-clamp-1">
              {place.state_name} {place.city_name}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <i className="ri-user-line mr-1 w-4 h-4 flex items-center justify-center" />
              <span>{place.user_nickname}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <i className="ri-star-fill text-yellow-400 mr-1 w-4 h-4 flex items-center justify-center" />
              <span className="font-medium text-gray-900">{place.average_rating}</span>
              <span className="text-gray-500 text-sm ml-1">({place.rating_count})</span>

              <i className="ri-eye-line ml-4 mr-1 w-4 h-4 flex items-center justify-center" />
              <span>{place.view_count}</span>
            </div>

            <div className="text-blue-600 font-bold">{formatCost(place.cost)}</div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <i className="ri-calendar-line mr-1 w-4 h-4 flex items-center justify-center" />
                <span>{stayTime(place.visit_start_time, place.visit_end_time)}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(place.created_at)}</span>
              </div>
              <button
                type="button"
                onClick={handleLike}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
                  isLiked ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <i className={`ri-heart-${isLiked ? 'fill' : 'line'} w-4 h-4`} />
                <span>{likes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
