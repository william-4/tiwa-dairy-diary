
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AnimalDiary = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-green-600" />
          {t('animalDiary')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          {t('add')} Cow
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Dairy Cows</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No cows registered yet. Click "Add Cow" to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalDiary;
