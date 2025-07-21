'use client';

import { useCallback, useEffect, useState } from 'react';
import PlaceCard from '@/components/places/PlaceCard';
import { PLACE_CATEGORIES, PLACE_STATES } from '@/consts';
import { usePlace } from '@/hooks/usePlace';
import { FilterOption, PlaceWithUserAction } from '@/types/place.type';
import SortButton, { SortOption } from '@/components/places/SortButton';
import { compareAsc } from 'date-fns';
import { SORT_OPTIONS } from '@/consts/place';

export default function PlacesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [places, setPlaces] = useState<PlaceWithUserAction[]>([]);
  const { getAllPlacesWithUserAction } = usePlace();
  const [filter, setFilter] = useState<FilterOption>({
    category: selectedCategory,
    region: selectedRegion,
    term: searchTerm,
  });

  const fetchAllPlaces = useCallback(async () => {
    try {
      const data = await getAllPlacesWithUserAction(sortBy);

      const filtered = data.filter(
        (place) =>
          (!filter.term || place.name.includes(filter.term)) &&
          (selectedCategory === '전체' || place.category === selectedCategory) &&
          (selectedRegion === '전체' || place.state_name === selectedRegion)
      );

      setPlaces(filtered);
    } catch (error) {
      console.error('여행지 목록을 가져오는 중 오류 발생:', error);
    }
  }, [getAllPlacesWithUserAction, sortBy, filter]);

  useEffect(() => {
    fetchAllPlaces();
  }, [fetchAllPlaces]);

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
  };

  const handleSearch = () => {
    setFilter({
      category: selectedCategory,
      region: selectedRegion,
      term: searchTerm,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">여행지 목록</h1>
          <p className="text-gray-600">다양한 여행지를 둘러보고 나만의 여행 계획을 세워보세요</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="찾으시는 제목을 검색해보세요."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                onChange={(e) => setSelectedCategory(e.target.value)}
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
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value={'전체'}>전체</option>
                {PLACE_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <button
                className={`px-4 py-2 text-sm font-medium ${'text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50'} whitespace-nowrap`}
                onClick={handleSearch}
              >
                검색
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold text-blue-600">{places.length}</span>개의 여행지가
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
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {places.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-map-pin-line text-6xl text-gray-300 mb-4 w-16 h-16 flex items-center justify-center mx-auto"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 필터를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
