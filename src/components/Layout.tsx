
import React from 'react';
import BottomNavigation from './BottomNavigation';
import LanguageToggle from './LanguageToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Language Toggle in Top Right with proper spacing */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>
      
      <main className="pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
