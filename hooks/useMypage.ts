import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { MyPostViewType, PlaceViewType } from '@/app/mypage/type';

export const useMypage = () => {
  const [activeTab, setActiveTab] = useState('drafts');
  const { user } = useAuth();
  const [myPostList, setMyPostList] = useState<{
    not_viewed: MyPostViewType[];
    viewed: MyPostViewType[];
    total_post_likes: number;
  }>({ not_viewed: [], viewed: [], total_post_likes: 0 });
  const [myPlaceList, setMyPlaceList] = useState<{
    total_place_likes: number;
    places: PlaceViewType[];
  }>({ total_place_likes: 0, places: [] });

  useEffect(() => {
    if (!user) return;

    const getPostList = async () => {
      const { data, error } = await supabase.rpc('get_mypost_view_list', { _user_id: user.id }); // 함수 이름
      if (error) {
        console.error('RPC 오류:', error);
        return;
      }
      console.log(data);
      setMyPostList(data);
    };

    const getPlaceList = async () => {
      const { data, error } = await supabase.rpc('get_myplace_view_list', { _user_id: user.id }); // 함수 이름
      if (error) {
        console.error('RPC 오류:', error);
        return;
      }
      console.log('dasfa', data);
      setMyPlaceList(data);
    };

    getPostList();
    getPlaceList();
  }, [user]);

  return {
    userName: user?.user_metadata.name,
    numOfPost: myPostList.viewed.length,
    numOfPlace: myPlaceList.places.length,
    numOfLikes: myPlaceList.total_place_likes + myPostList.total_post_likes,
    activeTab,
    postList: myPostList.viewed,
    notPostList: myPostList.not_viewed,
    setActiveTab,
  };
};
