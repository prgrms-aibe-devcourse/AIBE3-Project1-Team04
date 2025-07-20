// 데이터베이스 연동을 위한 타입 정의 및 유틸리티 함수들

export interface User {
  id: string;
}

export interface Place {
  id: string;
  name: string;
  state: string;
  city: string;
  category: string;
  memo: string;
  created_at: string;
  modified_at: string;
  visit_start_time: string;
  visit_end_time: string;
}

export interface Post {
  id: string;
  image_id: string;
  title: string;
  content: string;
  created_at: string;
  modified_at: string;
}

export interface PlaceImage {
  id: string;
  image_url: string;
  created_at: string;
}

export interface PlaceLike {
  id: string;
  created_at: string;
  user_id: string;
  place_id: string;
}

export interface PostFavorite {
  id: string;
  created_at: string;
  post_id: string;
  user_id: string;
}

export interface PostViewLog {
  id: string;
  viewed_at: string;
  post_id: string;
  user_id: string;
}

export interface PlaceViewLog {
  id: string;
  viewed_at: string;
  user_id: string;
  place_id: string;
}

export interface PlaceFavorite {
  id: string;
  created_at: string;
  user_id: string;
  place_id: string;
}

export interface PostReview {
  id: string;
  user_id: string;
  post_id: string;
  rating: string;
  content: string;
  created_at: string;
  modified_at: string;
}

export interface PlaceReview {
  id: string;
  user_id: string;
  places_id: string;
  rating: string;
  content: string;
  created_at: string;
  modified_at: string;
}

export interface PostLike {
  id: string;
  created_at: string;
  user_id: string;
  post_id: string;
}

export interface Tag {
  id: string;
  Field: string;
  places_id: string;
}

export interface PostPlace {
  id: string;
  posts_id: string;
  places_id: string;
}

export interface RepresentativeImage {
  id: string;
  place_id: string;
  image_id: string;
}

// API 함수들 (실제 구현시 사용)

export class DatabaseAPI {
  // 여행지 좋아요 토글
  static async togglePlaceLike(userId: string, placeId: string): Promise<boolean> {
    // 실제 구현시 API 호출
    console.log('Toggle place like:', { userId, placeId });
    return true;
  }

  // 게시글 좋아요 토글
  static async togglePostLike(userId: string, postId: string): Promise<boolean> {
    // 실제 구현시 API 호출
    console.log('Toggle post like:', { userId, postId });
    return true;
  }

  // 여행지 즐겨찾기 토글
  static async togglePlaceFavorite(userId: string, placeId: string): Promise<boolean> {
    // 실제 구현시 API 호출
    console.log('Toggle place favorite:', { userId, placeId });
    return true;
  }

  // 게시글 즐겨찾기 토글
  static async togglePostFavorite(userId: string, postId: string): Promise<boolean> {
    // 실제 구현시 API 호출
    console.log('Toggle post favorite:', { userId, postId });
    return true;
  }

  // 조회수 기록
  static async recordView(userId: string, itemId: string, type: 'post' | 'place'): Promise<void> {
    // 실제 구현시 API 호출
    console.log('Record view:', { userId, itemId, type });
  }

  // 리뷰 작성
  static async createPlaceReview(
    userId: string,
    placeId: string,
    rating: number,
    content: string
  ): Promise<PlaceReview> {
    // 실제 구현시 API 호출
    const review: PlaceReview = {
      id: Date.now().toString(),
      user_id: userId,
      places_id: placeId,
      rating: rating.toString(),
      content,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
    };
    console.log('Create place review:', review);
    return review;
  }

  // 게시글 리뷰 작성
  static async createPostReview(
    userId: string,
    postId: string,
    rating: number,
    content: string
  ): Promise<PostReview> {
    // 실제 구현시 API 호출
    const review: PostReview = {
      id: Date.now().toString(),
      user_id: userId,
      post_id: postId,
      rating: rating.toString(),
      content,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
    };
    console.log('Create post review:', review);
    return review;
  }

  // 여행지 생성
  static async createPlace(
    placeData: Omit<Place, 'id' | 'created_at' | 'modified_at'>
  ): Promise<Place> {
    // 실제 구현시 API 호출
    const place: Place = {
      ...placeData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
    };
    console.log('Create place:', place);
    return place;
  }

  // 게시글 생성
  static async createPost(
    postData: Omit<Post, 'id' | 'created_at' | 'modified_at'>
  ): Promise<Post> {
    // 실제 구현시 API 호출
    const post: Post = {
      ...postData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
    };
    console.log('Create post:', post);
    return post;
  }
}

// 현재 사용자 ID (실제 구현시 인증 시스템에서 가져올 데이터)
export const getCurrentUserId = (): string => {
  return 'current-user-id';
};
