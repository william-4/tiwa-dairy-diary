
import React from 'react';
import BottomNavigation from './BottomNavigation';
import MobileNavigation from './MobileNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Mobile header with hamburger menu - only shown on small screens */}
      <div className="md:hidden">
        <MobileNavigation />
      </div>
      
      {/* Main content */}
      <main className="w-full">
        {children}
      </main>
      
      {/* Bottom navigation - always visible */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
