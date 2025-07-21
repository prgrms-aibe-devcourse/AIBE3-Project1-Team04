'use client';

import { DUMMY_IMAGE_URL } from '@/consts';
import { formatCost, getStayDuration } from '@/lib/place';
import { PlaceWithUserAction } from '@/types/place.type';
import { PostWithUserAction } from '@/types/post.type';
import { format } from 'date-fns';
import { uniq, uniqBy } from 'lodash';

interface ItineraryTabProps {
  post: PostWithUserAction;
  onPlaceClick: (place: PlaceWithUserAction) => void;
}

export default function ItineraryTab({ post, onPlaceClick }: ItineraryTabProps) {
  // 실제 예산 계산 (places 배열의 cost 합계)
  const actualTotalBudget = post.places.reduce((sum, place) => sum + place.cost, 0);
  const categories = uniq(post.places.map((place) => place.category));
  const regions = uniqBy(
    post.places.map((place) => ({ state: place.state_name, city: place.city_name })),
    (place) => `${place.state}-${place.city}` // 복합 키 기준으로 중복 제거
  );

  return (
    <div>
      {/* 요약 섹션 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
        <h3 className="text-xl font-bold mb-6 text-gray-800">여행 요약</h3>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {getStayDuration(post.visit_start_time, post.visit_end_time)}
            </div>
            <div className="text-sm text-gray-600">총 기간</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-blue-100">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatCost(actualTotalBudget)}
            </div>
            <div className="text-sm text-gray-600">총 예산</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-blue-100">
            <div className="text-2xl font-bold text-purple-600 mb-1">{post.places.length} 개</div>
            <div className="text-sm text-gray-600">여행지</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-blue-100">
            <div className="text-2xl font-bold text-orange-600 mb-1">{regions.length} 개</div>
            <div className="text-sm text-gray-600">방문 지역</div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
            <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center text-blue-600"></i>
              방문 지역
            </h4>
            <div className="flex flex-wrap gap-2">
              {regions.map((region, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {region.state}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
            <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <i className="ri-price-tag-3-line w-4 h-4 flex items-center justify-center text-purple-600"></i>
              카테고리
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 평균 비용 정보 */}
        {post.places.length > 0 && (
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">여행지당 평균 비용</span>
              <span className="font-semibold text-gray-800">
                {formatCost(Math.round(actualTotalBudget / post?.places?.length))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 여행지 목록 */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <i className="ri-route-line w-5 h-5 flex items-center justify-center text-blue-600"></i>
          여행 일정 ({post.places.length}개 여행지)
        </h3>

        {post.places.map((place, index) => (
          <div
            key={place.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200"
          >
            {/* 순서 표시 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* 이미지 */}
              <div className="lg:w-56 flex-shrink-0">
                <div className="relative">
                  <img
                    src={place.thumbnail_image_url || DUMMY_IMAGE_URL}
                    alt={place.name}
                    className="w-full h-40 lg:h-32 object-cover object-top rounded-lg shadow-sm"
                  />
                  {place.image_urls && place.image_urls.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                      + {place.image_urls.length - 1} 장
                    </div>
                  )}
                </div>
              </div>

              {/* 정보 */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                  <div className="mb-3 lg:mb-0">
                    <h4 className="font-bold text-xl text-gray-800 mb-2">{place.name}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center"></i>
                        {place.state_name}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                        {place.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right bg-gray-50 rounded-lg p-3 lg:min-w-[120px]">
                    <div className="text-xs text-gray-600 mb-1">방문 시간</div>
                    <div className="font-semibold text-gray-800">
                      {format(place.visit_start_time, 'HH:mm')} -
                      {format(place.visit_end_time, 'HH:mm')}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2">{place.memo}</p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-lg">
                      {place.cost === 0 ? (
                        <span className="text-green-600">무료</span>
                      ) : (
                        <span className="text-blue-600">{place.cost.toLocaleString()}원</span>
                      )}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <i className="ri-heart-line w-4 h-4 flex items-center justify-center"></i>
                      <span className="text-sm">{place.like_count}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onPlaceClick(place)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer flex items-center gap-2"
                  >
                    <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                    상세보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {post?.places?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <i className="ri-map-pin-line text-4xl mb-4"></i>
            <p>등록된 여행지가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
