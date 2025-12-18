import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin } from 'lucide-react';
import { ListingCard } from '@/components/marketplace/listing-card';
import { SearchFilters } from '@/components/marketplace/search-filters';
import { getListings } from '@/lib/api/listings';

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { data: listings, error } = await getListings({
    page: 1,
    limit: 12,
    ...(searchParams?.category && { category: String(searchParams.category) }),
    ...(searchParams?.location && { location: String(searchParams.location) }),
    ...(searchParams?.minPrice && { minPrice: Number(searchParams.minPrice) }),
    ...(searchParams?.maxPrice && { maxPrice: Number(searchParams.maxPrice) }),
  });

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Nairobi Waste Marketplace</h1>
        <p className="text-muted-foreground">Buy and sell waste materials in Nairobi</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for waste materials..."
              className="pl-10"
              defaultValue={searchParams?.q as string}
            />
          </div>
          <Button>Search</Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Nairobi, Kenya</span>
          </div>
          
          <div className="flex items-center gap-2">
            <SearchFilters />
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Listings</TabsTrigger>
          <TabsTrigger value="plastic">Plastic</TabsTrigger>
          <TabsTrigger value="metal">Metal</TabsTrigger>
          <TabsTrigger value="paper">Paper</TabsTrigger>
          <TabsTrigger value="glass">Glass</TabsTrigger>
          <TabsTrigger value="organic">Organic</TabsTrigger>
          <TabsTrigger value="ewaste">E-Waste</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load listings. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Button variant="outline" className="w-full sm:w-auto">
          Load More
        </Button>
      </div>
    </div>
  );
}
