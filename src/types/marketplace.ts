export interface BuyerProfile {
  id: string;
  businessName: string;
  businessType: 'recycler' | 'manufacturer' | 'retailer' | 'other';
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  subscriptionTier: 'free' | 'basic' | 'premium';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WasteListing {
  id: string;
  sellerId: string; // Changed from groupId to sellerId to match Bolt system
  wasteType: 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'mixed'; // Updated waste types
  quantity: number;
  pricePerKg: number;
  availableFrom: string;
  availableUntil: string;
  status: 'available' | 'reserved' | 'sold' | 'expired';
  location: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalPrice: number; // Changed from totalAmount to totalPrice to match Bolt system
  status: 'pending' | 'completed' | 'cancelled' | 'disputed';
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceStats {
  totalListings: number;
  activeListings: number;
  totalTransactions: number;
  totalRevenue: number;
  averagePricePerKg: {
    plastic: number;
    organic: number;
    electronic: number;
    hazardous: number;
    mixed: number;
  };
}
