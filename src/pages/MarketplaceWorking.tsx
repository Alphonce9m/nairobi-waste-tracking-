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

// Mock types to avoid import issues
interface WasteListing {
  id: string;
  sellerId: string;
  wasteType: 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'mixed';
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

interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const MarketplaceWorking = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [filtered, setFiltered] = useState<WasteListing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState({
    wasteType: 'all',
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

  // Mock data initialization
  useEffect(() => {
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
        quantity: 25,
        pricePerKg: 50,
        location: 'Industrial Area, Nairobi',
        description: 'Electronic waste and components',
        status: 'available',
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    setListings(mockListings);
    setFiltered(mockListings);
    setLoading(false);
    
    toast({
      title: "Marketplace Loaded",
      description: "Showing demo listings",
    });
  }, [toast]);

  useEffect(() => {
    let filteredListings = listings;
    
    if (filters.wasteType && filters.wasteType !== 'all') {
      filteredListings = filteredListings.filter(listing => listing.wasteType === filters.wasteType);
    }
    
    if (filters.minPrice) {
      filteredListings = filteredListings.filter(listing => listing.pricePerKg >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filteredListings = filteredListings.filter(listing => listing.pricePerKg <= parseFloat(filters.maxPrice));
    }
    
    setFiltered(filteredListings);
  }, [listings, filters]);

  const handleCreateListing = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a listing",
        variant: "destructive",
      });
      return;
    }

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
      title: "Listing Created!",
      description: "Your waste listing is now available",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case 'plastic': return 'bg-blue-100 text-blue-800';
      case 'organic': return 'bg-green-100 text-green-800';
      case 'electronic': return 'bg-purple-100 text-purple-800';
      case 'hazardous': return 'bg-red-100 text-red-800';
      case 'mixed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8">
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
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="hazardous">Hazardous</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
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
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ wasteType: 'all', minPrice: '', maxPrice: '' })}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>

          {/* Listings */}
          {loading ? (
            <div className="text-center py-8">
              <p>Loading listings...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No listings found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <Card key={listing.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className={getWasteTypeColor(listing.wasteType)}>
                      {listing.wasteType}
                    </Badge>
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{listing.wasteType} Waste</h3>
                  <p className="text-muted-foreground text-sm mb-4">{listing.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      <span>{listing.quantity} kg available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">KES {listing.pricePerKg}/kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">
                        KES {listing.quantity * listing.pricePerKg}
                      </span>
                      <Button size="sm">
                        Contact Seller
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
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Create New Listing</h2>
            </div>

            {!user ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Sign in to create a listing</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Waste Type</Label>
                  <Select value={newListing.wasteType} onValueChange={(value) => setNewListing({...newListing, wasteType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plastic">Plastic</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="hazardous">Hazardous</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Quantity (kg)</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={newListing.quantity}
                    onChange={(e) => setNewListing({...newListing, quantity: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Price per kg (KES)</Label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={newListing.pricePerKg}
                    onChange={(e) => setNewListing({...newListing, pricePerKg: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Location</Label>
                  <Input
                    placeholder="Nairobi, Kenya"
                    value={newListing.location}
                    onChange={(e) => setNewListing({...newListing, location: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Available From</Label>
                  <Input
                    type="date"
                    value={newListing.availableFrom}
                    onChange={(e) => setNewListing({...newListing, availableFrom: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Available Until</Label>
                  <Input
                    type="date"
                    value={newListing.availableUntil}
                    onChange={(e) => setNewListing({...newListing, availableUntil: e.target.value})}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <textarea
                    className="w-full p-3 border rounded-md"
                    rows={3}
                    placeholder="Describe your waste materials..."
                    value={newListing.description}
                    onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Button onClick={handleCreateListing} className="w-full">
                    Create Listing
                  </Button>
                </div>
              </div>
            )}
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
                        <p className="font-semibold">KES {transaction.totalPrice}</p>
                        <Badge className={getStatusColor(transaction.status)}>
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

export default MarketplaceWorking;
