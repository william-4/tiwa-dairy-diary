
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

const PageHeader = ({ title, onBack }: PageHeaderProps) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
        {/* Add right padding to prevent overlap with language toggle */}
        <div className="w-16"></div>
      </div>
    </div>
  );
};

export default PageHeader;
