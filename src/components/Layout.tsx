
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      <main className="flex-1 md:ml-0">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
