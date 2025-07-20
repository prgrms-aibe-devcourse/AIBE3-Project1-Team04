'use client';

import Link from 'next/link';
import { useState } from 'react';

interface PostCardProps {
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
  likes?: number;
  isLiked?: boolean;
}

export default function PostCard({
  id,
  title,
  category,
  region,
  author,
  rating,
  ratingCount,
  views,
  cost,
  imageUrl,
  createdAt,
  duration,
  likes = 0,
  isLiked = false,
}: PostCardProps) {
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentIsLiked, setCurrentIsLiked] = useState(isLiked);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentIsLiked) {
      setCurrentLikes((prev) => prev - 1);
      setCurrentIsLiked(false);
    } else {
      setCurrentLikes((prev) => prev + 1);
      setCurrentIsLiked(true);
    }

    // 실제 구현시 API 호출
    console.log('Post like toggled:', id, !currentIsLiked);
  };

  function formatDate(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  return (
    <Link href={`/posts/${id}`} className="cursor-pointer">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {category}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>

          <div className="flex items-center gap-2 mb-3">
            <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center text-gray-500"></i>
            <span className="text-gray-600 text-sm">{region}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <i className="ri-star-fill w-4 h-4 flex items-center justify-center text-yellow-500"></i>
                <span className="font-medium text-sm">{rating}</span>
                <span className="text-gray-500 text-sm">({ratingCount})</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <i className="ri-eye-line w-4 h-4 flex items-center justify-center text-gray-500"></i>
                <span className="text-gray-500 text-sm">{views}회</span>
              </div>
            </div>
            <span className="font-bold text-blue-600">{cost.toLocaleString()}원</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>{duration}</span>
            <div className="flex items-center gap-1">
              <i className="ri-user-line w-4 h-4 flex items-center justify-center text-gray-500"></i>
              <span>{author}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-400">{formatDate(createdAt)}</div>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors ${
                currentIsLiked ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <i className={`ri-heart-${currentIsLiked ? 'fill' : 'line'} w-4 h-4`}></i>
              <span>{currentLikes}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
