import { PostEditData } from '@/lib/database';
import { formatCost } from '@/lib/place';

function PlaceSummary({ postData }: { postData: PostEditData }) {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
        <h2 className="text-xl font-bold mb-4">여행 요약</h2>
        <div className="flex justify-around">
          <div className="text-center">
            <div className="text-3xl font-bold">{postData.stats.place_count}개</div>
            <div className="text-sm opacity-90">등록된 여행지</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{postData.stats.total_days}일</div>
            <div className="text-sm opacity-90">총 여행 기간</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{formatCost(postData.stats.total_cost)}</div>
            <div className="text-sm opacity-90">여행 비용</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlaceSummary;
