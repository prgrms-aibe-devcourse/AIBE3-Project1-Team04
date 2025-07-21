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
  region_states: string[]; // ["region:state", "region:state", …]
  first_start_time: string; // 가장 빠른 방문 시작 시간 (ISO string) or null
  last_end_time: string; // 가장 늦은 방문 종료 시간 (ISO string) or null
  categories: string[];
  thumbnail_url: string;
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
  thumbnail_url: string;
}

// -- //
