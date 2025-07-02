
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckSquare, DollarSign, Calendar, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTasks } from '@/hooks/useTasks';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { format, isToday, isTomorrow, isAfter } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: tasks = [] } = useTasks();
  const { data: financialRecords = [] } = useFinancialRecords();

  const features = [
    {
      title: 'Dairy Diary',
      icon: BookOpen,
      path: '/diary',
      description: 'Track your dairy cows',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: t('tasksCalendar'),
      icon: CheckSquare,
      path: '/tasks',
      description: 'Manage farm tasks',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: t('financesOverview'),
      icon: DollarSign,
      path: '/finances',
      description: 'Track income & expenses',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: t('calendarOverview'),
      icon: Calendar,
      path: '/calendar',
      description: 'View schedule',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  // Calculate financial data from actual records
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
    
    const upcomingTasks = [...todayTasks, ...tomorrowTasks, ...overdueTasks]
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(0, 5);

    return {
      today: todayTasks.length,
      tomorrow: tomorrowTasks.length,
      overdue: overdueTasks.length,
      upcoming: upcomingTasks
    };
  }, [tasks]);

  const getDateLabel = (date: string) => {
    const taskDate = new Date(date);
    if (isToday(taskDate)) return 'Today';
    if (isTomorrow(taskDate)) return 'Tomorrow';
    return format(taskDate, 'MMM d');
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟠';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden">
        <CardContent className="p-6">
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {t('welcome')}
            </h1>
            <p className="text-green-100 text-lg mb-4">
              {t('tagline')}
            </p>
            <div className="absolute top-0 right-0 opacity-20">
              <BookOpen className="h-24 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts for overdue tasks */}
      {taskSummary.overdue > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">
                You have {taskSummary.overdue} overdue task{taskSummary.overdue > 1 ? 's' : ''}!
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-auto text-red-700 border-red-300"
                onClick={() => navigate('/tasks')}
              >
                View Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.path} 
              className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md"
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              {t('farmFinancialSnapshot')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{t('totalIncome')}</span>
              </div>
              <span className="font-bold text-green-600">
                KSh {financialData.totalIncome.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">{t('totalExpenses')}</span>
              </div>
              <span className="font-bold text-red-600">
                KSh {financialData.totalExpenses.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border-2">
              <span className="font-semibold">{t('balance')}</span>
              <span className={`font-bold text-lg ${financialData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                KSh {financialData.balance.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              Upcoming Tasks 🗓️
              {(taskSummary.today + taskSummary.overdue) > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {taskSummary.today + taskSummary.overdue} urgent
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {taskSummary.upcoming.length > 0 ? (
              <div className="space-y-3">
                {taskSummary.upcoming.map((task) => {
                  const isOverdue = isAfter(new Date(), new Date(task.due_date));
                  return (
                    <div 
                      key={task.id} 
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        isOverdue ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm flex items-center gap-1">
                          {getPriorityIcon(task.priority)} {task.title}
                        </p>
                        <p className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                          {getDateLabel(task.due_date)} 
                          {task.due_time && ` at ${task.due_time}`}
                          {isOverdue && ' (Overdue)'}
                        </p>
                        {task.assigned_to && (
                          <p className="text-xs text-gray-500">👤 {task.assigned_to}</p>
                        )}
                      </div>
                      <CheckSquare className="h-4 w-4 text-gray-400" />
                    </div>
                  );
                })}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/tasks')}
                >
                  View All Tasks 📋
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">No upcoming tasks. Great job! 👏</p>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/tasks')}
                >
                  Create New Task ➕
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
