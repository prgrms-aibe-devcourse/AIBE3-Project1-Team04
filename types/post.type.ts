import { PlaceWithUserAction } from './place.type';

export interface PostWithUserAction {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: Date;
  modified_at: Date;
  is_viewed: boolean;
  user_name: string;
  average_rating: number;
  rating_count: number;
  view_count: number;
  like_count: number;
  liked_by_me: boolean;
  favorite_by_me: boolean;
  visit_start_time: string;
  visit_end_time: string;
  places: PlaceWithUserAction[];
}

export interface RegionLocation {
  city: string;
  state: string;
}

export interface PostReview {
  id: number;
  user_id: string;
  post_id: number;
  rating: number;
  content: string;
  created_at: Date;
  modified_at: Date;
  user_name: string;
  avatar_url: string;
}

export interface PostInputType {
  title: string;
  content: string;
  user_id: string;
  representative_place_id?: number;
  isviewd: boolean;
}
