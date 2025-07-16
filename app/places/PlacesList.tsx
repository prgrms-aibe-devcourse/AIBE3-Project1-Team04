
'use client';

import { useState } from 'react';
import PlaceCard from '../../components/PlaceCard';

export default function PlacesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');

  const categories = ['전체', '관광지', '맛집', '카페', '숙박', '쇼핑', '문화시설', '체험'];
  const regions = ['전체', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

  const places = [
    {
      id: 1,
      name: '경복궁',
      category: '관광지',
      region: '서울',
      location: '서울특별시 종로구',
      author: '한국문화탐험가',
      rating: 4.8,
      reviewCount: 324,
      views: 1250,
      cost: 3000,
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20traditional%20Korean%20palace%20Gyeongbokgung%20with%20colorful%20autumn%20leaves%2C%20golden%20hour%20lighting%2C%20tourists%20walking%20through%20the%20gates%2C%20traditional%20architecture%20details%2C%20serene%20atmosphere%2C%20professional%20photography&width=400&height=300&seq=place1&orientation=landscape',
      startDate: '2024-01-15',
      endDate: '2024-01-15',
      duration: '당일',
      createdAt: '2024-01-20',
      likes: 142,
      isLiked: false,
      isFavorited: true
    },
    {
      id: 2,
      name: '광안리 해수욕장',
      category: '관광지',
      region: '부산',
      location: '부산광역시 수영구',
      author: '바다사랑여행',
      rating: 4.6,
      reviewCount: 187,
      views: 890,
      cost: 0,
      image: 'https://readdy.ai/api/search-image?query=Gwangalli%20Beach%20in%20Busan%20with%20beautiful%20bridge%20view%20at%20sunset%2C%20people%20walking%20on%20the%20beach%2C%20city%20skyline%2C%20warm%20golden%20lighting%2C%20peaceful%20ocean%20waves%2C%20modern%20urban%20landscape%20background&width=400&height=300&seq=place2&orientation=landscape',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      duration: '2박3일',
      createdAt: '2024-01-18',
      likes: 89,
      isLiked: true,
      isFavorited: false
    },
    {
      id: 3,
      name: '명동 교자',
      category: '맛집',
      region: '서울',
      location: '서울특별시 중구',
      author: '맛집헌터',
      rating: 4.4,
      reviewCount: 156,
      views: 680,
      cost: 15000,
      image: 'https://readdy.ai/api/search-image?query=Traditional%20Korean%20dumpling%20restaurant%20interior%20with%20steaming%20hot%20dumplings%20on%20wooden%20table%2C%20cozy%20atmosphere%2C%20warm%20lighting%2C%20traditional%20Korean%20food%20presentation%2C%20appetizing%20food%20photography&width=400&height=300&seq=place3&orientation=landscape',
      startDate: '2024-01-08',
      endDate: '2024-01-08',
      duration: '당일',
      createdAt: '2024-01-15',
      likes: 67,
      isLiked: false,
      isFavorited: false
    },
    {
      id: 4,
      name: '제주 성산일출봉',
      category: '관광지',
      region: '제주',
      location: '제주특별자치도 서귀포시',
      author: '제주도여행러버',
      rating: 4.9,
      reviewCount: 298,
      views: 1420,
      cost: 2000,
      image: 'https://readdy.ai/api/search-image?query=Seongsan%20Ilchulbong%20Peak%20in%20Jeju%20Island%20at%20sunrise%2C%20dramatic%20volcanic%20crater%20formation%2C%20beautiful%20orange%20and%20pink%20sky%2C%20tourists%20silhouettes%2C%20natural%20landscape%2C%20breathtaking%20view&width=400&height=300&seq=place4&orientation=landscape',
      startDate: '2024-01-05',
      endDate: '2024-01-07',
      duration: '2박3일',
      createdAt: '2024-01-12',
      likes: 203,
      isLiked: true,
      isFavorited: true
    },
    {
      id: 5,
      name: '카페 온더루프',
      category: '카페',
      region: '부산',
      location: '부산광역시 해운대구',
      author: '카페탐방러',
      rating: 4.5,
      reviewCount: 89,
      views: 420,
      cost: 8000,
      image: 'https://readdy.ai/api/search-image?query=Modern%20rooftop%20cafe%20with%20ocean%20view%2C%20stylish%20interior%20design%2C%20comfortable%20seating%2C%20coffee%20and%20desserts%20on%20table%2C%20natural%20lighting%2C%20trendy%20atmosphere%2C%20urban%20coastal%20setting&width=400&height=300&seq=place5&orientation=landscape',
      startDate: '2024-01-03',
      endDate: '2024-01-03',
      duration: '당일',
      createdAt: '2024-01-10',
      likes: 34,
      isLiked: false,
      isFavorited: false
    },
    {
      id: 6,
      name: '홍대 걷고싶은거리',
      category: '쇼핑',
      region: '서울',
      location: '서울특별시 마포구',
      author: '홍대맛집탐방',
      rating: 4.3,
      reviewCount: 234,
      views: 950,
      cost: 25000,
      image: 'https://readdy.ai/api/search-image?query=Hongdae%20walking%20street%20at%20night%20with%20colorful%20neon%20lights%2C%20young%20people%20shopping%20and%20walking%2C%20vibrant%20atmosphere%2C%20street%20food%20vendors%2C%20urban%20nightlife%2C%20energetic%20mood&width=400&height=300&seq=place6&orientation=landscape',
      startDate: '2024-01-01',
      endDate: '2024-01-02',
      duration: '1박2일',
      createdAt: '2024-01-08',
      likes: 156,
      isLiked: false,
      isFavorited: true
    },
    {
      id: 7,
      name: '부산 감천문화마을',
      category: '문화시설',
      region: '부산',
      location: '부산광역시 사하구',
      author: '문화여행가',
      rating: 4.7,
      reviewCount: 176,
      views: 780,
      cost: 5000,
      image: 'https://readdy.ai/api/search-image?query=Colorful%20Gamcheon%20Culture%20Village%20in%20Busan%20with%20rainbow%20painted%20houses%20on%20hillside%2C%20artistic%20murals%2C%20narrow%20alleys%2C%20tourists%20exploring%2C%20cultural%20heritage%2C%20bright%20daylight&width=400&height=300&seq=place7&orientation=landscape',
      startDate: '2023-12-28',
      endDate: '2023-12-30',
      duration: '2박3일',
      createdAt: '2024-01-05',
      likes: 98,
      isLiked: true,
      isFavorited: false
    },
    {
      id: 8,
      name: '전주 한옥마을',
      category: '문화시설',
      region: '전북',
      location: '전라북도 전주시',
      author: '전통문화탐험',
      rating: 4.6,
      reviewCount: 203,
      views: 1100,
      cost: 10000,
      image: 'https://readdy.ai/api/search-image?query=Traditional%20Korean%20hanok%20village%20in%20Jeonju%20with%20beautiful%20wooden%20architecture%2C%20curved%20rooftiles%2C%20people%20in%20hanbok%20walking%2C%20cultural%20atmosphere%2C%20warm%20afternoon%20lighting&width=400&height=300&seq=place8&orientation=landscape',
      startDate: '2023-12-25',
      endDate: '2023-12-26',
      duration: '1박2일',
      createdAt: '2024-01-03',
      likes: 87,
      isLiked: false,
      isFavorited: false
    }
  ];

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || place.category === selectedCategory;
    const matchesRegion = selectedRegion === '전체' || place.region === selectedRegion;
    
    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">여행지 목록</h1>
          <p className="text-gray-600">다양한 여행지를 둘러보고 나만의 여행 계획을 세워보세요</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="여행지나 지역을 검색해보세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold text-blue-600">{filteredPlaces.length}</span>개의 여행지가 있습니다
          </p>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
              최신순
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
              인기순
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
              평점순
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
              좋아요순
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-map-pin-line text-6xl text-gray-300 mb-4 w-16 h-16 flex items-center justify-center mx-auto"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 필터를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
