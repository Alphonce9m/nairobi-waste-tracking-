import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

type AvatarUploadProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
};

const sizeMap = {
  sm: { button: 'h-8 w-8', avatar: 'h-16 w-16' },
  md: { button: 'h-10 w-10', avatar: 'h-24 w-24' },
  lg: { button: 'h-12 w-12', avatar: 'h-32 w-32' },
};

export function AvatarUpload({ className = '', size = 'md', disabled = false }: AvatarUploadProps) {
  const { profile, uploadAvatar } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type and size (max 5MB)
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPEG, PNG, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      try {
        setIsUploading(true);
        await uploadAvatar(file);
        toast.success('Profile picture updated successfully');
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast.error('Failed to update profile picture');
      } finally {
        setIsUploading(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [uploadAvatar]
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`relative ${sizeMap[size].avatar}`}>
        <Avatar className="h-full w-full border-2 border-background shadow-sm">
          {profile?.avatar_url ? (
            <AvatarImage 
              src={profile.avatar_url} 
              alt={profile.full_name || 'User'}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary">
              {profile?.full_name ? getInitials(profile.full_name) : 'U'}
            </AvatarFallback>
          )}
        </Avatar>

        {!disabled && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/webp"
              className="hidden"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={`absolute -bottom-2 -right-2 rounded-full ${sizeMap[size].button}`}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || disabled}
            >
              {isUploading ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              ) : (
                <Icons.camera className="h-4 w-4" />
              )}
              <span className="sr-only">Upload profile picture</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
