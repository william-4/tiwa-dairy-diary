
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCreateAnimal } from '@/hooks/useAnimals';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

const animalSchema = z.object({
  name: z.string().min(1, 'Animal name/tag is required'),
  breed: z.string().min(1, 'Breed is required'),
  date_of_birth: z.date({
    required_error: 'Date of birth is required',
  }),
  gender: z.enum(['Male', 'Female']),
  source: z.string().min(1, 'Source is required'),
  notes: z.string().optional(),
});

type AnimalFormData = z.infer<typeof animalSchema>;

interface RegisterAnimalFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const RegisterAnimalForm = ({ onSuccess, onClose }: RegisterAnimalFormProps) => {
  const { t } = useLanguage();
  const createAnimal = useCreateAnimal();
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);

  const form = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      gender: 'Female',
      source: 'Born on farm',
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a photo smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or WebP image",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedPhoto(file);
      toast({
        title: "Photo uploaded",
        description: `${file.name} ready to attach`,
      });
    }
  };

  const onSubmit = async (data: AnimalFormData) => {
    try {
      const animalData = {
        name: data.name,
        tag: data.name, // Use the same value for both name and tag
        breed: data.breed,
        date_of_birth: format(data.date_of_birth, 'yyyy-MM-dd'),
        gender: data.gender,
        source: data.source,
        notes: data.notes || null,
        photo_url: uploadedPhoto ? `uploaded_${uploadedPhoto.name}` : null, // Store photo reference for now
      };

      await createAnimal.mutateAsync(animalData);
      
      form.reset();
      setUploadedPhoto(null);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error creating animal:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🐄 Register New Animal
        </h2>
        <p className="text-gray-600">
          Add a new animal to your dairy herd with all essential information
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Animal Photo Upload */}
          <div className="space-y-2">
            <FormLabel>Animal Photo (Optional) 📸</FormLabel>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <div className="flex justify-center">
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Photo
                      </span>
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, or WebP (max 5MB)
                </p>
                {uploadedPhoto && (
                  <div className="mt-3 p-3 bg-green-50 rounded flex items-center justify-between">
                    <span className="text-sm text-green-700">{uploadedPhoto.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setUploadedPhoto(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cow Name/ID Tag *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Bella, C001, or Cow #23" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('breed')} *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select breed" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Holstein">Holstein</SelectItem>
                      <SelectItem value="Jersey">Jersey</SelectItem>
                      <SelectItem value="Guernsey">Guernsey</SelectItem>
                      <SelectItem value="Ayrshire">Ayrshire</SelectItem>
                      <SelectItem value="Brown Swiss">Brown Swiss</SelectItem>
                      <SelectItem value="Friesian">Friesian</SelectItem>
                      <SelectItem value="Crossbred">Crossbred</SelectItem>
                      <SelectItem value="Zebu">Zebu</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
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
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('dateOfBirth')} *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('gender')} *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Female">🐄 Female</SelectItem>
                      <SelectItem value="Male">🐂 Male</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('source')} *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Born on farm">🏠 Born on farm</SelectItem>
                    <SelectItem value="Purchased">💰 Purchased</SelectItem>
                    <SelectItem value="Gift">🎁 Gift</SelectItem>
                    <SelectItem value="Inherited">👨‍👩‍👧‍👦 Inherited</SelectItem>
                    <SelectItem value="Other">📝 Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('notes')} (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional information about this animal..."
                    className="resize-none" 
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={createAnimal.isPending}
          >
            {createAnimal.isPending ? 'Adding Animal...' : 'Add Animal to Herd'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterAnimalForm;
