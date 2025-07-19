import { PostEditData, RegionsResponse } from '@/lib/database';
import { format } from 'date-fns';
import EditForm from './EditForm';

function PlaceList({
  places,
  regions,
  isEditingPlace,
  editingPlaceId,
  handleUpdatePlace,
  handleEditPlace,
  handleDeletePlace,
  handleImagesUpload,
  removeImage,
  currentPlace,
  setCurrentPlace,
  resetPlaceForm,
  placeCategories,
  stateIds,
}: {
  places: PostEditData['places'];
  regions: RegionsResponse;
  isEditingPlace: boolean;
  editingPlaceId: number | null;
  handleUpdatePlace: (e: React.FormEvent) => void;
  handleEditPlace: (place: PostEditData['places'][number]) => void;
  handleDeletePlace: (placeId: number) => void;
  handleImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  currentPlace: PostEditData['places'][number];
  setCurrentPlace: (place: PostEditData['places'][number]) => void;
  resetPlaceForm: () => void;
  placeCategories: string[];
  stateIds: string[];
}) {
  if (places.length === 0) return <></>;
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">등록된 여행지 ({places.length}개)</h2>

      <div className="space-y-4">
        {places.map((place) => (
          <div key={place.place_id}>
            {/* 여행지 카드 */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={place.images[0]}
                    alt={place.place_name}
                    className="w-full h-full object-cover object-top rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg">{place.place_name}</h4>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {place.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center"></i>
                          {regions[place.state_id].state_name}{' '}
                          {regions[place.state_id].city_map[place.city_id]}
                        </span>
                        {(place.visit_start || place.visit_end) && (
                          <span className="flex items-center gap-1">
                            <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
                            {`${format(place.visit_start, 'MM/dd HH:mm')} - ${format(
                              place.visit_end,
                              'MM/dd HH:mm'
                            )}`}
                          </span>
                        )}
                      </div>
                      {place.images.length > 1 && (
                        <div className="flex gap-2 mb-2">
                          {place.images.slice(0, 3).map((image, idx) => (
                            <img
                              key={idx}
                              src={image}
                              alt={`${place.place_name} ${idx + 1}`}
                              className="w-12 h-12 object-cover object-top rounded border"
                            />
                          ))}
                          {place.images.length > 3 && (
                            <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                              +{place.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600 mb-2">
                        {place.cost === 0 ? '무료' : `${place.cost.toLocaleString()}원`}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPlace(place)}
                          className="text-blue-600 hover:text-blue-700 p-1 cursor-pointer"
                          title="수정"
                        >
                          <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                        <button
                          onClick={() => handleDeletePlace(place.place_id)}
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

            <EditForm
              place={place}
              regions={regions}
              isEditingPlace={isEditingPlace}
              editingPlaceId={editingPlaceId}
              handleUpdatePlace={handleUpdatePlace}
              currentPlace={currentPlace}
              setCurrentPlace={setCurrentPlace}
              resetPlaceForm={resetPlaceForm}
              placeCategories={placeCategories}
              stateIds={stateIds}
              handleImagesUpload={handleImagesUpload}
              removeImage={removeImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaceList;
