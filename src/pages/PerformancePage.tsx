
import React from 'react';
import { PerformanceDashboard } from '@/components/PerformanceDashboard';
import { BackToDashboard } from '@/components/BackToDashboard';
import { useRituals } from '@/hooks/useRituals';
import { useTranslation } from '@/hooks/useTranslation';

const PerformancePage = () => {
  const { rituals } = useRituals();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-warfare-dark p-6">
      <div className="max-w-7xl mx-auto">
        <BackToDashboard />
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard de Performance</h1>
          <p className="text-warfare-gray">
            Monitore seu progresso e conquiste suas metas com insights visuais motivadores
          </p>
        </header>

        <PerformanceDashboard rituals={rituals} />
      </div>
    </div>
  );
};

export default PerformancePage;
