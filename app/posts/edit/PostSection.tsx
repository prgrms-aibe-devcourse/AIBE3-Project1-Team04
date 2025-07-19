import { PostEditData } from '@/lib/database';

function PostSection({
  postData,
  setPostData,
}: {
  postData: PostEditData;
  setPostData: (data: PostEditData) => void;
}) {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">기본 정보</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="여행 제목을 입력하세요"
              // NOTE : maxLength 확인 필요
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1">{postData.title.length}/100자</div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">여행 내용</label>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData({ ...postData, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="여행 경험과 팁을 자세히 공유해주세요..."
              // NOTE : maxLength 확인 필요
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 mt-1">{postData.content.length}/2000자</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostSection;
