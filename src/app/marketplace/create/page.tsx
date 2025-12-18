'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { createListing } from '@/lib/api/listings';

const categories = [
  { id: 'plastic', name: 'Plastic' },
  { id: 'metal', name: 'Metal' },
  { id: 'paper', name: 'Paper' },
  { id: 'glass', name: 'Glass' },
  { id: 'organic', name: 'Organic' },
  { id: 'ewaste', name: 'E-Waste' },
  { id: 'hazardous', name: 'Hazardous' },
  { id: 'other', name: 'Other' },
];

const conditions = [
  { id: 'new', name: 'New' },
  { id: 'used', name: 'Used' },
  { id: 'refurbished', name: 'Refurbished' },
];

const units = [
  { id: 'kg', name: 'Kilogram (kg)' },
  { id: 'g', name: 'Gram (g)' },
  { id: 'ton', name: 'Metric Ton' },
  { id: 'piece', name: 'Piece' },
  { id: 'liter', name: 'Liter' },
  { id: 'm3', name: 'Cubic Meter (m³)' },
];

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  condition: z.string().min(1, 'Please select a condition'),
  price: z.number().min(0, 'Price must be a positive number'),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Please select a unit'),
  location: z.string().min(1, 'Please enter a location'),
  isNegotiable: z.boolean().default(false),
  images: z.array(z.instanceof(File)).min(1, 'Please upload at least one image'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isNegotiable: false,
      images: [],
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
    setValue('images', [...watch('images'), ...files]);
  };

  const removeImage = (index: number) => {
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);
    
    const newImages = [...watch('images')];
    newImages.splice(index, 1);
    setValue('images', newImages);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('condition', data.condition);
      formData.append('price', data.price.toString());
      formData.append('quantity', data.quantity.toString());
      formData.append('unit', data.unit);
      formData.append('location', data.location);
      formData.append('isNegotiable', data.isNegotiable.toString());
      
      // Append each image file
      data.images.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
      
      // Call the API to create the listing
      const result = await createListing(formData);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Redirect to the new listing
      router.push(`/marketplace/${result.data.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      // Handle error (e.g., show error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create a New Listing</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., High-quality plastic waste for recycling"
                  {...register('title')}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of your waste material..."
                  rows={5}
                  {...register('description')}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    onValueChange={(value) => setValue('category', value)}
                    defaultValue={watch('category')}
                  >
                    <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    onValueChange={(value) => setValue('condition', value)}
                    defaultValue={watch('condition')}
                  >
                    <SelectTrigger className={errors.condition ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition.id} value={condition.id}>
                          {condition.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.condition && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.condition.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Pricing & Quantity */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Quantity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price">Price (KES) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('price', { valueAsNumber: true })}
                    className={errors.price ? 'border-destructive' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      placeholder="1.0"
                      {...register('quantity', { valueAsNumber: true })}
                      className={errors.quantity ? 'border-destructive' : ''}
                    />
                    <Select
                      onValueChange={(value) => setValue('unit', value)}
                      defaultValue={watch('unit')}
                    >
                      <SelectTrigger className="w-[180px]" className={errors.unit ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.quantity && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.quantity.message}
                    </p>
                  )}
                  {errors.unit && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.unit.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNegotiable"
                  onCheckedChange={(checked) => setValue('isNegotiable', Boolean(checked))}
                />
                <Label htmlFor="isNegotiable" className="font-normal">
                  Price is negotiable
                </Label>
              </div>
            </CardContent>
          </Card>
          
          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter location (e.g., Industrial Area, Nairobi)"
                  {...register('location')}
                  className={errors.location ? 'border-destructive' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>
              
              {/* Map integration can be added here */}
              <div className="mt-4 h-48 bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Map will be displayed here</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload at least one clear photo of your waste material
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden bg-muted">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {previewImages.length < 10 && (
                    <label
                      htmlFor="image-upload"
                      className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        {previewImages.length > 0 ? 'Add more' : 'Upload'}
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                
                {errors.images && (
                  <p className="text-sm text-destructive">
                    {errors.images.message}
                  </p>
                )}
                
                <div className="text-sm text-muted-foreground">
                  <p>Tips for better photos:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Use good lighting</li>
                    <li>Show the actual waste material clearly</li>
                    <li>Take photos from multiple angles</li>
                    <li>Maximum 10 images (up to 5MB each)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
