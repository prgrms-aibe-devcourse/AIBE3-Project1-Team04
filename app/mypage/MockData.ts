////

export interface MyPlaceCardProps {
  id: string;
  name: string;
  category: string;
  region: string;
  rating: number;
  ratingCount: number;
  imageUrl: string;
  description: string;
  openTime: string;
  phone: string;
  address: string;
  website: string;
  tags: string[];
  facilities: string[];
  createdAt: string;
  likes: number;
}

export const mockDraftPosts = [
  {
    id: 'draft1',
    title: '부산 맛집 투어 (작성중)',
    content: '부산의 숨은 맛집들을 소개하는 글입니다...',
    createdAt: '2024-03-25',
    updatedAt: '2024-03-25',
    status: 'draft',
  },
  {
    id: 'draft2',
    title: '제주도 힐링 여행 (임시저장)',
    content: '제주도에서의 힐링 경험을 공유합니다...',
    createdAt: '2024-03-24',
    updatedAt: '2024-03-24',
    status: 'draft',
  },
];

export const mockMyPosts = [
  {
    id: '1',
    title: '부산 3박 4일完벽 코스 - 해운대부터 감천문화마을까지',
    category: '가족여행',
    region: '부산광역시',
    author: '김여행',
    rating: 4.8,
    ratingCount: 156,
    views: 2340,
    cost: 450000,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Beautiful%20Busan%20Haeundae%20Beach%20cityscape%20with%20modern%20buildings%20and%20ocean%20view%2C%20vibrant%20blue%20sky%2C%20tourist%20destination%2C%20clean%20minimalist%20background%2C%20professional%20photography&width=400&height=300&seq=busan-mypost1&orientation=landscape',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    createdAt: '2024-01-20',
    duration: '3박 4일',
    likes: 87,
    isLiked: true,
    isFavorited: false,
  },
  {
    id: '2',
    title: '강릉 바다카페 힐링투어 1박2일',
    category: '커플여행',
    region: '강원도',
    author: '김여행',
    rating: 4.6,
    ratingCount: 134,
    views: 2670,
    cost: 280000,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Gangneung%20seaside%20coffee%20street%20with%20cozy%20cafes%2C%20ocean%20view%2C%20sandy%20beaches%2C%20and%20modern%20coffee%20shops.%20Relaxing%20atmosphere%20with%20ocean%20breeze%20and%20Korean%20coastal%20town%20charm&width=400&height=300&seq=gangneung-mypost1&orientation=landscape',
    startDate: '2024-03-15',
    endDate: '2024-03-16',
    createdAt: '2024-03-18',
    duration: '1박 2일',
    likes: 78,
    isLiked: true,
    isFavorited: false,
  },
];

export const mockMyPlaces: MyPlaceCardProps[] = [
  {
    id: '1',
    name: '해운대 블루라인 파크',
    category: '관광명소',
    region: '부산광역시 해운대구',
    rating: 4.7,
    ratingCount: 342,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Haeundae%20Blue%20Line%20Park%20seaside%20train%20track%20with%20ocean%20view%2C%20modern%20coastal%20railway%20infrastructure%2C%20blue%20sky%20and%20turquoise%20water%2C%20scenic%20Korean%20coastal%20attraction&width=400&height=300&seq=haeundae-place1&orientation=landscape',
    description: '바다를 따라 달리는 해안열차로 아름다운 경치를 즐길 수 있는 곳',
    openTime: '09:00 - 18:00',
    phone: '051-749-7614',
    address: '부산광역시 해운대구 달맞이길 62-10',
    website: 'https://www.haeundae.go.kr',
    tags: ['가족여행', '데이트', '사진촬영'],
    facilities: ['주차장', '화장실', '매점', '휠체어 접근'],
    createdAt: '2024-03-20',
    likes: 0,
  },
  {
    id: '2',
    name: '정동진 모래시계 공원',
    category: '관광명소',
    region: '강원도 강릉시',
    rating: 4.5,
    ratingCount: 198,
    imageUrl:
      'https://readdy.ai/api/search-image?query=Jeongdongjin%20Hourglass%20Park%20with%20giant%20hourglass%20sculpture%20by%20the%20sea%2C%20sunrise%20view%2C%20Korean%20east%20coast%20landmark%2C%20peaceful%20morning%20atmosphere%20with%20golden%20sunlight&width=400&height=300&seq=jeongdongjin-place1&orientation=landscape',
    description: '일출로 유명한 정동진 해변의 상징적인 모래시계 조형물',
    openTime: '24시간',
    phone: '033-640-5420',
    address: '강원도 강릉시 강동면 정동진리 17-5',
    website: 'https://www.gn.go.kr',
    tags: ['일출', '사진촬영', '커플'],
    facilities: ['주차장', '화장실', '편의점'],
    createdAt: '2024-03-18',
    likes: 0,
  },
];

export const tabs = [
  { id: 'drafts', label: '임시저장', count: mockDraftPosts.length },
  { id: 'posts', label: '내 게시글', count: mockMyPosts.length },
  { id: 'places', label: '내 여행지', count: mockMyPlaces.length },
];
