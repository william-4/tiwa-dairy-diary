
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckSquare, DollarSign, Calendar, TrendingUp, Bell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { useTasks } from '@/hooks/useTasks';
import { useAnimals } from '@/hooks/useAnimals';
import PageHeader from '@/components/PageHeader';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { data: financialRecords = [] } = useFinancialRecords();
  const { data: tasks = [] } = useTasks();
  const { data: animals = [] } = useAnimals();

  // Calculate financial summary
  const totalIncome = financialRecords
    .filter(r => r.transaction_type === 'Income')
    .reduce((sum, r) => sum + Number(r.amount), 0);
  
  const totalExpenses = financialRecords
    .filter(r => r.transaction_type === 'Expense')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Get upcoming tasks (next 7 days)
  const upcomingTasks = tasks.filter(task => {
    if (task.status === 'Done') return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return dueDate >= today && dueDate <= nextWeek;
  }).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title={t('home')} />
      
      <div className="p-2 md:p-4 space-y-4 md:space-y-6 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center py-4 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {t('welcome')}
          </h1>
          <p className="text-base md:text-lg text-gray-600">{t('tagline')}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-2xl mb-1">🐄</div>
              <div className="text-lg md:text-xl font-bold text-green-600">{animals.length}</div>
              <div className="text-xs md:text-sm text-green-700">Cows</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-2xl mb-1">✅</div>
              <div className="text-lg md:text-xl font-bold text-blue-600">{tasks.filter(t => t.status === 'Pending').length}</div>
              <div className="text-xs md:text-sm text-blue-700">Pending Tasks</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-lg md:text-xl font-bold text-purple-600">KSh {totalIncome.toLocaleString()}</div>
              <div className="text-xs md:text-sm text-purple-700">Income</div>
            </CardContent>
          </Card>

          <Card className={`${balance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className={`text-lg md:text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                KSh {balance.toLocaleString()}
              </div>
              <div className={`text-xs md:text-sm ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>Balance</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/diary')}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg">{t('animalDiary')}</h3>
                  <p className="text-sm text-gray-600">Track your cows</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/tasks')}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckSquare className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg">{t('tasksCalendar')}</h3>
                  <p className="text-sm text-gray-600">Manage tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/finances')}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg">{t('financesOverview')}</h3>
                  <p className="text-sm text-gray-600">Track finances</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              {t('upcomingTasksWeek')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                        {task.assigned_to && ` • Assigned to: ${task.assigned_to}`}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      task.priority === 'High' ? 'bg-red-100 text-red-700' :
                      task.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={() => navigate('/tasks')} className="w-full mt-3">
                  View All Tasks
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">{t('noUpcomingTasks')}</p>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              {t('farmFinancialSnapshot')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">{t('totalIncome')}</p>
                <p className="text-xl font-bold text-green-600">KSh {totalIncome.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">{t('totalExpenses')}</p>
                <p className="text-xl font-bold text-red-600">KSh {totalExpenses.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">{t('balance')}</p>
                <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  KSh {balance.toLocaleString()}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/finances')} className="w-full mt-4">
              View Detailed Finances
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
