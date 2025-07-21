import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { MyPostViewType, MyPlaceViewType } from '@/types/mypage.type';
import { useMessageModal } from '@/stores/MessageModalStore';

export const useMypage = () => {
  const { addModal } = useMessageModal();
  const [activeTab, setActiveTab] = useState('drafts');
  const { user } = useAuth();
  const [myPostList, setMyPostList] = useState<{
    not_viewed: MyPostViewType[];
    viewed: MyPostViewType[];
    total_post_likes: number;
  }>({ not_viewed: [], viewed: [], total_post_likes: 0 });
  const [myPlaceList, setMyPlaceList] = useState<{
    total_place_likes: number;
    places: MyPlaceViewType[];
  }>({ total_place_likes: 0, places: [] });

  useEffect(() => {
    if (!user) return;

    const getPostPlaceList = async () => {
      const { data: postData, error: postError } = await supabase.rpc('get_mypost_view_list_fast', {
        _user_id: user.id,
      }); // 함수 이름
      if (postError) {
        console.error('RPC 오류:', postError);
        addModal('게시글 목록 조회 중 오류가 발생했습니다.');
        return;
      }

      const { data: placeData, error: placeError } = await supabase.rpc(
        'get_myplace_view_list_fast',
        {
          _user_id: user.id,
        }
      ); // 함수 이름
      if (placeError) {
        console.error('RPC 오류:', placeError);
        addModal('여행지 목록 조회 중 오류가 발생했습니다.');
        return;
      }

      setMyPostList(postData);
      setMyPlaceList(placeData);
    };
    getPostPlaceList();
  }, [addModal, user]);

  const deletePost = async (postId: number) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) {
      console.log(error);
      console.error('게시글 삭제 오류:', error);
      addModal('게시글 삭제 중 오류가 발생했습니다.');
      return;
    }

    addModal('게시글이 삭제되었습니다.');
    setMyPostList((prev) => ({
      ...prev,
      viewed: prev.viewed.filter((post) => post.id !== postId),
    }));
  };

  const deletePlace = async (placeId: number) => {
    const { error } = await supabase.from('places').delete().eq('id', placeId);
    if (error) {
      console.log(error);
      console.error('여행지 삭제 오류:', error);
      addModal('여행지 삭제 중 오류가 발생했습니다.');
      return;
    }

    addModal('여행지가 삭제되었습니다.');
    setMyPlaceList((prev) => ({
      ...prev,
      places: prev.places.filter((place) => place.place_id !== placeId),
    }));
  };

  return {
    userName: user?.name,
    numOfPost: myPostList.viewed.length,
    numOfPlace: myPlaceList.places.length,
    numOfLikes: myPlaceList.total_place_likes + myPostList.total_post_likes,
    activeTab,
    postList: myPostList.viewed,
    notPostList: myPostList.not_viewed,
    placeList: myPlaceList.places,
    setActiveTab,
    deletePost,
    deletePlace,
  };
};
