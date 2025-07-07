
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, DollarSign, Package, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navigation = [
    { name: t('home'), href: '/', icon: Home, activeColor: 'text-green-600', bgColor: 'bg-green-100' },
    { name: 'Dairy Diary', href: '/diary', icon: BookOpen, activeColor: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: t('tasks'), href: '/tasks', icon: CheckSquare, activeColor: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: t('finances'), href: '/finances', icon: DollarSign, activeColor: 'text-orange-600', bgColor: 'bg-orange-100' },
    { name: 'Inventory', href: '/inventory', icon: Package, activeColor: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { name: 'More', href: '/more', icon: MoreHorizontal, activeColor: 'text-gray-600', bgColor: 'bg-gray-100' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors min-w-0 ${
                isActive
                  ? `${item.bgColor} ${item.activeColor}`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 mb-1 flex-shrink-0" />
              <span className="text-xs font-medium text-center leading-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
