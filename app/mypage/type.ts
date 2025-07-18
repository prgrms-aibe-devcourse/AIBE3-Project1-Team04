export interface MyPostViewType {
  post_id: number;
  title: string;
  created_at: string; // ISO timestamp 문자열
  modified_at: string | null; // 수정일이 없으면 null
  view_count: number;
  review_count: number;
  review_rate: number;
  total_cost: number;
  place_count: number;
  region_states: Array<{
    region_name: string;
    state_name: string;
  }>;
  first_start_time: string | null; // 방문 시작이 없으면 null
  last_end_time: string | null; // 방문 종료가 없으면 null
}

export interface PlaceViewType {
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
