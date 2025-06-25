
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Animal = Tables<'animals'>;

interface AnimalCardProps {
  animal: Animal;
  onViewProfile: (animal: Animal) => void;
}

const AnimalCard = ({ animal, onViewProfile }: AnimalCardProps) => {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{animal.name}</h3>
            {animal.tag && (
              <p className="text-sm text-gray-600">Tag: {animal.tag}</p>
            )}
          </div>
          {animal.photo_url && (
            <img
              src={animal.photo_url}
              alt={animal.name}
              className="w-16 h-16 rounded-lg object-cover ml-3"
            />
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{animal.breed}</Badge>
            <Badge variant={animal.health_status === 'Healthy' ? 'default' : 'destructive'}>
              {animal.health_status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Age: {calculateAge(animal.date_of_birth)}</span>
          </div>
          
          <p className="text-sm text-gray-600">
            Source: {animal.source}
          </p>
        </div>

        <Button
          onClick={() => onViewProfile(animal)}
          className="w-full"
          variant="outline"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnimalCard;
