function ActivitySummary({
  numOfPost,
  numOfPlace,
  numOfLikes,
}: {
  numOfPost: number;
  numOfPlace: number;
  numOfLikes: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-article-line w-6 h-6 flex items-center justify-center text-blue-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{numOfPost}</h3>
        <p className="text-gray-600">작성한 게시글</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-map-pin-line w-6 h-6 flex items-center justify-center text-green-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{numOfPlace}</h3>
        <p className="text-gray-600">등록한 여행지</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-heart-line w-6 h-6 flex items-center justify-center text-purple-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{numOfLikes}</h3>
        <p className="text-gray-600">받은 좋아요</p>
      </div>
    </div>
  );
}

export default ActivitySummary;
