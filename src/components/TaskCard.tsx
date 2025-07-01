
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Cow, Edit, Trash2, Check } from 'lucide-react';
import { format, isAfter, isToday, isTomorrow } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';
import { useUpdateTask, useDeleteTask } from '@/hooks/useTasks';

type TaskWithAnimal = Tables<'tasks'> & { 
  animals?: { name: string; tag: string | null } 
};

interface TaskCardProps {
  task: TaskWithAnimal;
  onEdit: (task: TaskWithAnimal) => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟠';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  const getDateLabel = (date: string) => {
    const taskDate = new Date(date);
    if (isToday(taskDate)) return 'Today';
    if (isTomorrow(taskDate)) return 'Tomorrow';
    return format(taskDate, 'MMM d, yyyy');
  };

  const isOverdue = isAfter(new Date(), new Date(task.due_date)) && task.status !== 'Done';

  const handleMarkDone = async () => {
    await updateTask.mutateAsync({
      id: task.id,
      status: task.status === 'Done' ? 'Pending' : 'Done'
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask.mutateAsync(task.id);
    }
  };

  return (
    <Card className={`mb-3 ${isOverdue ? 'border-red-300' : ''} ${task.status === 'Done' ? 'opacity-70' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${task.status === 'Done' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            {task.status === 'Done' && <Check className="h-4 w-4 text-green-600" />}
          </div>
          <Badge className={getPriorityColor(task.priority)}>
            {getPriorityIcon(task.priority)} {task.priority}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {getDateLabel(task.due_date)}
              {isOverdue && ' (Overdue)'}
            </span>
            {task.due_time && (
              <>
                <Clock className="h-4 w-4 ml-2" />
                <span>{task.due_time}</span>
              </>
            )}
          </div>

          {task.assigned_to && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Assigned to: {task.assigned_to}</span>
            </div>
          )}

          {task.animals && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Cow className="h-4 w-4" />
              <span>
                Related to: {task.animals.name}
                {task.animals.tag && ` (${task.animals.tag})`}
              </span>
            </div>
          )}

          {task.description && (
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {task.description}
            </p>
          )}

          {task.reminder_enabled && task.reminder_date && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <span>🔔 Reminder: {format(new Date(task.reminder_date), 'MMM d')} 
                {task.reminder_time && ` at ${task.reminder_time}`}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={task.status === 'Done' ? 'outline' : 'default'}
            onClick={handleMarkDone}
            disabled={updateTask.isPending}
          >
            {task.status === 'Done' ? 'Mark Pending' : 'Mark Done'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
