
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, Upload, Image } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAnimals } from '@/hooks/useAnimals';
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { Tables } from '@/integrations/supabase/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  assigned_to: z.string().optional(),
  animal_id: z.string().optional(),
  due_date: z.date(),
  due_time: z.string().optional(),
  priority: z.enum(['High', 'Medium', 'Low']),
  reminder_enabled: z.boolean(),
  reminder_date: z.date().optional(),
  reminder_time: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Tables<'tasks'>;
  onClose: () => void;
}

const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const { data: animals = [] } = useAnimals();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(task?.photo_url || null);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      assigned_to: task?.assigned_to || '',
      animal_id: task?.animal_id || '',
      due_date: task?.due_date ? new Date(task.due_date) : new Date(),
      due_time: task?.due_time || '',
      priority: (task?.priority as 'High' | 'Medium' | 'Low') || 'Medium',
      reminder_enabled: task?.reminder_enabled || false,
      reminder_date: task?.reminder_date ? new Date(task.reminder_date) : undefined,
      reminder_time: task?.reminder_time || '',
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const onSubmit = async (data: TaskFormData) => {
    console.log('Submitting task form with data:', data);
    
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        assigned_to: data.assigned_to,
        animal_id: data.animal_id || null,
        due_date: format(data.due_date, 'yyyy-MM-dd'),
        due_time: data.due_time || null,
        priority: data.priority,
        reminder_enabled: data.reminder_enabled,
        reminder_date: data.reminder_date ? format(data.reminder_date, 'yyyy-MM-dd') : null,
        reminder_time: data.reminder_time || null,
        photo_url: photoPreview || null, // For now, just store the preview URL
      };

      if (task) {
        console.log('Updating existing task:', task.id);
        await updateTask.mutateAsync({ id: task.id, ...taskData });
      } else {
        console.log('Creating new task');
        await createTask.mutateAsync(taskData);
      }
      
      console.log('Task saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl">
          {task ? 'Edit Task' : 'Add New Task'} 📝
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title (e.g., Feed cattle, Vet checkup)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assigned_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To 🧑🏽‍🌾</FormLabel>
                  <FormControl>
                    <Input placeholder="Worker name (e.g., Wanjiku, John)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date * 📅</FormLabel>
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
                            date < new Date(new Date().setDate(new Date().getDate() - 1))
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time (Optional) ⏰</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority 📌</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="High">🔴 High</SelectItem>
                      <SelectItem value="Medium">🟠 Medium</SelectItem>
                      <SelectItem value="Low">🟢 Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about the task..." 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo Upload Section */}
            <div className="space-y-2">
              <FormLabel>Photo (Optional) 📸</FormLabel>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  Choose Photo
                </label>
                {photoPreview && (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Task photo preview"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                        onClick={removePhoto}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="reminder_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Set Reminder 🔔</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Get notified before the task is due
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('reminder_enabled') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reminder_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Reminder Date</FormLabel>
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
                                <span>Pick reminder date</span>
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
                              date < new Date() || date > form.getValues('due_date')
                            }
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reminder_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={createTask.isPending || updateTask.isPending}
              >
                {createTask.isPending || updateTask.isPending 
                  ? 'Saving...' 
                  : task ? 'Update Task' : 'Create Task'
                }
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
