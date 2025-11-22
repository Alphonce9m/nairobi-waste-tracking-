import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { 
  Search, 
  Plus, 
  Filter, 
  Package, 
  MapPin, 
  Calendar, 
  Clock,
  TrendingUp,
  DollarSign,
  Scale
} from "lucide-react";
import { wasteListingService, transactionService } from "@/services/marketplaceService";
import { WasteListing, Transaction } from "@/types/marketplace";

const Marketplace = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [filtered, setFiltered] = useState<WasteListing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState({
    wasteType: '',
    minPrice: '',
    maxPrice: '',
  });

  const [newListing, setNewListing] = useState({
    wasteType: '',
    quantity: '',
    pricePerKg: '',
    availableFrom: '',
    availableUntil: '',
    location: '',
    description: '',
  });

  // Fetch listings
  useEffect(() => {
    fetchListings();
    if (user) {
      fetchTransactions();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applyFilters();
  }, [listings, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchListings = async () => {
    try {
      const data = await wasteListingService.getListings();
      setListings(data);
      setLoading(false);
    } catch (error: unknown) {
      // Fallback to mock data if Supabase fails
      console.log('Supabase failed, using mock data:', error);
      const mockListings: WasteListing[] = [
        {
          id: '1',
          sellerId: 'seller-1',
          wasteType: 'plastic',
          quantity: 100,
          pricePerKg: 25,
          location: 'Kilimani, Nairobi',
          description: 'Clean plastic bottles and containers',
          status: 'available',
          availableFrom: new Date().toISOString(),
          availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          sellerId: 'seller-2',
          wasteType: 'organic',
          quantity: 50,
          pricePerKg: 15,
          location: 'Westlands, Nairobi',
          description: 'Food waste and organic materials',
          status: 'available',
          availableFrom: new Date().toISOString(),
          availableUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          sellerId: 'seller-3',
          wasteType: 'electronic',
          quantity: 20,
          pricePerKg: 50,
          location: 'CBD, Nairobi',
          description: 'Electronic waste - computers and phones',
          status: 'available',
          availableFrom: new Date().toISOString(),
          availableUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setListings(mockListings);
      setLoading(false);
      
      const errorData = error as { message: string };
      toast({
        title: "Using Demo Data",
        description: "Unable to connect to database. Showing sample listings.",
        variant: "default",
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getTransactionsByBuyer(user?.id || '');
      setTransactions(data);
    } catch (error: unknown) {
      console.log('Failed to fetch transactions, using mock data:', error);
      // Fallback to mock transactions
      const mockTransactions: Transaction[] = [
        {
          id: 'tx-1',
          listingId: '1',
          buyerId: user?.id || 'buyer-1',
          sellerId: 'seller-1',
          quantity: 50,
          totalPrice: 1250,
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setTransactions(mockTransactions);
    }
  };

  const applyFilters = () => {
    let filtered = listings;

    if (filters.wasteType) {
      filtered = filtered.filter(l => l.wasteType === filters.wasteType);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(l => l.pricePerKg >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(l => l.pricePerKg <= parseFloat(filters.maxPrice));
    }

    setFiltered(filtered);
  };

  const handleCreateListing = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create listings",
        variant: "destructive",
      });
      return;
    }

    try {
      const listing = {
        sellerId: user.id, // Fixed: use sellerId instead of groupId
        wasteType: newListing.wasteType as 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'mixed',
        quantity: parseFloat(newListing.quantity),
        pricePerKg: parseFloat(newListing.pricePerKg),
        availableFrom: newListing.availableFrom,
        availableUntil: newListing.availableUntil,
        location: newListing.location,
        description: newListing.description,
        status: 'available' as const,
      };

      await wasteListingService.createListing(listing);
      setIsCreateOpen(false);
      setNewListing({
        wasteType: '',
        quantity: '',
        pricePerKg: '',
        availableFrom: '',
        availableUntil: '',
        location: '',
        description: '',
      });

      toast({
        title: "Listing Created!",
        description: "Your waste listing is now available",
      });
    } catch (error: unknown) {
      const errorData = error as { message: string };
      // If Supabase fails, create a mock listing locally
      const mockListing: WasteListing = {
        id: `mock-${Date.now()}`,
        sellerId: user.id,
        wasteType: newListing.wasteType as 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'mixed',
        quantity: parseFloat(newListing.quantity),
        pricePerKg: parseFloat(newListing.pricePerKg),
        location: newListing.location,
        description: newListing.description,
        status: 'available',
        availableFrom: newListing.availableFrom,
        availableUntil: newListing.availableUntil,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setListings(prev => [mockListing, ...prev]);
      setIsCreateOpen(false);
      setNewListing({
        wasteType: '',
        quantity: '',
        pricePerKg: '',
        availableFrom: '',
        availableUntil: '',
        location: '',
        description: '',
      });

      toast({
        title: "Listing Created (Demo Mode)",
        description: "Your listing was created locally. Database connection unavailable.",
        variant: "default",
      });
    }
  };

  const handleReserveListing = async (listing: WasteListing) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to reserve listings",
        variant: "destructive",
      });
      return;
    }

    try {
      const transaction = {
        listingId: listing.id,
        buyerId: user.id,
        sellerId: listing.sellerId, // Fixed: use sellerId instead of groupId
        quantity: listing.quantity,
        totalPrice: listing.quantity * listing.pricePerKg, // Fixed: use totalPrice
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await transactionService.createTransaction(transaction);
      
      // Update listing status
      await wasteListingService.updateListing(listing.id, { status: 'reserved' });
      
      fetchListings();
      fetchTransactions();

      toast({
        title: "Listing Reserved!",
        description: "Contact the seller to complete the transaction",
      });
    } catch (error: unknown) {
      const errorData = error as { message: string };
      // If Supabase fails, create a mock transaction locally
      const mockTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        listingId: listing.id,
        buyerId: user.id,
        sellerId: listing.sellerId,
        quantity: listing.quantity,
        totalPrice: listing.quantity * listing.pricePerKg,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setTransactions(prev => [mockTransaction, ...prev]);
      
      // Update listing status locally
      setListings(prev => prev.map(l => 
        l.id === listing.id ? { ...l, status: 'reserved' } : l
      ));

      toast({
        title: "Listing Reserved (Demo Mode)",
        description: "Transaction created locally. Database connection unavailable.",
        variant: "default",
      });
    }
  };

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic' },
    { value: 'organic', label: 'Organic' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'hazardous', label: 'Hazardous' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const getWasteTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      plastic: 'bg-blue-100 text-blue-800',
      organic: 'bg-emerald-100 text-emerald-800',
      electronic: 'bg-purple-100 text-purple-800',
      hazardous: 'bg-red-100 text-red-800',
      mixed: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground mb-2">Waste Marketplace</h1>
        <p className="text-muted-foreground text-lg">
          Buy and sell recyclable materials in Nairobi
        </p>
      </header>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="create">Create Listing</TabsTrigger>
          <TabsTrigger value="transactions">My Transactions</TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label>Waste Type</Label>
                <Select value={filters.wasteType} onValueChange={(value) => setFilters({...filters, wasteType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    {wasteTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Min Price (KES/kg)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>
              <div>
                <Label>Max Price (KES/kg)</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={() => setFilters({ wasteType: '', minPrice: '', maxPrice: '' })}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center py-8">Loading listings...</div>
          ) : filtered.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or create a new listing</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getWasteTypeColor(listing.wasteType)}>
                        {wasteTypes.find(t => t.value === listing.wasteType)?.label}
                      </Badge>
                      <Badge variant="outline">{listing.status}</Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">
                      {listing.quantity} kg available
                    </h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>KES {listing.pricePerKg} per kg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Available until {new Date(listing.availableUntil).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {listing.description && (
                      <p className="text-sm text-muted-foreground mb-4">{listing.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-lg font-bold text-primary">
                        KES {listing.quantity * listing.pricePerKg}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleReserveListing(listing)}
                        disabled={listing.status !== 'available'}
                      >
                        {listing.status === 'available' ? 'Reserve' : listing.status}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Create Listing Tab */}
        <TabsContent value="create">
          <Card className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Create New Listing</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Waste Type *</Label>
                <Select value={newListing.wasteType} onValueChange={(value) => setNewListing({...newListing, wasteType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Quantity (kg) *</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={newListing.quantity}
                    onChange={(e) => setNewListing({...newListing, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Price per kg (KES) *</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={newListing.pricePerKg}
                    onChange={(e) => setNewListing({...newListing, pricePerKg: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Available From *</Label>
                  <Input
                    type="date"
                    value={newListing.availableFrom}
                    onChange={(e) => setNewListing({...newListing, availableFrom: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Available Until *</Label>
                  <Input
                    type="date"
                    value={newListing.availableUntil}
                    onChange={(e) => setNewListing({...newListing, availableUntil: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Location *</Label>
                <Input
                  placeholder="e.g., Kibera, Nairobi"
                  value={newListing.location}
                  onChange={(e) => setNewListing({...newListing, location: e.target.value})}
                />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  className="w-full p-3 border rounded-md"
                  rows={3}
                  placeholder="Additional details about the waste material..."
                  value={newListing.description}
                  onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                />
              </div>

              <Button 
                onClick={handleCreateListing}
                className="w-full"
                disabled={!user || !newListing.wasteType || !newListing.quantity || !newListing.pricePerKg || !newListing.location}
              >
                {!user ? 'Sign in to Create Listing' : 'Create Listing'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">My Transactions</h2>
            </div>

            {!user ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Sign in to view your transactions</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">Transaction #{transaction.id.slice(0, 8)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">KES {transaction.totalPrice}</div>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;
