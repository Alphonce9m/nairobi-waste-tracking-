import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient();

interface MpesaPaymentRequest {
  phone: string;
  amount: number;
  accountReference: string;
  description: string;
  callbackUrl?: string;
}

export const paymentsApi = {
  async initializeMpesaPayment(paymentData: MpesaPaymentRequest) {
    // In a real implementation, this would call your backend API
    // which then calls the M-Pesa API with your credentials
    const paymentId = `MPESA-${Date.now()}-${uuidv4()}`;
    
    // Simulate API call to M-Pesa
    return {
      id: paymentId,
      status: 'pending',
      message: 'Payment request sent to M-Pesa',
      timestamp: new Date().toISOString(),
      checkoutRequestId: `ws_CO_${Date.now()}`,
      merchantRequestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      responseCode: '0',
      responseDescription: 'Success. Request accepted for processing'
    };
  },

  async confirmMpesaPayment(transactionId: string) {
    // In a real implementation, this would check the payment status
    // from your backend which would verify with M-Pesa
    return {
      id: transactionId,
      status: 'completed',
      amount: 0, // Would be the actual amount from the transaction
      receiptNumber: `MP${Date.now()}`,
      transactionDate: new Date().toISOString(),
      phoneNumber: '', // Would be the actual phone number
      accountReference: '' // Would be your reference
    };
  },

  async createEscrow(transactionId: string, amount: number, sellerId: string, buyerId: string) {
    // In a real implementation, this would create an escrow in your database
    const escrowId = `escrow-${uuidv4()}`;
    
    const { data, error } = await supabase
      .from('escrows')
      .insert([{
        id: escrowId,
        transaction_id: transactionId,
        amount,
        seller_id: sellerId,
        buyer_id: buyerId,
        status: 'held',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async releaseEscrow(escrowId: string) {
    // In a real implementation, this would trigger the actual fund transfer
    const { data, error } = await supabase
      .from('escrows')
      .update({
        status: 'released',
        released_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', escrowId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async refundEscrow(escrowId: string, reason: string) {
    // In a real implementation, this would trigger a refund to the buyer
    const { data, error } = await supabase
      .from('escrows')
      .update({
        status: 'refunded',
        refund_reason: reason,
        refunded_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', escrowId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPaymentHistory(userId: string, type: 'sent' | 'received' = 'sent') {
    const column = type === 'sent' ? 'buyer_id' : 'seller_id';
    
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        listing:listings(*),
        buyer:user_profiles!transactions_buyer_id_fkey(*),
        seller:user_profiles!transactions_seller_id_fkey(*)
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getEscrowDetails(escrowId: string) {
    const { data, error } = await supabase
      .from('escrows')
      .select('*')
      .eq('id', escrowId)
      .single();

    if (error) throw error;
    return data;
  },

  async calculateFees(amount: number) {
    // Example fee structure
    const platformFee = Math.max(amount * 0.05, 10); // 5% or 10 KES, whichever is higher
    const transactionFee = 0; // M-Pesa fees would be added here
    const total = amount + platformFee + transactionFee;

    return {
      amount,
      platformFee,
      transactionFee,
      total,
      currency: 'KES'
    };
  }
};
