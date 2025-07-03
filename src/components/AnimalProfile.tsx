
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Heart, Stethoscope, Utensils, Milk2, Edit, Camera } from 'lucide-react';
import { format, differenceInDays, differenceInMonths } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tables } from '@/integrations/supabase/types';
import ProductionRecords from './records/ProductionRecords';
import HealthRecords from './records/HealthRecords';
import FeedingRecords from './records/FeedingRecords';
import BreedingRecords from './records/BreedingRecords';
import GeneralDairyRecords from './GeneralDairyRecords';

type Animal = Tables<'animals'>;

interface AnimalProfileProps {
  animal: Animal;
  onBack: () => void;
  onEdit: () => void;
}

const AnimalProfile = ({ animal, onBack, onEdit }: AnimalProfileProps) => {
  const { t } = useLanguage();
  // Default to 'history' tab (Full History)
  const [activeTab, setActiveTab] = useState('history');

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const months = differenceInMonths(now, birth);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0) {
      return `${years}y ${remainingMonths}m`;
    }
    return `${months}m`;
  };

  const getHealthStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'recovering': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderEmoji = (gender: string) => {
    return gender === 'Male' ? '🐂' : '🐄';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-40">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xl">{getGenderEmoji(animal.gender)}</span>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {animal.name}
              </h1>
              {animal.tag && (
                <Badge variant="outline" className="text-xs">
                  #{animal.tag}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            {t('edit')}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-6xl mx-auto">
        {/* Animal Info Card */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {animal.photo_url ? (
                    <img 
                      src={animal.photo_url} 
                      alt={animal.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Camera className="h-8 w-8 mx-auto mb-1" />
                      <span className="text-xs">No photo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('breed')}</p>
                  <p className="font-medium">{animal.breed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('age')}</p>
                  <p className="font-medium">{getAge(animal.date_of_birth)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('gender')}</p>
                  <p className="font-medium">{animal.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('health')}</p>
                  <Badge className={getHealthStatusColor(animal.health_status || 'Healthy')}>
                    {animal.health_status || 'Healthy'}
                  </Badge>
                </div>
              </div>
            </div>

            {animal.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{animal.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Records Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="history" className="text-xs">
              📋 {t('fullHistory')}
            </TabsTrigger>
            <TabsTrigger value="production" className="text-xs">
              🥛 {t('production')}
            </TabsTrigger>
            <TabsTrigger value="health" className="text-xs">
              🩺 {t('health')}
            </TabsTrigger>
            <TabsTrigger value="feeding" className="text-xs">
              🌾 {t('feeding')}
            </TabsTrigger>
            <TabsTrigger value="breeding" className="text-xs">
              💕 {t('breeding')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-4">
            <GeneralDairyRecords animalId={animal.id} />
          </TabsContent>

          <TabsContent value="production" className="mt-4">
            <ProductionRecords animalId={animal.id} />
          </TabsContent>

          <TabsContent value="health" className="mt-4">
            <HealthRecords animalId={animal.id} />
          </TabsContent>

          <TabsContent value="feeding" className="mt-4">
            <FeedingRecords animalId={animal.id} />
          </TabsContent>

          <TabsContent value="breeding" className="mt-4">
            <BreedingRecords animalId={animal.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnimalProfile;
