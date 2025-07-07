
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
  Cow, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  AlertTriangle,
  Package,
  Calendar,
  Plus
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

  // Get today's date for urgency checks
  const today = new Date();
  const urgentReminders = upcomingReminders.filter(reminder => {
    const dueDate = new Date(reminder.due_date);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1; // Due today or overdue
  });

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🏠 {t('dashboard')}
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome to your dairy farm management dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link to="/diary">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Link>
          </Button>
        </div>
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
                  Urgent Reminders ({urgentReminders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {urgentReminders.slice(0, 3).map((reminder) => (
                    <div key={reminder.id} className="flex justify-between items-center bg-white p-2 rounded">
                      <span className="font-medium">{reminder.title}</span>
                      <span className="text-sm text-red-600">
                        {format(new Date(reminder.due_date), 'MMM d')}
                      </span>
                    </div>
                  ))}
                  {urgentReminders.length > 3 && (
                    <Button asChild variant="outline" size="sm" className="w-full mt-2">
                      <Link to="/reminders">View All Reminders</Link>
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
                  Low Stock Alert ({lowStockItems.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded">
                      <span className="font-medium">{item.item_name}</span>
                      <span className="text-sm text-orange-600">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                  {lowStockItems.length > 3 && (
                    <Button asChild variant="outline" size="sm" className="w-full mt-2">
                      <Link to="/inventory">View Inventory</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            <Cow className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              KSh {totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue from all sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              KSh {totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Operating and other costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              KSh {netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Income minus expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/diary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Dairy Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Manage animal profiles, production, health, and breeding records
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/finances">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track income, expenses, and profitability
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/inventory">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Monitor feed, medicine, and equipment stock levels
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/tasks">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Task Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Create and track daily farm tasks
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/reminders">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Set up alerts for important farm activities
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/more">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MoreHorizontal className="h-5 w-5" />
                More Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Settings, reports, and additional tools
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {financialRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
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
              <p className="text-center text-gray-500 py-4">
                No recent activity. Start by adding some records!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
