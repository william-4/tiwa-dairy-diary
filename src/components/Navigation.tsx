
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, DollarSign, Package, Bell, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Navigation = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/diary', icon: BookOpen, label: t('diary') },
    { path: '/tasks', icon: CheckSquare, label: t('tasks') },
    { path: '/finances', icon: DollarSign, label: t('finances') },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/reminders', icon: Bell, label: 'Reminders' },
    { path: '/more', icon: MoreHorizontal, label: t('more') },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex space-x-8 overflow-x-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              isActive(path)
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
