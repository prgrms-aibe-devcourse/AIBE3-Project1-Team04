'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-pacifico text-blue-600">TravelPlan</div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                홈
              </Link>
              <Link href="/posts" className="text-gray-700 hover:text-blue-600 font-medium">
                게시글
              </Link>
              <Link href="/places" className="text-gray-700 hover:text-blue-600 font-medium">
                여행지
              </Link>
              <Link
                href="/posts/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 whitespace-nowrap cursor-pointer"
              >
                글쓰기
              </Link>
            </div>
          </nav>

          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="ri-menu-line w-6 h-6 flex items-center justify-center text-xl"></i>
            아이콘
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/posts"
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
              >
                게시글 목록
              </Link>
              <Link
                href="/places"
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
              >
                여행지 목록
              </Link>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 w-fit whitespace-nowrap cursor-pointer">
                게시글 작성
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
