
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, Milk, Utensils, Stethoscope, Heart, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useGeneralHerdRecords, useCreateGeneralHerdRecord, useDeleteGeneralHerdRecord } from '@/hooks/useGeneralHerdRecords';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const GeneralHerdSummary = () => {
  const { toast } = useToast();
  const { data: records = [], isLoading } = useGeneralHerdRecords();
  const createRecord = useCreateGeneralHerdRecord();
  const deleteRecord = useDeleteGeneralHerdRecord();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    record_type: '',
    title: '',
    description: '',
    total_production: '',
    total_animals_affected: '',
    cost: '',
    notes: ''
  });

  const recordTypes = [
    { value: 'production', label: 'Production', icon: Milk, color: 'bg-blue-100 text-blue-800' },
    { value: 'feeding', label: 'Feeding', icon: Utensils, color: 'bg-green-100 text-green-800' },
    { value: 'health', label: 'Health', icon: Stethoscope, color: 'bg-red-100 text-red-800' },
    { value: 'breeding', label: 'Breeding', icon: Heart, color: 'bg-pink-100 text-pink-800' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.record_type || !formData.title) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createRecord.mutateAsync({
        date: formData.date,
        record_type: formData.record_type,
        title: formData.title,
        description: formData.description || null,
        total_production: formData.total_production ? Number(formData.total_production) : null,
        total_animals_affected: formData.total_animals_affected ? Number(formData.total_animals_affected) : null,
        cost: formData.cost ? Math.round(Number(formData.cost)) : null,
        notes: formData.notes || null
      });

      toast({
        title: "Success",
        description: "Herd record added successfully",
      });

      setShowForm(false);
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        record_type: '',
        title: '',
        description: '',
        total_production: '',
        total_animals_affected: '',
        cost: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add herd record",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord.mutateAsync(id);
        toast({
          title: "Success",
          description: "Record deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete record",
          variant: "destructive",
        });
      }
    }
  };

  const getRecordTypeInfo = (type: string) => {
    return recordTypes.find(rt => rt.value === type) || recordTypes[0];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">General Herd Summary</h2>
          <p className="text-gray-600 text-sm">Record activities affecting your entire herd</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-green-600 hover:bg-green-700"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {/* Add Record Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Herd Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="record_type">Record Type *</Label>
                  <Select value={formData.record_type} onValueChange={(value) => setFormData({ ...formData, record_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {recordTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Daily milk production, Herd vaccination"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the activity"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.record_type === 'production' && (
                  <div>
                    <Label htmlFor="total_production">Total Production (L)</Label>
                    <Input
                      id="total_production"
                      type="number"
                      step="0.1"
                      value={formData.total_production}
                      onChange={(e) => setFormData({ ...formData, total_production: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="total_animals_affected">Animals Affected</Label>
                  <Input
                    id="total_animals_affected"
                    type="number"
                    value={formData.total_animals_affected}
                    onChange={(e) => setFormData({ ...formData, total_animals_affected: e.target.value })}
                    placeholder="Number of animals"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cost">Cost (KSh)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="1"
                    value={formData.cost}
                    onChange={(e) => {
                      const value = Math.round(parseFloat(e.target.value) || 0).toString();
                      setFormData({ ...formData, cost: value });
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional observations or notes"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createRecord.isPending}>
                  {createRecord.isPending ? 'Adding...' : 'Add Record'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Records List */}
      {records.length > 0 ? (
        <div className="space-y-3">
          {records.map((record) => {
            const typeInfo = getRecordTypeInfo(record.record_type);
            const Icon = typeInfo.icon;
            
            return (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{record.title}</h4>
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </div>
                        
                        {record.description && (
                          <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(record.date), 'MMM dd, yyyy')}
                          </span>
                          {record.total_animals_affected && (
                            <span>{record.total_animals_affected} animals</span>
                          )}
                          {record.cost && (
                            <span>KSh {Number(record.cost).toLocaleString()}</span>
                          )}
                          {record.total_production && (
                            <span>{record.total_production}L produced</span>
                          )}
                        </div>
                        
                        {record.notes && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 md:p-12 text-center">
            <Calendar className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No herd records yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Start recording general activities that affect your entire herd.
            </p>
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add First Record
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeneralHerdSummary;
