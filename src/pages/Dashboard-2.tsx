import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTasks } from '@/hooks/useTasks';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import FeedingRecords from '@/components/records/FeedingRecords';
import HealthRecords from '@/components/records/HealthRecords';
import { ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useAnimals } from '@/hooks/useAnimals';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

const Dashboard2 = () => {
  const { t } = useLanguage();
  const { data: tasks = [], refetch: refetchTasks } = useTasks();
  const { data: animals = [] } = useAnimals();

  // State for task form modal
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // State for filters
  const [timeFilter, setTimeFilter] = useState('Week');
  const [categoryFilter, setCategoryFilter] = useState('vaccine');
  const [subCategoryFilter, setSubCategoryFilter] = useState('milk');

  // State for new task input
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Filtered tasks based on category filter
  const filteredTasks = tasks.filter(task => {
    if (!categoryFilter) return true;
    return task.title.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  // Dummy data for score index gauge (replace with real data)
  const scoreIndex = 75;

  // Dummy data for milk liters graph (replace with real data)
  const milkData = [
    { name: '80', milk: 90 },
    { name: 'P2', milk: 120 },
    { name: '12', milk: 130 },
    { name: '13', milk: 110 },
    { name: '12', milk: 140 },
    { name: '14', milk: 135 },
  ];

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
    setNewTaskTitle('');
    refetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4 max-w-md mx-auto">
      {/* Score Index Gauge */}
      <Card className="mb-4">
        <CardContent className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-green-300 relative flex items-center justify-center">
            <div
              className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-green-600"
              style={{ clip: 'rect(0px, 96px, 96px, 48px)', transform: `rotate(${(scoreIndex / 100) * 180}deg)` }}
            />
            <div className="text-center text-gray-600">
              <div>Daily target</div>
              <div className="text-green-700 font-bold text-lg">Score Index</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My task / updates */}
      <Card className="mb-4 p-4">
        <CardTitle className="font-bold mb-2">My task / <u>updates</u></CardTitle>
        <div className="space-y-2">
          {filteredTasks.slice(0, 4).map(task => (
            <div key={task.id} className="flex items-center gap-2">
              <Checkbox checked={task.status === 'Done'} disabled />
              <span className={`flex-1 ${task.status === 'Done' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Add task/reminder input */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add task/reminder here."
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          className="flex-1"
        />
        <Select onValueChange={setNewTaskDate} value={newTaskDate} defaultValue={newTaskDate}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={format(new Date(), 'yyyy-MM-dd')}>Today</SelectItem>
            {/* Add more date options as needed */}
          </SelectContent>
        </Select>
        <Button onClick={handleAddTask} className="bg-green-600 hover:bg-green-700">Add</Button>
      </div>

      {/* Time filter and Milk in Ltrs label */}
      <div className="flex justify-between items-center mb-2">
      <Select onValueChange={setTimeFilter} value={timeFilter} defaultValue={timeFilter}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Week">Week</SelectItem>
          <SelectItem value="Monthly">Monthly</SelectItem>
          <SelectItem value="Yearly">Yearly</SelectItem>
        </SelectContent>
      </Select>
        <div className="font-semibold">Milk In Ltrs</div>
      </div>

      {/* Milk liters graph */}
      <Card className="mb-4">
        <ChartContainer
          config={{
            milk: { color: '#34D399', label: 'Milk' },
          }}
        >
          {/* Implement the actual chart here using Recharts components */}
          {/* Placeholder for graph */}
          <div className="text-center text-gray-500 py-10">Milk liters graph here</div>
        </ChartContainer>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <Input placeholder="Filter/cow/vaccine/feed/date 🔍" className="flex-1" />
      <Select onValueChange={setCategoryFilter} value={categoryFilter} defaultValue={categoryFilter}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vaccine">vaccine</SelectItem>
          <SelectItem value="milk">milk</SelectItem>
          <SelectItem value="feed">feed</SelectItem>
        </SelectContent>
      </Select>
      </div>

      {/* Task list with icons and update button */}
      <div className="space-y-4 mb-4">
        {filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={(task) => {
            setEditingTask(task);
            setShowTaskForm(true);
          }} />
        ))}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
        <Button variant="default" className="flex flex-col items-center gap-1 bg-green-700 text-white">
          <span>🐝</span>
          <span>Dashboard</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <span>🐄</span>
          <span>Cows</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <span>📋</span>
          <span>Records</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <span>✔️</span>
          <span>Settings</span>
        </Button>
      </div>

      {/* Task form modal */}
      {showTaskForm && (
        <TaskForm task={editingTask} onClose={handleTaskFormClose} />
      )}
    </div>
  );
};

export default Dashboard2;
