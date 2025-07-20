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
export interface Place_City {
  id: number;
  name: string;
  state_id: number;
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
  isviewed: boolean;
  user_name: string;
  state_name: string;
  city_name: string;
  average_rating: number;
  rating_count: number;
  view_count: number;
  like_count: number;
  liked_by_me: boolean;
  favorite_by_me: boolean;
  thumbnail_image_url: string;
  image_urls: string[];
}

export interface PlaceInputType {
  name: string;
  state_id: number;
  city_id: number;
  visit_start_time: Date; // ISO string or Date
  visit_end_time: Date;
  category: string;
  memo: string;
  isviewed?: boolean;
  cost: number;
}

export interface PlaceFileType {
  image_file: File;
  image_string: string;
  is_representative?: boolean;
}
export interface PlaceImageInputType {
  place_id: number;
  image_url: string;
  is_representative?: boolean;
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
export interface Place {
  id: number;
  name: string;
  state_id: number;
  city_id: number;
  cost: number;
  created_at: Date;
  modified_at: Date;
  visit_start_time: Date;
  visit_end_time: Date;
  category: string;
  memo: string;
  isviewed: boolean;
  user_id: string;
  thumbnail_image_id: null;
}

export interface PostedPlace {
  place_id: number;
  currentPlace: PlaceInputType;
  images: PlaceFileType[];
}
