
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Calendar, Heart, AlertCircle } from 'lucide-react';
import { useHealthRecords, useCreateHealthRecord, useUpdateHealthRecord } from '@/hooks/useHealthRecords';
import { format } from 'date-fns';

interface HealthRecordsProps {
  animalId: string;
}

const HealthRecords = ({ animalId }: HealthRecordsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    health_issue: '',
    treatment_given: '',
    vet_name: '',
    cost: '',
    vaccine_dewormer: '',
    recovery_status: '',
    next_appointment: '',
    notes: '',
  });

  const { data: records, isLoading } = useHealthRecords(animalId);
  const createRecord = useCreateHealthRecord();
  const updateRecord = useUpdateHealthRecord();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData = {
      animal_id: animalId,
      date: formData.date,
      health_issue: formData.health_issue || null,
      treatment_given: formData.treatment_given || null,
      vet_name: formData.vet_name || null,
      cost: formData.cost ? parseFloat(formData.cost) : null,
      vaccine_dewormer: formData.vaccine_dewormer || null,
      recovery_status: formData.recovery_status || null,
      next_appointment: formData.next_appointment || null,
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
        health_issue: '',
        treatment_given: '',
        vet_name: '',
        cost: '',
        vaccine_dewormer: '',
        recovery_status: '',
        next_appointment: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error saving health record:', error);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      health_issue: record.health_issue || '',
      treatment_given: record.treatment_given || '',
      vet_name: record.vet_name || '',
      cost: record.cost?.toString() || '',
      vaccine_dewormer: record.vaccine_dewormer || '',
      recovery_status: record.recovery_status || '',
      next_appointment: record.next_appointment || '',
      notes: record.notes || '',
    });
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {editingRecord ? 'Edit Health Record' : 'Add Health Record'}
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
                <Label htmlFor="health_issue">Health Issue or Diagnosis</Label>
                <Input
                  id="health_issue"
                  value={formData.health_issue}
                  onChange={(e) => setFormData(prev => ({ ...prev, health_issue: e.target.value }))}
                  placeholder="e.g., Mastitis, Fever, Lameness"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment_given">Treatment Given / Drug Name</Label>
                <Input
                  id="treatment_given"
                  value={formData.treatment_given}
                  onChange={(e) => setFormData(prev => ({ ...prev, treatment_given: e.target.value }))}
                  placeholder="e.g., Antibiotics, Pain medication"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vet_name">Vet Name (Optional)</Label>
                <Input
                  id="vet_name"
                  value={formData.vet_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, vet_name: e.target.value }))}
                  placeholder="Veterinarian name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost of Treatment (KSH)</Label>
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
                <Label htmlFor="vaccine_dewormer">Vaccination/Deworming Type</Label>
                <Input
                  id="vaccine_dewormer"
                  value={formData.vaccine_dewormer}
                  onChange={(e) => setFormData(prev => ({ ...prev, vaccine_dewormer: e.target.value }))}
                  placeholder="e.g., FMD vaccine, Albendazole"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recovery_status">Recovery Status</Label>
                <Select value={formData.recovery_status} onValueChange={(value) => setFormData(prev => ({ ...prev, recovery_status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fully recovered">Fully recovered</SelectItem>
                    <SelectItem value="Still sick">Still sick</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="next_appointment">Next Appointment Date</Label>
                <Input
                  id="next_appointment"
                  type="date"
                  value={formData.next_appointment}
                  onChange={(e) => setFormData(prev => ({ ...prev, next_appointment: e.target.value }))}
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
        <h3 className="text-lg font-semibold">Health Records</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Loading health records...</p>
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
                      {record.recovery_status === 'Still sick' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      {record.recovery_status === 'Fully recovered' && (
                        <Heart className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {record.health_issue && <p className="text-sm"><strong>Issue:</strong> {record.health_issue}</p>}
                    {record.treatment_given && <p className="text-sm"><strong>Treatment:</strong> {record.treatment_given}</p>}
                    {record.vet_name && <p className="text-sm"><strong>Vet:</strong> {record.vet_name}</p>}
                    {record.vaccine_dewormer && <p className="text-sm"><strong>Vaccine/Dewormer:</strong> {record.vaccine_dewormer}</p>}
                    {record.cost && <p className="text-sm"><strong>Cost:</strong> KSH {record.cost}</p>}
                    {record.recovery_status && (
                      <p className="text-sm">
                        <strong>Status:</strong> 
                        <span className={`ml-1 ${
                          record.recovery_status === 'Fully recovered' ? 'text-green-600' :
                          record.recovery_status === 'Still sick' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {record.recovery_status}
                        </span>
                      </p>
                    )}
                    {record.next_appointment && (
                      <p className="text-sm text-blue-600">
                        <strong>Next Appointment:</strong> {format(new Date(record.next_appointment), 'PPP')}
                      </p>
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
            <p className="text-gray-500 text-center">No health records yet. Add the first one!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthRecords;
