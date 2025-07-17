'use client';

import { MyPlaceCardProps } from '@/app/mypage/MockData';
import Link from 'next/link';

export default function MyPlaceCard({ place }: { place: MyPlaceCardProps }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCost = (cost: number) => {
    if (cost === 0) return '무료';
    if (cost >= 10000) {
      return `${(cost / 10000).toFixed(0)}만원`;
    }
    return `${cost.toLocaleString()}원`;
  };

  return (
    <Link href={`/places/${place.id}`}>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative">
          <img
            src={place.imageUrl}
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
              {place.region}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{place.name}</h3>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <i className="ri-map-pin-line mr-1 w-4 h-4 flex items-center justify-center"></i>
            <span className="line-clamp-1">{place.region}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                <i className="ri-star-fill text-yellow-400 mr-1 w-4 h-4 flex items-center justify-center"></i>
                <span className="font-medium text-gray-900">{place.rating}</span>
                <span className="text-gray-500 text-sm ml-1">({100})</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <i className="ri-eye-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                <span>{1000}</span>
              </div>
            </div>
            <div className="text-blue-600 font-bold">{formatCost(100000)}</div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <i className="ri-calendar-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                <span>{place.openTime}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(place.createdAt)}</span>
              </div>
              <button
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors text-gray-500 hover:bg-gray-50`}
              >
                <i className={`ri-heart-line w-4 h-4`}></i>
                <span>{place.likes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
