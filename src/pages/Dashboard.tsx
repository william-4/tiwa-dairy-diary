
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnimals } from '@/hooks/useAnimals';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { useUpcomingReminders } from '@/hooks/useReminders';
import { useLowStockItems } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  Home, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  AlertTriangle,
  Package,
  Calendar,
  BookOpen,
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { t } = useLanguage();
  const { data: animals = [] } = useAnimals();
  const { data: financialRecords = [] } = useFinancialRecords();
  const { data: upcomingReminders = [] } = useUpcomingReminders();
  const { data: lowStockItems = [] } = useLowStockItems();

  // Calculate financial summaries
  const totalIncome = financialRecords
    .filter(record => record.transaction_type === 'Income')
    .reduce((sum, record) => sum + Number(record.amount), 0);

  const totalExpenses = financialRecords
    .filter(record => record.transaction_type === 'Expense')
    .reduce((sum, record) => sum + Number(record.amount), 0);

  const netProfit = totalIncome - totalExpenses;

  // Get urgent reminders (due within 3 days)
  const today = new Date();
  const urgentReminders = upcomingReminders.filter(reminder => {
    const dueDate = new Date(reminder.due_date);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 text-center">
        <h1 className="text-lg md:text-xl font-bold">
          Welcome to TIWA Kilimo Dairy Diary – Record, Reflect, Grow
        </h1>
      </div>

      <div className="p-4 space-y-6 max-w-6xl mx-auto">
        {/* Main Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Button asChild className="h-24 bg-blue-600 hover:bg-blue-700 flex-col gap-2">
            <Link to="/diary">
              <BookOpen className="h-8 w-8" />
              <span className="text-sm font-semibold">🐄 Dairy Diary</span>
            </Link>
          </Button>
          
          <Button asChild className="h-24 bg-purple-600 hover:bg-purple-700 flex-col gap-2">
            <Link to="/tasks">
              <CheckSquare className="h-8 w-8" />
              <span className="text-sm font-semibold">✅ Tasks</span>
            </Link>
          </Button>
          
          <Button asChild className="h-24 bg-orange-600 hover:bg-orange-700 flex-col gap-2">
            <Link to="/finances">
              <DollarSign className="h-8 w-8" />
              <span className="text-sm font-semibold">💰 Financials</span>
            </Link>
          </Button>
          
          <Button asChild className="h-24 bg-emerald-600 hover:bg-emerald-700 flex-col gap-2">
            <Link to="/inventory">
              <Package className="h-8 w-8" />
              <span className="text-sm font-semibold">📦 Inventory</span>
            </Link>
          </Button>
        </div>

        {/* Alerts Section */}
        {(urgentReminders.length > 0 || lowStockItems.length > 0) && (
          <div className="space-y-3">
            {/* Urgent Reminders Alert */}
            {urgentReminders.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <Bell className="h-5 w-5" />
                    🔔 Urgent Reminders ({urgentReminders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {urgentReminders.slice(0, 3).map((reminder) => (
                      <div key={reminder.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <div>
                          <p className="font-medium">{reminder.title}</p>
                          <p className="text-sm text-gray-600">{reminder.reminder_type}</p>
                        </div>
                        <span className="text-sm text-red-600 font-medium">
                          {format(new Date(reminder.due_date), 'MMM d')}
                        </span>
                      </div>
                    ))}
                    {urgentReminders.length > 3 && (
                      <Button asChild variant="outline" size="sm" className="w-full mt-2">
                        <Link to="/reminders">
                          View All Reminders
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    📦 Low Stock Alert ({lowStockItems.length} items)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lowStockItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-medium">{item.item_name}</span>
                        <span className="text-sm text-orange-600 font-medium">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    ))}
                    {lowStockItems.length > 3 && (
                      <Button asChild variant="outline" size="sm" className="w-full mt-2">
                        <Link to="/inventory">
                          View Inventory
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              📊 Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  KSh {totalIncome.toLocaleString()}
                </div>
                <div className="text-sm text-green-700">Total Income</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  KSh {totalExpenses.toLocaleString()}
                </div>
                <div className="text-sm text-red-700">Total Expenses</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  KSh {netProfit.toLocaleString()}
                </div>
                <div className="text-sm text-blue-700">Net Profit</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{animals.length}</div>
              <p className="text-xs text-muted-foreground">
                Active livestock in your herd
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Reminders</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingReminders.length}</div>
              <p className="text-xs text-muted-foreground">
                Upcoming farm activities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              📝 Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {financialRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{record.category}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(record.transaction_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className={`font-bold ${
                    record.transaction_type === 'Income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {record.transaction_type === 'Income' ? '+' : '-'}KSh {Number(record.amount).toLocaleString()}
                  </div>
                </div>
              ))}
              {financialRecords.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity. Start by adding some records!</p>
                  <Button asChild className="mt-4">
                    <Link to="/diary">Add First Record</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
