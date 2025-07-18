'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { supabase } from '@/lib/supabaseClient';

interface Post {
  id: string;
  title: string;
  category: string;
  region: string;
  author: string;
  rating: number;
  ratingCount: number;
  views: number;
  cost: number;
  imageUrl: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  duration: string;
  likes: number;
  isLiked: boolean;
  isFavorited: boolean;
}

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 여행 기간 계산 함수
  function calculateDuration(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return '기간미정';

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '당일치기';
    if (diffDays === 1) return '1박 2일';
    return `${diffDays - 1}박 ${diffDays}일`;
  }

  // 카테고리 포맷팅 함수
  function formatCategories(categories: string[] | null): string {
    if (!categories || categories.length === 0) return '기타';
    if (categories.length === 1) return categories[0];
    return `${categories[0]} 외 ${categories.length - 1}개`;
  }

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

    async function fetchPosts() {
      const { data, error } = await supabase.from('post_list_view').select('*');
      if (error) {
        console.error(error);
        return;
      }

      const formattedPosts: Post[] = data.map((post) => ({
        id: post.post_id,
        title: post.title,
        category: formatCategories(post.categories),
        region: post.city_name || '지역미정',
        author: post.email, // TODO: 작성자의 이름을 사용하도록 수정 필요
        rating: post.avg_rating || 0,
        ratingCount: post.review_count || 0,
        views: post.view_count || 0,
        cost: post.total_cost || 0,
        // TODO: 정확히 연결된 이미지 사용 필요
        imageUrl:
          'https://readdy.ai/api/search-image?query=Traditional%20Korean%20hanok%20village%20in%20Jeonju%20with%20beautiful%20wooden%20architecture%2C%20curved%20rooftiles%2C%20people%20in%20hanbok%20walking%2C%20cultural%20atmosphere%2C%20warm%20afternoon%20lighting&width=400&height=300&seq=place8&orientation=landscape', // 기본 이미지 또는 실제 이미지 URL
        startDate: post.trip_start,
        endDate: post.trip_end,
        createdAt: post.created_at,
        duration: calculateDuration(post.trip_start, post.trip_end),
        likes: post.like_count || 0,
        isLiked: false, // TODO: 사용자별 좋아요 상태는 별도 쿼리 필요
        isFavorited: false, // TODO: 사용자별 즐겨찾기 상태는 별도 쿼리 필요
      }));

      setPosts(formattedPosts);
      setIsLoading(false);
    }

    fetchPosts();
  }, []);

  const filteredPosts = posts
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

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
