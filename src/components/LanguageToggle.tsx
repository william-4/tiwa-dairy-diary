
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
      className="min-w-[60px]"
    >
      {language === 'en' ? '🇰🇪 SW' : '🇬🇧 EN'}
    </Button>
  );
};

export default LanguageToggle;
