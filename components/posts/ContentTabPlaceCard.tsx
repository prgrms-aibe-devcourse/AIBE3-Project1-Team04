'use Client';
import { DUMMY_IMAGE_URL } from '@/consts';
import { usePlace } from '@/hooks/usePlace';
import { formatCost } from '@/lib/place';
import { copyPlaceUrlToClipboard } from '@/lib/share';
import { PlaceWithUserAction } from '@/types/place.type';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';

interface ContentTabPlaceCardProps {
  place: PlaceWithUserAction;
}

const ContentTabPlaceCard = ({ place }: ContentTabPlaceCardProps) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { togglePlaceLike, togglePlaceFavorite } = usePlace();
  const [selectedImageIndexes, setSelectedImageIndexes] = useState<number>(0);

  const setSelectedImageIndex = (index: number) => {
    setSelectedImageIndexes(index);
  };

  /** 좋아요 기능 */
  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await togglePlaceLike(place.id, isLiked, () => {
      setIsLiked(!isLiked);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    });
  };

  /** 즐겨찾기 기능 */
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await togglePlaceFavorite(place.id, isFavorite, () => {
      setIsFavorite(!isFavorite);
    });
  };

  useEffect(() => {
    setLikes(place.like_count ?? 0);
    setIsLiked(place.liked_by_me ?? false);
    setIsFavorite(place.favorite_by_me ?? false);
  }, [place]);
  return (
    <div
      key={place.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center mb-2">
              <button
                onClick={handleFavoriteToggle}
                className={`flex items-center justify-center px-2 py-2 text-sm font-medium rounded-full transition mr-3
                      ${
                        isFavorite
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }
                    `}
              >
                {isFavorite ? (
                  <FaStar className="text-yellow-400 inline w-4 h-4" />
                ) : (
                  <FaRegStar className="text-yellow-400 inline w-4 h-4" />
                )}
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mr-3">
                {place.category}
              </span>
            </div>
            <h4 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h4>
            <div className="flex items-center text-gray-600 mb-2">
              <i className="ri-map-pin-line mr-2 w-5 h-5 flex items-center justify-center"></i>
              <span>
                {place.state_name} {place.city_name}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <i className="ri-star-fill text-yellow-400 mr-1 w-5 h-5 flex items-center justify-center"></i>
              <span className="font-bold text-lg">{place.average_rating}</span>
              <span className="text-gray-500 ml-1">({place.rating_count})</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{formatCost(place.cost)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="font-bold text-lg mb-3">방문 정보</h5>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="ri-time-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                <span className="text-gray-600 whitespace-nowrap">방문 시간:</span>
                <span className="ml-2 font-medium whitespace-nowrap">
                  {format(place.visit_start_time, 'yyyy-MM-dd HH:mm')} -
                  {format(place.visit_end_time, 'yyyy-MM-dd HH:mm')}
                </span>
              </div>
              <div className="flex items-center">
                <i className="ri-heart-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                <span className="text-gray-600">좋아요:</span>
                <span className="ml-2 font-medium">{place.like_count}</span>
              </div>
            </div>
          </div>
        </div>

        {place.image_urls && (
          <div className="mb-8">
            <h5 className="font-bold text-lg mb-4">사진 ({place.image_urls.length}장)</h5>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-1">
                <img
                  src={place.image_urls?.[selectedImageIndexes] || DUMMY_IMAGE_URL}
                  alt={`${place.name} 사진`}
                  className="w-full h-80 object-cover object-top rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {place.image_urls.slice(0, 6).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-lg cursor-pointer ${
                      selectedImageIndexes === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${place.name} 썸네일 ${index + 1}`}
                      className="w-full h-24 object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h5 className="font-bold text-lg mb-4">여행 메모</h5>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{place.memo}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isLiked
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <i
                  className={`ri-heart-${
                    isLiked ? 'fill' : 'line'
                  } mr-2 w-5 h-5 flex items-center justify-center`}
                ></i>
                좋아요 {likes}
              </button>
              <button
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap cursor-pointer"
                onClick={() => copyPlaceUrlToClipboard(place.id)}
              >
                <i className="ri-share-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                공유하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTabPlaceCard;
