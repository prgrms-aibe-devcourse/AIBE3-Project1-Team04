'use client';
import PostCard from '@/components/posts/PostCard';
import SortButton, { SortOption } from '@/components/posts/SortButton';
import { PLACE_CATEGORIES, PLACE_STATES } from '@/consts';
import { SORT_OPTIONS } from '@/consts/post';
import { usePost } from '@/hooks/usePost';
import { FilterOption } from '@/types/post.type';
import { compareAsc } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';

const PostList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [filter, setFilter] = useState<FilterOption>({
    category: selectedCategory,
    region: selectedRegion,
    searchTerm: searchTerm,
  });
  const [posts, setPosts] = useState<any[]>([]);
  const { getAllPostsWithUserAction } = usePost();

  const handleSearchTermChange = (value: string) => setSearchTerm(value);
  const handleSelectedCategoryChange = (value: string) => setSelectedCategory(value);
  const handleSelectedRegionChange = (value: string) => setSelectedRegion(value);

  const handleSearch = () =>
    setFilter({
      category: selectedCategory,
      region: selectedRegion,
      searchTerm: searchTerm,
    });

  const fetchAllPosts = useCallback(async () => {
    try {
      const data = await getAllPostsWithUserAction(sortBy, filter);

      // places 배열 내부 값 필터링
      const filtered = data.filter(
        (post) =>
          // 카테고리 필터
          (filter.category === '전체' ||
            post.places.some((place) => place.category === filter.category)) &&
          // 지역(시/도) 필터
          (filter.region === '전체' ||
            post.places.some((place) => place.state_name === filter.region))
      );

      const sortedPostByPlace = filtered.map((post) => ({
        ...post,
        places: [...post.places].sort((a, b) =>
          compareAsc(new Date(a.visit_start_time), new Date(b.visit_start_time))
        ),
      }));
      setPosts(sortedPostByPlace);
    } catch (error) {
      console.error('게시글 목록을 가져오는 중 오류 발생:', error);
    }
  }, [getAllPostsWithUserAction, sortBy, filter]);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">여행 게시글</h1>
          <p className="text-gray-600">다양한 여행 경험과 팁을 공유하는 공간입니다</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="찾으시는 제목을 검색해보세요."
                  value={searchTerm}
                  onChange={(e) => handleSearchTermChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => handleSelectedCategoryChange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value={'전체'}>전체</option>
                {PLACE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedRegion}
                onChange={(e) => handleSelectedRegionChange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value={'전체'}>전체</option>
                {PLACE_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg border border-blue-500
              transition-all duration-150
              hover:bg-blue-600 hover:shadow-lg hover:scale-105"
              onClick={handleSearch}
            >
              검색
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold text-blue-600">{posts.length}</span>개의 게시글이
            있습니다
          </p>

          <div className="flex gap-2">
            {SORT_OPTIONS.map((opt) => (
              <SortButton
                key={opt.value}
                label={opt.label}
                value={opt.value}
                selected={sortBy === opt.value}
                onClick={handleSortChange}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-map-pin-line text-6xl text-gray-300 mb-4 w-16 h-16 flex items-center justify-center mx-auto"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 필터를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;
