import { supabase } from './supabase';

export async function uploadImageToSupabase(file: File, userId: string): Promise<string> {
  try {
    console.log('Uploading image to Supabase:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    console.log('Image uploaded successfully:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function uploadMultipleImagesToSupabase(files: File[], userId: string): Promise<string[]> {
  console.log('Uploading multiple images to Supabase:', files.length, 'files');
  
  try {
    const uploadPromises = files.map(file => uploadImageToSupabase(file, userId));
    const urls = await Promise.all(uploadPromises);
    
    console.log('All images uploaded successfully:', urls);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}
