import { apiClient } from './apiClient';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  createdAt: string;
  condition: 'new' | 'used' | 'refurbished';
  quantity: number;
  unit: string;
  isNegotiable: boolean;
  seller: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
    joinedAt: string;
    listingsCount?: number;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
}

export interface ListingsResponse {
  data: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListingsFilters {
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  q?: string;
  sortBy?: 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export const listingsApi = {
  async getListings(filters: ListingsFilters = {}): Promise<{ data: ListingsResponse | null; error: Error | null }> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await apiClient.get(`/listings?${params.toString()}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async getListingById(id: string): Promise<{ data: Listing | null; error: Error | null }> {
    try {
      const response = await apiClient.get(`/listings/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async createListing(formData: FormData): Promise<{ data: Listing | null; error: Error | null }> {
    try {
      const response = await apiClient.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async updateListing(
    id: string,
    updates: Partial<Omit<Listing, 'id' | 'createdAt' | 'seller' | 'reviews'>>
  ): Promise<{ data: Listing | null; error: Error | null }> {
    try {
      const response = await apiClient.put(`/listings/${id}`, updates);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async deleteListing(id: string): Promise<{ error: Error | null }> {
    try {
      await apiClient.delete(`/listings/${id}`);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async searchListings(query: string, filters: Partial<ListingsFilters> = {}): Promise<{ data: ListingsResponse | null; error: Error | null }> {
    try {
      const { data, error } = await apiClient.get('listings', {
        ...filters,
        status: 'available',
        or: `title.ilike.%${query}%,description.ilike.%${query}%`
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async getSimilarListings(listingId: string, limit: number = 5) {
    const listing = await this.getListingById(listingId);
    
    const { data, error } = await apiClient.get('listings', {
      waste_type: listing.wasteType,
      status: 'available',
      id: { neq: listingId },
      limit
    });

    if (error) throw error;
    return data;
  },

  async incrementViewCount(listingId: string) {
    const { data, error } = await apiClient.put('listings', listingId, {
      view_count: apiClient.rpc('increment', { row_id: listingId, column: 'view_count' })
    });

    if (error) throw error;
    return data;
  },

  async toggleSaveListing(listingId: string, userId: string) {
    // Check if already saved
    const { data: existing, error: checkError } = await apiClient.get('saved_listings', {
      listing_id: listingId,
      user_id: userId
    });

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      // Unsave
      const { error } = await apiClient.delete('saved_listings', existing[0].id);
      if (error) throw error;
      
      // Decrement save count
      await apiClient.put('listings', listingId, {
        save_count: apiClient.rpc('decrement', { row_id: listingId, column: 'save_count' })
      });
      
      return { saved: false };
    } else {
      // Save
      const { error } = await apiClient.post('saved_listings', {
        listing_id: listingId,
        user_id: userId,
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      
      // Increment save count
      await apiClient.put('listings', listingId, {
        save_count: apiClient.rpc('increment', { row_id: listingId, column: 'save_count' })
      });
      
      return { saved: true };
    }
  },

  async uploadListingImages(
    listingId: string,
    images: File[]
  ): Promise<{ data: string[] | null; error: Error | null }> {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await apiClient.post(`/listings/${listingId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
};
