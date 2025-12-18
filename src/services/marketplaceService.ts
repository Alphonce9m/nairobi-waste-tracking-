import { createClient } from '@/utils/supabase/client';
import { BuyerProfile, WasteListing, Transaction } from '@/types/marketplace';
import { realtimeService } from './realtimeService';

const supabase = createClient();

type RealtimeCallback = (payload: {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: any;
  old: any;
}) => void;

// Buyer Profile Services
export const buyerProfileService = {
  async createProfile(profile: Omit<BuyerProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('buyer_profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('buyer_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<BuyerProfile>) {
    const { data, error } = await supabase
      .from('buyer_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllProfiles() {
    const { data, error } = await supabase
      .from('buyer_profiles')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};

// Waste Listing Services
export const listingService = {
  async createListing(listing: Omit<WasteListing, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('waste_listings')
      .insert({
        ...listing,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error };
  },
  
  subscribeToListings(callback: RealtimeCallback) {
    return realtimeService.subscribeToTable('waste_listings', (payload) => {
      callback({
        eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        new: payload.new,
        old: payload.old
      });
    });
  },
  
  async getListings(filters: {
    wasteType?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    let query = supabase
      .from('waste_listings')
      .select('*')
      .eq('status', 'available')
      .order('createdAt', { ascending: false });

    if (filters?.wasteType) {
      query = query.eq('wasteType', filters.wasteType);
    }
    if (filters?.minPrice) {
      query = query.gte('pricePerKg', filters.minPrice);
    }
    if (filters?.maxPrice) {
      query = query.lte('pricePerKg', filters.maxPrice);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getListingById(id: string) {
    const { data, error } = await supabase
      .from('waste_listings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getListingsBySeller(sellerId: string) {
    const { data, error } = await supabase
      .from('waste_listings')
      .select('*')
      .eq('sellerId', sellerId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateListing(id: string, updates: Partial<WasteListing>) {
    const { data, error } = await supabase
      .from('waste_listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteListing(id: string) {
    const { error } = await supabase
      .from('waste_listings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Transaction Services
export const transactionService = {
  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTransactionsByBuyer(buyerId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('buyerId', buyerId)
      .order('createdAt', { ascending: false }); // Changed from transactionDate to createdAt
    
    if (error) throw error;
    return data;
  },

  async getTransactionsBySeller(sellerId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('sellerId', sellerId)
      .order('createdAt', { ascending: false }); // Changed from transactionDate to createdAt
    
    if (error) throw error;
    return data;
  },

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTransactionStats() {
    const { data, error } = await supabase
      .from('transactions')
      .select('totalAmount, commissionAmount')
      .eq('status', 'completed');
    
    if (error) throw error;
    
    const totalRevenue = data?.reduce((sum, t) => sum + t.totalAmount, 0) || 0;
    const totalCommission = data?.reduce((sum, t) => sum + t.commissionAmount, 0) || 0;
    
    return { totalRevenue, totalCommission };
  },
};

// Real-time subscriptions
export const subscribeToListings = (callback: (payload: { new: WasteListing; old?: WasteListing; eventType: string }) => void) => {
  return supabase
    .channel('waste_listings')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'waste_listings' },
      callback
    )
    .subscribe();
};

export const subscribeToTransactions = (callback: (payload: { new: Transaction; old?: Transaction; eventType: string }) => void) => {
  return supabase
    .channel('transactions')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'transactions' },
      callback
    )
    .subscribe();
};
