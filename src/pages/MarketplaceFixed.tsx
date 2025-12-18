import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Filter, MapPin, Clock, Star, Phone, MessageCircle,
  TrendingUp, Package, DollarSign, Calendar, User, Heart,
  Grid3X3, List, RefreshCw, Loader2
} from 'lucide-react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { WasteListing, WasteType } from '@/types/marketplace';
import { listingService } from '@/services/marketplaceService';

interface Filters {
  wasteType: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  sortBy: string;
}

const MarketplaceFixed: React.FC = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<WasteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState<Filters>({
    wasteType: 'all',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'newest'
  });

  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    wasteType: '' as WasteType,
    quantity: 0,
    pricePerUnit: 0,
    location: '',
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const data = await listingService.getListings({
          status: 'available'
        });

        setListings(data || []);
        
        toast({
          title: "Marketplace Loaded",
          description: `Found ${data?.length || 0} listings`,
        });
      } catch (error) {
        console.error('Error loading listings:', error);
        toast({
          title: "Error",
          description: "Failed to load marketplace listings",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [toast]);

  useEffect(() => {
    const filtered = listings.filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filters.wasteType === 'all' || listing.wasteType === filters.wasteType;
      const matchesLocation = !filters.location || listing.location.address.toLowerCase().includes(filters.location.toLowerCase());
      const matchesPrice = (!filters.minPrice || listing.pricePerUnit >= parseFloat(filters.minPrice)) &&
                          (!filters.maxPrice || listing.pricePerUnit <= parseFloat(filters.maxPrice));
      
      return matchesSearch && matchesType && matchesLocation && matchesPrice;
    });

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'price_low':
          return a.pricePerUnit - b.pricePerUnit;
        case 'price_high':
          return b.pricePerUnit - a.pricePerUnit;
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  }, [listings, filters, searchQuery]);

  const toggleFavorite = useCallback((listingId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
      } else {
        newFavorites.add(listingId);
      }
      return newFavorites;
    });
  }, []);

  const handleCreateListing = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a listing",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const listingData = {
        ...newListing,
        sellerId: user.id,
        wasteGrade: 'A' as const,
        unit: 'kg' as const,
        totalPrice: newListing.quantity * newListing.pricePerUnit,
        location: {
          address: newListing.location,
          latitude: -1.2921, // Nairobi coordinates
          longitude: 36.8219
        },
        images: [],
        status: 'available' as const,
        isNegotiable: false,
        viewCount: 0,
        saveCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await listingService.createListing(listingData);
      if (result.error) throw result.error;

      toast({
        title: "Listing created!",
        description: "Your waste listing has been posted successfully",
      });

      setNewListing({
        title: '',
        description: '',
        wasteType: '' as WasteType,
        quantity: 0,
        pricePerUnit: 0,
        location: '',
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      const data = await listingService.getListings({ status: 'available' });
      setListings(data || []);

    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: "Failed to create listing",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getWasteTypeColor = (type: WasteType) => {
    const colors = {
      plastic: 'bg-blue-100 text-blue-800 border-blue-200',
      organic: 'bg-green-100 text-green-800 border-green-200',
      electronic: 'bg-purple-100 text-purple-800 border-purple-200',
      hazardous: 'bg-red-100 text-red-800 border-red-200',
      mixed: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const ListingCard = ({ listing }: { listing: WasteListing }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">{listing.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{listing.description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(listing.id);
            }}
            className="ml-2"
          >
            <Heart className={`h-4 w-4 ${favorites.has(listing.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge className={getWasteTypeColor(listing.wasteType)}>
            {listing.wasteType}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {listing.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{listing.quantity} kg</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">KES {listing.pricePerUnit}/kg</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{listing.location.address}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(listing.availableUntil).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Seller info would need to be fetched separately */}
        {/* {false && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{listing.seller.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {listing.seller.rating || 'New'} ({listing.seller.totalSales || 0} sales)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </CardContent>

      <div className="px-6 pb-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-1" />
            Contact
          </Button>
          <Button size="sm" className="flex-1">
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Nairobi Waste Marketplace</h1>
            <p className="text-muted-foreground">Connect with waste collectors and recyclers in your area</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Listing</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newListing.title}
                      onChange={(e) => setNewListing(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Plastic Bottles for Recycling"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Waste Type</label>
                    <Select
                      value={newListing.wasteType}
                      onValueChange={(value: WasteType) => 
                        setNewListing(prev => ({ ...prev, wasteType: value }))
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newListing.description}
                    onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your waste materials, condition, and any special requirements"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity (kg)</label>
                    <Input
                      type="number"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price per kg</label>
                    <Input
                      type="number"
                      value={newListing.pricePerUnit}
                      onChange={(e) => setNewListing(prev => ({ ...prev, pricePerUnit: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={newListing.location}
                      onChange={(e) => setNewListing(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Nairobi area"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleCreateListing} disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Listing
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filters.wasteType} onValueChange={(value) => setFilters(prev => ({ ...prev, wasteType: value }))}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Waste Type" />
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
            
            <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1 border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredListings.length} listings found
          </p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          }`}>
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceFixed;
