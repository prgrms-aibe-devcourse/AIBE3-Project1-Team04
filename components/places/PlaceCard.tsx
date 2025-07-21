'use client';

import Link from 'next/link';
import { PlaceWithUserAction } from '@/types/place.type';
import { getStayDuration } from '@/lib/place';
import { formatCost } from '@/lib/place';
import { format } from 'date-fns';
import { DUMMY_IMAGE_URL } from '@/consts';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

export default function PlaceCard({ place }: { place: PlaceWithUserAction }) {
  const { user } = useAuth();

  const [likes, setLikes] = useState<number>(place.like_count ?? 0);
  const [isLiked, setIsLiked] = useState<boolean>(place.liked_by_me ?? false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

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
            src={place?.thumbnail_image_url || DUMMY_IMAGE_URL}
            alt={place?.name || '장소 이미지'}
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
              <span>{place.user_name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <i className="ri-star-fill text-yellow-400 mr-1 w-4 h-4 flex items-center justify-center" />
              <span className="font-medium text-gray-900">{place.average_rating ?? 0}</span>
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
                <span>{getStayDuration(place.visit_start_time, place.visit_end_time)}</span>
                <span className="mx-2">•</span>
                <span>
                  {place.visit_start_time ? format(place.visit_start_time, 'yyyy-MM-dd') : '-'}
                </span>
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
