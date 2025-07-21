import Link from 'next/link';
import { MyPostViewType } from '@/types/mypage.type';
import MyPostCard from '@/components/mypage/MyPostCard';

function CompletedPostListTab({
  postList,
  deletePost,
}: {
  postList: MyPostViewType[];
  deletePost: (postId: number) => void;
}) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">내가 작성한 게시글</h2>
          <div className="text-sm text-gray-600">총 {postList.length}개의 게시글</div>
        </div>

        {postList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {postList.map((post: MyPostViewType) => (
              <div key={post.id} className="relative">
                <MyPostCard {...post} />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Link
                    href={`/posts/edit?post=${post.id}`}
                    className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm cursor-pointer"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center text-gray-600"></i>
                  </Link>
                  <button
                    className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm cursor-pointer"
                    onClick={() => deletePost(post.id)}
                  >
                    <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center text-red-600"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <i className="ri-article-line w-16 h-16 flex items-center justify-center text-gray-300 mx-auto mb-4 text-4xl"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">작성한 게시글이 없습니다</h3>
            <p className="text-gray-500 mb-4">첫 번째 여행 후기를 작성해보세요</p>
            <Link
              href="/posts/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              게시글 작성하기
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default CompletedPostListTab;
