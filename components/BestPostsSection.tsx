'use client';

import { useState } from 'react';
import PostCard from './PostCard';

const mockPosts = [
  {
    id: '1',
    title: '제주도 3박 4일 완벽 여행 코스 - 서귀포 중심으로',
    category: '자연/관광',
    region: '제주도',
    author: '여행매니아',
    rating: 4.8,
    ratingCount: 142,
    views: 2840,
    cost: 450000,
    imageUrl: 'https://readdy.ai/api/search-image?query=Beautiful%20Jeju%20Island%20scenic%20landscape%20with%20volcanic%20rocks%2C%20blue%20ocean%2C%20traditional%20architecture%2C%20and%20lush%20green%20nature.%20Bright%20sunny%20day%20with%20clear%20blue%20sky.%20Tourism%20destination%20in%20South%20Korea.%20High%20quality%20photography%20with%20vibrant%20colors%20and%20excellent%20composition.&width=400&height=300&seq=jeju1&orientation=landscape',
    startDate: '2024-03-15',
    endDate: '2024-03-18',
    createdAt: '2024-03-20',
    duration: '3박 4일'
  },
  {
    id: '2',
    title: '부산 해안 드라이브 & 맛집 투어 2박 3일',
    category: '맛집/카페',
    region: '부산광역시',
    author: '부산토박이',
    rating: 4.6,
    ratingCount: 98,
    views: 1920,
    cost: 320000,
    imageUrl: 'https://readdy.ai/api/search-image?query=Busan%20coastal%20drive%20scenic%20view%20with%20beautiful%20beaches%2C%20modern%20city%20skyline%2C%20seafood%20restaurants%2C%20and%20Korean%20traditional%20markets.%20Ocean%20waves%20and%20seagulls.%20Bright%20daylight%20with%20clear%20weather.%20Travel%20photography%20showcasing%20Korean%20coastal%20city%20culture.&width=400&height=300&seq=busan1&orientation=landscape',
    startDate: '2024-04-01',
    endDate: '2024-04-03',
    createdAt: '2024-04-05',
    duration: '2박 3일'
  },
  {
    id: '3',
    title: '경주 역사 문화 탐방 당일치기 완벽 가이드',
    category: '역사/문화',
    region: '경상북도',
    author: '역사여행러',
    rating: 4.9,
    ratingCount: 67,
    views: 1456,
    cost: 85000,
    imageUrl: 'https://readdy.ai/api/search-image?query=Gyeongju%20historical%20sites%20with%20ancient%20Korean%20temples%2C%20traditional%20pagodas%2C%20cherry%20blossoms%2C%20and%20cultural%20heritage%20buildings.%20Serene%20atmosphere%20with%20traditional%20Korean%20architecture.%20Spring%20season%20with%20beautiful%20lighting%20and%20cultural%20tourism%20elements.&width=400&height=300&seq=gyeongju1&orientation=landscape',
    startDate: '2024-04-10',
    endDate: '2024-04-10',
    createdAt: '2024-04-12',
    duration: '당일치기'
  },
  {
    id: '4',
    title: '강릉 바다 & 커피 거리 힐링 여행 1박 2일',
    category: '자연/관광',
    region: '강원도',
    author: '커피러버',
    rating: 4.7,
    ratingCount: 89,
    views: 2156,
    cost: 180000,
    imageUrl: 'https://readdy.ai/api/search-image?query=Gangneung%20seaside%20coffee%20street%20with%20cozy%20cafes%2C%20ocean%20view%2C%20sandy%20beaches%2C%20and%20modern%20coffee%20shops.%20Relaxing%20atmosphere%20with%20ocean%20breeze%20and%20Korean%20coastal%20town%20charm.%20Natural%20lighting%20with%20peaceful%20seaside%20ambiance.&width=400&height=300&seq=gangneung1&orientation=landscape',
    startDate: '2024-03-28',
    endDate: '2024-03-29',
    createdAt: '2024-03-31',
    duration: '1박 2일'
  },
  {
    id: '5',
    title: '전주 한옥마을 & 전통음식 체험 1박 2일',
    category: '맛집/카페',
    region: '전라북도',
    author: '한식마니아',
    rating: 4.8,
    ratingCount: 134,
    views: 2890,
    cost: 220000,
    imageUrl: 'https://readdy.ai/api/search-image?query=Jeonju%20Hanok%20Village%20with%20traditional%20Korean%20houses%2C%20street%20food%20markets%2C%20Korean%20traditional%20cuisine%2C%20and%20cultural%20experiences.%20Authentic%20Korean%20architecture%20with%20wooden%20buildings%20and%20tile%20roofs.%20Warm%20lighting%20with%20cultural%20heritage%20atmosphere.&width=400&height=300&seq=jeonju1&orientation=landscape',
    startDate: '2024-04-05',
    endDate: '2024-04-06',
    createdAt: '2024-04-08',
    duration: '1박 2일'
  },
  {
    id: '6',
    title: '설악산 단풍 트레킹 & 온천 힐링 2박 3일',
    category: '자연/관광',
    region: '강원도',
    author: '산악인',
    rating: 4.9,
    ratingCount: 76,
    views: 1678,
    cost: 380000,
    imageUrl: 'https://readdy.ai/api/search-image?query=Seoraksan%20National%20Park%20autumn%20foliage%20with%20colorful%20maple%20trees%2C%20mountain%20hiking%20trails%2C%20traditional%20Korean%20temples%2C%20and%20hot%20springs.%20Beautiful%20fall%20colors%20with%20red%20and%20yellow%20leaves.%20Natural%20mountain%20landscape%20with%20peaceful%20hiking%20atmosphere.&width=400&height=300&seq=seorak1&orientation=landscape',
    startDate: '2024-10-15',
    endDate: '2024-10-17',
    createdAt: '2024-10-20',
    duration: '2박 3일'
  }
];

const categories = ['전체', '자연/관광', '맛집/카페', '역사/문화', '액티비티'];
const sortOptions = ['인기순', '최신순', '평점순', '비용순'];

export default function BestPostsSection() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('인기순');

  const filteredPosts = mockPosts.filter(post => 
    selectedCategory === '전체' || post.category === selectedCategory
  );

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">베스트 여행 계획</h2>
          <p className="text-gray-600 text-lg">다른 여행자들이 추천하는 인기 여행 코스를 확인해보세요</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="sm:ml-auto">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 font-medium whitespace-nowrap cursor-pointer">
            더 많은 게시글 보기
          </button>
        </div>
      </div>
    </section>
  );
}