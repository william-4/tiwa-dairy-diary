
import React from 'react';
import Navigation from './Navigation';
import BottomNavigation from './BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Shield, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navigation />
        {/* Role indicator for desktop */}
        {userRole && (
          <div className="fixed top-4 right-4 z-50">
            <Badge 
              variant={userRole === 'admin' ? 'default' : 'secondary'}
              className="flex items-center gap-1"
            >
              {userRole === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
              {userRole}
            </Badge>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="md:ml-64">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <BottomNavigation />
        {/* Role indicator for mobile */}
        {userRole && (
          <div className="fixed top-4 right-4 z-50">
            <Badge 
              variant={userRole === 'admin' ? 'default' : 'secondary'}
              className="flex items-center gap-1 text-xs"
            >
              {userRole === 'admin' ? <Shield className="h-2 w-2" /> : <User className="h-2 w-2" />}
              {userRole}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
