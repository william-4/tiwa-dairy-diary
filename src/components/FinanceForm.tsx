
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnimals } from '@/hooks/useAnimals';
import { useCreateFinancialRecord, useUpdateFinancialRecord } from '@/hooks/useFinancialRecords';
import { Tables } from '@/integrations/supabase/types';

type FinancialRecord = Tables<'financial_records'>;

const financeSchema = z.object({
  transaction_type: z.enum(['Income', 'Expense']),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  transaction_date: z.date(),
  animal_id: z.string().optional(),
  description: z.string().optional(),
  photo_url: z.string().optional(),
  buyer_supplier_name: z.string().optional(),
  buyer_supplier_phone: z.string().optional(),
  is_credit: z.boolean().optional(),
  repayment_date: z.date().optional(),
});

type FinanceFormData = z.infer<typeof financeSchema>;

interface FinanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: FinancialRecord;
}

const FinanceForm = ({ open, onOpenChange, record }: FinanceFormProps) => {
  const { t } = useLanguage();
  const { data: animals = [] } = useAnimals();
  const createRecord = useCreateFinancialRecord();
  const updateRecord = useUpdateFinancialRecord();
  const [customCategory, setCustomCategory] = useState('');
  const [showCreditOptions, setShowCreditOptions] = useState(false);

  const expenseCategories = [
    'Feed',
    'Vet/Health',
    'Medicine',
    'Breeding/AI',
    'Labor',
    'Equipment',
    'Other'
  ];

  const incomeCategories = [
    'Milk Sales',
    'Animal Sales',
    'Manure Sales',
    'Other'
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues: record ? {
      transaction_type: record.transaction_type as 'Income' | 'Expense',
      category: record.category,
      amount: Number(record.amount),
      transaction_date: new Date(record.transaction_date),
      animal_id: record.animal_id || undefined,
      description: record.description || undefined,
      photo_url: record.photo_url || undefined,
    } : {
      transaction_type: 'Expense',
      transaction_date: new Date(),
      is_credit: false,
    },
  });

  const transactionType = watch('transaction_type');
  const selectedCategory = watch('category');
  const isCredit = watch('is_credit');

  const categories = transactionType === 'Income' ? incomeCategories : expenseCategories;

  const onSubmit = async (data: FinanceFormData) => {
    try {
      const finalCategory = data.category === 'Other' && customCategory ? customCategory : data.category;
      
      const recordData = {
        transaction_type: data.transaction_type,
        category: finalCategory,
        amount: data.amount,
        transaction_date: format(data.transaction_date, 'yyyy-MM-dd'),
        animal_id: data.animal_id || null,
        description: data.description || null,
        photo_url: data.photo_url || null,
      };

      if (record) {
        await updateRecord.mutateAsync({ id: record.id, ...recordData });
      } else {
        await createRecord.mutateAsync(recordData);
      }
      
      reset();
      setCustomCategory('');
      setShowCreditOptions(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving financial record:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {record ? 'Edit Financial Record' : 'Add Financial Record'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="transaction_type">Transaction Type</Label>
            <Select
              value={watch('transaction_type')}
              onValueChange={(value: 'Income' | 'Expense') => setValue('transaction_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Income">💰 Income</SelectItem>
                <SelectItem value="Expense">💸 Expense</SelectItem>
              </SelectContent>
            </Select>
            {errors.transaction_type && (
              <p className="text-sm text-red-600">{errors.transaction_type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategory || ''}
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {selectedCategory === 'Other' && (
            <div>
              <Label htmlFor="customCategory">Please specify</Label>
              <Input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
              />
            </div>
          )}

          <div>
            <Label htmlFor="amount">Amount (KSh)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register('amount', { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <Label>Transaction Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watch('transaction_date') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('transaction_date') ? (
                    format(watch('transaction_date'), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch('transaction_date')}
                  onSelect={(date) => date && setValue('transaction_date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.transaction_date && (
              <p className="text-sm text-red-600">{errors.transaction_date.message}</p>
            )}
          </div>

          {/* Buyer/Supplier Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buyer_supplier_name">
                {transactionType === 'Income' ? 'Buyer Name' : 'Supplier Name'} (Optional)
              </Label>
              <Input
                {...register('buyer_supplier_name')}
                placeholder={transactionType === 'Income' ? 'e.g., John Kamau' : 'e.g., Agro Vet'}
              />
            </div>
            <div>
              <Label htmlFor="buyer_supplier_phone">Phone (Optional)</Label>
              <Input
                {...register('buyer_supplier_phone')}
                placeholder="e.g., 0712345678"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="animal_id">Linked Cow (Optional)</Label>
            <Select
              value={watch('animal_id') || 'none'}
              onValueChange={(value) => setValue('animal_id', value === 'none' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cow or leave blank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not linked to any cow</SelectItem>
                {animals.map((animal) => (
                  <SelectItem key={animal.id} value={animal.id}>
                    🐄 {animal.name} {animal.tag && `(${animal.tag})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Credit Purchase Option for Expenses */}
          {transactionType === 'Expense' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_credit"
                {...register('is_credit')}
                onChange={(e) => setShowCreditOptions(e.target.checked)}
              />
              <Label htmlFor="is_credit">Was this purchased on credit?</Label>
            </div>
          )}

          {showCreditOptions && isCredit && (
            <div>
              <Label>Repayment Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watch('repayment_date') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch('repayment_date') ? (
                      format(watch('repayment_date'), "PPP")
                    ) : (
                      <span>Pick repayment date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watch('repayment_date')}
                    onSelect={(date) => date && setValue('repayment_date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              {...register('description')}
              placeholder="Add any notes about this transaction..."
              rows={3}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <Label htmlFor="photo_url">Receipt/Photo (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                {...register('photo_url')}
                placeholder="Photo URL or upload coming soon..."
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Photo upload feature coming soon. For now, you can add a URL.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createRecord.isPending || updateRecord.isPending}
            >
              {createRecord.isPending || updateRecord.isPending 
                ? 'Saving...' 
                : record ? 'Update Record' : 'Add Record'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceForm;
