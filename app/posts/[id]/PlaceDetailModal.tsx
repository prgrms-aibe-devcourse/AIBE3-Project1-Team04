
'use client';

import { useState } from 'react';

interface Place {
  id: string;
  name: string;
  location: string;
  category: string;
  memo: string;
  cost: number;
  visitTime: string;
  imageUrl: string;
  images: string[];
  likes: number;
}

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
}

export default function PlaceDetailModal({ place, onClose }: PlaceDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(place.likes);
  
  const allImages = [place.imageUrl, ...place.images];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCost = (cost: number) => {
    if (cost === 0) return '무료';
    if (cost >= 10000) {
      return `${(cost / 10000).toFixed(0)}만원`;
    }
    return `${cost.toLocaleString()}원`;
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mr-3">
                    {place.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    서울
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <i className="ri-map-pin-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                  <span>{place.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="ri-user-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                  <span>한국문화탐험가</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <i className="ri-star-fill text-yellow-400 mr-1 w-5 h-5 flex items-center justify-center"></i>
                  <span className="font-bold text-lg">4.8</span>
                  <span className="text-gray-500 ml-1">({likes})</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCost(place.cost)}
                </div>
                <div className="text-sm text-gray-500">조회수 1250</div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer mt-2"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-lg mb-3">방문 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="ri-time-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    <span className="text-gray-600">방문 시간:</span>
                    <span className="ml-2 font-medium">{place.visitTime}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-map-2-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    <span className="text-gray-600">지역:</span>
                    <span className="ml-2 font-medium">서울 종로구</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-calendar-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    <span className="text-gray-600">작성일:</span>
                    <span className="ml-2 font-medium">2024년 1월 20일</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">사진 ({allImages.length}장)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-1">
                  <img
                    src={allImages[selectedImageIndex]}
                    alt={`${place.name} 사진 ${selectedImageIndex + 1}`}
                    className="w-full h-80 object-cover object-top rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {allImages.slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative overflow-hidden rounded-lg cursor-pointer ${
                        selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
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

            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">여행 메모</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {place.memo}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      isLiked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <i className={`ri-heart-${isLiked ? 'fill' : 'line'} mr-2 w-5 h-5 flex items-center justify-center`}></i>
                    좋아요
                  </button>
                  <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap cursor-pointer">
                    <i className="ri-share-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                    공유하기
                  </button>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
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
