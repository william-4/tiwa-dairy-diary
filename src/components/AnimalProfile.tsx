
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Milk, Utensils, Heart, Baby } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import FeedingRecords from '@/components/records/FeedingRecords';
import ProductionRecords from '@/components/records/ProductionRecords';
import HealthRecords from '@/components/records/HealthRecords';
import BreedingRecords from '@/components/records/BreedingRecords';

type Animal = Tables<'animals'>;

interface AnimalProfileProps {
  animal: Animal;
  onBack: () => void;
}

const AnimalProfile = ({ animal, onBack }: AnimalProfileProps) => {
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                       (today.getMonth() - birthDate.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} months`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years}y ${months}m` : `${years} years`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-2xl font-bold">{animal.name}</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{animal.name}</h2>
              {animal.tag && (
                <p className="text-gray-600 mb-2">Tag: {animal.tag}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{animal.breed}</Badge>
                <Badge variant={animal.health_status === 'Healthy' ? 'default' : 'destructive'}>
                  {animal.health_status}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Age: {calculateAge(animal.date_of_birth)}</span>
                </div>
                <p>Source: {animal.source}</p>
                <p>Gender: {animal.gender}</p>
              </div>
            </div>
            {animal.photo_url && (
              <img
                src={animal.photo_url}
                alt={animal.name}
                className="w-24 h-24 rounded-lg object-cover ml-4"
              />
            )}
          </div>
          
          {animal.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm"><strong>Notes:</strong> {animal.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="feeding" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feeding" className="flex items-center gap-1">
            <Utensils className="h-4 w-4" />
            Feeding
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center gap-1">
            <Milk className="h-4 w-4" />
            Production
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="breeding" className="flex items-center gap-1">
            <Baby className="h-4 w-4" />
            Breeding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feeding">
          <FeedingRecords animalId={animal.id} />
        </TabsContent>

        <TabsContent value="production">
          <ProductionRecords animalId={animal.id} />
        </TabsContent>

        <TabsContent value="health">
          <HealthRecords animalId={animal.id} />
        </TabsContent>

        <TabsContent value="breeding">
          <BreedingRecords animalId={animal.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimalProfile;
