import Link from 'next/link';
import MyPlaceCard from '@/components/mypage/MyPlaceCard';
import { MyPlaceViewType } from '@/types/mypage.type';

function PlaceListTab({
  placeList,
  deletePlace,
}: {
  placeList: MyPlaceViewType[];
  deletePlace: (placeId: number) => void;
}) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">내가 등록한 여행지</h2>
          <div className="text-sm text-gray-600">총 {placeList.length}개의 여행지</div>
        </div>

        {placeList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {placeList.map((place: MyPlaceViewType) => (
              <div key={place.place_id} className="relative">
                <MyPlaceCard {...place} />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm cursor-pointer"
                    onClick={() => deletePlace(place.place_id)}
                  >
                    <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center text-red-600"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <i className="ri-map-pin-line w-16 h-16 flex items-center justify-center text-gray-300 mx-auto mb-4 text-4xl"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록한 여행지가 없습니다</h3>
            <p className="text-gray-500 mb-4">새로운 여행지를 등록해보세요</p>
          </div>
        )}
      </div>
    </>
  );
}

export default PlaceListTab;
