
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Calendar } from 'lucide-react';
import { useFeedingRecords, useCreateFeedingRecord, useUpdateFeedingRecord } from '@/hooks/useFeedingRecords';
import { format } from 'date-fns';

interface FeedingRecordsProps {
  animalId: string;
}

const FeedingRecords = ({ animalId }: FeedingRecordsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    feed_type: '',
    quantity: '',
    source_of_feed: '',
    cost: '',
    notes: '',
    custom_mix_description: '',
  });

  const { data: records, isLoading } = useFeedingRecords(animalId);
  const createRecord = useCreateFeedingRecord();
  const updateRecord = useUpdateFeedingRecord();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalFeedType = formData.feed_type;
    let finalNotes = formData.notes;

    // If Mixed Feed is selected, combine the description with notes
    if (formData.feed_type === 'Mixed Feed (Custom)' && formData.custom_mix_description) {
      finalNotes = `Mixed Feed: ${formData.custom_mix_description}${formData.notes ? '\n' + formData.notes : ''}`;
    }

    const recordData = {
      animal_id: animalId,
      date: formData.date,
      feed_type: finalFeedType,
      quantity: formData.quantity ? parseFloat(formData.quantity) : null,
      source_of_feed: formData.source_of_feed || null,
      cost: formData.cost ? parseFloat(formData.cost) : null,
      notes: finalNotes || null,
    };

    try {
      if (editingRecord) {
        await updateRecord.mutateAsync({ id: editingRecord.id, ...recordData });
      } else {
        await createRecord.mutateAsync(recordData);
      }
      
      setShowForm(false);
      setEditingRecord(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        feed_type: '',
        quantity: '',
        source_of_feed: '',
        cost: '',
        notes: '',
        custom_mix_description: '',
      });
    } catch (error) {
      console.error('Error saving feeding record:', error);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    
    // Parse mixed feed description from notes if it exists
    let customMixDescription = '';
    let regularNotes = record.notes || '';
    
    if (record.feed_type === 'Mixed Feed (Custom)' && record.notes) {
      const mixMatch = record.notes.match(/^Mixed Feed: (.+?)(?:\n(.+))?$/);
      if (mixMatch) {
        customMixDescription = mixMatch[1];
        regularNotes = mixMatch[2] || '';
      }
    }
    
    setFormData({
      date: record.date,
      feed_type: record.feed_type,
      quantity: record.quantity?.toString() || '',
      source_of_feed: record.source_of_feed || '',
      cost: record.cost?.toString() || '',
      notes: regularNotes,
      custom_mix_description: customMixDescription,
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
                <Select value={formData.feed_type} onValueChange={(value) => setFormData(prev => ({ ...prev, feed_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feed type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Napier">Napier</SelectItem>
                    <SelectItem value="Dairy Meal">Dairy Meal</SelectItem>
                    <SelectItem value="Silage">Silage</SelectItem>
                    <SelectItem value="Hay">Hay</SelectItem>
                    <SelectItem value="Mixed Feed (Custom)">Mixed Feed (Custom)</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.feed_type === 'Mixed Feed (Custom)' && (
                <div className="space-y-2">
                  <Label htmlFor="custom_mix_description">Describe Your Feed Mix *</Label>
                  <Textarea
                    id="custom_mix_description"
                    value={formData.custom_mix_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, custom_mix_description: e.target.value }))}
                    placeholder="e.g., Napier + Dairy Meal + Molasses, or 2kg Hay + 1kg Silage"
                    rows={2}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source_of_feed">Feed Source</Label>
                <Input
                  id="source_of_feed"
                  value={formData.source_of_feed}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_of_feed: e.target.value }))}
                  placeholder="e.g., Own farm, Market, Supplier name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost (KSH)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  placeholder="Enter cost"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Any other notes about this feeding..."
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
                    <p className="text-sm"><strong>Feed Type:</strong> {record.feed_type}</p>
                    {record.quantity && <p className="text-sm"><strong>Quantity:</strong> {record.quantity} kg</p>}
                    {record.source_of_feed && <p className="text-sm"><strong>Source:</strong> {record.source_of_feed}</p>}
                    {record.cost && <p className="text-sm"><strong>Cost:</strong> KSH {record.cost}</p>}
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
