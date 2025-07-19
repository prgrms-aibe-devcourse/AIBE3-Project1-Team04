'use client';

import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { fetchUserProfile } from '@/lib/auth';
import { AuthContextType, UserProfile } from '@/types/auth.type';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getInitialUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const profile = await fetchUserProfile(user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInitialUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const value = {
    user,
    loading,
    signOut,
    getInitialUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
