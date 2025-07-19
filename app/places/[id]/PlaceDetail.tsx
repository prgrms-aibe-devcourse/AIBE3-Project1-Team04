'use client';

import { useCallback, useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { usePlace } from '@/hooks/usePlace';
import { PlaceWithUserAction } from '@/types/place.type';
import { format } from 'date-fns';
import { formatCost } from '@/lib/cost';

interface PlaceDetailProps {
  placeId: string;
}

export default function PlaceDetail({ placeId }: PlaceDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { getPlaceWithUserAction } = usePlace();
  const [place, setPlace] = useState<PlaceWithUserAction | null>();

  const fetchAllPlaces = useCallback(async () => {
    try {
      const data = await getPlaceWithUserAction(placeId);
      setPlace(data);
    } catch (error) {
      console.error('해당 여행지를 가져오는 중 오류 발생:', error);
    }
  }, [placeId, getPlaceWithUserAction]);

  useEffect(() => {
    fetchAllPlaces();
  }, [fetchAllPlaces]);

  if (!place) return '잘못된 여행지입니다.';

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mr-3">
                    {place.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    {place.state}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <i className="ri-map-pin-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                  <span>{place.state}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="ri-user-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                  <span>{place.user_name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <i className="ri-star-fill text-yellow-400 mr-1 w-5 h-5 flex items-center justify-center"></i>
                  <span className="font-bold text-lg">{place.average_rating}</span>
                  <span className="text-gray-500 ml-1">({place.rating_count})</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCost(place.cost)}
                </div>
                <div className="text-sm text-gray-500">조회수 {place.view_count}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-lg mb-3">방문 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="ri-time-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    <span className="text-gray-600 whitespace-nowrap">방문 시간:</span>
                    <span className="ml-2 font-medium whitespace-nowrap">
                      {format(place.visit_start_time, 'yyyy-MM-dd HH:mm:ss')} -{' '}
                      {format(place.visit_end_time, 'yyyy-MM-dd HH:mm:ss')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-map-2-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    <span className="text-gray-600">지역:</span>
                    <span className="ml-2 font-medium">
                      {place.state} {place.city}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-calendar-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    <span className="text-gray-600">작성일:</span>
                    <span className="ml-2 font-medium">작성일일</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">사진 (장)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-1">
                  {/* <img
                    src={place.images[selectedImageIndex]}
                    alt={`${place.name} 사진 ${selectedImageIndex + 1}`}
                    className="w-full h-80 object-cover object-top rounded-lg"
                  /> */}
                  이미지지
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* {place.images.slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative overflow-hidden rounded-lg ${
                        selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${place.name} 썸네일 ${index + 1}`}
                        className="w-full h-24 object-cover object-top"
                      />
                    </button>
                  ))} */}
                  이미지지
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">여행 메모</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{place.memo}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap">
                    <i className="ri-heart-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                    좋아요
                  </button>
                  <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">
                    <i className="ri-share-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                    공유하기
                  </button>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                  여행 계획에 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
