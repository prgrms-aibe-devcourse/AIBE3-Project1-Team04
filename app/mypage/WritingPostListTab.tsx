import Link from 'next/link';
import { MyPostViewType } from '@/lib/database';

function WritingPostListTab({ notPostList }: { notPostList: MyPostViewType[] }) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">임시저장한 게시물</h2>
        </div>

        {notPostList.length > 0 ? (
          <div className="space-y-4">
            {notPostList.map((post: MyPostViewType) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.title}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        최종 수정:{' '}
                        {new Date(post.modified_at ?? post.created_at).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        임시저장
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/posts/edit?post=${post.id}`}
                      className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                    >
                      편집
                    </Link>
                    <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded cursor-pointer">
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <i className="ri-draft-line w-16 h-16 flex items-center justify-center text-gray-300 mx-auto mb-4 text-4xl"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">임시저장한 글이 없습니다</h3>
            <p className="text-gray-500 mb-4">새로운 여행 이야기를 작성해보세요</p>
            <Link
              href="/posts/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              글쓰기 시작하기
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default WritingPostListTab;
