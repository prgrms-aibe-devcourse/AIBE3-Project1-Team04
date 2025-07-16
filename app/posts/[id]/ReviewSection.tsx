'use client';

import { useState } from 'react';

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
  avatar: string;
}

interface ReviewSectionProps {
  postId: string;
}

export default function ReviewSection({ postId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      author: '이영희',
      rating: 5,
      content: '정말 좋은 여행 코스였어요! 특히 해운대 일출이 너무 아름다웠습니다. 덕분에 즐거운 부산 여행을 할 수 있었어요.',
      createdAt: '2024-01-25',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20Asian%20woman%20profile%20photo%2C%20friendly%20smile%2C%20natural%20lighting%2C%20clean%20background%2C%20portrait%20photography&width=60&height=60&seq=avatar1&orientation=squarish'
    },
    {
      id: '2',
      author: '박민수',
      rating: 4,
      content: '감천문화마을이 정말 인상적이었습니다. 사진도 예쁘게 많이 찍을 수 있어서 좋았어요. 다음에 또 참고하겠습니다.',
      createdAt: '2024-01-23',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20Asian%20man%20profile%20photo%2C%20friendly%20expression%2C%20natural%20lighting%2C%20clean%20background%2C%20portrait%20photography&width=60&height=60&seq=avatar2&orientation=squarish'
    },
    {
      id: '3',
      author: '최지연',
      rating: 5,
      content: '가족 여행으로 다녀왔는데 아이들도 너무 즐거워했어요. 코스 구성이 알차고 실용적이었습니다.',
      createdAt: '2024-01-22',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20Asian%20woman%20profile%20photo%2C%20warm%20smile%2C%20natural%20lighting%2C%20clean%20background%2C%20portrait%20photography&width=60&height=60&seq=avatar3&orientation=squarish'
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    content: ''
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.content.trim()) {
      const review: Review = {
        id: Date.now().toString(),
        author: '새로운 사용자',
        rating: newReview.rating,
        content: newReview.content,
        createdAt: new Date().toISOString().split('T')[0],
        avatar: 'https://readdy.ai/api/search-image?query=Professional%20neutral%20profile%20photo%2C%20friendly%20expression%2C%20natural%20lighting%2C%20clean%20background%2C%20portrait%20photography&width=60&height=60&seq=avatar-new&orientation=squarish'
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, content: '' });
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            className={`w-5 h-5 flex items-center justify-center ${
              interactive ? 'cursor-pointer hover:scale-110' : ''
            }`}
            disabled={!interactive}
          >
            <i className={`ri-star-${star <= rating ? 'fill' : 'line'} ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}></i>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold mb-6">리뷰 ({reviews.length})</h3>
      
      {/* 리뷰 작성 */}
      <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-4">리뷰 작성하기</h4>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">평점</label>
          {renderStars(newReview.rating, true, (rating) => 
            setNewReview({ ...newReview, rating })
          )}
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
          <div className="text-xs text-gray-500 mt-1">
            {newReview.content.length}/500자
          </div>
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
                src={review.avatar}
                alt={review.author}
                className="w-12 h-12 rounded-full object-cover object-top"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h5 className="font-medium">{review.author}</h5>
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500">{review.createdAt}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}