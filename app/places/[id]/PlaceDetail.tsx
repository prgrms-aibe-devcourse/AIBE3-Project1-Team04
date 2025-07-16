
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';

interface PlaceDetailProps {
  placeId: string;
}

export default function PlaceDetail({ placeId }: PlaceDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const place = {
    id: parseInt(placeId),
    name: '경복궁',
    category: '관광지',
    region: '서울',
    location: '서울특별시 종로구 사직로 161',
    detailLocation: '종로구',
    author: '한국문화탐험가',
    rating: 4.8,
    reviewCount: 324,
    views: 1250,
    cost: 3000,
    visitStartTime: '09:00',
    visitEndTime: '17:00',
    memo: '조선 왕조의 대표적인 궁궐로, 특히 근정전과 경회루의 아름다운 건축양식이 인상적이었습니다. 가을 단풍철에 방문하니 더욱 아름다웠고, 수문장 교대식도 볼 수 있어서 좋았습니다. 한복을 입고 가면 무료 입장이 가능해서 더욱 추천합니다.',
    images: [
      'https://readdy.ai/api/search-image?query=Beautiful%20traditional%20Korean%20palace%20Gyeongbokgung%20main%20gate%20Gwanghwamun%20with%20colorful%20autumn%20leaves%2C%20golden%20hour%20lighting%2C%20traditional%20architecture%20details%2C%20serene%20atmosphere%2C%20professional%20photography&width=600&height=400&seq=place_detail1&orientation=landscape',
      'https://readdy.ai/api/search-image?query=Gyeongbokgung%20palace%20throne%20hall%20Geunjeongjeon%20with%20traditional%20Korean%20architecture%2C%20ornate%20decorations%2C%20tourists%20in%20hanbok%2C%20cultural%20heritage%2C%20bright%20daylight&width=600&height=400&seq=place_detail2&orientation=landscape',
      'https://readdy.ai/api/search-image?query=Gyeongbokgung%20palace%20garden%20with%20traditional%20Korean%20pavilion%2C%20pond%20reflection%2C%20autumn%20colors%2C%20peaceful%20atmosphere%2C%20historical%20architecture&width=600&height=400&seq=place_detail3&orientation=landscape',
      'https://readdy.ai/api/search-image?query=Korean%20royal%20guard%20ceremony%20at%20Gyeongbokgung%20palace%2C%20traditional%20colorful%20uniforms%2C%20cultural%20performance%2C%20tourists%20watching%2C%20authentic%20experience&width=600&height=400&seq=place_detail4&orientation=landscape',
      'https://readdy.ai/api/search-image?query=Gyeongbokgung%20palace%20courtyard%20with%20traditional%20Korean%20architecture%2C%20stone%20paths%2C%20visitors%20exploring%2C%20cultural%20heritage%20site%2C%20natural%20lighting&width=600&height=400&seq=place_detail5&orientation=landscape',
      'https://readdy.ai/api/search-image?query=Gyeongbokgung%20palace%20evening%20view%20with%20traditional%20Korean%20architecture%20silhouette%2C%20warm%20lighting%2C%20peaceful%20atmosphere%2C%20historical%20significance&width=600&height=400&seq=place_detail6&orientation=landscape'
    ],
    createdAt: '2024-01-20'
  };

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
                    {place.region}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <i className="ri-map-pin-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                  <span>{place.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="ri-user-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                  <span>{place.author}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <i className="ri-star-fill text-yellow-400 mr-1 w-5 h-5 flex items-center justify-center"></i>
                  <span className="font-bold text-lg">{place.rating}</span>
                  <span className="text-gray-500 ml-1">({place.reviewCount})</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCost(place.cost)}
                </div>
                <div className="text-sm text-gray-500">
                  조회수 {place.views}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-lg mb-3">방문 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="ri-time-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    <span className="text-gray-600">방문 시간:</span>
                    <span className="ml-2 font-medium">{place.visitStartTime} - {place.visitEndTime}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-map-2-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    <span className="text-gray-600">지역:</span>
                    <span className="ml-2 font-medium">{place.region} {place.detailLocation}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-calendar-line mr-3 w-5 h-5 flex items-center justify-center text-gray-600"></i>
                    <span className="text-gray-600">작성일:</span>
                    <span className="ml-2 font-medium">{formatDate(place.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">사진 ({place.images.length}장)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-1">
                  <img
                    src={place.images[selectedImageIndex]}
                    alt={`${place.name} 사진 ${selectedImageIndex + 1}`}
                    className="w-full h-80 object-cover object-top rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {place.images.slice(0, 6).map((image, index) => (
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
