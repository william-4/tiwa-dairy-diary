import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Calendar, Building2 } from 'lucide-react';
import { format } from 'date-fns';

interface GeneralRecord {
  id: string;
  date: string;
  activity_type: string;
  quantity?: number;
  notes?: string;
  photo_url?: string;
}

const GeneralDairyRecords = () => {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<GeneralRecord[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    activity_type: '',
    quantity: '',
    notes: '',
  });

  const activityTypes = [
    'Total Feed to Herd',
    'Total Milk Collected',
    'Barn Cleaning',
    'General Vet Visit',
    'Equipment Maintenance',
    'Staff Training',
    'Farm Inspection',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: GeneralRecord = {
      id: Date.now().toString(),
      date: formData.date,
      activity_type: formData.activity_type,
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      notes: formData.notes || undefined,
    };

    setRecords(prev => [newRecord, ...prev]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      activity_type: '',
      quantity: '',
      notes: '',
    });
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add General Dairy Record</h3>
          <Button variant="outline" onClick={() => setShowForm(false)}>
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
                <Label htmlFor="activity_type">Activity Type *</Label>
                <Select 
                  value={formData.activity_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, activity_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (if applicable)</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="e.g., 50 (for litres, kg, etc.)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Additional details about this activity..."
                />
              </div>

              <Button type="submit" className="w-full">
                Add Record
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
        <h3 className="text-lg font-semibold">General Dairy Records</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>
      
      {records.length > 0 ? (
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
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{record.activity_type}</span>
                    </div>
                    {record.quantity && (
                      <p className="text-sm"><strong>Quantity:</strong> {record.quantity}</p>
                    )}
                    {record.notes && (
                      <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-center">No general dairy records yet. Add the first one!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeneralDairyRecords;
