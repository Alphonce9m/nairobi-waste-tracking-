import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '../../components/icons';

// Define form schema with Zod
const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { profile, updateProfile } = useUser();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      username: profile?.username || '',
      email: profile?.email || '',
      phone_number: profile?.phone_number || '',
      address: profile?.address || '',
      bio: profile?.metadata?.bio || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Prepare the update data
      const updateData: any = {
        full_name: data.full_name,
        username: data.username,
        phone_number: data.phone_number || null,
        address: data.address || null,
      };
      
      // Add metadata if bio exists
      if (data.bio) {
        updateData.metadata = {
          ...(profile?.metadata || {}),
          bio: data.bio,
        };
      }
      
      await updateProfile(updateData);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            placeholder="John Doe"
            {...register('full_name')}
            disabled={isSubmitting}
          />
          {errors.full_name && (
            <p className="text-sm text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">@</span>
            </div>
            <Input
              id="username"
              placeholder="username"
              className="pl-8"
              {...register('username')}
              disabled={isSubmitting}
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icons.mail className="w-4 h-4 text-gray-500" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              {...register('email')}
              disabled={true}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Contact support to change your email address
          </p>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icons.phone className="w-4 h-4 text-gray-500" />
            </div>
            <Input
              id="phone_number"
              type="tel"
              placeholder="+254 700 000000"
              className="pl-10"
              {...register('phone_number')}
              disabled={isSubmitting}
            />
          </div>
          {errors.phone_number && (
            <p className="text-sm text-red-500">{errors.phone_number.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <div className="relative">
          <div className="absolute top-3 left-3">
            <Icons.mapPin className="w-4 h-4 text-gray-500" />
          </div>
          <Textarea
            id="address"
            placeholder="Enter your full address"
            className="pl-10 min-h-[100px]"
            {...register('address')}
            disabled={isSubmitting}
          />
        </div>
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us a little bit about yourself"
          className="min-h-[120px]"
          {...register('bio')}
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          A short bio about yourself (max 160 characters)
        </p>
        {errors.bio && (
          <p className="text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
          )}
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
