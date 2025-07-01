
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Calendar, Milk } from 'lucide-react';
import { useProductionRecords, useCreateProductionRecord, useUpdateProductionRecord } from '@/hooks/useProductionRecords';
import { format } from 'date-fns';

interface ProductionRecordsProps {
  animalId: string;
}

const ProductionRecords = ({ animalId }: ProductionRecordsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    am_yield: '',
    pm_yield: '',
    use_type: '',
    notes: '',
  });

  const { data: records, isLoading } = useProductionRecords(animalId);
  const createRecord = useCreateProductionRecord();
  const updateRecord = useUpdateProductionRecord();

  const calculateTotal = () => {
    const am = parseFloat(formData.am_yield) || 0;
    const pm = parseFloat(formData.pm_yield) || 0;
    return am + pm;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData = {
      animal_id: animalId,
      date: formData.date,
      am_yield: formData.am_yield ? parseFloat(formData.am_yield) : null,
      pm_yield: formData.pm_yield ? parseFloat(formData.pm_yield) : null,
      use_type: formData.use_type || null,
      notes: formData.notes || null,
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
        am_yield: '',
        pm_yield: '',
        use_type: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error saving production record:', error);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      am_yield: record.am_yield?.toString() || '',
      pm_yield: record.pm_yield?.toString() || '',
      use_type: record.use_type || '',
      notes: record.notes || '',
    });
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {editingRecord ? 'Edit Production Record' : 'Add Production Record'}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="am_yield">AM Yield (Litres)</Label>
                  <Input
                    id="am_yield"
                    type="number"
                    step="0.1"
                    value={formData.am_yield}
                    onChange={(e) => setFormData(prev => ({ ...prev, am_yield: e.target.value }))}
                    placeholder="Morning yield"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pm_yield">PM Yield (Litres)</Label>
                  <Input
                    id="pm_yield"
                    type="number"
                    step="0.1"
                    value={formData.pm_yield}
                    onChange={(e) => setFormData(prev => ({ ...prev, pm_yield: e.target.value }))}
                    placeholder="Evening yield"
                  />
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Total: {calculateTotal().toFixed(1)} Litres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="use_type">Use</Label>
                <Select value={formData.use_type} onValueChange={(value) => setFormData(prev => ({ ...prev, use_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select use" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Calf">Calf</SelectItem>
                    <SelectItem value="Home use">Home use</SelectItem>
                    <SelectItem value="Spoiled">Spoiled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Additional notes..."
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
        <h3 className="text-lg font-semibold">Milk Production Records</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Loading production records...</p>
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
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Milk className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">AM: {record.am_yield || 0}L</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Milk className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">PM: {record.pm_yield || 0}L</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-green-600">Total: {record.total_yield || 0}L</p>
                    {record.use_type && <p className="text-sm"><strong>Use:</strong> {record.use_type}</p>}
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
            <p className="text-gray-500 text-center">No production records yet. Add the first one!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionRecords;
