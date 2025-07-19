'use client';
import { useAuth } from '@/hooks/useAuth';
import { usePlace } from '@/hooks/usePlace';
import { PlaceReview } from '@/types/place.type';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { reviewStars } from '../reviewStar';

interface PlaceDetailProps {
  placeId: string;
}

export const PlaceReviewForm = ({ placeId }: PlaceDetailProps) => {
  const [reviews, setReviews] = useState<PlaceReview[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    content: '',
  });
  const { getPlaceReviews, createPlaceReivew } = usePlace();
  const { user } = useAuth();

  const fetchAllPlaceReviews = useCallback(async () => {
    try {
      if (!placeId) return;
      const data = await getPlaceReviews(placeId);
      setReviews(data);
    } catch (error) {
      console.error('해당 여행지를 가져오는 중 오류 발생:', error);
    }
  }, [placeId, getPlaceReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !placeId) return;
    if (newReview.content.trim()) {
      const review = {
        user_id: user.id,
        place_id: Number(placeId),
        rating: newReview.rating,
        content: newReview.content,
      };

      await createPlaceReivew(review);
      setNewReview({ rating: 5, content: '' });
      fetchAllPlaceReviews();
    }
  };

  useEffect(() => {
    fetchAllPlaceReviews();
  }, [fetchAllPlaceReviews]);
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold mb-6">리뷰 ({reviews.length})</h3>

      {/* 리뷰 작성 */}
      <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-4">리뷰 작성하기</h4>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">평점</label>
          {reviewStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">리뷰 내용</label>
          <textarea
            value={newReview.content}
            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows={4}
            placeholder="여행 경험을 공유해주세요..."
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">{newReview.content.length}/500자</div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
        >
          리뷰 등록
        </button>
      </form>

      {/* 리뷰 목록 */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <img
                src={review.avatar_url}
                alt={review.user_name}
                className="w-12 h-12 rounded-full object-cover object-top"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h5 className="font-medium">{review.user_name}</h5>
                  {reviewStars(review.rating)}
                  <span className="text-sm text-gray-500">
                    {format(review.created_at, 'yyyy-MM-dd HH:mm:ss')}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceReviewForm;
