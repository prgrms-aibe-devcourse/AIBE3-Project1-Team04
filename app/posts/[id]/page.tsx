import PostDetail from './PostDetail';

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
}

export default function PostPage({ params }: { params: { id: string } }) {
  return <PostDetail postId={params.id} />;
}
