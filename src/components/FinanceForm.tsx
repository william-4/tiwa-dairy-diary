
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, X, Upload, FileImage } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAnimals } from '@/hooks/useAnimals';
import { useCreateFinancialRecord, useUpdateFinancialRecord } from '@/hooks/useFinancialRecords';
import { Tables } from '@/integrations/supabase/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import CustomSelect from './CustomSelect';

const financeSchema = z.object({
  transaction_type: z.enum(['Income', 'Expense']),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  transaction_date: z.date(),
  description: z.string().optional(),
  animal_id: z.string().optional(),
  buyer_name: z.string().optional(),
  buyer_phone: z.string().optional(),
  supplier_name: z.string().optional(),
  supplier_phone: z.string().optional(),
  is_credit: z.boolean().optional(),
  repayment_date: z.date().optional(),
});

type FinanceFormData = z.infer<typeof financeSchema>;

interface FinanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: Tables<'financial_records'>;
}

const FinanceForm = ({ open, onOpenChange, record }: FinanceFormProps) => {
  const { t } = useLanguage();
  const { data: animals = [] } = useAnimals();
  const createRecord = useCreateFinancialRecord();
  const updateRecord = useUpdateFinancialRecord();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const incomeCategories = [
    { value: 'Milk Sales', label: 'Milk Sales' },
    { value: 'Animal Sales', label: 'Animal Sales' },
    { value: 'Breeding Services', label: 'Breeding Services' },
    { value: 'Manure Sales', label: 'Manure Sales' },
  ];

  const expenseCategories = [
    { value: 'Feed', label: 'Feed' },
    { value: 'Veterinary', label: 'Veterinary' },
    { value: 'Labor', label: 'Labor' },
    { value: 'Equipment', label: 'Equipment' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Transport', label: 'Transport' },
  ];

  const form = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      transaction_type: (record?.transaction_type as 'Income' | 'Expense') || 'Income',
      category: record?.category || '',
      amount: record?.amount ? Number(record.amount) : 0,
      transaction_date: record?.transaction_date ? new Date(record.transaction_date) : new Date(),
      description: record?.description || '',
      animal_id: record?.animal_id || '',
      is_credit: false,
    },
  });

  const transactionType = form.watch('transaction_type');
  const isCredit = form.watch('is_credit');
  const categories = transactionType === 'Income' ? incomeCategories : expenseCategories;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, WebP, or PDF file",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} ready to attach`,
      });
    }
  };

  const onSubmit = async (data: FinanceFormData) => {
    try {
      const recordData = {
        transaction_type: data.transaction_type,
        category: data.category,
        amount: data.amount,
        transaction_date: format(data.transaction_date, 'yyyy-MM-dd'),
        description: data.description || null,
        animal_id: data.animal_id || null,
        // Note: Photo upload would be implemented with Supabase Storage
        photo_url: null, // Will be implemented when storage is set up
      };

      if (record) {
        await updateRecord.mutateAsync({ id: record.id, ...recordData });
      } else {
        await createRecord.mutateAsync(recordData);
      }
      
      onOpenChange(false);
      form.reset();
      setUploadedFile(null);
    } catch (error) {
      console.error('Error saving financial record:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {record ? 'Edit Financial Record' : 'Add Financial Record'} 💰
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="transaction_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Income">💰 {t('income')}</SelectItem>
                        <SelectItem value="Expense">💸 {t('expense')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('category')} *</FormLabel>
                    <CustomSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={categories}
                      placeholder="Select category"
                      allowOther={true}
                      otherPlaceholder="Please specify category"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('amount')} (KSh) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('transactionDate')} *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Buyer/Supplier Details */}
            {transactionType === 'Income' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="buyer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyer Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buyer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyer Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., +254712345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {transactionType === 'Expense' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supplier_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ABC Feed Store" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplier_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., +254712345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="animal_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Cow (Optional) 🐄</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a cow or leave blank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Not linked to any cow</SelectItem>
                      {animals.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id}>
                          {animal.name} {animal.tag ? `(${animal.tag})` : ''} - {animal.breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo Upload */}
            <div className="space-y-2">
              <FormLabel>Upload Receipt/Photo (Optional) 📸</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <FileImage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <div className="flex justify-center">
                    <label className="cursor-pointer">
                      <Button type="button" variant="outline" className="pointer-events-none">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, WebP or PDF (max 5MB)
                  </p>
                  {uploadedFile && (
                    <div className="mt-2 p-2 bg-green-50 rounded flex items-center justify-between">
                      <span className="text-sm text-green-700">{uploadedFile.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setUploadedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')} (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this transaction..." 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createRecord.isPending || updateRecord.isPending}
              >
                {record ? 'Update Record' : 'Add Record'}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('cancel')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceForm;
