'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  minSizeKB?: number;
  maxSizeKB?: number;
  existingImages?: string[];
  onDeleteExistingImage?: (imageUrl: string) => void;
  onReplaceExistingImage?: (imageUrl: string, newFile: File) => void;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  minSizeKB = 100, 
  maxSizeKB = 2500,
  existingImages = [],
  onDeleteExistingImage,
  onReplaceExistingImage
}: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image file`);
        return;
      }

      // Check file size
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB < minSizeKB) {
        errors.push(`${file.name} is too small (minimum ${minSizeKB}KB)`);
        return;
      }
      if (fileSizeKB > maxSizeKB) {
        errors.push(`${file.name} is too large (maximum ${maxSizeKB}KB)`);
        return;
      }

      // Check total images limit
      if (images.length + validFiles.length >= maxImages) {
        errors.push(`Maximum ${maxImages} images allowed`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      toast({
        title: 'Upload Error',
        description: errors.join(', '),
        variant: 'destructive',
      });
    }

    if (validFiles.length > 0) {
      onImagesChange([...images, ...validFiles]);
      toast({
        title: 'Images Added',
        description: `${validFiles.length} image(s) added successfully`,
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          disabled={images.length >= maxImages}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Images ({images.length}/{maxImages})
        </Button>
        <span className="text-sm text-muted-foreground">
          Min: {minSizeKB}KB, Max: {maxSizeKB}KB
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((file, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-2">
                <div className="relative bg-muted rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)}KB
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Show existing images */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Existing Images:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {existingImages.map((url, index) => (
              <Card key={`existing-${index}`} className="relative">
                <CardContent className="p-2">
                  <div className="relative bg-muted rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`Existing image ${index + 1}`}
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
                      Existing
                    </div>
                    <div className="absolute bottom-1 right-1 flex gap-1">
                      {onDeleteExistingImage && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => onDeleteExistingImage(url)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      {onReplaceExistingImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                onReplaceExistingImage(url, file);
                              }
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    Existing Image {index + 1}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
