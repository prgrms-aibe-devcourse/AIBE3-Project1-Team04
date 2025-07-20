import { User } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  user?: User | null;
  error?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  options: {
    data: object;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getInitialUser: () => Promise<void>;
}
