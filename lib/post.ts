import { PlaceWithUserAction, PostedPlace } from '@/types/place.type';
import { uniq, uniqBy } from 'lodash';

function isPlaceWithUserAction(
  places: PlaceWithUserAction[] | string[]
): places is PlaceWithUserAction[] {
  return typeof places[0] === 'object';
}

export const formatCategories = (places: PlaceWithUserAction[] | string[]): string => {
  const categories = isPlaceWithUserAction(places)
    ? uniq(places.map((place) => place.category))
    : places;
  if (!categories || categories.length === 0) return '전체';
  if (categories.length === 1) return categories[0];
  return `${categories[0]} 외 ${categories.length - 1}개`;
};

export const formatRegions = (places: PlaceWithUserAction[] | string[]): string => {
  const regions = isPlaceWithUserAction(places)
    ? uniqBy(
        places.map((place) => ({ state: place.state_name, city: place.city_name })),
        (place) => `${place.state}-${place.city}` // 복합 키 기준으로 중복 제거
      )
    : places.map((place) => {
        const [state, city] = place.split(':');
        return { state, city };
      });
  if (!regions || regions.length === 0) return '지역미정';
  if (regions.length === 1) return regions[0].state;
  return `${regions[0].state} 외 ${regions.length - 1}개`;
};

export const formatRating = (rating: number): string => {
  if (rating === 0) return '0';
  return rating.toFixed(1);
};

export const getRepresentativePlaceId = (
  postedPlaces: PostedPlace[],
  representativePlaceId: number | null
): number => {
  // 1. 사용자가 선택한 대표 여행지가 있는 경우
  if (representativePlaceId && postedPlaces.some((p) => p.place_id === representativePlaceId)) {
    return representativePlaceId;
  }

  // 2. 대표 이미지가 있는 여행지를 우선 탐색
  const withRepresentativeImage = postedPlaces.find((place) =>
    place.images?.some((img) => img.is_representative)
  );
  if (withRepresentativeImage) {
    return withRepresentativeImage.place_id;
  }

  // 3. 대표 이미지도 없으면 첫 번째 여행지 반환
  return postedPlaces[0].place_id;
};
