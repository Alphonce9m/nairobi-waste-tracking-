import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
import { useEffect } from 'react';

type AdminStats = {
  totalUsers: number;
  activeRequests: number;
  completedRequests: number;
  userGrowth: number;
  requestChange: number;
  completionRate: number;
  lastUpdated: string;
};

// Cache for storing previous values for calculating changes
const statsCache: {
  previous?: AdminStats;
  lastUpdated?: Date;
} = {};

async function fetchStats(): Promise<AdminStats> {
  // Get user count
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  // Get request stats
  const { count: activeRequests } = await supabase
    .from('service_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress');
  
  const { count: completedRequests } = await supabase
    .from('service_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('completed_at', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString());
  
  // Calculate growth and change percentages
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Get previous user count for growth calculation
  const { count: previousUserCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .lt('created_at', oneWeekAgo.toISOString());
  
  // Get previous completed requests for change calculation
  const { count: previousCompletedRequests } = await supabase
    .from('service_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('completed_at', new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .lt('completed_at', oneWeekAgo.toISOString());
  
  // Calculate metrics
  const userGrowth = previousUserCount && previousUserCount > 0 
    ? ((userCount || 0) - previousUserCount) / previousUserCount * 100 
    : 0;
    
  const requestChange = previousCompletedRequests && previousCompletedRequests > 0
    ? ((completedRequests || 0) - previousCompletedRequests) / previousCompletedRequests * 100
    : 0;
    
  const completionRate = (completedRequests || 0) > 0 && (userCount || 0) > 0
    ? Math.min(100, ((completedRequests || 0) / (userCount || 1)) * 100)
    : 0;
  
  return {
    totalUsers: userCount || 0,
    activeRequests: activeRequests || 0,
    completedRequests: completedRequests || 0,
    userGrowth: parseFloat(userGrowth.toFixed(1)),
    requestChange: parseFloat(requestChange.toFixed(1)),
    completionRate: parseFloat(completionRate.toFixed(1)),
    lastUpdated: now.toISOString(),
  };
}

export function useAdminStats() {
  const queryClient = useQueryClient();
  
  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to profiles table changes
    const profilesSubscription = supabase
      .channel('profiles_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
      )
      .subscribe();

    // Subscribe to service_requests table changes
    const requestsSubscription = supabase
      .channel('service_requests_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'service_requests' 
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesSubscription);
      supabase.removeChannel(requestsSubscription);
    };
  }, [queryClient]);

  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: fetchStats,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes as fallback
    staleTime: 0, // Always consider the data stale to get fresh data on refocus
  });
}
