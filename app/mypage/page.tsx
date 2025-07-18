'use client';

import ActivitySummary from './ActivitySummary';
import { mockMyPosts, mockMyPlaces, mockDraftPosts } from './MockData';
import WritingPostListTab from './WritingPostListTab';
import CompletedPostListTab from './CompletedPostListTab';
import PlaceListTab from './PlaceListTab';
import MyTabs from './MyTabs';
import { useMypage } from '@/hooks/useMypage';

export default function MyPage() {
  const { activeTab, setActiveTab } = useMypage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActivitySummary mockMyPosts={mockMyPosts} mockMyPlaces={mockMyPlaces} />

        <MyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 탭 콘텐츠 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* 임시저장 탭 */}
          {activeTab === 'drafts' && <WritingPostListTab mockDraftPosts={mockDraftPosts} />}

          {/* 내 게시글 탭 */}
          {activeTab === 'posts' && <CompletedPostListTab mockMyPosts={mockMyPosts} />}

          {/* 내 여행지 탭 */}
          {activeTab === 'places' && <PlaceListTab mockMyPlaces={mockMyPlaces} />}
        </div>
      </div>
    </div>
  );
}
