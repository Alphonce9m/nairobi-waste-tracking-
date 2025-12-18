import { createClient } from '@/utils/supabase/client';
import { VerificationStatus } from '@/types/marketplace';

const supabase = createClient();

export class VerificationService {
  private static instance: VerificationService;

  private constructor() {}

  public static getInstance(): VerificationService {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService();
    }
    return VerificationService.instance;
  }

  public async startVerification(
    userId: string, 
    documentType: 'id' | 'business_license' | 'address',
    file: File
  ): Promise<{ success: boolean; verificationId?: string; error?: string }> {
    try {
      // 1. Upload document to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `verifications/${userId}/${documentType}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('verifications')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Create verification record
      const { data, error } = await supabase
        .from('verifications')
        .insert({
          user_id: userId,
          document_type: documentType,
          document_url: uploadData.path,
          status: 'pending_review'
        })
        .select()
        .single();

      if (error) throw error;

      // 3. Update user verification status
      await this.updateUserVerificationStatus(userId, 'pending');

      return { success: true, verificationId: data.id };
    } catch (error) {
      console.error('Verification error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Verification failed' 
      };
    }
  }

  public async checkVerificationStatus(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('verification_status, verifications(status, reviewed_at, rejection_reason)')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  public async getVerificationBadge(userId: string) {
    const { data } = await supabase
      .from('user_profiles')
      .select('verification_status, business_type')
      .eq('id', userId)
      .single();

    if (!data) return null;

    const { verification_status, business_type } = data;
    
    // Define badge levels based on verification status and business type
    if (verification_status === 'verified') {
      return {
        level: 'verified',
        label: 'Verified Business',
        icon: 'verified',
        color: 'green'
      };
    } else if (verification_status === 'pending') {
      return {
        level: 'pending',
        label: 'Verification Pending',
        icon: 'pending',
        color: 'orange'
      };
    }
    
    return null;
  }

  // Admin function - would be protected by RLS in production
  public async reviewVerification(
    verificationId: string, 
    status: 'approved' | 'rejected',
    reviewerNotes?: string
  ) {
    try {
      // 1. Update verification record
      const { data: verification, error: updateError } = await supabase
        .from('verifications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewerNotes
        })
        .eq('id', verificationId)
        .select('user_id')
        .single();

      if (updateError) throw updateError;

      // 2. Update user verification status
      const newStatus: VerificationStatus = status === 'approved' ? 'verified' : 'rejected';
      await this.updateUserVerificationStatus(verification.user_id, newStatus);

      return { success: true };
    } catch (error) {
      console.error('Review verification error:', error);
      return { success: false, error };
    }
  }

  private async updateUserVerificationStatus(
    userId: string, 
    status: VerificationStatus
  ) {
    const { error } = await supabase
      .from('user_profiles')
      .update({ verification_status: status })
      .eq('id', userId);

    if (error) throw error;
    return true;
  }
}

export const verificationService = VerificationService.getInstance();
