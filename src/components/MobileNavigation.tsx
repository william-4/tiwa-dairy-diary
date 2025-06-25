
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, BookOpen, CheckSquare, DollarSign, LogOut, Cow } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { t } = useLanguage();

  const navigation = [
    { name: t('dashboard'), href: '/', icon: Home },
    { name: t('animalDiary'), href: '/diary', icon: BookOpen },
    { name: t('tasks'), href: '/tasks', icon: CheckSquare },
    { name: t('finances'), href: '/finances', icon: DollarSign },
  ];

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 bg-white shadow-md">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <Cow className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold">TIWA Kilimo</h1>
                  <p className="text-sm text-gray-600">Dairy Diary</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {user && (
              <div className="p-4 border-t">
                <div className="mb-3 text-sm text-gray-600">
                  {user.email}
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
