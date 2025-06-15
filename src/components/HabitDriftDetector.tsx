
import React from 'react';
import { useHabitNudges } from '@/hooks/useHabitNudges';
import { HabitNudgeCard } from './HabitNudgeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  last_completed_at?: string;
  streak_count?: number;
}

interface HabitDriftDetectorProps {
  habits?: Habit[];
  className?: string;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-6">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
  </div>
);

export const HabitDriftDetector: React.FC<HabitDriftDetectorProps> = ({ 
  habits = [],
  className = '' 
}) => {
  const { nudges, loading, error, generateNudge, refreshNudges } = useHabitNudges();

  const handleGenerateTestNudge = async () => {
    if (habits.length === 0) return;

    const testHabit = habits[0];
    const testParams = {
      user_first_name: 'User',
      habit_name: testHabit.name || 'Test Habit',
      missed_days: 3,
      last_success_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      habit_id: testHabit.id
    };

    try {
      await generateNudge(testParams);
    } catch (err) {
      console.error('Failed to generate test nudge:', err);
    }
  };

  const getHabitName = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    return habit?.name || 'Unknown Habit';
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <CardTitle>Habit Drift Detector</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshNudges}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-sm text-destructive mb-4 p-3 bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        {nudges.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              No habit drift detected. Keep up the great work!
            </p>
            {habits.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateTestNudge}
                disabled={loading}
              >
                Generate Test Nudge
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {nudges.map((nudge) => (
              <HabitNudgeCard
                key={nudge.id}
                nudge={nudge}
                habitName={getHabitName(nudge.habit_id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
