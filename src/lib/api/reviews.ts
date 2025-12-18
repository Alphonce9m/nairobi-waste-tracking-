import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export interface Review {
  id: string;
  transaction_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  // Additional fields from joined tables
  reviewer?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  listing?: {
    id: string;
    title: string;
    waste_type: string;
  };
}

export const reviewsApi = {
  async createReview(reviewData: Omit<Review, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        ...reviewData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getReviews(userId: string, type: 'given' | 'received' = 'received') {
    const column = type === 'given' ? 'reviewer_id' : 'reviewee_id';
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        listing:listings!reviews_listing_id_fkey(
          id,
          title,
          waste_type
        )
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getListingReviews(listingId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getUserRating(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', userId);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return {
        average: 0,
        count: 0,
        distribution: [0, 0, 0, 0, 0]
      };
    }

    const total = data.reduce((sum, review) => sum + review.rating, 0);
    const average = total / data.length;
    
    // Calculate rating distribution (1-5 stars)
    const distribution = [0, 0, 0, 0, 0];
    data.forEach(review => {
      distribution[review.rating - 1]++;
    });

    return {
      average: parseFloat(average.toFixed(1)),
      count: data.length,
      distribution
    };
  },

  async canReviewTransaction(userId: string, transactionId: string) {
    // Check if user has already reviewed this transaction
    const { count, error } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('transaction_id', transactionId)
      .eq('reviewer_id', userId);

    if (error) throw error;
    
    // If already reviewed, can't review again
    if (count && count > 0) return false;

    // Check if user is part of this transaction
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('buyer_id, seller_id')
      .eq('id', transactionId)
      .single();

    if (txError) throw txError;
    
    // User must be either buyer or seller to review
    return transaction && (transaction.buyer_id === userId || transaction.seller_id === userId);
  },

  async reportReview(reviewId: string, reason: string, userId: string) {
    const { data, error } = await supabase
      .from('reported_reviews')
      .insert([{
        review_id: reviewId,
        reported_by: userId,
        reason,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRecentReviews(limit: number = 5) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        listing:listings!reviews_listing_id_fkey(
          id,
          title,
          waste_type
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};
