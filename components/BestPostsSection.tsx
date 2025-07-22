'use client';

import { useMainFilter } from '@/hooks/useMainFilter';
import { useMainFilterStore } from '@/stores/mainFilterStore';
import { PlaceWithUserAction } from '@/types/place.type';
import { PostWithUserAction } from '@/types/post.type';
import { useCallback, useEffect, useState } from 'react';
import PlaceCard from './places/PlaceCard';
import PostCard from './posts/PostCard';

export default function BestPostsSection() {
  const activeTab = useMainFilterStore((state) => state.activeTab);
  const setActiveTab = useMainFilterStore((state) => state.setActiveTab);
  const [places, setPlaces] = useState<PlaceWithUserAction[]>([]);
  const [posts, setPosts] = useState<PostWithUserAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getBestPlacesWithUserAction, getBestPostsWithUserAction } = useMainFilter();

  const fetchBestPlaces = useCallback(async () => {
    try {
      const data = await getBestPlacesWithUserAction();

      setPosts([]);
      setPlaces(data);
    } catch (error) {
      console.error('여행지 목록을 가져오는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getBestPlacesWithUserAction]);

  const fetchBestPosts = useCallback(async () => {
    try {
      const data = await getBestPostsWithUserAction();

      setPlaces([]);
      setPosts(data);
    } catch (error) {
      console.error('여행지 목록을 가져오는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getBestPostsWithUserAction]);

  useEffect(() => {
    setIsLoading(true);
    if (activeTab === 'post') fetchBestPosts();
    else if (activeTab === 'place') fetchBestPlaces();
  }, [activeTab, fetchBestPosts, fetchBestPlaces]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            베스트 {activeTab === 'post' ? `여행 계획` : `여행지`} Top 30
          </h2>
          <p className="text-gray-600 text-lg">
            다른 여행자들이 추천하는 인기 여행 코스를 확인해보세요
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('post')}
            className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium transition-colors
      ${
        activeTab === 'post'
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300'
      }
    `}
          >
            게시글
          </button>
          <button
            onClick={() => setActiveTab('place')}
            className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium transition-colors
      ${
        activeTab === 'place'
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300'
      }
    `}
          >
            여행지
          </button>
        </div>
        {isLoading && <span>데이터를 불러오는 중입니다...</span>}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
