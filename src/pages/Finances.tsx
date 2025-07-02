
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Plus, ArrowUp, ArrowDown, Search, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { useAnimals } from '@/hooks/useAnimals';
import FinanceForm from '@/components/FinanceForm';
import FinanceCard from '@/components/FinanceCard';
import PageHeader from '@/components/PageHeader';
import { Tables } from '@/integrations/supabase/types';

type FinancialRecord = Tables<'financial_records'>;

const Finances = () => {
  const { t } = useLanguage();
  const { data: records = [], isLoading } = useFinancialRecords();
  const { data: animals = [] } = useAnimals();
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAnimal, setFilterAnimal] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredRecords = useMemo(() => {
    let filtered = records;

    // Filter by tab
    if (activeTab === 'income') {
      filtered = filtered.filter(r => r.transaction_type === 'Income');
    } else if (activeTab === 'expenses') {
      filtered = filtered.filter(r => r.transaction_type === 'Expense');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(r => r.category === filterCategory);
    }

    // Filter by animal
    if (filterAnimal) {
      filtered = filtered.filter(r => r.animal_id === filterAnimal);
    }

    return filtered;
  }, [records, activeTab, searchTerm, filterCategory, filterAnimal]);

  const summary = useMemo(() => {
    const income = records
      .filter(r => r.transaction_type === 'Income')
      .reduce((sum, r) => sum + Number(r.amount), 0);
    
    const expenses = records
      .filter(r => r.transaction_type === 'Expense')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    };
  }, [records]);

  const categories = useMemo(() => {
    const cats = [...new Set(records.map(r => r.category))];
    return cats.sort();
  }, [records]);

  const handleAddRecord = () => {
    setEditingRecord(undefined);
    setFormOpen(true);
  };

  const handleEditRecord = (record: any) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="My Farm Finances" />
      
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-purple-600" />
              {t('finances')} 💰
            </h1>
            <p className="text-gray-600 text-sm mt-1">Track your farm income and expenses</p>
          </div>
          <Button onClick={handleAddRecord} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-pulse text-gray-600 mb-2">Loading your financial records...</div>
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        )}

        {/* Financial Summary */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <ArrowUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-700 mb-1">{t('totalIncome')}</p>
                <p className="text-2xl font-bold text-green-600">
                  KSh {summary.totalIncome.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <ArrowDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-red-700 mb-1">{t('totalExpenses')}</p>
                <p className="text-2xl font-bold text-red-600">
                  KSh {summary.totalExpenses.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className={`${summary.balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
              <CardContent className="p-6 text-center">
                <DollarSign className={`h-8 w-8 mx-auto mb-2 ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                <p className={`text-sm mb-1 ${summary.balance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                  {t('balance')}
                </p>
                <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  KSh {summary.balance.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        {!isLoading && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterAnimal} onValueChange={setFilterAnimal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by cow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Cows</SelectItem>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.name} {animal.tag && `(${animal.tag})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('');
                    setFilterAnimal('');
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Records Tabs */}
        {!isLoading && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Records ({records.length})</TabsTrigger>
              <TabsTrigger value="income">
                💰 Income ({records.filter(r => r.transaction_type === 'Income').length})
              </TabsTrigger>
              <TabsTrigger value="expenses">
                💸 Expenses ({records.filter(r => r.transaction_type === 'Expense').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <RecordsList records={filteredRecords} onEdit={handleEditRecord} />
            </TabsContent>

            <TabsContent value="income" className="mt-6">
              <RecordsList records={filteredRecords} onEdit={handleEditRecord} />
            </TabsContent>

            <TabsContent value="expenses" className="mt-6">
              <RecordsList records={filteredRecords} onEdit={handleEditRecord} />
            </TabsContent>
          </Tabs>
        )}

        <FinanceForm
          open={formOpen}
          onOpenChange={setFormOpen}
          record={editingRecord}
        />
      </div>
    </div>
  );
};

interface RecordsListProps {
  records: any[];
  onEdit: (record: any) => void;
}

const RecordsList = ({ records, onEdit }: RecordsListProps) => {
  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No financial records found</h3>
          <p className="text-sm text-gray-500 mb-6">
            Start tracking your farm finances by adding your first transaction.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <FinanceCard key={record.id} record={record} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default Finances;
