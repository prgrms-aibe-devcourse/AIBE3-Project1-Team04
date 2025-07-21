import { DUMMY_IMAGE_URL, PLACE_STATES } from '@/consts';
import { usePlace } from '@/hooks/usePlace';
import { useRegion } from '@/hooks/useRegion';
import { formatCost } from '@/lib/place';
import { usePostPlacesStore } from '@/stores/PostPlacesStore';
import { PlaceInputType, PostedPlace } from '@/types/place.type';
import { format } from 'date-fns';
import React from 'react';

const PostedPlaceCard = ({ postedPlace }: { postedPlace: PostedPlace }) => {
  const { cities } = useRegion();
  const { place_id, currentPlace: place, images } = postedPlace;
  const representative_image = images.find((image) => image.is_representative);
  const stateName = PLACE_STATES[place.state_id - 1];
  const cityName = cities.find((city) => (city.id = place.city_id))!.name;
  const removePostedPlace = usePostPlacesStore((state) => state.removePostedPlace);
  const setEditingPlace = usePostPlacesStore((state) => state.setEditingPlace);
  const representativePlaceId = usePostPlacesStore((state) => state.representativePlaceId);
  const toggleRepresentativePlace = usePostPlacesStore((state) => state.toggleRepresentativePlace);
  const { updatePlace } = usePlace();

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    if (!postedPlace) return;
    try {
      const newPlace: PlaceInputType = { ...place };
      newPlace.isviewed = false;
      await updatePlace(place_id, newPlace);
      removePostedPlace(place_id);
    } catch (error) {
      console.error('여행지 삭제제 중 오류 발생:', error);
    }
  };

  return (
    <div
      className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      onClick={() => place.isviewed && toggleRepresentativePlace(place_id)}
    >
      {!place.isviewed && (
        <div className="absolute top-1 left-1 bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full shadow">
          임시
        </div>
      )}
      {place_id === representativePlaceId && (
        <div className="absolute top-1 left-1 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full shadow">
          대표
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={representative_image?.image_string ?? DUMMY_IMAGE_URL}
            alt={place.name}
            className="w-full h-full object-cover object-top rounded-lg"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-lg">{place.name}</h4>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {place.category}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center"></i>
                  {`${stateName} ${cityName}`}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
                  {format(place.visit_start_time, 'yyyy-MM-dd HH:mm')} -
                  {format(place.visit_end_time, 'yyyy-MM-dd HH:mm')}
                </span>
              </div>
              {images?.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {images?.slice(0, 3).map((image, idx) => (
                    <img
                      key={idx}
                      src={image.image_string}
                      alt={`${place.name} ${idx + 1}`}
                      className="w-12 h-12 object-cover object-top rounded border"
                    />
                  ))}
                  {images?.length > 3 && (
                    <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                      +{images.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-600 mb-2">{formatCost(place.cost)}</div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingPlace(postedPlace);
                  }}
                  className="text-blue-600 hover:text-blue-700 p-1 cursor-pointer"
                  title="수정"
                >
                  <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                </button>
                <button
                  onClick={handleRemove}
                  className="text-red-600 hover:text-red-700 p-1 cursor-pointer"
                  title="삭제"
                >
                  <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">{place.memo}</p>
        </div>
      </div>
    </div>
  );
};

export default PostedPlaceCard;
