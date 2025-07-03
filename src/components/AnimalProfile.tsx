import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useProductionRecords } from '@/hooks/useProductionRecords';
import { useFeedingRecords } from '@/hooks/useFeedingRecords';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { useBreedingRecords } from '@/hooks/useBreedingRecords';
import ProductionRecords from './records/ProductionRecords';
import FeedingRecords from './records/FeedingRecords';
import HealthRecords from './records/HealthRecords';
import BreedingRecords from './records/BreedingRecords';
import GeneralDairyRecords from './GeneralDairyRecords';
import PageHeader from './PageHeader';
import { Tables } from '@/integrations/supabase/types';

type Animal = Tables<'animals'>;

interface AnimalProfileProps {
  animal: Animal;
  onBack: () => void;
}

const AnimalProfile = ({ animal, onBack }: AnimalProfileProps) => {
  const [activeTab, setActiveTab] = useState('production');
  const { data: productionRecords = [] } = useProductionRecords(animal.id);
  const { data: feedingRecords = [] } = useFeedingRecords(animal.id);
  const { data: healthRecords = [] } = useHealthRecords(animal.id);
  const { data: breedingRecords = [] } = useBreedingRecords(animal.id);

  // Combine all records for Full History
  const allRecords = useMemo(() => {
    const combined = [
      ...productionRecords.map(r => ({
        id: r.id,
        date: r.date,
        type: 'production',
        icon: '🥛',
        title: `Milk Production: ${r.total_yield}L`,
        details: `AM: ${r.am_yield || 0}L, Noon: ${r.noon_yield || 0}L, PM: ${r.pm_yield || 0}L`,
      })),
      ...feedingRecords.map(r => ({
        id: r.id,
        date: r.date,
        type: 'feeding',
        icon: '🍽️',
        title: `Feeding: ${r.feed_type}`,
        details: r.quantity ? `${r.quantity}kg` : 'Quantity not specified',
      })),
      ...healthRecords.map(r => ({
        id: r.id,
        date: r.date,
        type: 'health',
        icon: '🩺',
        title: `Health: ${r.health_issue || 'General checkup'}`,
        details: r.treatment_given || r.vaccine_dewormer || 'Treatment recorded',
      })),
      ...breedingRecords.map(r => ({
        id: r.id,
        date: r.date_of_heat || r.pregnancy_confirmation_date || r.expected_calving_date || r.actual_calving_date || '',
        type: 'breeding',
        icon: '🐮',
        title: 'Breeding Record',
        details: r.conception_status || r.mating_method || 'Breeding activity',
      })),
    ];

    return combined
      .filter(r => r.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [productionRecords, feedingRecords, healthRecords, breedingRecords]);

  const age = useMemo(() => {
    const birthDate = new Date(animal.date_of_birth);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return months > 0 ? `${years}y ${months}m` : `${years} years`;
  }, [animal.date_of_birth]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title={`${animal.name}${animal.tag ? ` (${animal.tag})` : ''}`} onBack={onBack} />
      
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Animal Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐄</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{animal.name}</h1>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Tag:</span> {animal.tag || 'Not assigned'}</div>
                  <div><span className="font-medium">Breed:</span> {animal.breed}</div>
                  <div><span className="font-medium">Age:</span> {age}</div>
                  <div><span className="font-medium">Gender:</span> {animal.gender}</div>
                  <div><span className="font-medium">Source:</span> {animal.source}</div>
                  <div><span className="font-medium">Health:</span> 
                    <Badge variant={animal.health_status === 'Healthy' ? 'default' : 'destructive'} className="ml-1">
                      {animal.health_status}
                    </Badge>
                  </div>
                </div>
                {animal.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{animal.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="production">🥛 Production</TabsTrigger>
            <TabsTrigger value="feeding">🍽️ Feeding</TabsTrigger>
            <TabsTrigger value="health">🩺 Health</TabsTrigger>
            <TabsTrigger value="breeding">🐮 Breeding</TabsTrigger>
            <TabsTrigger value="general">🏠 General</TabsTrigger>
            <TabsTrigger value="history">📋 Full History</TabsTrigger>
          </TabsList>

          <TabsContent value="production" className="mt-6">
            <ProductionRecords animalId={animal.id} />
          </TabsContent>

          <TabsContent value="feeding" className="mt-6">
            <FeedingRecords animalId={animal.id} />
          </TabsContent>

          <TabsContent value="health" className="mt-6">
            <HealthRecords animalId={animal.id} />
          </TabsContent>

          <TabsContent value="breeding" className="mt-6">
            <BreedingRecords animalId={animal.id} />
          </TabsContent>

          <TabsContent value="general" className="mt-6">
            <GeneralDairyRecords />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Full Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                {allRecords.length > 0 ? (
                  <div className="space-y-4">
                    {allRecords.map((record) => (
                      <div key={`${record.type}-${record.id}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-xl">{record.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{record.title}</h4>
                            <span className="text-sm text-gray-500">
                              {format(new Date(record.date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{record.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No activity records yet. Start by adding production, feeding, health, or breeding records.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnimalProfile;
