'use client';

import { useMainFilterStore } from '@/stores/mainFilterStore';
import { useRef } from 'react';

export default function HeroSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const setSearchTerm = useMainFilterStore((state) => state.setSearchTerm);

  const handeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (!inputRef.current) return;

    const { value } = inputRef.current;
    if (value.trim()) {
      setSearchTerm(value);
    } else {
      setSearchTerm('');
    }
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Beautiful%20Korean%20travel%20destinations%20collage%20with%20mountains%2C%20beaches%2C%20traditional%20temples%2C%20modern%20cities%2C%20and%20cultural%20landmarks.%20Inspiring%20travel%20photography%20with%20warm%20sunset%20lighting.%20Multiple%20scenic%20locations%20showcasing%20diverse%20Korean%20tourism%20attractions%20in%20harmonious%20composition.&width=1200&height=600&seq=hero1&orientation=landscape')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            완벽한 여행 계획을
            <br />
            <span className="text-blue-400">함께 만들어보세요</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            실제 여행자들의 경험을 바탕으로 한 맞춤형 여행 추천
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="어디로 여행을 떠나고 싶으신가요?"
                className="w-full px-6 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                ref={inputRef}
                onKeyDown={handeKeyDown}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer"
                onClick={handleSearch}
              >
                <i className="ri-search-line w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              #제주도
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              #부산
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              #강릉
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              #전주
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              #경주
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
