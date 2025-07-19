import { RegionLocation } from '@/types/post.type';

export const formatCategories = (categories: string[]): string => {
  if (!categories || categories.length === 0) return '전체';
  if (categories.length === 1) return categories[0];
  return `${categories[0]} 외 ${categories.length - 1}개`;
};

export const formatRegions = (regions: RegionLocation[]): string => {
  console.log(!regions, regions.length === 0);
  if (!regions || regions.length === 0) return '지역미정';
  if (regions.length === 1) return regions[0].state;
  return `${regions[0].state} 외 ${regions.length - 1}개`;
};
