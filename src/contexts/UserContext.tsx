import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { UserProfile, UserContextType } from '@/types/user';
import { profileService } from '@/services/profileService';
import { toast } from 'sonner';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const userProfile = await profileService.getCurrentProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updates: any) => {
    if (!user) return;
    
    try {
      const updatedProfile = await profileService.updateProfile(user.id, updates);
      setProfile(prev => ({
        ...prev,
        ...updatedProfile,
        preferences: {
          ...prev?.preferences,
          ...updates.preferences,
        },
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const avatarUrl = await profileService.uploadAvatar(user.id, file);
      
      // Update local state
      setProfile(prev => ({
        ...prev!,
        avatar_url: avatarUrl,
      }));
      
      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Check current session on mount
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user: user ? { ...user, user_metadata: profile } as any : null,
    profile,
    isLoading,
    refreshProfile,
    updateProfile,
    uploadAvatar,
    signOut,
  };

  return (
    <UserContext.Provider value={value}>
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
