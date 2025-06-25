
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnimals } from '@/hooks/useAnimals';
import AnimalCard from '@/components/AnimalCard';
import RegisterAnimalForm from '@/components/RegisterAnimalForm';
import AnimalProfile from '@/components/AnimalProfile';
import { Tables } from '@/integrations/supabase/types';

type Animal = Tables<'animals'>;

const AnimalDiary = () => {
  const { t } = useLanguage();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: animals, isLoading, error } = useAnimals();

  const filteredAnimals = animals?.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (selectedAnimal) {
    return (
      <AnimalProfile
        animal={selectedAnimal}
        onBack={() => setSelectedAnimal(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-green-600" />
          {t('animalDiary')}
        </h1>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowRegisterForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Register Animal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Dairy Cows</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, tag, or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse text-gray-600">Loading animals...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading animals. Please try again.
            </div>
          ) : filteredAnimals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {animals?.length === 0 
                  ? "No animals registered yet. Click 'Register Animal' to get started."
                  : "No animals match your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnimals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  onViewProfile={setSelectedAnimal}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showRegisterForm && (
        <RegisterAnimalForm onClose={() => setShowRegisterForm(false)} />
      )}
    </div>
  );
};

export default AnimalDiary;
