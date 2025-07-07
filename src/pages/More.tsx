
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Download, 
  Upload, 
  FileText, 
  Bell,
  Package,
  Users,
  Languages,
  HelpCircle,
  Shield,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import RoleBasedAccess from '@/components/RoleBasedAccess';

const More = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, userRole, signOut } = useAuth();

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          ⚙️ {t('more')}
        </h1>
        <Badge variant="outline">
          {userRole === 'admin' ? '👑 Admin' : '👷 Worker'}
        </Badge>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Track feed, medicine, and equipment stock levels
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/reminders">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Reminders & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Set up notifications for important farm activities
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Language / Lugha</h3>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Switch to Swahili' : 'Badili kwenda Kiingereza'}
              </p>
            </div>
            <Button variant="outline" onClick={handleLanguageToggle}>
              <Languages className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Kiswahili' : 'English'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Only Features */}
      <RoleBasedAccess allowedRoles={['admin']}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">User Management</h3>
                  <p className="text-sm text-gray-600">
                    Manage worker accounts and permissions
                  </p>
                </div>
                <Button variant="outline" disabled>
                  <Users className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Data Export</h3>
                  <p className="text-sm text-gray-600">
                    Export farm data to Excel or PDF
                  </p>
                </div>
                <Button variant="outline" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Data Import</h3>
                  <p className="text-sm text-gray-600">
                    Import existing records from spreadsheets
                  </p>
                </div>
                <Button variant="outline" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </RoleBasedAccess>

      {/* Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reports & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" disabled className="h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Production Report</div>
                <div className="text-sm text-gray-600">Milk production analysis</div>
              </div>
            </Button>
            
            <Button variant="outline" disabled className="h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Financial Summary</div>
                <div className="text-sm text-gray-600">Income vs expenses</div>
              </div>
            </Button>
            
            <Button variant="outline" disabled className="h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Health Overview</div>
                <div className="text-sm text-gray-600">Animal health trends</div>
              </div>
            </Button>
            
            <Button variant="outline" disabled className="h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Breeding Report</div>
                <div className="text-sm text-gray-600">Reproduction analytics</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Support & Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">TIWA Kilimo Dairy Diary</h3>
              <p className="text-sm text-blue-700">
                Version 2.0 - Comprehensive farm management for Kenyan dairy farmers
              </p>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Features:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Animal registration and profile management</li>
                <li>Production, health, and breeding records</li>
                <li>Financial tracking with buyer/supplier details</li>
                <li>Inventory management with low-stock alerts</li>
                <li>Task management and reminders</li>
                <li>Multi-user support (Admin/Worker roles)</li>
                <li>Bilingual support (English/Swahili)</li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                Need help? Contact support or check our user guide.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  User Guide
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {user && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm">
                  <strong>Role:</strong> {userRole}
                </p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => signOut()}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default More;
