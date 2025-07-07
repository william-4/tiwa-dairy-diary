
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, Beef, Receipt, User, Building } from 'lucide-react';
import { format } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';
import { useDeleteFinancialRecord } from '@/hooks/useFinancialRecords';

type FinancialRecordWithAnimal = Tables<'financial_records'> & {
  animals?: { name: string; tag: string | null };
};

interface FinanceCardProps {
  record: FinancialRecordWithAnimal;
  onEdit: (record: FinancialRecordWithAnimal) => void;
}

const FinanceCard = ({ record, onEdit }: FinanceCardProps) => {
  const deleteRecord = useDeleteFinancialRecord();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this financial record?')) {
      await deleteRecord.mutateAsync(record.id);
    }
  };

  const isIncome = record.transaction_type === 'Income';

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {isIncome ? '💰' : '💸'}
            </span>
            <div>
              <h3 className="font-semibold">{record.category}</h3>
              <Badge 
                variant={isIncome ? "default" : "secondary"}
                className={isIncome ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {record.transaction_type}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
              {isIncome ? '+' : '-'}KSh {Number(record.amount).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(record.transaction_date), 'MMM d, yyyy')}</span>
          </div>

          {/* Buyer details for income */}
          {isIncome && record.buyer_name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>
                Buyer: {record.buyer_name}
                {record.buyer_contact && ` (${record.buyer_contact})`}
              </span>
            </div>
          )}

          {/* Supplier details for expenses */}
          {!isIncome && record.supplier_name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building className="h-4 w-4" />
              <span>
                Supplier: {record.supplier_name}
                {record.supplier_contact && ` (${record.supplier_contact})`}
              </span>
            </div>
          )}

          {record.animals && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Beef className="h-4 w-4" />
              <span>
                Linked to: {record.animals.name}
                {record.animals.tag && ` (${record.animals.tag})`}
              </span>
            </div>
          )}

          {record.description && (
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {record.description}
            </p>
          )}

          {record.receipt_photo_url && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Receipt className="h-4 w-4" />
              <span>Receipt/Photo attached</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(record)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDelete}
            disabled={deleteRecord.isPending}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceCard;
