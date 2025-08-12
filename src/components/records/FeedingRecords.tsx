
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Calendar, Wheat } from 'lucide-react';
import { useFeedingRecords, useCreateFeedingRecord, useUpdateFeedingRecord } from '@/hooks/useFeedingRecords';
import { useCreateFinancialRecord, useUpdateFinancialRecord } from '@/hooks/useFinancialRecords';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface FeedingRecordsProps {
  animalId: string;
}

const FeedingRecords = ({ animalId }: FeedingRecordsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    feed_type: '',
    custom_feed_description: '',
    quantity: '',
    cost: '',
    source_of_feed: '',
    notes: '',
  });

  const { data: records, isLoading } = useFeedingRecords(animalId);
  const createRecord = useCreateFeedingRecord();
  const updateRecord = useUpdateFeedingRecord();
  const createFinancialRecord = useCreateFinancialRecord();
  const updateFinancialRecord = useUpdateFinancialRecord();
  const [financialDescription, setFinancialDescription] = useState<string | null>(null);

  const feedTypes = [
    'Napier Grass',
    'Rhodes Grass',
    'Dairy Meal',
    'Wheat Bran',
    'Maize Germ',
    'Cotton Seed Cake',
    'Molasses',
    'Hay',
    'Silage',
    'Mixed Feed (Custom)',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalFeedType = formData.feed_type === 'Mixed Feed (Custom)' && formData.custom_feed_description 
      ? `Mixed Feed: ${formData.custom_feed_description}` 
      : formData.feed_type;
    
    const recordData = {
      animal_id: animalId,
      date: formData.date,
      feed_type: finalFeedType,
      quantity: formData.quantity ? parseFloat(formData.quantity) : null,
      cost: formData.cost ? Math.round(parseFloat(formData.cost)) : null,
      source_of_feed: formData.source_of_feed || null,
      notes: formData.notes || null,
    };

    try {
      let feedingRecordId: string;

      if (editingRecord) {
        await updateRecord.mutateAsync({ id: editingRecord.id, ...recordData });
        feedingRecordId= editingRecord.id;
      } else {
        const created = await createRecord.mutateAsync(recordData);
        feedingRecordId = created.id;
      }

      // Auto-create financial record if cost is provided
      if (formData.cost && parseFloat(formData.cost) > 0) {
        const description = `FeedingRecord:${feedingRecordId}`;
        setFinancialDescription(description);

        // Fetch existing financial record by description only
        console.log('Checking for existing financial record with description:', description);

        const { data: existingFinancialRecord, error } = await supabase
          .from('financial_records')
          .select('*')
          .eq('description', financialDescription)
          .single();

        if (error) {
          console.error('Error fetching existing financial record:', error);
        }
        
        if (existingFinancialRecord) {
          console.log('Updating existing financial record for health issue:', description);
          // Update the financial record
          await updateFinancialRecord.mutateAsync({
            id: existingFinancialRecord.id,
            amount: Math.round(parseFloat(formData.cost)),
            transaction_date: formData.date,
            description,
          });
        } else {
          console.log('Creating new financial record for health issue:', description);
          // Create a new financial record
          await createFinancialRecord.mutateAsync({
            transaction_type: 'Expense',
            category: 'Feed',
            amount: Math.round(parseFloat(formData.cost)),
            transaction_date: formData.date,
            animal_id: animalId,
            description,
          });
        }
      }
      
      setShowForm(false);
      setEditingRecord(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        feed_type: '',
        custom_feed_description: '',
        quantity: '',
        cost: '',
        source_of_feed: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error saving feeding record:', error);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    
    // Check if it's a custom mixed feed
    const isCustomMixed = record.feed_type.startsWith('Mixed Feed:');
    const customDescription = isCustomMixed ? record.feed_type.replace('Mixed Feed: ', '') : '';
    
    setFormData({
      date: record.date,
      feed_type: isCustomMixed ? 'Mixed Feed (Custom)' : record.feed_type,
      custom_feed_description: customDescription,
      quantity: record.quantity?.toString() || '',
      cost: record.cost?.toString() || '',
      source_of_feed: record.source_of_feed || '',
      notes: record.notes || '',
    });
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {editingRecord ? 'Edit Feeding Record' : 'Add Feeding Record'}
          </h3>
          <Button variant="outline" onClick={() => {
            setShowForm(false);
            setEditingRecord(null);
          }}>
            Cancel
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feed_type">Feed Type *</Label>
                <Select 
                  value={formData.feed_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, feed_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feed type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.feed_type === 'Mixed Feed (Custom)' && (
                <div className="space-y-2 p-4 bg-yellow-50 rounded-lg">
                  <Label htmlFor="custom_feed_description">Describe Your Feed Mix *</Label>
                  <Textarea
                    id="custom_feed_description"
                    value={formData.custom_feed_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, custom_feed_description: e.target.value }))}
                    placeholder="e.g., Napier + Dairy Meal + Molasses (2:1:0.5 ratio)"
                    required
                    rows={2}
                  />
                  <p className="text-xs text-yellow-700">
                    Describe the types of feed and proportions used in your mix
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="e.g., 25"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (KSh)</Label>
                  <Input      
                    id="cost"
                    type="number"
                    step="1"
                    value={formData.cost}
                    onChange={(e) => {
                    setFormData(prev => ({ ...prev, cost: e.target.value }));
                    }}
                    placeholder="e.g., 1500"
                  />
                </div>
              </div>

              {formData.cost && parseFloat(formData.cost) > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Cost: KSh {Math.round(parseFloat(formData.cost)).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    This will be automatically added to your Finance records
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="source_of_feed">Source/Supplier</Label>
                <Input
                  id="source_of_feed"
                  value={formData.source_of_feed}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_of_feed: e.target.value }))}
                  placeholder="e.g., Local supplier, Own production"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Additional notes about feeding..."
                />
              </div>

              <Button type="submit" disabled={createRecord.isPending || updateRecord.isPending} className="w-full">
                {createRecord.isPending || updateRecord.isPending 
                  ? (editingRecord ? 'Updating...' : 'Adding...') 
                  : (editingRecord ? 'Update Record' : 'Add Record')
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Feeding Records</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Loading feeding records...</p>
          </CardContent>
        </Card>
      ) : records && records.length > 0 ? (
        <div className="space-y-3">
          {records.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{format(new Date(record.date), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Wheat className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{record.feed_type}</span>
                    </div>
                    {record.quantity && <p className="text-sm"><strong>Quantity:</strong> {record.quantity} kg</p>}
                    {record.cost && <p className="text-sm"><strong>Cost:</strong> KSh {record.cost}</p>}
                    {record.source_of_feed && <p className="text-sm"><strong>Source:</strong> {record.source_of_feed}</p>}
                    {record.notes && <p className="text-sm text-gray-600 mt-2">{record.notes}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(record)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-center">No feeding records yet. Add the first one!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FeedingRecords;
