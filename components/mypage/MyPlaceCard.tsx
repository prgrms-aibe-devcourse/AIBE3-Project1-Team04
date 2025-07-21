'use client';

import Link from 'next/link';
import { MyPlaceViewType } from '@/types/mypage.type';
import { formatCost, getStayDuration_withTime } from '@/lib/place';
import { format } from 'date-fns';
import { DUMMY_IMAGE_URL } from '@/consts';
import { formatRegions, formatRating } from '@/lib/post';

export default function MyPlaceCard({
  place_id,
  name,
  category,
  cost,
  created_at,
  region_states,
  view_total,
  like_total,
  review_count,
  review_rate,
  visit_start_time,
  visit_end_time,
  thumbnail_url,
}: MyPlaceViewType) {
  return (
    <Link href={`/places/${place_id}`}>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative">
          <img
            src={thumbnail_url || DUMMY_IMAGE_URL}
            alt={name || '장소 이미지'}
            className="w-full h-48 object-cover object-top"
          />

          <section className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              {category}
            </span>
            <span className="px-2 py-1 bg-black/50 text-white text-xs font-medium rounded-full">
              {formatRegions(region_states)}
            </span>
          </section>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{name}</h3>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <i className="ri-map-pin-line mr-1 w-4 h-4 flex items-center justify-center" />
            <span className="line-clamp-1">{formatRegions(region_states)}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <i className="ri-star-fill text-yellow-400 mr-1 w-4 h-4 flex items-center justify-center" />
              <span className="font-medium text-gray-900">{formatRating(review_rate)}</span>
              <span className="text-gray-500 text-sm ml-1">({review_count})</span>

              <i className="ri-eye-line ml-4 mr-1 w-4 h-4 flex items-center justify-center" />
              <span>{view_total}</span>
            </div>

            <div className="text-blue-600 font-bold">{formatCost(cost)}</div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <i className="ri-calendar-line mr-1 w-4 h-4 flex items-center justify-center" />
                <span>{getStayDuration_withTime(visit_start_time, visit_end_time)}</span>
                <span className="mx-2">•</span>
                <span>{created_at ? format(created_at, 'yyyy-MM-dd') : '-'}</span>
              </div>
              <div className={'flex gap-1 px-2 py-1 rounded-full text-sm text-gray-500'}>
                <i className={`ri-heart-fill w-4 h-4`} />
                <span>{like_total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
