'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { supabase } from '@/lib/supabaseClient';

const mockPosts = [
  {
    id: '1',
    title: '부산 3박 4일 완벽 코스 - 해운대부터 감천문화마을까지',
    category: '가족여행',
    region: '부산광역시',
    author: '김여행',
    rating: 4.8,
    ratingCount: 156,
    views: 2340,
    cost: 450000,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Beautiful%20Busan%20Haeundae%20Beach%20cityscape%20with%20modern%20buildings%20and%20ocean%20view%2C%20vibrant%20blue%20sky%2C%20tourist%20destination%2C%20clean%20minimalist%20background%2C%20professional%20photography&width=400&height=300&seq=busan-post1&orientation=landscape',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    createdAt: '2024-01-20',
    duration: '3박 4일',
    likes: 87,
    isLiked: true,
    isFavorited: false,
  },
  {
    id: '2',
    title: '제주도 자연 힐링 여행 - 한라산과 성산일출봉',
    category: '자연여행',
    region: '제주특별자치도',
    author: '박자연',
    rating: 4.9,
    ratingCount: 203,
    views: 3450,
    cost: 380000,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Jeju%20Island%20natural%20landscape%2C%20Hallasan%20mountain%20view%2C%20lush%20green%20fields%2C%20volcanic%20island%20scenery%2C%20pristine%20nature%2C%20peaceful%20atmosphere&width=400&height=300&seq=jeju-post1&orientation=landscape',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    createdAt: '2024-02-15',
    duration: '2박 3일',
    likes: 124,
    isLiked: false,
    isFavorited: true,
  },
  {
    id: '3',
    title: '경주 역사문화탐방 당일치기 완벽가이드',
    category: '문화여행',
    region: '경상북도',
    author: '이역사',
    rating: 4.7,
    ratingCount: 89,
    views: 1890,
    cost: 120000,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Gyeongju%20historical%20sites%20with%20ancient%20Korean%20temples%2C%20traditional%20pagodas%2C%20cherry%20blossoms%2C%20and%20cultural%20heritage%20buildings.%20Serene%20atmosphere%20with%20traditional%20Korean%20architecture&width=400&height=300&seq=gyeongju-post1&orientation=landscape',
    startDate: '2024-03-05',
    endDate: '2024-03-05',
    createdAt: '2024-03-08',
    duration: '당일치기',
    likes: 45,
    isLiked: false,
    isFavorited: false,
  },
  {
    id: '4',
    title: '강릉 바다카페 힐링투어 1박2일',
    category: '커플여행',
    region: '강원도',
    author: '최바다',
    rating: 4.6,
    ratingCount: 134,
    views: 2670,
    cost: 280000,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Gangneung%20seaside%20coffee%20street%20with%20cozy%20cafes%2C%20ocean%20view%2C%20sandy%20beaches%2C%20and%20modern%20coffee%20shops.%20Relaxing%20atmosphere%20with%20ocean%20breeze%20and%20Korean%20coastal%20town%20charm&width=400&height=300&seq=gangneung-post1&orientation=landscape',
    startDate: '2024-03-15',
    endDate: '2024-03-16',
    createdAt: '2024-03-18',
    duration: '1박 2일',
    likes: 78,
    isLiked: true,
    isFavorited: false,
  },
  {
    id: '5',
    title: '전주 한옥마을 맛집투어 1박2일',
    category: '맛집여행',
    region: '전라북도',
    author: '정맛집',
    rating: 4.8,
    ratingCount: 167,
    views: 3120,
    cost: 200000,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Jeonju%20Hanok%20Village%20with%20traditional%20Korean%20houses%2C%20street%20food%20markets%2C%20Korean%20traditional%20cuisine%2C%20and%20cultural%20experiences.%20Authentic%20Korean%20architecture%20with%20wooden%20buildings&width=400&height=300&seq=jeonju-post1&orientation=landscape',
    startDate: '2024-03-20',
    endDate: '2024-03-21',
    createdAt: '2024-03-23',
    duration: '1박 2일',
    likes: 96,
    isLiked: false,
    isFavorited: true,
  },
  {
    id: '6',
    title: '설악산 단풍 트레킹 2박3일',
    category: '액티비티',
    region: '강원도',
    author: '산악왕',
    rating: 4.9,
    ratingCount: 98,
    views: 2340,
    cost: 350000,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Seoraksan%20National%20Park%20autumn%20foliage%20with%20colorful%20maple%20trees%2C%20mountain%20hiking%20trails%2C%20traditional%20Korean%20temples%2C%20and%20hot%20springs.%20Beautiful%20fall%20colors%20with%20red%20and%20yellow%20leaves&width=400&height=300&seq=seorak-post1&orientation=landscape',
    startDate: '2024-10-15',
    endDate: '2024-10-17',
    createdAt: '2024-10-20',
    duration: '2박 3일',
    likes: 67,
    isLiked: false,
    isFavorited: false,
  },
  {
    id: '7',
    title: '여수 밤바다 야경투어 1박2일',
    category: '커플여행',
    region: '전라남도',
    author: '야경매니아',
    rating: 4.7,
    ratingCount: 123,
    views: 2890,
    cost: 320000,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Yeosu%20night%20sea%20view%20with%20beautiful%20harbor%20lights%2C%20cable%20car%2C%20marine%20city%20skyline%2C%20romantic%20evening%20atmosphere%2C%20Korean%20coastal%20city%20at%20night&width=400&height=300&seq=yeosu-post1&orientation=landscape',
    startDate: '2024-04-01',
    endDate: '2024-04-02',
    createdAt: '2024-04-05',
    duration: '1박 2일',
    likes: 89,
    isLiked: true,
    isFavorited: true,
  },
  {
    id: '8',
    title: '인천 차이나타운 당일여행',
    category: '문화여행',
    region: '인천광역시',
    author: '도시탐험가',
    rating: 4.3,
    ratingCount: 67,
    views: 1560,
    cost: 80000,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Incheon%20Chinatown%20with%20traditional%20Chinese%20architecture%2C%20colorful%20buildings%2C%20street%20food%20vendors%2C%20cultural%20district%2C%20vibrant%20urban%20atmosphere&width=400&height=300&seq=incheon-post1&orientation=landscape',
    startDate: '2024-04-10',
    endDate: '2024-04-10',
    createdAt: '2024-04-12',
    duration: '당일치기',
    likes: 23,
    isLiked: false,
    isFavorited: false,
  },
];

const categories = ['전체', '가족여행', '커플여행', '자연여행', '문화여행', '맛집여행', '액티비티'];

const sortOptions = [
  { value: 'popular', label: '인기순' },
  { value: 'latest', label: '최신순' },
  { value: 'rating', label: '평점순' },
  { value: 'cost-low', label: '비용 낮은순' },
  { value: 'cost-high', label: '비용 높은순' },
];

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [regions, setRegions] = useState(['전체']);

  useEffect(() => {
    async function fetchRegions() {
      const { data, error } = await supabase.from('regions_state').select('name');
      if (error) {
        console.error(error);
        return;
      }
      // state 테이블의 name만 추출해서 배열로 만듦
      const regionNames = data.map((row) => row.name).filter(Boolean);
      setRegions(['전체', ...regionNames]);
    }
    fetchRegions();
  }, []);

  const filteredPosts = mockPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '전체' || post.category === selectedCategory;
      const matchesRegion = selectedRegion === '전체' || post.region.includes(selectedRegion);

      return matchesSearch && matchesCategory && matchesRegion;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'cost-low':
          return a.cost - b.cost;
        case 'cost-high':
          return b.cost - a.cost;
        default: // popular
          return b.views - a.views;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">여행 게시글</h1>
          <p className="text-gray-600 text-lg">다양한 여행 경험과 팁을 공유하는 공간입니다</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* 검색바 */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line w-5 h-5 flex items-center justify-center text-gray-400"></i>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="게시글 제목, 지역, 작성자로 검색..."
            />
          </div>

          {/* 필터 옵션들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 카테고리 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 지역 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* 정렬 옵션 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 검색 결과 요약 */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            총 <span className="font-medium text-blue-600">{filteredPosts.length}</span>개의 게시글
          </div>
          <Link
            href="/posts/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 whitespace-nowrap cursor-pointer"
          >
            새 게시글 작성
          </Link>
        </div>

        {/* 게시글 목록 */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <i className="ri-file-search-line w-16 h-16 flex items-center justify-center text-gray-300 mx-auto mb-4 text-4xl"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색 조건을 시도해보세요</p>
          </div>
        )}

        {/* 페이지네이션 */}
        {filteredPosts.length > 0 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer">1</button>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                2
              </button>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                3
              </button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                10
              </button>
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
