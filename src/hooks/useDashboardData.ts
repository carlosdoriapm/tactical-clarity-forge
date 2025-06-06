
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  warLogsCount: number;
  ritualsCount: number;
  warCodeFragmentsCount: number;
  currentStreak: number;
}

interface RecentActivity {
  id: string;
  type: 'war_log' | 'ritual' | 'war_code';
  description: string;
  timestamp: string;
  status?: string;
}

interface LastMission {
  dilemma: string;
  decisionPath: string;
  outcome: string;
  date: string;
}

interface RitualsSummary {
  current: number;
  best: number;
  lastCompleted: string;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    warLogsCount: 0,
    ritualsCount: 0,
    warCodeFragmentsCount: 0,
    currentStreak: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [lastMission, setLastMission] = useState<LastMission>({
    dilemma: "No missions logged yet",
    decisionPath: "Start chatting to log decisions",
    outcome: "N/A",
    date: new Date().toISOString().split('T')[0]
  });
  const [ritualsSummary, setRitualsSummary] = useState<RitualsSummary>({
    current: 0,
    best: 0,
    lastCompleted: "No rituals completed yet"
  });

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch war logs count and last mission
      const { data: warLogs } = await supabase
        .from('war_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      // Fetch rituals data
      const { data: rituals } = await supabase
        .from('rituals')
        .select('*')
        .eq('user_id', user.id);

      // Fetch war code fragments count
      const { data: warCodeFragments } = await supabase
        .from('war_code_fragments')
        .select('id')
        .eq('user_id', user.id);

      // Update stats
      setStats({
        warLogsCount: warLogs?.length || 0,
        ritualsCount: rituals?.length || 0,
        warCodeFragmentsCount: warCodeFragments?.length || 0,
        currentStreak: rituals?.reduce((max, ritual) => Math.max(max, ritual.streak_count || 0), 0) || 0
      });

      // Update last mission
      if (warLogs && warLogs.length > 0) {
        const latest = warLogs[0];
        setLastMission({
          dilemma: latest.dilemma || "No dilemma recorded",
          decisionPath: latest.decision_path || "No decision path recorded",
          outcome: latest.result || "Pending",
          date: latest.date ? new Date(latest.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
      }

      // Update rituals summary
      if (rituals && rituals.length > 0) {
        const bestStreak = rituals.reduce((max, ritual) => Math.max(max, ritual.streak_count || 0), 0);
        const currentStreak = rituals.reduce((max, ritual) => Math.max(max, ritual.streak_count || 0), 0);
        const lastCompleted = rituals
          .filter(r => r.last_completed_at)
          .sort((a, b) => new Date(b.last_completed_at!).getTime() - new Date(a.last_completed_at!).getTime())[0];
        
        setRitualsSummary({
          current: currentStreak,
          best: bestStreak,
          lastCompleted: lastCompleted?.name || "No rituals completed yet"
        });
      }

      // Build recent activity
      const activities: RecentActivity[] = [];
      
      // Add war logs to activity
      if (warLogs) {
        warLogs.slice(0, 3).forEach(log => {
          activities.push({
            id: log.id,
            type: 'war_log',
            description: 'War log completed',
            timestamp: log.date || new Date().toISOString(),
            status: log.result || undefined
          });
        });
      }

      // Add rituals to activity
      if (rituals) {
        rituals
          .filter(r => r.last_completed_at)
          .sort((a, b) => new Date(b.last_completed_at!).getTime() - new Date(a.last_completed_at!).getTime())
          .slice(0, 2)
          .forEach(ritual => {
            activities.push({
              id: ritual.id,
              type: 'ritual',
              description: `Ritual session finished: ${ritual.name}`,
              timestamp: ritual.last_completed_at!,
              status: 'completed'
            });
          });
      }

      // Add war code fragments to activity
      if (warCodeFragments && warCodeFragments.length > 0) {
        const { data: recentFragments } = await supabase
          .from('war_code_fragments')
          .select('*')
          .eq('user_id', user.id)
          .order('date_logged', { ascending: false })
          .limit(2);

        if (recentFragments) {
          recentFragments.forEach(fragment => {
            activities.push({
              id: fragment.id,
              type: 'war_code',
              description: 'War code fragment saved',
              timestamp: fragment.date_logged || new Date().toISOString()
            });
          });
        }
      }

      // Sort activities by timestamp and take the 5 most recent
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  return {
    loading,
    stats,
    recentActivity,
    lastMission,
    ritualsSummary,
    refreshData: loadDashboardData
  };
};
