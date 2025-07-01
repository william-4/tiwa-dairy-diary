
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateAnimal } from '@/hooks/useAnimals';
import { X } from 'lucide-react';

interface RegisterAnimalFormProps {
  onClose: () => void;
}

const RegisterAnimalForm = ({ onClose }: RegisterAnimalFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    breed: '',
    date_of_birth: '',
    source: '',
    gender: 'Female',
    notes: '',
  });

  const createAnimal = useCreateAnimal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createAnimal.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error('Error creating cow:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <Label htmlFor="name">Cow Name or Tag *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag/ID Number</Label>
              <Input
                id="tag"
                value={formData.tag}
                onChange={(e) => handleChange('tag', e.target.value)}
              />
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
                  <SelectItem value="Crossbreed">Crossbreed</SelectItem>
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
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Born on farm">Born on farm</SelectItem>
                  <SelectItem value="Bought">Bought</SelectItem>
                  <SelectItem value="Gifted">Gifted</SelectItem>
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
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
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
