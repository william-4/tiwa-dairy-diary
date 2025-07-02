
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LogOut, HelpCircle, MessageSquare, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/PageHeader';

const More = () => {
  const { signOut, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title="More" showBackToDashboard={false} />
      
      <div className="p-4 space-y-4">
        {/* User Profile Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-lg">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium">{user?.user_metadata?.full_name || 'Farmer'}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <Label htmlFor="language-toggle">
                  {language === 'en' ? 'English' : 'Kiswahili'}
                </Label>
              </div>
              <Switch
                id="language-toggle"
                checked={language === 'sw'}
                onCheckedChange={toggleLanguage}
              />
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Help & Support</h3>
            
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & FAQ
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Feedback
            </Button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="p-4">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default More;
