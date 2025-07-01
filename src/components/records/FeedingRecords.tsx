
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FeedingRecordsProps {
  animalId: string;
}

const FeedingRecords = ({ animalId }: FeedingRecordsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Feeding Records</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">No feeding records yet. Add the first one!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedingRecords;
