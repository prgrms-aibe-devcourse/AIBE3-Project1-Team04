import { LoginData, SignUpData, UserProfile, AuthResponse } from '@/types/auth.type';
import { supabase } from './supabaseClient';
import { User, AuthError } from '@supabase/supabase-js';

export async function signUp({ email, password, options }: SignUpData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }

    const user = data.user;

    // ✅ 회원가입 성공 시 user_profiles 테이블에 정보 저장
    if (user) {
      const meta = user.user_metadata || {};
      const name = meta.name || meta.nickname || meta.full_name || '익명 유저';
      const avatar_url = meta.avatar_url || null;

      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: user.id,
        name,
        avatar_url,
      });

      if (profileError) {
        console.error('user_profiles 저장 실패:', profileError.message);
      }
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    return {
      success: false,
      error: '회원가입 중 오류가 발생했습니다.',
    };
  }
}

// 로그인 함수
export async function signIn({ email, password }: LoginData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: '로그인 중 오류가 발생했습니다.',
    };
  }
}

// 로그아웃 함수
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: '로그아웃 중 오류가 발생했습니다.',
    };
  }
}

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, name, avatar_url')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
};

// 현재 사용자 가져오기
export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    return null;
  }
}

// 인증 상태 변경 감지
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
}

// 에러 메시지 변환 함수
function getErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    case 'Email not confirmed':
      return '이메일 인증이 필요합니다.';
    case 'User already registered':
      return '이미 등록된 이메일입니다.';
    case 'Password should be at least 6 characters':
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    case 'Unable to validate email address: invalid format':
      return '올바른 이메일 형식을 입력해주세요.';
    default:
      return error.message || '알 수 없는 오류가 발생했습니다.';
  }
}

// 소셜 로그인 함수들
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Google 로그인 중 오류가 발생했습니다.',
    };
  }
}

export async function signInWithGithub(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'GitHub 로그인 중 오류가 발생했습니다.',
    };
  }
}

export async function signInWithKakao(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Kakao 로그인 중 오류가 발생했습니다.',
    };
  }
}
