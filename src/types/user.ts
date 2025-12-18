import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  phone_number: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    theme: 'light' | 'dark' | 'system';
  };
  metadata?: Record<string, unknown>;
}

export interface UpdateProfileData {
  full_name?: string;
  username?: string;
  phone_number?: string | null;
  address?: string | null;
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    language?: string;
    theme?: 'light' | 'dark' | 'system';
  };
}

export interface UserContextType {
  user: (SupabaseUser & { user_metadata: UserProfile }) | null;
  profile: UserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: UpdateProfileData) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  signOut: () => Promise<void>;
}
