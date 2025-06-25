
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckSquare, DollarSign, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      title: t('animalDiary'),
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

  // Mock data - will be replaced with real data from Supabase
  const financialData = {
    totalIncome: 25000,
    totalExpenses: 18000,
    balance: 7000,
  };

  const upcomingTasks = [
    { id: 1, title: 'Milk collection', date: 'Today', time: '6:00 AM' },
    { id: 2, title: 'Feed preparation', date: 'Tomorrow', time: '8:00 AM' },
    { id: 3, title: 'Vet checkup - Cow #003', date: 'Friday', time: '2:00 PM' },
  ];

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
              {t('upcomingTasksWeek')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-gray-600">{task.date} at {task.time}</p>
                    </div>
                    <CheckSquare className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/tasks')}
                >
                  View All Tasks
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">{t('noUpcomingTasks')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
