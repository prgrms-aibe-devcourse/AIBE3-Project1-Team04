//-- 마이페이지 탭 데이터 타입
export interface MyPostViewType {
  id: number; // post id (BIGINT)
  title: string; // post title (TEXT)
  created_at: string; // timestamp with time zone (ISO string)
  modified_at: string | null; // timestamp with time zone (ISO string) or null
  view_count: number; // 조회 수
  review_count: number; // 리뷰 수
  review_rate: number; // 평균 평점
  post_like_count: number; // 좋아요 수
  total_cost: number; // 장소 비용 합계
  place_count: number; // 연관 장소 수
  region_states: Array<{ f1: string; f2: string }>; // [(region_name, state_name), …]
  first_start_time: string; // 가장 빠른 방문 시작 시간 (ISO string) or null
  last_end_time: string; // 가장 늦은 방문 종료 시간 (ISO string) or null
  categories: string[];
}

export interface MyPlaceViewType {
  place_id: number; // BIGINT
  name: string; // TEXT
  category: string; // TEXT
  cost: number; // INTEGER
  created_at: string; // TIMESTAMPTZ (ISO 8601 문자열)
  modified_at: string; // TIMESTAMPTZ (ISO 8601 문자열)
  visit_start_time: string; // TIMESTAMPTZ (ISO 8601 문자열)
  visit_end_time: string; // TIMESTAMPTZ (ISO 8601 문자열)
  view_total: number; // BIGINT
  like_total: number; // BIGINT
  review_count: number; // BIGINT
  review_rate: number; // NUMERIC
  all_images: string[]; // TEXT[] (URL 문자열 배열)
  region_states: string[]; // TEXT[] ("region:state" 문자열 배열)
}

// -- //

// -- 게시글 수정 타입
export interface PostEditData {
  title: string;
  content: string;
  stats: {
    place_count: number; // 연동된 여행지 개수
    total_days: number; // 총 여행 기간 (일수)
    total_cost: number; // 총 여행 비용
  };
  places: {
    place_id: number; // places.id
    place_name: string; // places.name
    category: string; // public.place_categories enum
    city_id: number; // places.city_id
    state_id: number; // places.state_id
    cost: number; // places.cost
    images: string[]; // place_images.image_url[]
    visit_start: string; // places.visit_start_time (ISO timestamp)
    visit_end: string; // places.visit_end_time   (ISO timestamp)
    memo: string | null; // places.memo
  }[];
}

// -- //

// -- 지역 타입 get_regions RPC 호출 결과
export interface RegionData {
  state_name: string; // 예: "서울특별시"
  city_map: Record<string, string>; // { [cityId]: cityName }
  // 예: { "10": "종로구", "11": "중구" }
}
export type RegionsResponse = Record<string, RegionData>;

// --
