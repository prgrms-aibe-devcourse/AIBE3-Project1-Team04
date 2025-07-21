import { Place_Category, Place_State } from '@/types/place.type';

export const PLACE_CATEGORIES: Place_Category[] = [
  '맛집',
  '관광',
  '문화',
  '휴식',
  '모험',
  '자연',
  '기타',
];

export const PLACE_STATES: Place_State[] = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

export const MAX_FILE_COUNT = 5;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MEGA_BYTE = 1024 * 1024;

export const INIT_POST_FORM_VALUE = {
  title: '',
  content: '',
};

export const INIT_PLACE_FORM_VALUE = {
  name: '',
  state_id: 0, // number로 변경
  city_id: 0, // number로 변경
  category: '',
  memo: '',
  cost: 0,
  visit_start_time: new Date(),
  visit_end_time: new Date(),
};

export const DUMMY_IMAGE_URL =
  'https://ionwvcdgjauhpubafztg.supabase.co/storage/v1/object/public/place-images//no_image.jpeg';

export const SORT_OPTIONS = ['인기순', '최신순', '평점순', '비용순'];
