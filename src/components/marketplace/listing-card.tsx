import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  createdAt: string;
  condition: 'new' | 'used' | 'refurbished';
  quantity: number;
  unit: string;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
};

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/marketplace/${listing.id}`}>
        <div className="relative aspect-video bg-muted">
          {listing.images?.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-background text-foreground">
            {listing.condition}
          </Badge>
        </div>
      </Link>
      
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/marketplace/${listing.id}`} className="hover:underline">
            <h3 className="font-semibold line-clamp-2">{listing.title}</h3>
          </Link>
          <p className="font-bold text-lg whitespace-nowrap">
            {formatCurrency(listing.price)}
          </p>
        </div>
        
        <div className="mt-1 flex items-center text-sm text-muted-foreground">
          <span>{listing.location}</span>
          <span className="mx-2">•</span>
          <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
        </div>
        
        <Badge variant="secondary" className="mt-2 w-fit">
          {listing.category}
        </Badge>
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {listing.description}
        </p>
      </CardHeader>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <span className="font-medium">{listing.quantity} {listing.unit}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-muted-foreground">{listing.seller.name}</span>
        </div>
        
        <Button size="sm" asChild>
          <Link href={`/marketplace/${listing.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
