
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, HelpCircle, LogOut, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

const More = () => {
  const { t } = useLanguage();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title={t('more')} onBack={handleBackToDashboard} />
      
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              {t('profile')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{t('email')}</span>
              <span className="text-sm text-gray-500">{user?.email}</span>
            </div>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              {t('editProfile')}
            </Button>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-green-600" />
              {t('support')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-2" />
              {t('contactSupport')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              {t('sendFeedback')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              {t('helpCenter')}
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">TIWA Kilimo - Dairy Diary</p>
            <p className="text-xs text-gray-400">Version 1.0.0</p>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('signOut')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default More;
