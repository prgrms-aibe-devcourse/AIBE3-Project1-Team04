import Link from 'next/link';

function WritingPostListTab({ mockDraftPosts }: { mockDraftPosts: any }) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">임시저장한 게시물</h2>
          <Link
            href="/posts/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
          >
            새 글 작성
          </Link>
        </div>

        {mockDraftPosts.length > 0 ? (
          <div className="space-y-4">
            {mockDraftPosts.map((draft) => (
              <div
                key={draft.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-2">{draft.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{draft.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>최종 수정: {new Date(draft.updatedAt).toLocaleDateString()}</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        임시저장
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/posts/create?draft=${draft.id}`}
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
