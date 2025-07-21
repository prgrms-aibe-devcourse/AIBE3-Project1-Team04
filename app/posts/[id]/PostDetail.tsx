'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import ContentTab from './ContentTab';
import ItineraryTab from './ItineraryTab';
import PlaceDetailModal from './PlaceDetailModal';
import { usePost } from '@/hooks/usePost';
import { formatCost, getStayDuration } from '@/lib/place';
import { PlaceWithUserAction } from '@/types/place.type';
import { formatCategories, formatRegions } from '@/lib/post';
import { DUMMY_IMAGE_URL } from '@/consts';
import PostReviewForm from '@/components/posts/PostReviewForm';
import { PostWithUserAction } from '@/types/post.type';
import { compareAsc } from 'date-fns';

interface PostDetailProps {
  postId: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'content'>('itinerary');
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [post, setPost] = useState<PostWithUserAction | null>(null);
  const { getPostWithUserAction } = usePost();

  const fetchPostWithPlace = useCallback(async () => {
    try {
      const data = await getPostWithUserAction(postId);
      if (data) {
        const sortedPostByPlace = {
          ...data,
          places: [...data.places].sort((a, b) =>
            compareAsc(new Date(a.visit_start_time), new Date(b.visit_start_time))
          ),
        };
        setPost(sortedPostByPlace);
        setLikes(sortedPostByPlace.like_count);
      }
    } catch (error) {
      console.error('해당 여행지를 가져오는 중 오류 발생:', error);
    }
  }, [postId, getPostWithUserAction]);

  useEffect(() => {
    fetchPostWithPlace();
  }, [fetchPostWithPlace]);

  if (!post) return;

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

  const handlePlaceClick = (place: PlaceWithUserAction) => {
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
          <Link
            href="/posts"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <i className="ri-arrow-left-line mr-2 w-5 h-5 flex items-center justify-center"></i>
            게시글 목록으로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* 대표 이미지 추가 */}
          <div className="aspect-[2/1] relative overflow-hidden">
            <img
              src={post.thumbnail_url || DUMMY_IMAGE_URL}
              alt={post.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {formatCategories(post.places)}
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
                    <span>{formatRegions(post.places)}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-user-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span>{post.user_name}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-calendar-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span>{getStayDuration(post.visit_start_time, post.visit_end_time)}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-eye-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span>{post.view_count}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <i className="ri-star-fill text-yellow-400 mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span className="font-medium">{post.average_rating ?? 0}</span>
                    <span className="text-gray-500 text-sm ml-1">({post.rating_count})</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatCost(post.places.reduce((sum, place) => sum + place.cost, 0))}
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
                  <i
                    className={`ri-heart-${
                      isLiked ? 'fill' : 'line'
                    } w-5 h-5 flex items-center justify-center`}
                  ></i>
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
            </div>

            <div>
              {activeTab === 'itinerary' && (
                <ItineraryTab post={post} onPlaceClick={handlePlaceClick} />
              )}
              {activeTab === 'content' && <ContentTab post={post} />}
            </div>
          </div>
        </div>
        <PostReviewForm postId={postId} />
      </div>
      {selectedPlace && <PlaceDetailModal place={selectedPlace} onClose={handleCloseModal} />}
    </div>
  );
}
