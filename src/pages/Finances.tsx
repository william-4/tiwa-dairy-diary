
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Finances = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-purple-600" />
          {t('finances')}
        </h1>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          {t('add')} Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <ArrowUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700 mb-1">{t('totalIncome')}</p>
            <p className="text-2xl font-bold text-green-600">KSh 0</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <ArrowDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-700 mb-1">{t('totalExpenses')}</p>
            <p className="text-2xl font-bold text-red-600">KSh 0</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 mb-1">{t('balance')}</p>
            <p className="text-2xl font-bold text-gray-600">KSh 0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No transactions recorded yet. Click "Add Entry" to start tracking your finances.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finances;
