import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient();

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export const messagingApi = {
  // Get or create conversation
  async getOrCreateConversation(listingId: string, buyerId: string, sellerId: string): Promise<Conversation> {
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('listing_id', listingId)
      .eq('buyer_id', buyerId)
      .single();

    if (existing) return existing;

    // Create new conversation
    const newConversation = {
      id: uuidv4(),
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
      unread_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('conversations')
      .insert([newConversation])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Send message
  async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
    const message = {
      id: uuidv4(),
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;

    // Update conversation's updated_at and increment unread count
    await supabase
      .from('conversations')
      .update({
        updated_at: new Date().toISOString(),
        last_message: message,
        unread_count: supabase.rpc('increment', {
          row_id: conversationId,
          column: 'unread_count'
        })
      })
      .eq('id', conversationId);

    return data;
  },

  // Get conversation messages
  async getMessages(conversationId: string, page = 1, pageSize = 20) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      pagination: {
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    };
  },

  // Get user conversations
  async getUserConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        listing:listings(*),
        seller:user_profiles!conversations_seller_id_fkey(*),
        buyer:user_profiles!conversations_buyer_id_fkey(*)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Mark messages as read
  async markAsRead(conversationId: string, userId: string) {
    // Mark messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId);

    // Reset unread count
    const { data, error } = await supabase
      .from('conversations')
      .update({ unread_count: 0 })
      .eq('id', conversationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Subscribe to new messages
  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  // Subscribe to conversation updates
  subscribeToConversations(userId: string, callback: (conversation: Conversation) => void) {
    const subscription = supabase
      .channel(`user_conversations:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `buyer_id=eq.${userId},seller_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Conversation);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
};
