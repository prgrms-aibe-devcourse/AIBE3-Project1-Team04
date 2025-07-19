'use client';

import Link from 'next/link';
import { MyPlaceViewType } from '@/lib/database';
import { formatCost, getStayDuration_withTime } from '@/lib/place';
import { format } from 'date-fns';

export default function MyPlaceCard({
  place_id,
  name,
  category,
  cost,
  created_at,
  all_images,
  region_states,
  view_total,
  like_total,
  review_count,
  review_rate,
  visit_start_time,
  visit_end_time,
}: MyPlaceViewType) {
  return (
    <Link href={`/places/${place_id}`}>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative">
          <img
            src={all_images[0]} // 대표 이미지로 교체
            alt={name}
            className="w-full h-48 object-cover object-top"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              {category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-black/50 text-white text-xs font-medium rounded-full">
              {region_states[0]}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{name}</h3>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <i className="ri-map-pin-line mr-1 w-4 h-4 flex items-center justify-center"></i>
            <span className="line-clamp-1">{region_states[0]}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                <i className="ri-star-fill text-yellow-400 mr-1 w-4 h-4 flex items-center justify-center"></i>
                <span className="font-medium text-gray-900">{review_rate}</span>
                <span className="text-gray-500 text-sm ml-1">({review_count})</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <i className="ri-eye-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                <span>{view_total}</span>
              </div>
            </div>
            <div className="text-blue-600 font-bold">{formatCost(cost)}</div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <i className="ri-calendar-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                <span>{getStayDuration_withTime(visit_start_time, visit_end_time)}</span>
                <span className="mx-2">•</span>
                <span>{format(created_at, 'yyyy-MM-dd')}</span>
              </div>
              <button
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors text-gray-500 hover:bg-gray-50`}
              >
                <i className={`ri-heart-line w-4 h-4`}></i>
                <span>{like_total}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
