import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Clock, ShieldCheck, MessageCircle, Phone, Mail, Share2, Heart } from 'lucide-react';
import { getListingById } from '@/lib/api/listings';

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await getListingById(params.id);
  
  if (!listing) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <div className="rounded-lg overflow-hidden bg-muted">
            {listing.images?.length > 0 ? (
              <div className="relative aspect-video">
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="flex items-center justify-center aspect-video text-muted-foreground">
                No image available
              </div>
            )}
          </div>
          
          {/* Listing title and price */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{listing.title}</h1>
              <div className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat('en-KE', {
                  style: 'currency',
                  currency: 'KES',
                  minimumFractionDigits: 0,
                }).format(listing.price)}
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{listing.location}</span>
              <span className="mx-2">•</span>
              <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
              <Badge variant="secondary" className="ml-2">
                {listing.category}
              </Badge>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(listing.seller.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {listing.seller.rating?.toFixed(1) || 'No ratings'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="seller">Seller Info</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-4">
              <div className="prose max-w-none">
                <p>{listing.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-medium">
                    {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Quantity Available</p>
                  <p className="font-medium">
                    {listing.quantity} {listing.unit}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{listing.category}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Listed On</p>
                  <p className="font-medium">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="seller" className="pt-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={listing.seller.avatar} alt={listing.seller.name} />
                  <AvatarFallback>
                    {listing.seller.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-medium">{listing.seller.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Member since {new Date(listing.seller.joinedAt).getFullYear()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                      <span>{listing.seller.rating?.toFixed(1) || 'No ratings'}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {listing.seller.listingsCount || 0} listings
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-4">
              <div className="space-y-4">
                {listing.reviews?.length > 0 ? (
                  listing.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.user.avatar} alt={review.user.name} />
                            <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{review.user.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No reviews yet</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Make an Offer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price per {listing.unit}</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-KE', {
                      style: 'currency',
                      currency: 'KES',
                      minimumFractionDigits: 0,
                    }).format(listing.price)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Quantity</span>
                  <span className="font-medium">
                    {listing.quantity} {listing.unit}
                  </span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat('en-KE', {
                      style: 'currency',
                      currency: 'KES',
                      minimumFractionDigits: 0,
                    }).format(listing.price * listing.quantity)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full">Make an Offer</Button>
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Save to Watchlist
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Response within 24h</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Share this listing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <span className="sr-only">WhatsApp</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.5 2.5C15.5 0.5 12.8 0 10.2 0 4.6 0 0 4.6 0 10.2c0 1.7.4 3.3 1.2 4.8L0 24l9.2-2.4c1.4.7 2.9 1.1 4.5 1.1 5.6 0 10.2-4.6 10.2-10.2 0-2.7-.6-5.3-2.4-7.2zM13.7 18c-1.2.3-2.4.5-3.7.5-1.3 0-2.5-.2-3.6-.6l-.3-.2-2.8.8.8-2.7-.2-.3c-1-1.7-1.5-3.6-1.5-5.6 0-4.9 4-8.9 8.9-8.9 2.4 0 4.6.9 6.3 2.5 1.7 1.7 2.6 3.9 2.6 6.3.1 4.9-3.9 8.9-8.8 8.9z" />
                    <path d="M17.2 14.1c-.3-.2-1.7-.8-2-1-.3-.1-.5-.1-.7.1-.2.2-.8.9-1 1.1-.2.2-.4.3-.7.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.1-.3.2-.5 0-.2 0-.4-.1-.5-.1-.1-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.6-.2 0-.5 0-.7.1-.3.1-.6.3-.9.5-.3.2-1.2 1.1-1.2 2.6 0 1.5 1.1 3 1.3 3.2.1.2 2.3 3.5 5.5 4.9.8.4 1.4.6 1.9.8.8.2 1.5.2 2.1.1.7-.1 2.1-.8 2.4-1.6.3-.8.3-1.4.2-1.6-.1-.2-.3-.3-.6-.5z" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
