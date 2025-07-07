
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Bell, CheckCircle, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useReminders, useCreateReminder, useUpdateReminder, useCompleteReminder } from '@/hooks/useReminders';
import { useAnimals } from '@/hooks/useAnimals';
import { format } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';

type Reminder = Tables<'reminders'>;

const Reminders = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminder_type: '',
    due_date: '',
    animal_id: '',
    is_recurring: false,
    recurring_interval: 0,
  });

  const { data: reminders = [], isLoading } = useReminders();
  const { data: animals = [] } = useAnimals();
  const createReminder = useCreateReminder();
  const updateReminder = useUpdateReminder();
  const completeReminder = useCompleteReminder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createReminder.mutateAsync({
        title: formData.title,
        description: formData.description || null,
        reminder_type: formData.reminder_type,
        due_date: formData.due_date,
        animal_id: formData.animal_id || null,
        is_recurring: formData.is_recurring,
        recurring_interval: formData.is_recurring ? formData.recurring_interval : null,
      });
      
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        reminder_type: '',
        due_date: '',
        animal_id: '',
        is_recurring: false,
        recurring_interval: 0,
      });
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  const handleComplete = async (id: string) => {
    await completeReminder.mutateAsync(id);
  };

  const getReminderTypeColor = (type: string) => {
    switch (type) {
      case 'Deworming': return 'bg-blue-100 text-blue-800';
      case 'Heat Detection': return 'bg-pink-100 text-pink-800';
      case 'Dry-off': return 'bg-yellow-100 text-yellow-800';
      case 'Calving': return 'bg-green-100 text-green-800';
      case 'Payment': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', color: 'text-red-600', icon: AlertCircle };
    if (diffDays === 0) return { status: 'today', color: 'text-orange-600', icon: Clock };
    if (diffDays <= 3) return { status: 'soon', color: 'text-yellow-600', icon: Clock };
    return { status: 'upcoming', color: 'text-gray-600', icon: Calendar };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🔔 Reminders</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reminders set yet. Create your first reminder!</p>
            </CardContent>
          </Card>
        ) : (
          reminders.map((reminder) => {
            const urgency = getUrgencyStatus(reminder.due_date);
            const UrgencyIcon = urgency.icon;
            
            return (
              <Card key={reminder.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{reminder.title}</h3>
                        <Badge className={getReminderTypeColor(reminder.reminder_type)}>
                          {reminder.reminder_type}
                        </Badge>
                        {reminder.is_recurring && (
                          <Badge variant="outline" className="text-xs">
                            Recurring
                          </Badge>
                        )}
                      </div>
                      
                      {reminder.description && (
                        <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className={`flex items-center gap-1 ${urgency.color}`}>
                          <UrgencyIcon className="h-4 w-4" />
                          <span>{format(new Date(reminder.due_date), 'MMM d, yyyy')}</span>
                        </div>
                        
                        {reminder.animal_id && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <span>🐄</span>
                            <span>
                              {animals.find(a => a.id === reminder.animal_id)?.name || 'Unknown Animal'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleComplete(reminder.id)}
                      className="ml-4"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Reminder Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Deworm all cattle"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder_type">Type *</Label>
              <Select 
                value={formData.reminder_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, reminder_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deworming">Deworming</SelectItem>
                  <SelectItem value="Heat Detection">Heat Detection</SelectItem>
                  <SelectItem value="Dry-off">Dry-off</SelectItem>
                  <SelectItem value="Calving">Calving</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="animal_id">Related Animal (Optional)</Label>
              <Select 
                value={formData.animal_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, animal_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an animal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific animal</SelectItem>
                  {animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.name} {animal.tag ? `(${animal.tag})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={createReminder.isPending}>
                Add Reminder
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reminders;
