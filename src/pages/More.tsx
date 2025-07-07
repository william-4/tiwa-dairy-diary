
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Settings, HelpCircle, LogOut, Phone, Mail, MessageSquare, Download, Globe, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import PageHeader from '@/components/PageHeader';
import LanguageToggle from '@/components/LanguageToggle';

const More = () => {
  const { t } = useLanguage();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: user?.email || '',
    message: '',
    category: 'general'
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to your backend
    toast({
      title: "Feedback Sent!",
      description: "Thank you for your feedback. We'll review it and get back to you soon.",
    });
    setFeedbackForm({ name: '', email: user?.email || '', message: '', category: 'general' });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be ready shortly and sent to your email.",
    });
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

        {/* Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <span>Language</span>
              </div>
              <LanguageToggle />
            </div>
            
            <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded">
              <Shield className="h-4 w-4" />
              Your data is securely stored and backed up automatically
            </div>
          </CardContent>
        </Card>

        {/* Help Center Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Frequently Asked Questions
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Frequently Asked Questions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  <div>
                    <h4 className="font-medium">How do I register a new cow?</h4>
                    <p className="text-sm text-gray-600 mt-1">Go to Animal Diary and click "Add Animal". Fill in the cow's details and click Register.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">How do I track milk production?</h4>
                    <p className="text-sm text-gray-600 mt-1">Select a cow from Animal Diary, then go to Production Records to log daily milk yields.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Can I use the app offline?</h4>
                    <p className="text-sm text-gray-600 mt-1">The app requires internet connection to save data. However, you can view previously loaded data offline.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">How do I add farm expenses?</h4>
                    <p className="text-sm text-gray-600 mt-1">Go to Finances section and click "Add Transaction". Select "Expense" and fill in the details.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Is my data secure?</h4>
                    <p className="text-sm text-gray-600 mt-1">Yes, all data is encrypted and stored securely. Only you can access your farm data.</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-2" />
              Contact Support: +254 700 123 456
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Email: support@tiwakilimo.com
            </Button>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              Send Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback-name">Name</Label>
                  <Input
                    id="feedback-name"
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback-email">Email</Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm({...feedbackForm, email: e.target.value})}
                    placeholder="Your email"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feedback-message">Your Message</Label>
                <Textarea
                  id="feedback-message"
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
                  placeholder="Tell us about your experience, suggestions, or report any issues..."
                  rows={4}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">TIWA Kilimo - Dairy Diary</p>
            <p className="text-xs text-gray-400">Version 1.0.0 • Made with ❤️ for Kenyan farmers</p>
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
