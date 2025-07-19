'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

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

const categories = ['맛집', '관광', '문화', '휴식', '모험', '자연', '기타'];

const sortOptions = [
  { value: 'latest', label: '최근등록순' },
  { value: 'visit-date', label: '여행지 방문날짜순' },
  { value: 'cost', label: '비용순' },
  { value: 'views', label: '조회순' },
  { value: 'rating', label: '평점순' },
  { value: 'review-count', label: '리뷰 개수순' },
];

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('기타');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('latest');
  const [regions, setRegions] = useState(['전체']);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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

  // 지역명 포맷팅 함수
  function formatRegions(regions: string[] | null): string {
    if (!regions || regions.length === 0) return '지역미정';
    if (regions.length === 1) return regions[0];
    return `${regions[0]} 외 ${regions.length - 1}개`;
  }

  useEffect(() => {
    async function fetchRegions() {
      const { data, error } = await supabase.from('regions_state').select('name');
      if (error) {
        console.error(error);
        return;
      }
      const regionNames = data.map((row) => row.name).filter(Boolean);
      setRegions(['전체', ...regionNames]);
    }
    fetchRegions();
  }, []);

  // 게시글 목록과 좋아요 여부를 함께 불러오는 함수
  async function fetchPostsWithLikes(params?: {
    search?: string;
    region?: string;
    category?: string;
    sort?: string;
  }) {
    setIsLoading(true);
    // 1. 게시글 목록 불러오기
    const { data: postsData, error: postsError } = await supabase.rpc('search_posts', {
      search: params?.search ?? searchQuery,
      region: params?.region ?? selectedRegion,
      category: params?.category ?? selectedCategory,
      sort: params?.sort ?? selectedSort,
    });
    if (postsError) {
      setIsLoading(false);
      alert('게시글을 불러오는 중 오류가 발생했습니다.');
      return;
    }
    // 2. 좋아요 여부 불러오기 (로그인한 유저가 있을 때만)
    let likedData: { post_id: number; liked_by_me: boolean }[] = [];
    if (user?.id) {
      const { data: liked, error: likedError } = await supabase.rpc('get_liked_by_me', {
        _user_id: user.id,
      });
      if (!likedError && liked) {
        likedData = liked;
      }
    }
    // 3. 게시글에 isLiked 정보 매핑
    const posts = (postsData || []).map((post: any) => {
      const likeInfo = likedData.find((d) => d.post_id === post.post_id);
      return {
        id: post.post_id,
        title: post.title,
        category: formatCategories(post.categories),
        region: formatRegions(post.city_name),
        author: post.name ? post.name : '익명',
        rating: post.avg_rating || 0,
        ratingCount: post.review_count || 0,
        views: post.view_count || 0,
        cost: post.total_cost || 0,
        imageUrl:
          'https://readdy.ai/api/search-image?query=Traditional%20Korean%20hanok%20village%20in%20Jeonju%20with%20beautiful%20wooden%20architecture%2C%20curved%20rooftiles%2C%20people%20in%20hanbok%20walking%2C%20cultural%20atmosphere%2C%20warm%20afternoon%20lighting&width=400&height=300&seq=place8&orientation=landscape',
        startDate: post.trip_start,
        endDate: post.trip_end,
        createdAt: post.created_at,
        duration: calculateDuration(post.trip_start, post.trip_end),
        likes: post.like_count || 0,
        isLiked: likeInfo ? likeInfo.liked_by_me : false,
        isFavorited: false,
      };
    });
    setPosts(posts);
    setIsLoading(false);
  }

  // 최초 로딩 및 정렬/필터 변경 시
  useEffect(() => {
    fetchPostsWithLikes();
  }, [selectedCategory, selectedRegion, selectedSort, user]);

  // 검색 버튼/엔터 입력 시
  const handleSearch = () => {
    fetchPostsWithLikes({ search: searchQuery, region: selectedRegion, sort: selectedSort });
  };

  // // 로딩 중일 때 표시
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">게시글을 불러오는 중...</p>
  //       </div>
  //     </div>
  //   );
  // }

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
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="제목"
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
          {/* 검색 버튼 */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 whitespace-nowrap cursor-pointer"
            >
              검색
            </button>
          </div>
        </div>

        {/* 검색 결과 요약 */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            총 <span className="font-medium text-blue-600">{posts.length}</span>개의 게시글
          </div>
          <Link
            href="/posts/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 whitespace-nowrap cursor-pointer"
          >
            새 게시글 작성
          </Link>
        </div>

        {/* 게시글 목록 */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post) => (
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
      </div>
    </div>
  );
}
