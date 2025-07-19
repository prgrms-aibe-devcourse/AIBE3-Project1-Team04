import { PlaceWithUserAction } from '@/types/place.type';
import { RegionLocation } from '@/types/post.type';
import { uniq, uniqBy } from 'lodash';

export const formatCategories = (places: PlaceWithUserAction[]): string => {
  const categories = uniq(places.map((place) => place.category));
  if (!categories || categories.length === 0) return '전체';
  if (categories.length === 1) return categories[0];
  return `${categories[0]} 외 ${categories.length - 1}개`;
};

export const formatRegions = (places: PlaceWithUserAction[]): string => {
  const regions = uniqBy(
    places.map((place) => ({ state: place.state, city: place.city })),
    (place) => `${place.state}-${place.city}` // 복합 키 기준으로 중복 제거
  );
  if (!regions || regions.length === 0) return '지역미정';
  if (regions.length === 1) return regions[0].state;
  return `${regions[0].state} 외 ${regions.length - 1}개`;
};
