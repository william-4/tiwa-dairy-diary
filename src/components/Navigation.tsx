
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, DollarSign, Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/diary', icon: BookOpen, label: t('diary') },
    { path: '/tasks', icon: CheckSquare, label: t('tasks') },
    { path: '/finances', icon: DollarSign, label: t('finances') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="bg-green-600 text-white p-4 flex justify-between items-center md:hidden">
        <h1 className="text-lg font-bold">TIWA Kilimo</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-white hover:bg-green-700 p-2"
          >
            <Globe className="h-4 w-4" />
            <span className="ml-1 text-xs">{language.toUpperCase()}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-green-700"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white w-64 h-full shadow-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-green-600">TIWA Kilimo</h2>
            </div>
            <nav className="p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 text-left transition-colors ${
                      isActive 
                        ? 'bg-green-100 text-green-700 border-l-4 border-green-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:shadow-lg md:min-h-screen">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-green-600">TIWA Kilimo</h1>
          <p className="text-sm text-gray-600 mt-1">{t('tagline')}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="mt-3 w-full"
          >
            <Globe className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Kiswahili' : 'English'}
          </Button>
        </div>
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 text-left transition-colors ${
                  isActive 
                    ? 'bg-green-100 text-green-700 border-l-4 border-green-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navigation;
