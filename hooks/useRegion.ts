import { supabase } from '@/lib/supabaseClient';
import { useRegionStore } from '@/stores/regionStore';
import { Place_City } from '@/types/place.type';
import { useCallback } from 'react';

export const useRegion = () => {
  const regions_city = useRegionStore((state) => state.regionsCity);
  const setRegionsCity = useRegionStore((state) => state.setRegionsCity);
  /** city 목록 조회 */
  const getPlaceCities = useCallback(async (): Promise<Place_City[]> => {
    try {
      const { data, error } = await supabase.from('regions_city').select('*');

      if (error) {
        console.error('시/군/구 목록을을 가져오는 중 오류 발생:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('시/군/구 목록을을 가져오는 중 오류 발생:', error);
      return [];
    }
  }, []);

  const fetchPlaceCities = useCallback(async () => {
    try {
      const data = await getPlaceCities();
      setRegionsCity(data);
    } catch (error) {
      console.error('게시글 목록을 가져오는 중 오류 발생:', error);
    }
  }, [getPlaceCities, setRegionsCity]);

  return { cities: regions_city, fetchPlaceCities };
};
