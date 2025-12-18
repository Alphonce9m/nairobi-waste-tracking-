// Core Enums
export type WasteType = 
  | 'plastic' | 'paper' | 'glass' | 'metal' | 'organic'
  | 'e-waste' | 'hazardous' | 'construction' | 'textile' | 'other';

export type WasteGrade = 'A' | 'B' | 'C' | 'D' | 'mixed';
export type UnitOfMeasure = 'kg' | 'ton' | 'bag' | 'bale' | 'pallet' | 'piece' | 'liter';
export type TransactionStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled' | 'disputed';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

// Core Interfaces
export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

export interface BuyerProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: 'recycler' | 'manufacturer' | 'retailer' | 'processor' | 'other';
  contactPerson: string;
  phoneNumber: string;
  email: string;
  location: Location;
  verificationStatus: VerificationStatus;
  verificationData?: any; // Could store KYC/verification documents
  rating?: number;
  totalTransactions: number;
  subscriptionTier: 'free' | 'basic' | 'premium';
  createdAt: string;
  updatedAt: string;
}

export interface WasteListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  wasteType: WasteType;
  wasteGrade: WasteGrade;
  quantity: number;
  unit: UnitOfMeasure;
  pricePerUnit: number;
  totalPrice: number;
  location: Location;
  images: string[];
  status: 'available' | 'reserved' | 'sold' | 'expired';
  availableFrom: string;
  availableUntil: string;
  isNegotiable: boolean;
  viewCount: number;
  saveCount: number;
  createdAt: string;
  updatedAt: string;
  // Additional metadata
  tags?: string[];
  certifications?: string[];
  pickupInstructions?: string;
}

export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  unit: UnitOfMeasure;
  pricePerUnit: number;
  totalPrice: number;
  status: TransactionStatus;
  paymentMethod: string;
  paymentStatus: 'pending' | 'partial' | 'completed' | 'refunded';
  paymentTransactionId?: string;
  // Logistics
  pickupAddress?: string;
  deliveryAddress?: string;
  scheduledPickupTime?: string;
  actualPickupTime?: string;
  // Ratings and reviews
  buyerRating?: number;
  sellerRating?: number;
  buyerReview?: string;
  sellerReview?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
  // Additional fields
  disputeReason?: string;
  cancellationReason?: string;
  cancellationRequestedBy?: 'buyer' | 'seller';
}

// Real-time Communication
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  read: boolean;
  attachments?: string[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Market Data
export interface PriceSuggestion {
  minPrice: number;
  maxPrice: number;
  suggestedPrice: number;
  confidence: 'low' | 'medium' | 'high';
  lastUpdated: string;
  marketTrend: 'up' | 'down' | 'stable';
  unit: UnitOfMeasure;
}

export interface MarketplaceStats {
  totalListings: number;
  activeListings: number;
  totalTransactions: number;
  totalRevenue: number;
  averagePricePerKg: Record<WasteType, number>;
  monthlyTransactions: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
  topWasteTypes: Array<{
    wasteType: WasteType;
    count: number;
    percentage: number;
  }>;
}
