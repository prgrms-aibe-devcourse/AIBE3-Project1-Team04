'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
              {user && (
                <Link
                  href="/posts/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  글쓰기
                </Link>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-white text-sm"></i>
                    </div>
                    <span className="font-medium">{user.name ?? '-'}님</span>
                    <i className="ri-arrow-down-s-line text-sm"></i>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <Link
                        href="/mypage"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        마이페이지
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        설정
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/auth?isLogin=true"
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-medium"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth?isLogin=false"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </nav>
          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="ri-menu-line w-6 h-6 flex items-center justify-center text-xl"></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
              >
                홈
              </Link>
              <Link
                href="/posts"
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
              >
                게시글
              </Link>
              <Link
                href="/places"
                className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer"
              >
                여행지
              </Link>
              {user && (
                <Link
                  href="/posts/create"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-fit whitespace-nowrap cursor-pointer"
                >
                  글쓰기
                </Link>
              )}

              {user ? (
                <div className="pt-2 border-t">
                  <Link
                    href="/mypage"
                    className="block py-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                  >
                    마이페이지
                  </Link>
                  <Link
                    href="/settings"
                    className="block py-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                  >
                    설정
                  </Link>
                  <button
                    onClick={signOut}
                    className="block py-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link
                    href="/auth?isLogin=true"
                    className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/auth?isLogin=false"
                    className="flex-1 text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
