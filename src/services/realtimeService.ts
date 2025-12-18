import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeToTable(table: string, callback: (payload: any) => void) {
    // Create a new channel for this table if it doesn't exist
    if (!this.channels.has(table)) {
      const channel = supabase
        .channel('realtime changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
          },
          (payload) => {
            callback(payload);
          }
        )
        .subscribe();

      this.channels.set(table, channel);
    }

    // Return a function to unsubscribe
    return () => {
      const channel = this.channels.get(table);
      if (channel) {
        channel.unsubscribe();
        this.channels.delete(table);
      }
    };
  }
}

// Export a singleton instance
export const realtimeService = new RealtimeService();