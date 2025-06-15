
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRituals, NewRitual } from '@/hooks/useRituals';
import { RitualList } from '@/components/RitualList';
import { RitualForm } from '@/components/RitualForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { VulnerabilityDashboard } from '@/components/VulnerabilityDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { rituals, isLoadingRituals, addRitual } = useRituals();

  const handleCreateRitual = (ritualData: {
    name: string;
    duration_minutes: number;
    stake_attached: boolean;
  }) => {
    if (!user) return;
    
    const newRitual: Omit<NewRitual, 'id' | 'created_at'> = {
      ...ritualData,
      user_id: user.id,
      streak_count: 0,
      last_completed_at: null,
    };
    
    addRitual(newRitual as NewRitual, {
      onSuccess: () => {
        setShowCreateForm(false);
      },
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-warfare-gray">Bem-vindo, {user?.email}</p>
        </header>

        <div className="space-y-12">
          {/* Tactical Intelligence Section */}
          <div>
            <VulnerabilityDashboard />
          </div>

          {/* Rituals Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Seus Rituais</h2>
              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)} className="bg-warfare-accent hover:bg-warfare-accent/80 text-white">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Novo Ritual
                </Button>
              )}
            </div>

            {showCreateForm ? (
              <RitualForm 
                onSubmit={handleCreateRitual}
                onCancel={() => setShowCreateForm(false)}
              />
            ) : (
              <>
                {isLoadingRituals ? (
                  <p className="text-warfare-gray">Carregando rituais...</p>
                ) : (
                  <RitualList rituals={rituals || []} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
