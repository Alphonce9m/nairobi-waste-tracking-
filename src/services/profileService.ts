import { createClient } from '@/utils/supabase/client';
import { UserProfile, UpdateProfileData } from '@/types/user';

const supabase = createClient();

const PROFILE_TABLE = 'profiles';
const AVATAR_BUCKET = 'avatars';

export const profileService = {
  // Get the current user's profile
  async getCurrentProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from(PROFILE_TABLE)
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    // Set default preferences if not set
    const defaultProfile: Partial<UserProfile> = {
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        language: 'en',
        theme: 'system',
      },
    };

    return { ...defaultProfile, ...data } as UserProfile;
  },

  // Update user profile
  async updateProfile(userId: string, updates: UpdateProfileData): Promise<UserProfile> {
    const { data, error } = await supabase
      .from(PROFILE_TABLE)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data as UserProfile;
  },

  // Upload profile picture
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    await this.updateProfile(userId, { avatar_url: publicUrl });

    return publicUrl;
  },

  // Delete profile picture
  async deleteAvatar(userId: string, filePath: string): Promise<void> {
    // Extract the file path from the URL
    const pathParts = filePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const fullPath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .remove([fullPath]);

    if (error) {
      console.error('Error deleting avatar:', error);
      throw error;
    }

    // Update profile to remove avatar URL
    await this.updateProfile(userId, { avatar_url: null });
  },

  // Search users (for admin)
  async searchUsers(searchTerm: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from(PROFILE_TABLE)
      .select('*')
      .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);

    if (error) {
      console.error('Error searching users:', error);
      throw error;
    }

    return data as UserProfile[];
  },

  // Update user role (admin only)
  async updateUserRole(userId: string, role: 'buyer' | 'seller' | 'admin'): Promise<void> {
    const { error } = await supabase
      .from(PROFILE_TABLE)
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },
};
