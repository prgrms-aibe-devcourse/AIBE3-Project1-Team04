'use client';

import { MyPostViewType } from '@/lib/database';
import { formatCost, getStayDuration_withTime } from '@/lib/place';
import { format } from 'date-fns';
import Link from 'next/link';

export default function MyPostCard({
  id,
  title,
  created_at,
  view_count,
  review_count,
  review_rate,
  total_cost,
  region_states,
  first_start_time,
  last_end_time,
  post_like_count,
  modified_at,
  categories,
}: MyPostViewType) {
  return (
    <Link href={`/posts/${id}`} className="cursor-pointer">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={
              'https://ionwvcdgjauhpubafztg.supabase.co/storage/v1/object/sign/places-image/c76e07a4f26d0e95b67f6e45e29785a9.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDkwYWMyYS0xODk5LTQzM2MtOWZhZS0wZDUwNjQxYzRhZmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFjZXMtaW1hZ2UvYzc2ZTA3YTRmMjZkMGU5NWI2N2Y2ZTQ1ZTI5Nzg1YTkuanBnIiwiaWF0IjoxNzUyODE3NjkzLCJleHAiOjE3NTM0MjI0OTN9.Lm2AdRINm6KSm-pnGNUJfdfUfnQudSVRQPPPv7mvDF4'
            }
            alt={title}
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {categories.map((category) => category).join(', ')}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>

          <div className="flex items-center gap-2 mb-3">
            <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center text-gray-500"></i>
            <span className="text-gray-600 text-sm">
              {region_states.map(({ f1, f2 }) => `${f1} ${f2}`).join(', ')}
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <i className="ri-star-fill w-4 h-4 flex items-center justify-center text-yellow-500"></i>
                <span className="font-medium text-sm">{review_rate}</span>
                <span className="text-gray-500 text-sm">({review_count})</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <i className="ri-eye-line w-4 h-4 flex items-center justify-center text-gray-500"></i>
                <span className="text-gray-500 text-sm">{view_count}회</span>
              </div>
            </div>
            <span className="font-bold text-blue-600">{formatCost(total_cost)}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>{getStayDuration_withTime(first_start_time, last_end_time)}</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-400">{format(created_at, 'yyyy-MM-dd')}</div>
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors text-gray-500 hover:bg-gray-50`}
            >
              <i className={`ri-heart-line w-4 h-4`}></i>
              <span>{post_like_count}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
