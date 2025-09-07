
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { artTypes, eventCategories } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { eventsApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ImageUpload } from '@/components/image-upload';
import { uploadMultipleImagesToSupabase } from '@/lib/image-upload';

const eventFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  date: z.date({ required_error: 'A date for the event is required.' }),
  time: z.string().min(1, { message: 'Time is required.' }),
  artType: z.enum(artTypes, { required_error: 'Please select an art type.' }),
  category: z.enum(eventCategories, { required_error: 'Please select a category.' }),
  organizer: z.string().min(2, { message: 'Organizer name is required.' }),
  price: z.coerce.number().optional(),
  ticketUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventForm({ editId }: { editId?: string | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      date: undefined,
      time: '19:00',
      artType: undefined,
      category: undefined,
      organizer: '',
      price: 0,
      ticketUrl: '',
    },
  });

  // Load event data when in edit mode
  useEffect(() => {
    if (editId && user) {
      loadEventData();
    }
  }, [editId, user]);

  const handleDeleteExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(url => url !== imageUrl));
  };

  const handleReplaceExistingImage = (oldImageUrl: string, newFile: File) => {
    // Remove old image and add new file to upload queue
    setExistingImages(prev => prev.filter(url => url !== oldImageUrl));
    setUploadedImages(prev => [...prev, newFile]);
  };

  const loadEventData = async () => {
    if (!editId) return;
    
    setIsLoading(true);
    try {
      const response = await eventsApi.getById(editId);
      if (response.data?.event) {
        const event = response.data.event;
        const eventDate = new Date(event.date);
        
        form.reset({
          title: event.title,
          description: event.description,
          location: event.location,
          date: eventDate,
          time: eventDate.toTimeString().slice(0, 5), // HH:MM format
          artType: event.art_type,
          category: event.category,
          organizer: event.organizer?.name || '',
          price: event.price || 0,
          ticketUrl: event.ticket_url || '',
        });

        // Handle existing images - convert URLs back to File objects for display
        if (event.images && event.images.length > 0) {
          console.log('Loading existing images for edit:', event.images);
          setExistingImages(event.images);
        } else {
          setExistingImages([]);
        }
      }
    } catch (error) {
      console.error('Error loading event:', error);
      toast({
        title: 'Error',
        description: 'Failed to load event data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(data: EventFormValues) {
    setIsSubmitting(true);
    
    try {
      // Upload images first
      let imageUrls: string[] = [];
      
      // Keep existing images when editing
      if (editId && existingImages.length > 0) {
        imageUrls = [...existingImages];
        console.log('Preserving existing images:', existingImages);
      }
      
      // Add new uploaded images
      if (uploadedImages.length > 0) {
        try {
          const uploadedUrls = await uploadMultipleImagesToSupabase(uploadedImages, user!.id);
          imageUrls = [...imageUrls, ...uploadedUrls];
          console.log('Added new images:', uploadedUrls);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast({
            title: 'Image Upload Failed',
            description: 'Some images failed to upload. Please try again or continue without images.',
            variant: 'destructive',
          });
          // Continue with existing images only
        }
      }
      
      // If no images at all, don't use placeholder - let it be empty
      // if (imageUrls.length === 0) {
      //   imageUrls = ['https://picsum.photos/600/400'];
      // }

      // Combine date and time
      const [hours, minutes] = data.time.split(':');
      const combinedDate = new Date(data.date);
      combinedDate.setHours(parseInt(hours), parseInt(minutes));

      const eventData = {
        title: data.title,
        description: data.description,
        location: data.location,
        date: combinedDate.toISOString(),
        art_type: data.artType,  // Changed from artType to art_type
        category: data.category,
        organizer: {
          name: data.organizer,
          email: user?.emailAddresses[0]?.emailAddress || '',
        },
        price: data.price || 0,
        ticket_url: data.ticketUrl || undefined,  // Changed from ticketUrl to ticket_url
        images: imageUrls, // Use combined existing + new images
      };

      const response = editId 
        ? await eventsApi.update(editId, eventData)
        : await eventsApi.create(eventData, user!.id);

      if (response.error) {
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: editId ? 'Event Updated!' : 'Event Created!',
          description: editId 
            ? `Your event "${data.title}" has been successfully updated.`
            : `Your event "${data.title}" has been successfully submitted for review.`,
        });
        form.reset();
        router.push('/profile');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading event data...</span>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Douala Art Fair" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us more about your event, what makes it special?"
                  className="resize-y min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col md:col-span-2">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={date => date < new Date(new Date().setHours(0,0,0,0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Bandjoun Station" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <FormField
            control={form.control}
            name="artType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Art Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an art type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {artTypes.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Your Company Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (XAF) - Optional</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter 0 for a free event" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <FormField
              control={form.control}
              name="ticketUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket URL - Optional</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-ticketing-site.com/event" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        <div className="space-y-2">
          <label className="text-sm font-medium">Event Images - Optional</label>
          <ImageUpload
            images={uploadedImages}
            onImagesChange={setUploadedImages}
            maxImages={5}
            minSizeKB={100}
            maxSizeKB={2500}
            existingImages={existingImages}
            onDeleteExistingImage={handleDeleteExistingImage}
            onReplaceExistingImage={handleReplaceExistingImage}
          />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || isLoading}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? (editId ? 'Updating Event...' : 'Creating Event...') : (editId ? 'Update Event' : 'Create Event')}
        </Button>
      </form>
      )}
    </Form>
  );
}
