'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signUp, signIn, signInWithGoogle, signInWithKakao } from '../../lib/auth';
import Header from '@/components/Header';
import { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { getInitialUser } = useAuth();

  useEffect(() => {
    const messageParam = searchParams.get('message');
    if (messageParam) {
      setMessage(messageParam);
    }
    const loginParam = searchParams.get('isLogin');
    if (loginParam) {
      setIsLogin(loginParam === 'true');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isLogin) {
      const result = await signIn({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || '로그인에 실패했습니다.');
        setIsLoading(false);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      if (!formData.agreeTerms) {
        alert('이용약관에 동의해주세요.');
        return;
      }
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { name: formData.name },
        },
      });

      if (result.success) {
        // 회원가입 성공 시 로그인 페이지로 이동
        await getInitialUser();
        router.push('/');
      } else {
        setError(result.error || '회원가입에 실패했습니다.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[4rem]">
        <Header />
      </div>
      <Suspense fallback={<div>로딩 중...</div>}>
        <div
          className="relative bg-cover bg-center bg-no-repeat min-h-[calc(100vh-4rem)] flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8)), url('https://readdy.ai/api/search-image?query=Peaceful%20Korean%20travel%20landscape%20with%20serene%20mountains%2C%20traditional%20architecture%20elements%2C%20soft%20morning%20light%2C%20minimalist%20composition%20perfect%20for%20login%20background.%20Clean%20and%20professional%20travel%20photography%20with%20calm%20atmosphere%20and%20beautiful%20natural%20scenery.&width=1200&height=800&seq=auth1&orientation=landscape')`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="text-center mb-8">
                    <div
                      className="text-3xl font-bold text-blue-600 mb-4"
                      style={{ fontFamily: 'Pacifico, serif' }}
                    >
                      TravelPlan
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {isLogin ? '로그인' : '회원가입'}
                    </h1>
                    <p className="text-gray-600">
                      {isLogin ? '여행 이야기를 공유해보세요' : '새로운 여행을 시작하세요'}
                    </p>
                  </div>

                  <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                        isLogin
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                        !isLogin
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      회원가입
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          이름
                        </label>
                        <input
                          type="name"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                          placeholder="이름을 입력하세요"
                          required
                        />
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        이메일
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        placeholder="이메일을 입력하세요"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        비밀번호
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        placeholder="비밀번호를 입력하세요"
                        required
                      />
                    </div>

                    {!isLogin && (
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          비밀번호 확인
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                          placeholder="비밀번호를 다시 입력하세요"
                          required
                        />
                      </div>
                    )}

                    {isLogin && (
                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-600">로그인 상태 유지</span>
                        </label>
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-500 cursor-pointer"
                        >
                          비밀번호 찾기
                        </button>
                      </div>
                    )}

                    {!isLogin && (
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                          required
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          <span className="text-red-500">*</span> 이용약관 및 개인정보처리방침에
                          동의합니다.
                        </span>
                      </label>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-colors font-medium whitespace-nowrap cursor-pointer"
                    >
                      {isLogin
                        ? isLoading
                          ? '로그인 중...'
                          : '로그인'
                        : isLoading
                        ? '회원가입 중...'
                        : '회원가입'}
                    </button>
                  </form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">또는</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <button
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={signInWithGoogle}
                      >
                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                          <i className="ri-google-fill text-red-500 text-lg"></i>
                        </div>
                        <span className="text-gray-700 font-medium whitespace-nowrap">
                          Google로 계속하기
                        </span>
                      </button>

                      <button
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={signInWithKakao}
                      >
                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                          <i className="ri-kakao-talk-fill text-yellow-500 text-lg"></i>
                        </div>
                        <span className="text-gray-700 font-medium whitespace-nowrap">
                          카카오로 계속하기
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-1 text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
                    >
                      회원가입
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
