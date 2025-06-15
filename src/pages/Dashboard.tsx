
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRituals, NewRitual } from '@/hooks/useRituals';
import { RitualList } from '@/components/RitualList';
import { RitualForm } from '@/components/RitualForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { VulnerabilityDashboard } from '@/components/VulnerabilityDashboard';
import { useMissions } from "@/hooks/useMissions";
import { MissionList } from "@/components/MissionList";
import { CheckInList } from "@/components/CheckInList";
import { useCheckIns } from "@/hooks/useCheckIns";
import { useTranslation } from "@/hooks/useTranslation";

const Dashboard = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { rituals, isLoadingRituals, addRitual } = useRituals();
  const { t } = useTranslation();

  // Missões
  const { missions, isLoading: isLoadingMissions } = useMissions();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

  // Lista de check-ins da missão selecionada
  const { checkIns, isLoading: isLoadingCheckIns } = useCheckIns(selectedMission || "");

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
          <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard')}</h1>
          <p className="text-warfare-gray">{t('welcome')}, {user?.email}</p>
        </header>

        <div className="space-y-12">
          {/* Tactical Intelligence Section */}
          <div>
            <VulnerabilityDashboard />
          </div>

          {/* Missions and Check-ins Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">{t('missions')}</h2>
            {isLoadingMissions ? (
              <p className="text-warfare-gray">{t('loading')}</p>
            ) : (
              <MissionList
                missions={missions || []}
                onSelect={(mission) => setSelectedMission(mission.id)}
                selectedMissionId={selectedMission || undefined}
              />
            )}
            {selectedMission && (
              <>
                <h3 className="text-xl font-bold text-warfare-blue mt-6">Check-ins for this Mission</h3>
                {isLoadingCheckIns ? (
                  <p className="text-warfare-gray">{t('loading')}</p>
                ) : (
                  <CheckInList checkIns={checkIns || []} />
                )}
              </>
            )}
          </div>

          {/* Rituals Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">{t('your_rituals')}</h2>
              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)} className="bg-warfare-accent hover:bg-warfare-accent/80 text-white">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {t('new_ritual')}
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
                  <p className="text-warfare-gray">{t('loading')}</p>
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
