
'use client';

import { Button } from './ui/button';
import { Calendar as CalendarIcon, MapPin, Accessibility } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { artTypes } from '@/lib/types';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const accessibilityOptions = [
  'Wheelchair Access',
  'Hearing Loop',
  'Sign Language',
  'Audio Description',
];

export function FilterSidebar() {

  return (
    <aside className="w-full md:w-1/4 lg:w-1/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Filters</h3>
        <Button variant="link" className="p-0 h-auto">Clear All</Button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Date Range</h4>
          <div className="flex gap-2">
             <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className="w-full justify-start text-left font-normal">
                  dd/mm/yyyy
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" initialFocus />
              </PopoverContent>
            </Popover>
             <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className="w-full justify-start text-left font-normal">
                  dd/mm/yyyy
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Art Type</h4>
          <div className="space-y-2">
            {artTypes.slice(0, 8).map(category => (
              <div key={category} className="flex items-center">
                <Checkbox id={category} />
                <label htmlFor={category} className="ml-2 text-sm">{category}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</h4>
          <Input placeholder="Enter city or venue" />
        </div>
        
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><Accessibility className="w-4 h-4" /> Accessibility</h4>
          <div className="space-y-2">
            {accessibilityOptions.map(option => (
              <div key={option} className="flex items-center">
                <Checkbox id={option} />
                <label htmlFor={option} className="ml-2 text-sm">{option}</label>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
