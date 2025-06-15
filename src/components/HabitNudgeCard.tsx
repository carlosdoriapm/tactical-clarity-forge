
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface HabitNudge {
  id: string;
  habit_id: string;
  text: string;
  missed_days: number;
  created_at: string;
}

interface HabitNudgeCardProps {
  nudge: HabitNudge;
  habitName?: string;
}

export const HabitNudgeCard: React.FC<HabitNudgeCardProps> = ({ 
  nudge, 
  habitName = 'Unknown Habit' 
}) => {
  const urgencyColor = nudge.missed_days > 3 ? 'destructive' : 'secondary';

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {habitName}
          </CardTitle>
          <Badge variant={urgencyColor}>
            {nudge.missed_days} days missed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-base font-medium mb-2">{nudge.text}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(nudge.created_at), { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
};
