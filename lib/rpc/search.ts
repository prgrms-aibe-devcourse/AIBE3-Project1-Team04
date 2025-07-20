import { supabase } from '../supabaseClient';

interface SearchResult {
  source: 'place' | 'post';
  id: string;
  name: string;
  region?: string;
}

export async function searchAllByKeyword(keyword: string) {
  const { data, error } = await supabase.rpc('search_place_and_post_names', { keyword });

  if (error) throw error;
  return data;
}
