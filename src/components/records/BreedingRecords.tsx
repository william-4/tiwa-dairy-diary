
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Calendar, Baby, Heart, Zap } from 'lucide-react';
import { useBreedingRecords, useCreateBreedingRecord, useUpdateBreedingRecord } from '@/hooks/useBreedingRecords';
import { format } from 'date-fns';
import { useCreateFinancialRecord, useUpdateFinancialRecord } from '@/hooks/useFinancialRecords';
import { supabase } from '@/integrations/supabase/client';

interface BreedingRecordsProps {
  animalId: string;
}

const BreedingRecords = ({ animalId }: BreedingRecordsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    date_of_heat: '',
    date_served: '',
    mating_method: '',
    bull_ai_source: '',
    conception_status: '',
    pregnancy_confirmation_date: '',
    expected_calving_date: '',
    actual_calving_date: '',
    notes: '',
    cost:'',
    steaming_date: '',
    observation_date: '',
  });

  const { data: records, isLoading } = useBreedingRecords(animalId);
  const createRecord = useCreateBreedingRecord();
  const updateRecord = useUpdateBreedingRecord();
  const createFinancialRecord = useCreateFinancialRecord();
  const updateFinancialRecord = useUpdateFinancialRecord();
  const [financialDescription, setFinancialDescription] = useState<string | null>(null);
  

  // Calculate expected calving date when date_served changes
  const calculateExpectedCalvingDate = (dateServed: string) => {
    if (!dateServed) return '';
    const servedDate = new Date(dateServed);
    const calvingDate = new Date(servedDate.getTime() + (283 * 24 * 60 * 60 * 1000)); // 283 days
    return calvingDate.toISOString().split('T')[0];
  };

  const handleDateServedChange = (dateServed: string) => {
    setFormData(prev => ({
      ...prev,
      date_served: dateServed,
      expected_calving_date: calculateExpectedCalvingDate(dateServed)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData = {
      animal_id: animalId,
      date_of_heat: formData.date_of_heat || null,
      date_served: formData.date_served || null,
      mating_method: formData.mating_method || null,
      bull_ai_source: formData.bull_ai_source || null,
      conception_status: formData.conception_status || null,
      pregnancy_confirmation_date: formData.pregnancy_confirmation_date || null,
      expected_calving_date: formData.expected_calving_date || null,
      actual_calving_date: formData.actual_calving_date || null,
      notes: formData.notes || null,
      cost: formData.cost ? Math.round(parseFloat(formData.cost)) : null,
      steaming_date: formData.steaming_date || null,
      observation_date: formData.observation_date || null,
    };

    try {
      let breedingRecordId: string;

      if (editingRecord) {
        await updateRecord.mutateAsync({ id: editingRecord.id, ...recordData });
        breedingRecordId= editingRecord.id;
      } else {
        const created = await createRecord.mutateAsync(recordData);
        breedingRecordId = created.id;
      }

      // Use breedingRecordId as unique identifier in financial record description
      if (formData.cost && parseFloat(formData.cost) > 0) {
        const description = `BreedingRecord:${breedingRecordId}`;
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
          console.log('Updating existing financial record for breeding expense:', description);
          // Update the financial record
          await updateFinancialRecord.mutateAsync({
            id: existingFinancialRecord.id,
            amount: Math.round(parseFloat(formData.cost)),
            transaction_date: existingFinancialRecord.created_at,
            description,
          });
        } else {
          console.log('Creating new financial record for breeding expense:', description);
          // Create a new financial record
          await createFinancialRecord.mutateAsync({
            transaction_type: 'Expense',
            category: 'Breeding',
            amount: Math.round(parseFloat(formData.cost)),
            transaction_date: new Date().toISOString().split('T')[0],
            animal_id: animalId,
            description,
          });
        }
      }
      
      setShowForm(false);
      setEditingRecord(null);
      setFormData({
        date_of_heat: '',
        date_served: '',
        mating_method: '',
        bull_ai_source: '',
        conception_status: '',
        pregnancy_confirmation_date: '',
        expected_calving_date: '',
        actual_calving_date: '',
        notes: '',
        cost: '',
        steaming_date: '',
        observation_date: '',
      });
    } catch (error) {
      console.error('Error saving breeding record:', error);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      date_of_heat: record.date_of_heat || '',
      date_served: record.date_served || '',
      mating_method: record.mating_method || '',
      bull_ai_source: record.bull_ai_source || '',
      conception_status: record.conception_status || '',
      pregnancy_confirmation_date: record.pregnancy_confirmation_date || '',
      expected_calving_date: record.expected_calving_date || '',
      actual_calving_date: record.actual_calving_date || '',
      notes: record.notes || '',
      cost: record.cost || '',
      steaming_date: record.steaming_date || '',
      observation_date: record.observation_date || '',
    });
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {editingRecord ? 'Edit Breeding Record' : 'Add Breeding Record'}
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
                <Label htmlFor="date_of_heat">Date of Heat</Label>
                <Input
                  id="date_of_heat"
                  type="date"
                  value={formData.date_of_heat}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_of_heat: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_served">Date Served (AI/Bull Service) *</Label>
                <Input
                  id="date_served"
                  type="date"
                  value={formData.date_served}
                  onChange={(e) => handleDateServedChange(e.target.value)}
                />
                <p className="text-xs text-gray-500">This will auto-calculate the expected calving date</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mating_method">Mating Method</Label>
                <Select value={formData.mating_method} onValueChange={(value) => setFormData(prev => ({ ...prev, mating_method: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mating method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Natural">Natural</SelectItem>
                    <SelectItem value="AI">Artificial Insemination (AI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bull_ai_source">Bull/AI Source</Label>
                <Input
                  id="bull_ai_source"
                  value={formData.bull_ai_source}
                  onChange={(e) => setFormData(prev => ({ ...prev, bull_ai_source: e.target.value }))}
                  placeholder="Bull name or AI source"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conception_status">Conception Status</Label>
                <Select value={formData.conception_status} onValueChange={(value) => setFormData(prev => ({ ...prev, conception_status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmed Pregnant">Confirmed Pregnant</SelectItem>
                    <SelectItem value="Not Pregnant">Not Pregnant</SelectItem>
                    <SelectItem value="Waiting">Waiting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pregnancy_confirmation_date">Pregnancy Test Date</Label>
                <Input
                  id="pregnancy_confirmation_date"
                  type="date"
                  value={formData.pregnancy_confirmation_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, pregnancy_confirmation_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_calving_date">Expected Calving Date</Label>
                <Input
                  id="expected_calving_date"
                  type="date"
                  value={formData.expected_calving_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, expected_calving_date: e.target.value }))}
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Auto-calculated based on date served (283 days)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actual_calving_date">Actual Calving Date</Label>
                <Input
                  id="actual_calving_date"
                  type="date"
                  value={formData.actual_calving_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, actual_calving_date: e.target.value }))}
                />
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

              <div className="space-y-2">
                <Label htmlFor="steaming_date">Steaming Date</Label>
                <Input
                  id="steaming_date"
                  type="date"
                  value={formData.steaming_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, steaming_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observation_date">Observation Date</Label>
                <Input
                  id="observation_date"
                  type="date"
                  value={formData.observation_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, observation_date: e.target.value }))}
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
        <h3 className="text-lg font-semibold">Breeding Records</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Loading breeding records...</p>
          </CardContent>
        </Card>
      ) : records && records.length > 0 ? (
        <div className="space-y-3">
          {records.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {record.date_of_heat && (
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="font-medium">Heat: {format(new Date(record.date_of_heat), 'PPP')}</span>
                      </div>
                    )}
                    {record.date_served && (
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Served: {format(new Date(record.date_served), 'PPP')}</span>
                      </div>
                    )}
                    {record.mating_method && <p className="text-sm"><strong>Method:</strong> {record.mating_method}</p>}
                    {record.bull_ai_source && <p className="text-sm"><strong>Source:</strong> {record.bull_ai_source}</p>}
                    {record.conception_status && (
                      <p className="text-sm">
                        <strong>Status:</strong> 
                        <span className={`ml-1 ${
                          record.conception_status === 'Confirmed Pregnant' ? 'text-green-600' :
                          record.conception_status === 'Not Pregnant' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {record.conception_status}
                        </span>
                      </p>
                    )}
                    {record.pregnancy_confirmation_date && (
                      <p className="text-sm">
                        <strong>Test Date:</strong> {format(new Date(record.pregnancy_confirmation_date), 'PPP')}
                      </p>
                    )}
                    {record.expected_calving_date && (
                      <div className="flex items-center gap-1">
                        <Baby className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">
                          <strong>Expected:</strong> {format(new Date(record.expected_calving_date), 'PPP')}
                        </span>
                      </div>
                    )}
                    {record.actual_calving_date && (
                      <div className="flex items-center gap-1">
                        <Baby className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          <strong>Calved:</strong> {format(new Date(record.actual_calving_date), 'PPP')}
                        </span>
                      </div>
                    )}
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
            <p className="text-gray-500 text-center">No breeding records yet. Add the first one!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BreedingRecords;
