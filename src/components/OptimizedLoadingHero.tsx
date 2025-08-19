import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingHeroProps {
  onComplete: () => void;
}

const OptimizedLoadingHero: React.FC<LoadingHeroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds for better LCP
    const interval = 50;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <img 
            src="/logo.png" 
            alt="Tiwa Dairy Diary" 
            className="w-32 h-32 mx-auto mb-4"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
        
        <motion.p 
          className="text-xl text-white opacity-90 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome to Tiwa Dairy Diary
        </motion.p>
        
        <div className="w-64 mx-auto">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-white/70 text-sm mt-2">
            {Math.round(progress)}% Loading...
          </p>
