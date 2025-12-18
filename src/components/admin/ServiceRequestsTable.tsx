import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

type ServiceRequest = {
  id: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  waste_type: string;
  quantity: number;
  urgency: 'normal' | 'urgent' | 'emergency';
  created_at: string;
  updated_at: string;
  user_id: string;
  collector_id?: string;
  scheduled_pickup?: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  user: {
    full_name: string;
    email: string;
    phone: string;
  };
};

type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
type WasteTypeFilter = 'all' | 'plastic' | 'organic' | 'hazardous' | 'electronic' | 'mixed';

type ServiceRequestsTableProps = {
  limit?: number;
  showActions?: boolean;
  onRefresh?: () => void;
  statusFilter?: StatusFilter;
  wasteTypeFilter?: WasteTypeFilter;
  searchQuery?: string;
};

export function ServiceRequestsTable({ 
  limit = 10, 
  showActions = true, 
  onRefresh, 
  statusFilter = 'all',
  wasteTypeFilter = 'all',
  searchQuery = ''
}: ServiceRequestsTableProps) {
  const { data: requests, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['admin-service-requests', statusFilter, wasteTypeFilter, searchQuery],
    queryFn: async (): Promise<ServiceRequest[]> => {
      let query = supabase
        .from('service_requests')
        .select(`
          *,
          user:user_id (full_name, email, phone)
        `);

      // Apply status filter
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply waste type filter
      if (wasteTypeFilter && wasteTypeFilter !== 'all') {
        query = query.eq('waste_type', wasteTypeFilter);
      }

      // Apply search query
      if (searchQuery) {
        query = query.or(`
          id.ilike.%${searchQuery}%,
          user_id.full_name.ilike.%${searchQuery}%,
          user_id.email.ilike.%${searchQuery}%,
          waste_type.ilike.%${searchQuery}%
        `);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit || 10);

      if (error) throw error;
      return data || [];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('service_requests_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_requests' },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [refetch]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge className={`${statusInfo.color} capitalize`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getWasteTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      plastic: 'bg-blue-100 text-blue-800',
      organic: 'bg-green-100 text-green-800',
      hazardous: 'bg-red-100 text-red-800',
      electronic: 'bg-purple-100 text-purple-800',
      mixed: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <Badge className={`${typeMap[type] || 'bg-gray-100 text-gray-800'} capitalize`}>
        {type}
      </Badge>
    );
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the data
      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recent Service Requests</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refetch();
            onRefresh?.();
          }}
          disabled={isRefetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Waste Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  <div className="max-w-[100px] truncate">
                    {request.id.split('-')[0]}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{request.user?.full_name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">
                      {request.user?.email || 'No email'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    {getWasteTypeBadge(request.waste_type)}
                    <div className="text-sm text-muted-foreground">
                      {request.quantity} kg • {request.urgency}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</div>
                    {request.scheduled_pickup && (
                      <div className="text-xs text-muted-foreground">
                        Pickup: {new Date(request.scheduled_pickup).toLocaleString()}
                      </div>
                    )}
                  </div>
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Navigate to request details
                          window.location.href = `/admin/requests/${request.id}`;
                        }}
                      >
                        View
                      </Button>
                      {request.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(request.id, 'in_progress')}
                        >
                          Accept
                        </Button>
                      )}
                      {request.status === 'in_progress' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(request.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {requests?.length === 0 && (
              <TableRow>
                <TableCell colSpan={showActions ? 6 : 5} className="text-center py-8 text-muted-foreground">
                  No service requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {limit > 0 && requests && requests.length >= limit && (
        <div className="flex justify-end">
          <Button variant="ghost" onClick={() => window.location.href = '/admin/requests'}>
            View All Requests
          </Button>
        </div>
      )}
    </div>
  );
}

export default ServiceRequestsTable;
