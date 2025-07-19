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
  categories: string[];
  total_cost: number;
  visit_start_time: string;
  visit_end_time: string;
  region_locations: RegionLocation[];
}

export interface RegionLocation {
  city: string;
  state: string;
}
