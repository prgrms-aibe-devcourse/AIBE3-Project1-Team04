export type Place_Category = '맛집' | '관광' | '문화' | '휴식' | '모험' | '자연' | '기타';
export type Place_State =
  | '서울특별시'
  | '부산광역시'
  | '대구광역시'
  | '인천광역시'
  | '광주광역시'
  | '대전광역시'
  | '울산광역시'
  | '세종특별자치시'
  | '경기도'
  | '강원특별자치도'
  | '충청북도'
  | '충청남도'
  | '전북특별자치도'
  | '전라남도'
  | '경상북도'
  | '경상남도'
  | '제주특별자치도';

export interface Place {
  id: string;
  title: string;
  category: Place_Category;
}
export interface PlaceWithUserAction {
  id: number;
  name: string;
  cost: number;
  created_at: Date;
  modified_at: Date;
  visit_start_time: string;
  visit_end_time: string;
  category: string;
  memo: string;
  is_view: boolean;
  user_name: string;
  state: string;
  city: string;
  average_rating: number;
  rating_count: number;
  view_count: number;
  like_count: number;
  liked_by_me: boolean;
  favorite_by_me: boolean;
}

export interface PlaceReview {
  id: number;
  user_id: string;
  place_id: number;
  rating: number;
  content: string;
  created_at: Date;
  modified_at: Date;
  user_name: string;
  avatar_url: string;
}
