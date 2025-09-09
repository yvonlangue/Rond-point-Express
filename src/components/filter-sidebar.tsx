
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Calendar as CalendarIcon, MapPin, Accessibility } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { artTypes } from '@/lib/types';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const accessibilityOptions = [
  'Wheelchair Access',
  'Hearing Loop',
  'Sign Language',
  'Audio Description',
];

interface FiltersPayload {
  dateFrom?: Date;
  dateTo?: Date;
  artTypes?: string[];
  location?: string;
  accessibility?: string[];
}

interface FilterSidebarProps {
  onFiltersChange?: (filters: FiltersPayload) => void;
}

export function FilterSidebar({ onFiltersChange }: FilterSidebarProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [selectedArtTypes, setSelectedArtTypes] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>([]);

  const handleArtTypeChange = (artType: string, checked: boolean) => {
    if (checked) {
      setSelectedArtTypes(prev => [...prev, artType]);
    } else {
      setSelectedArtTypes(prev => prev.filter(type => type !== artType));
    }
  };

  const handleAccessibilityChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedAccessibility(prev => [...prev, option]);
    } else {
      setSelectedAccessibility(prev => prev.filter(opt => opt !== option));
    }
  };

  const clearAllFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedArtTypes([]);
    setLocation('');
    setSelectedAccessibility([]);
    // Notify parent component
    onFiltersChange?.({
      dateFrom: undefined,
      dateTo: undefined,
      artTypes: [],
      location: '',
      accessibility: []
    });
  };

  // Notify parent when filters change
  useEffect(() => {
    const filters = {
      dateFrom,
      dateTo,
      artTypes: selectedArtTypes,
      location,
      accessibility: selectedAccessibility
    };
    onFiltersChange?.(filters);
  }, [dateFrom, dateTo, selectedArtTypes, location, selectedAccessibility, onFiltersChange]);

  return (
    <aside className="w-full md:w-1/4 lg:w-1/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Filters</h3>
        <Button variant="link" className="p-0 h-auto" onClick={clearAllFilters}>Clear All</Button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Date Range</h4>
          <div className="flex gap-2">
             <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={'outline'} 
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "dd/mm/yyyy"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
             <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={'outline'} 
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "dd/mm/yyyy"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Art Type</h4>
          <div className="space-y-2">
            {artTypes.slice(0, 8).map(category => (
              <div key={category} className="flex items-center">
                <Checkbox 
                  id={category} 
                  checked={selectedArtTypes.includes(category)}
                  onCheckedChange={(checked) => handleArtTypeChange(category, checked as boolean)}
                />
                <label htmlFor={category} className="ml-2 text-sm">{category}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</h4>
          <Input 
            placeholder="Enter city or venue" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><Accessibility className="w-4 h-4" /> Accessibility</h4>
          <div className="space-y-2">
            {accessibilityOptions.map(option => (
              <div key={option} className="flex items-center">
                <Checkbox 
                  id={option} 
                  checked={selectedAccessibility.includes(option)}
                  onCheckedChange={(checked) => handleAccessibilityChange(option, checked as boolean)}
                />
                <label htmlFor={option} className="ml-2 text-sm">{option}</label>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
