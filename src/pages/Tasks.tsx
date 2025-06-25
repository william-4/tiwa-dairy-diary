
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Tasks = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-blue-600" />
          {t('tasks')}
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t('add')} Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No tasks scheduled. Click "Add Task" to create your first task.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
