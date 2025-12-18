import { apiClient } from './apiClient';
import { BuyerProfile, VerificationStatus } from '@/types/marketplace';

export const usersApi = {
  async getProfile(userId: string): Promise<BuyerProfile> {
    return apiClient.getById<BuyerProfile>('user_profiles', userId);
  },

  async createProfile(userId: string, profileData: Partial<BuyerProfile>) {
    return apiClient.post<BuyerProfile>('user_profiles', {
      id: userId,
      ...profileData,
      verification_status: 'unverified' as VerificationStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  },

  async updateProfile(userId: string, updates: Partial<BuyerProfile>) {
    return apiClient.put<BuyerProfile>('user_profiles', userId, {
      ...updates,
      updated_at: new Date().toISOString()
    });
  },

  async verifyUser(userId: string, verificationData: any) {
    // Upload verification documents
    const documentUrls = await Promise.all(
      verificationData.documents.map((doc: File) => 
        apiClient.uploadFile('verifications', `${userId}/${doc.name}`, doc)
      )
    );

    // Update verification status
    return this.updateProfile(userId, {
      verification_status: 'pending',
      verification_data: {
        documents: documentUrls,
        submitted_at: new Date().toISOString(),
        ...verificationData.metadata
      }
    });
  },

  async updatePreferences(userId: string, preferences: any) {
    return this.updateProfile(userId, {
      preferences: {
        ...(await this.getProfile(userId)).preferences,
        ...preferences
      }
    });
  },

  async getSavedListings(userId: string) {
    const { data, error } = await apiClient.get('saved_listings', {
      user_id: userId,
      select: 'listing(*)'
    });

    if (error) throw error;
    return data.map((item: any) => item.listing);
  },

  async getActivity(userId: string) {
    const [listings, transactions] = await Promise.all([
      apiClient.get('listings', { seller_id: userId }),
      apiClient.get('transactions', { buyer_id: userId })
    ]);

    return {
      listings: listings.data || [],
      transactions: transactions.data || []
    };
  }
};
