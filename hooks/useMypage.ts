import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { MyPostViewType, MyPlaceViewType } from '@/lib/database';

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
    places: MyPlaceViewType[];
  }>({ total_place_likes: 0, places: [] });

  useEffect(() => {
    if (!user) return;

    const getPostPlaceList = async () => {
      const { data: postData, error: postError } = await supabase.rpc('get_mypost_view_list', {
        _user_id: user.id,
      }); // 함수 이름
      if (postError) {
        console.error('RPC 오류:', postError);
        return;
      }

      const { data: placeData, error: placeError } = await supabase.rpc('get_myplace_view_list', {
        _user_id: user.id,
      }); // 함수 이름
      if (placeError) {
        console.error('RPC 오류:', placeError);
        return;
      }

      setMyPostList(postData);
      setMyPlaceList(placeData);
    };
    getPostPlaceList();
  }, [user]);

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
  };
};
