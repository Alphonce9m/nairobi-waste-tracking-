'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';

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

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update price range
    params.set('minPrice', priceRange[0].toString());
    params.set('maxPrice', priceRange[1].toString());
    
    // Update categories
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    } else {
      params.delete('categories');
    }
    
    // Update conditions
    if (selectedConditions.length > 0) {
      params.set('conditions', selectedConditions.join(','));
    } else {
      params.delete('conditions');
    }
    
    // Reset pagination
    params.delete('page');
    
    // Update URL
    router.push(`/marketplace?${params.toString()}`);
    setOpen(false);
  };

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedCategories([]);
    setSelectedConditions([]);
    router.push('/marketplace');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-muted-foreground"
              onClick={clearFilters}
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="price-range" className="mb-2 block">
                Price range
              </Label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="h-9"
                  />
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="h-9"
                  />
                </div>
              </div>
              <Slider
                id="price-range"
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                min={0}
                max={10000}
                step={100}
                className="mt-4"
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Categories</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((id) => id !== category.id)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`category-${category.id}`} className="text-sm">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Condition</Label>
              <div className="space-y-2">
                {conditions.map((condition) => (
                  <div key={condition.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={selectedConditions.includes(condition.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedConditions([...selectedConditions, condition.id]);
                        } else {
                          setSelectedConditions(
                            selectedConditions.filter((id) => id !== condition.id)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`condition-${condition.id}`} className="text-sm">
                      {condition.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                className="w-full" 
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
