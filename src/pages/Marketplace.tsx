import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter
} from "@/components/ui/dialog";
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
  ShoppingCart,
  User as UserIcon,
  Star,
  DollarSign,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";

// Marketplace Types
type WasteType = 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'mixed' | 'paper' | 'metal' | 'glass' | 'textile' | 'other';
type ListingStatus = 'available' | 'reserved' | 'sold' | 'expired';
type Condition = 'new' | 'used' | 'processed';

interface User {
  id: string;
  name: string;
  rating: number;
  totalSales: number;
  joinDate: string;
}

interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface EnhancedWasteListing {
  id: string;
  seller: User;
  title: string;
  wasteType: WasteType;
  quantity: number;
  pricePerKg: number;
  availableFrom: string;
  availableUntil: string;
  status: ListingStatus;
  location: string;
  description: string;
  images: string[];
  condition: Condition;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  totalSales?: number;
  deliveryOptions: string[];
  paymentMethods: string[];
}

const Marketplace = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [listings, setListings] = useState<EnhancedWasteListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<EnhancedWasteListing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Enhanced filters
  const [filters, setFilters] = useState({
    wasteType: 'all' as 'all' | WasteType,
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'newest' as 'newest' | 'price-asc' | 'price-desc' | 'rating',
    condition: 'all' as 'all' | Condition,
    searchQuery: ''
  });

  // Current user data
  const currentUser: User = {
    id: user?.id || 'user-123',
    name: user?.email?.split('@')[0] || 'User',
    rating: 4.8,
    totalSales: 0,
    joinDate: new Date().toISOString().split('T')[0]
  };

  // New listing state
  const [newListing, setNewListing] = useState<Omit<EnhancedWasteListing, 'id' | 'seller' | 'createdAt' | 'updatedAt' | 'status'>>({
    title: 'Waste Material',
    wasteType: 'plastic',
    quantity: 1,
    pricePerKg: 0,
    availableFrom: new Date().toISOString().split('T')[0],
    availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: 'Nairobi, Kenya',
    description: 'High-quality waste material for recycling',
    images: [],
    condition: 'used',
    deliveryOptions: ['pickup'],
    paymentMethods: ['mpesa', 'cash'],
    rating: 0,
    totalSales: 0
  });

  // Enhanced filtering and sorting
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const applyFilters = useCallback(() => {
    let result = [...listings];

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
      );
    }

    // Apply waste type filter
    if (filters.wasteType !== 'all') {
      result = result.filter(item => item.wasteType === filters.wasteType);
    }

    // Apply price filters
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      result = result.filter(item => item.pricePerKg >= min);
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      result = result.filter(item => item.pricePerKg <= max);
    }

    // Apply location filter
    if (filters.location) {
      result = result.filter(item => 
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply condition filter
    if (filters.condition !== 'all') {
      result = result.filter(item => item.condition === filters.condition);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.pricePerKg - b.pricePerKg;
        case 'price-desc':
          return b.pricePerKg - a.pricePerKg;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredListings(result);
  }, [filters, listings]);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      const mockListings: EnhancedWasteListing[] = [
        {
          id: '1',
          title: 'Plastic Waste',
          wasteType: 'plastic',
          quantity: 100,
          pricePerKg: 50,
          availableFrom: new Date().toISOString(),
          availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'available',
          location: 'Nairobi, Westlands',
          description: 'Clean plastic waste ready for recycling',
          images: [],
          condition: 'used',
          seller: currentUser,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rating: 4.5,
          totalSales: 24,
          deliveryOptions: ['pickup', 'delivery'],
          paymentMethods: ['mpesa', 'cash', 'card']
        },
        {
          id: '2',
          title: 'Organic Waste',
          wasteType: 'organic',
          quantity: 200,
          pricePerKg: 30,
          availableFrom: new Date().toISOString(),
          availableUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'available',
          location: 'Nairobi, Kilimani',
          description: 'Organic waste for composting',
          images: [],
          condition: 'new',
          seller: currentUser,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rating: 4.2,
          totalSales: 15,
          deliveryOptions: ['pickup'],
          paymentMethods: ['mpesa', 'cash']
        },
        {
          id: '3',
          title: 'Electronic Waste',
          wasteType: 'electronic',
          quantity: 50,
          pricePerKg: 120,
          availableFrom: new Date().toISOString(),
          availableUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'available',
          location: 'Nairobi, Industrial Area',
          description: 'Old electronics for recycling',
          images: [],
          condition: 'used',
          seller: currentUser,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rating: 4.8,
          totalSales: 32,
          deliveryOptions: ['pickup', 'delivery'],
          paymentMethods: ['mpesa', 'card']
        }
      ];
      
      setListings(mockListings);
      setFilteredListings(mockListings);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load marketplace data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast, currentUser]);

  // Load data on component mount
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Apply filters when listings or filters change
  useEffect(() => {
    applyFilters();
  }, [listings, filters, applyFilters]);

  // Handle creating a new listing
  const handleCreateListing = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      const newListingData: EnhancedWasteListing = {
        ...newListing,
        id: Math.random().toString(36).substr(2, 9),
        seller: currentUser,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedListings = [newListingData, ...listings];
      setListings(updatedListings);
      
      // Reset form
      setNewListing({
        title: 'Waste Material',
        wasteType: 'plastic',
        quantity: 1,
        pricePerKg: 0,
        availableFrom: new Date().toISOString().split('T')[0],
        availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Nairobi, Kenya',
        description: 'High-quality waste material for recycling',
        images: [],
        condition: 'used',
        deliveryOptions: ['pickup'],
        paymentMethods: ['mpesa', 'cash'],
        rating: 0,
        totalSales: 0,
      });

      // Switch to buy tab after creating a listing
      setActiveTab('buy');

      toast({
        title: 'Listing created',
        description: 'Your waste listing has been published.',
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to create listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Waste Marketplace</h1>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setActiveTab('sell')}>
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Create Listing
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Waste
          </TabsTrigger>
          <TabsTrigger value="sell">
            <DollarSign className="mr-2 h-4 w-4" />
            Sell Waste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="mt-6">
          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search listings..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="wasteType">Waste Type</Label>
                <Select
                  value={filters.wasteType}
                  onValueChange={(value) => handleFilterChange({ wasteType: value as WasteType | 'all' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="hazardous">Hazardous</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange({ sortBy: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price Range</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 relative">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">
                        {listing.wasteType.charAt(0).toUpperCase() + listing.wasteType.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <div className="text-lg font-bold">
                        KES {listing.pricePerKg.toLocaleString()}/kg
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location}
                    </div>
                    {listing.rating && (
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(listing.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          ({listing.totalSales || 0} sold)
                        </span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center">
                        <Package className="h-3 w-3 mr-1" />
                        {listing.quantity} kg available
                      </Badge>
                      <Badge variant="outline">
                        {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sell" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Listing</CardTitle>
              <p className="text-sm text-gray-500">
                List your waste materials for recycling or reuse
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Clean Plastic Bottles"
                      value={newListing.title}
                      onChange={(e) =>
                        setNewListing({ ...newListing, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="wasteType">Waste Type *</Label>
                    <Select
                      value={newListing.wasteType}
                      onValueChange={(value) =>
                        setNewListing({ ...newListing, wasteType: value as WasteType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select waste type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plastic">Plastic</SelectItem>
                        <SelectItem value="organic">Organic</SelectItem>
                        <SelectItem value="electronic">Electronic</SelectItem>
                        <SelectItem value="hazardous">Hazardous</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                        <SelectItem value="paper">Paper</SelectItem>
                        <SelectItem value="metal">Metal</SelectItem>
                        <SelectItem value="glass">Glass</SelectItem>
                        <SelectItem value="textile">Textile</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity (kg) *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newListing.quantity}
                      onChange={(e) =>
                        setNewListing({ ...newListing, quantity: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price per kg (KES) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={newListing.pricePerKg}
                      onChange={(e) =>
                        setNewListing({ ...newListing, pricePerKg: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={newListing.condition}
                      onValueChange={(value) =>
                        setNewListing({ ...newListing, condition: value as Condition })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="processed">Processed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Nairobi, Westlands"
                    value={newListing.location}
                    onChange={(e) =>
                      setNewListing({ ...newListing, location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your waste material in detail..."
                    value={newListing.description}
                    onChange={(e) =>
                      setNewListing({ ...newListing, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Delivery Options</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['pickup', 'delivery', 'both'].map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={
                          newListing.deliveryOptions.includes(option)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => {
                          const options = new Set(newListing.deliveryOptions);
                          if (options.has(option)) {
                            options.delete(option);
                          } else {
                            options.add(option);
                          }
                          setNewListing({
                            ...newListing,
                            deliveryOptions: Array.from(options),
                          });
                        }}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Payment Methods</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['mpesa', 'cash', 'card', 'bank'].map((method) => (
                      <Button
                        key={method}
                        type="button"
                        variant={
                          newListing.paymentMethods.includes(method)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => {
                          const methods = new Set(newListing.paymentMethods);
                          if (methods.has(method)) {
                            methods.delete(method);
                          } else {
                            methods.add(method);
                          }
                          setNewListing({
                            ...newListing,
                            paymentMethods: Array.from(methods),
                          });
                        }}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setNewListing({
                    title: 'Waste Material',
                    wasteType: 'plastic',
                    quantity: 1,
                    pricePerKg: 0,
                    availableFrom: new Date().toISOString().split('T')[0],
                    availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split('T')[0],
                    location: 'Nairobi, Kenya',
                    description: 'High-quality waste material for recycling',
                    images: [],
                    condition: 'used',
                    deliveryOptions: ['pickup'],
                    paymentMethods: ['mpesa', 'cash'],
                    rating: 0,
                    totalSales: 0,
                  });
                }}
              >
                Reset
              </Button>
              <Button
                onClick={handleCreateListing}
                disabled={
                  !newListing.title ||
                  !newListing.description ||
                  newListing.quantity <= 0 ||
                  newListing.pricePerKg < 0 ||
                  !newListing.location
                }
              >
                {loading ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;
