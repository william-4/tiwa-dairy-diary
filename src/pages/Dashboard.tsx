
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckSquare, DollarSign, Calendar, ArrowUp, ArrowDown, AlertCircle, Plus, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { useAnimals } from '@/hooks/useAnimals';
import { format, isToday, isTomorrow, isAfter, isThisWeek } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: tasks = [] } = useTasks();
  const { data: financialRecords = [] } = useFinancialRecords();
  const { data: animals = [] } = useAnimals();

  const features = [
    {
      title: 'Dairy Diary',
      icon: BookOpen,
      path: '/diary',
      description: `${animals.length} cows registered`,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      emoji: '🐄'
    },
    {
      title: t('tasks'),
      icon: CheckSquare,
      path: '/tasks',
      description: `${tasks.filter(t => t.status !== 'Done').length} pending`,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      emoji: '✅'
    },
    {
      title: t('finances'),
      icon: DollarSign,
      path: '/finances',
      description: 'Track income & expenses',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      emoji: '💰'
    },
    {
      title: 'Calendar',
      icon: Calendar,
      path: '/tasks',
      description: 'View schedule',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      emoji: '📆'
    },
  ];

  // Calculate financial data
  const financialData = React.useMemo(() => {
    const income = financialRecords
      .filter(r => r.transaction_type === 'Income')
      .reduce((sum, r) => sum + Number(r.amount), 0);
    
    const expenses = financialRecords
      .filter(r => r.transaction_type === 'Expense')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [financialRecords]);

  // Process tasks for dashboard display
  const taskSummary = React.useMemo(() => {
    const now = new Date();
    const todayTasks = tasks.filter(task => isToday(new Date(task.due_date)) && task.status !== 'Done');
    const tomorrowTasks = tasks.filter(task => isTomorrow(new Date(task.due_date)) && task.status !== 'Done');
    const overdueTasks = tasks.filter(task => 
      isAfter(now, new Date(task.due_date)) && task.status !== 'Done'
    );
    const thisWeekTasks = tasks.filter(task => 
      isThisWeek(new Date(task.due_date)) && task.status !== 'Done'
    );
    
    return {
      today: todayTasks.length,
      tomorrow: tomorrowTasks.length,
      overdue: overdueTasks.length,
      thisWeek: thisWeekTasks.length,
      urgent: todayTasks.length + overdueTasks.length
    };
  }, [tasks]);

  // Week summary
  const weekSummary = React.useMemo(() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const newRecordsThisWeek = financialRecords.filter(record => 
      isThisWeek(new Date(record.created_at))
    ).length;

    return {
      tasksThisWeek: taskSummary.thisWeek,
      newRecords: newRecordsThisWeek
    };
  }, [financialRecords, taskSummary]);

  const userName = user?.user_metadata?.full_name || 'Farmer';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            Karibu {userName}! 👋
          </h1>
          <h2 className="text-xl mb-1">TIWA Kilimo – Dairy Diary</h2>
          <p className="text-green-100">Record. Reflect. Grow.</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-md mx-auto">
        {/* Urgent Alerts */}
        {taskSummary.urgent > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <Bell className="h-5 w-5" />
                <span className="font-medium">
                  🔔 {taskSummary.urgent} urgent task{taskSummary.urgent > 1 ? 's' : ''}!
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="ml-auto text-red-700 border-red-300"
                  onClick={() => navigate('/tasks')}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.path} 
                className="cursor-pointer hover:shadow-lg transition-all border-0 shadow-md"
                onClick={() => navigate(feature.path)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-2xl">{feature.emoji}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-xs">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* This Week Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              📊 This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tasks Due:</span>
              <span className="font-semibold">{weekSummary.tasksThisWeek}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Records:</span>
              <span className="font-semibold">{weekSummary.newRecords}</span>
            </div>
          </CardContent>
        </Card>

        {/* Finances Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              💰 {t('farmFinancialSnapshot')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Income</span>
              </div>
              <span className="font-bold text-green-600">
                KSh {financialData.totalIncome.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Expenses</span>
              </div>
              <span className="font-bold text-red-600">
                KSh {financialData.totalExpenses.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border-2">
              <span className="font-semibold">Balance</span>
              <span className={`font-bold text-lg ${financialData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                KSh {financialData.balance.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full justify-start bg-green-600 hover:bg-green-700"
              onClick={() => navigate('/diary')}
            >
              <Plus className="h-4 w-4 mr-2" />
              🐄 Register New Cow
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/tasks')}
            >
              <Plus className="h-4 w-4 mr-2" />
              ✅ Add New Task
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/finances')}
            >
              <Plus className="h-4 w-4 mr-2" />
              💰 Record Transaction
            </Button>
          </CardContent>
        </Card>

        {/* Reminders */}
        {(taskSummary.today > 0 || taskSummary.tomorrow > 0) && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-800">🔔 Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {taskSummary.today > 0 && (
                <p className="text-sm text-orange-700">
                  📅 <strong>Today:</strong> {taskSummary.today} task{taskSummary.today > 1 ? 's' : ''} due
                </p>
              )}
              {taskSummary.tomorrow > 0 && (
                <p className="text-sm text-orange-700">
                  📅 <strong>Tomorrow:</strong> {taskSummary.tomorrow} task{taskSummary.tomorrow > 1 ? 's' : ''} due
                </p>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full mt-2 text-orange-700 border-orange-300"
                onClick={() => navigate('/tasks')}
              >
                View All Tasks
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
