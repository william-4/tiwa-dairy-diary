
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateAnimal } from '@/hooks/useAnimals';
import { X, Upload, Image } from 'lucide-react';

interface RegisterAnimalFormProps {
  onClose: () => void;
}

const RegisterAnimalForm = ({ onClose }: RegisterAnimalFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    date_of_birth: '',
    source: '',
    gender: 'Female',
    notes: '',
    photo_url: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createAnimal = useCreateAnimal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // For now, we'll store the image preview as photo_url
      // In a real app, you'd upload to Supabase Storage first
      const animalData = {
        ...formData,
        tag: formData.name, // Using name as tag since we combined the fields
        photo_url: imagePreview || undefined,
      };
      
      await createAnimal.mutateAsync(animalData);
      onClose();
    } catch (error) {
      console.error('Error creating cow:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Register New Cow</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Cow Name/ID Tag *</Label>
              <Input
                id="name"
                placeholder="e.g., Bessie, Cow-001, or Tag #123"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-2">
              <Label>Cow Photo (Optional)</Label>
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Cow preview" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <Image className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Click to upload cow photo
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed *</Label>
              <Select value={formData.breed} onValueChange={(value) => handleChange('breed', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Friesian">Friesian</SelectItem>
                  <SelectItem value="Ayrshire">Ayrshire</SelectItem>
                  <SelectItem value="Jersey">Jersey</SelectItem>
                  <SelectItem value="Guernsey">Guernsey</SelectItem>
                  <SelectItem value="Holstein">Holstein</SelectItem>
                  <SelectItem value="Crossbreed">Crossbreed</SelectItem>
                  <SelectItem value="Zebu">Zebu</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Select value={formData.source} onValueChange={(value) => handleChange('source', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How did you acquire this cow?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Born on farm">Born on farm</SelectItem>
                  <SelectItem value="Bought">Bought</SelectItem>
                  <SelectItem value="Gifted">Gifted</SelectItem>
                  <SelectItem value="Inherited">Inherited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special characteristics, health notes, or other details..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={createAnimal.isPending} className="flex-1">
                {createAnimal.isPending ? 'Registering...' : 'Register Cow'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterAnimalForm;
