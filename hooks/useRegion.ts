import { supabase } from '@/lib/supabaseClient';
import { Place_City } from '@/types/place.type';

export const useRegion = () => {
  /** city 목록 조회 */
  const getPlaceCities = async (): Promise<Place_City[]> => {
    try {
      console.log('aa');
      const { data, error } = await supabase.from('regions_city').select('*');
      console.log(data);

      if (error) {
        console.error('시/군/구 목록을을 가져오는 중 오류 발생:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('시/군/구 목록을을 가져오는 중 오류 발생:', error);
      return [];
    }
  };
  return { getPlaceCities };
};
