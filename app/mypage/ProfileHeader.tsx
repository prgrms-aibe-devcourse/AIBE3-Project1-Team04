function ProfileHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <i className="ri-user-line text-3xl"></i>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">김여행님의 마이페이지</h1>
            <p className="text-blue-100">여행의 모든 순간을 기록하고 공유해보세요</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
