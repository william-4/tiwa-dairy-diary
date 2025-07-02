
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CheckSquare, Plus, Filter, Calendar, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTasks } from '@/hooks/useTasks';
import { useAnimals } from '@/hooks/useAnimals';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import PageHeader from '@/components/PageHeader';
import { format, isToday, isTomorrow, isAfter, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';

type TaskWithAnimal = Tables<'tasks'> & { 
  animals?: { name: string; tag: string | null } 
};

const Tasks = () => {
  const { t } = useLanguage();
  const { data: tasks = [], isLoading } = useTasks();
  const { data: animals = [] } = useAnimals();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithAnimal | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAnimal, setFilterAnimal] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by view mode
    const now = new Date();
    switch (viewMode) {
      case 'today':
        filtered = filtered.filter(task => isToday(new Date(task.due_date)));
        break;
      case 'week':
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.due_date);
          return taskDate >= weekStart && taskDate <= weekEnd;
        });
        break;
      case 'month':
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.due_date);
          return taskDate >= monthStart && taskDate <= monthEnd;
        });
        break;
    }

    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'overdue') {
        filtered = filtered.filter(task => 
          isAfter(now, new Date(task.due_date)) && task.status !== 'Done'
        );
      } else {
        filtered = filtered.filter(task => task.status === filterStatus);
      }
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Filter by animal
    if (filterAnimal !== 'all') {
      filtered = filtered.filter(task => task.animal_id === filterAnimal);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [tasks, viewMode, filterStatus, filterPriority, filterAnimal, searchTerm]);

  const taskStats = useMemo(() => {
    const now = new Date();
    const todayTasks = tasks.filter(task => isToday(new Date(task.due_date)));
    const overdueTasks = tasks.filter(task => 
      isAfter(now, new Date(task.due_date)) && task.status !== 'Done'
    );
    const upcomingTasks = tasks.filter(task => 
      isTomorrow(new Date(task.due_date)) || 
      (new Date(task.due_date) > now && !isToday(new Date(task.due_date)))
    );

    return {
      today: todayTasks.length,
      overdue: overdueTasks.length,
      upcoming: upcomingTasks.length,
      total: tasks.length
    };
  }, [tasks]);

  const handleEditTask = (task: TaskWithAnimal) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (showForm) {
    return <TaskForm task={editingTask} onClose={handleCloseForm} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="My Tasks" />
      
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-blue-600" />
              {t('tasks')} 📝
            </h1>
            <p className="text-gray-600 text-sm mt-1">Manage your daily farm tasks</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-pulse text-gray-600 mb-2">Loading your tasks...</div>
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{taskStats.today}</div>
                <div className="text-sm text-gray-600">Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
                <div className="text-sm text-gray-600">Overdue</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{taskStats.upcoming}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{taskStats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        {!isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">📅 Today</SelectItem>
                    <SelectItem value="week">📆 This Week</SelectItem>
                    <SelectItem value="month">🗓️ This Month</SelectItem>
                    <SelectItem value="all">📋 All Tasks</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">⏳ Pending</SelectItem>
                    <SelectItem value="Done">✅ Done</SelectItem>
                    <SelectItem value="overdue">🚨 Overdue</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="High">🔴 High</SelectItem>
                    <SelectItem value="Medium">🟠 Medium</SelectItem>
                    <SelectItem value="Low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterAnimal} onValueChange={setFilterAnimal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Related Cow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cows</SelectItem>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.name} {animal.tag ? `(${animal.tag})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="Search tasks by title, description, or assigned person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        {!isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Tasks ({filteredTasks.length})
                  {viewMode === 'today' && ' - Today'}
                  {viewMode === 'week' && ' - This Week'}
                  {viewMode === 'month' && ' - This Month'}
                </span>
                {taskStats.overdue > 0 && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{taskStats.overdue} overdue</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTasks.length > 0 ? (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                  <p className="text-sm mb-6">
                    {tasks.length === 0 
                      ? "You haven't added any tasks yet. Create your first task to get started!"
                      : "No tasks match your current filters. Try adjusting your search criteria."
                    }
                  </p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Tasks;
