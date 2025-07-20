import PostCard from '@/components/posts/PostCard';
import { PostWithUserAction } from '@/types/post.type';

export default function PostCardWrapper({ item }: { item: any }) {
  const post: PostWithUserAction = {
    ...item,
    places: item.places ?? [],
  };
  return <PostCard post={post} />;
}
