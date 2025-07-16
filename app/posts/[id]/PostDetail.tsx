
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import ContentTab from './ContentTab';
import ItineraryTab from './ItineraryTab';
import ReviewSection from './ReviewSection';
import PlaceDetailModal from './PlaceDetailModal';

interface PostDetailProps {
  postId: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'content' | 'reviews'>('itinerary');
  const [likes, setLikes] = useState(203);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const post = {
    id: postId,
    title: '제주도 3박 4일 완벽 여행 코스',
    category: '자연관광',
    region: '제주',
    author: '제주도러버',
    rating: 4.8,
    ratingCount: 15,
    views: 1250,
    cost: 450000,
    duration: '3박4일',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    createdAt: '2024-01-20',
    mainImage: 'https://readdy.ai/api/search-image?query=Beautiful%20Jeju%20Island%20landscape%20with%20Hallasan%20mountain%2C%20emerald%20ocean%2C%20volcanic%20rocks%2C%20tourists%20hiking%2C%20pristine%20nature%2C%20dramatic%20sky%2C%20Korean%20travel%20destination&width=800&height=400&seq=post_main1&orientation=landscape',
    content: `제주도의 아름다운 자연을 만끽할 수 있는 3박 4일完벽 코스를 소개합니다.

첫째 날은 제주공항에 도착해서 렌터카를 픽업하고 성산일출봉으로 향했습니다. 성산일출봉은 제주도의 대표적인 관광지 중 하나로, 일출을 보기 위해 새벽 일찍 올라가는 것을 추천합니다.

둘째 날에는 한라산 등반을 했습니다. 성판악 코스로 올라가서 백록담까지 다녀오는데 약 9시간 정도 소요됩니다. 체력적으로 힘들지만 정상에서 보는 경치는 정말 장관입니다.

셋째 날은 서귀포 지역을 탐방했습니다. 천지연폭포, 정방폭포를 구경하고 올레길을 걸으며 제주의 자연을 만끽했습니다.

마지막 날에는 제주시내 관광을 하고 공항으로 이동했습니다.`,
    totalDays: 4,
    totalBudget: 450000,
    regions: ['제주시', '서귀포시'],
    categories: ['자연관광', '등산', '문화체험'],
    places: [
      {
        id: '1',
        name: '성산일출봉',
        location: '제주 서귀포시 성산읍',
        category: '관광지',
        visitTime: '06:00 - 08:00',
        cost: 2000,
        memo: '일출이 정말 아름다웠습니다. 새벽 일찍 가는 것을 추천합니다.',
        imageUrl: 'https://readdy.ai/api/search-image?query=Seongsan%20Ilchulbong%20sunrise%20peak%20Jeju%20Island%2C%20volcanic%20crater%20formation%2C%20morning%20golden%20light%2C%20tourists%20hiking%2C%20UNESCO%20world%20heritage%20site%2C%20dramatic%20cliffs%20overlooking%20ocean&width=300&height=200&seq=seongsan1&orientation=landscape',
        images: [
          'https://readdy.ai/api/search-image?query=Seongsan%20Ilchulbong%20crater%20rim%20view%2C%20panoramic%20ocean%20vista%2C%20volcanic%20rock%20formations%2C%20clear%20blue%20sky%2C%20hiking%20trail%2C%20Jeju%20natural%20landscape&width=300&height=200&seq=seongsan2&orientation=landscape',
          'https://readdy.ai/api/search-image?query=Sunrise%20at%20Seongsan%20Ilchulbong%2C%20golden%20hour%20photography%2C%20silhouette%20of%20peak%20against%20colorful%20sky%2C%20peaceful%20ocean%20reflection%2C%20Korean%20travel%20destination&width=300&height=200&seq=seongsan3&orientation=landscape'
        ],
        likes: 42,
      },
      {
        id: '2',
        name: '한라산 백록담',
        location: '제주 제주시 해안동',
        category: '등산',
        visitTime: '07:00 - 16:00',
        cost: 0,
        memo: '체력적으로 힘들지만 정상에서 보는 경치는 장관입니다.',
        imageUrl: 'https://readdy.ai/api/search-image?query=Hallasan%20mountain%20Baengnokdam%20crater%20lake%2C%20highest%20peak%20in%20South%20Korea%2C%20alpine%20vegetation%2C%20hiking%20trails%2C%20misty%20mountain%20atmosphere%2C%20pristine%20nature&width=300&height=200&seq=hallasan1&orientation=landscape',
        images: [
          'https://readdy.ai/api/search-image?query=Hallasan%20summit%20crater%20Baengnokdam%2C%20circular%20lake%20formation%2C%20rocky%20terrain%2C%20mountain%20hikers%2C%20cloudy%20sky%2C%20Jeju%20volcanic%20landscape&width=300&height=200&seq=hallasan2&orientation=landscape',
          'https://readdy.ai/api/search-image?query=Hallasan%20hiking%20trail%20through%20forest%2C%20tall%20pine%20trees%2C%20stone%20steps%2C%20mountain%20path%2C%20natural%20woodland%2C%20Korean%20mountain%20scenery&width=300&height=200&seq=hallasan3&orientation=landscape'
        ],
        likes: 38,
      },
      {
        id: '3',
        name: '천지연폭포',
        location: '제주 서귀포시 천지동',
        category: '관광지',
        visitTime: '14:00 - 15:30',
        cost: 2000,
        memo: '폭포 소리가 마음을 평온하게 해줍니다.',
        imageUrl: 'https://readdy.ai/api/search-image?query=Cheonjiyeon%20Falls%20Jeju%20Island%2C%20cascading%20waterfall%20through%20lush%20green%20forest%2C%20natural%20pool%2C%20tropical%20vegetation%2C%20peaceful%20water%20sound%2C%20scenic%20walking%20path&width=300&height=200&seq=cheonjiyeon1&orientation=landscape',
        images: [
          'https://readdy.ai/api/search-image?query=Cheonjiyeon%20waterfall%20close%20up%20view%2C%20crystal%20clear%20water%20cascade%2C%20moss%20covered%20rocks%2C%20dense%20forest%20surroundings%2C%20natural%20beauty&width=300&height=200&seq=cheonjiyeon2&orientation=landscape',
          'https://readdy.ai/api/search-image?query=Cheonjiyeon%20Falls%20walking%20trail%2C%20wooden%20bridges%2C%20subtropical%20plants%2C%20visitors%20enjoying%20nature%2C%20peaceful%20forest%20atmosphere&width=300&height=200&seq=cheonjiyeon3&orientation=landscape'
        ],
        likes: 35,
      },
    ],
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }

    // 실제 구현시 API 호출
    console.log('Post like toggled:', postId, !isLiked);
  };

  const handlePlaceClick = (place: any) => {
    setSelectedPlace(place);
  };

  const handleCloseModal = () => {
    setSelectedPlace(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/posts" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <i className="ri-arrow-left-line mr-2 w-5 h-5 flex items-center justify-center"></i>
            게시글 목록으로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* 대표 이미지 추가 */}
          <div className="aspect-[2/1] relative overflow-hidden">
            <img
              src={post.mainImage}
              alt={post.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{post.title}</h1>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <i className="ri-map-pin-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span>{post.region}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-user-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-calendar-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span>{post.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-eye-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span>{post.views}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <i className="ri-star-fill text-yellow-400 mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span className="font-medium">{post.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({post.ratingCount})</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {post.cost.toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                    isLiked
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <i className={`ri-heart-${isLiked ? 'fill' : 'line'} w-5 h-5 flex items-center justify-center`}></i>
                  좋아요 {likes}
                </button>
                <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 whitespace-nowrap cursor-pointer">
                  <i className="ri-share-line w-5 h-5 flex items-center justify-center"></i>
                  공유하기
                </button>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 whitespace-nowrap cursor-pointer">
                여행 일정 복사
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-full">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'itinerary'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                여행 일정
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'content'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                여행 후기
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                댓글 ({post.ratingCount})
              </button>
            </div>

            <div>
              {activeTab === 'itinerary' && <ItineraryTab post={post} onPlaceClick={handlePlaceClick} />}
              {activeTab === 'content' && <ContentTab post={post} />}
              {activeTab === 'reviews' && <ReviewSection postId={post.id} />}
            </div>
          </div>
        </div>
      </div>

      {selectedPlace && (
        <PlaceDetailModal place={selectedPlace} onClose={handleCloseModal} />
      )}
    </div>
  );
}
