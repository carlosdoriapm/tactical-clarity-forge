
import { Ritual } from '@/hooks/useRituals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Repeat, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RitualListProps {
  rituals: Ritual[];
}

export const RitualList: React.FC<RitualListProps> = ({ rituals }) => {
  if (rituals.length === 0) {
    return (
      <div className="text-center text-warfare-gray py-8 glass-card rounded-xl">
        <p className="text-white font-semibold">Nenhum ritual encontrado.</p>
        <p className="text-sm mt-2">Crie seu primeiro ritual para começar a construir disciplina.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rituals.map(ritual => (
        <Card key={ritual.id} className="bg-warfare-card border-warfare-gray/20 text-white flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{ritual.name}</span>
              {ritual.stake_attached && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Flame className="w-5 h-5 text-orange-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>High Intensity Stake</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </CardTitle>
            <CardDescription className="flex items-center text-warfare-gray">
              <Clock className="w-4 h-4 mr-2" />
              {ritual.duration_minutes} minutos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-warfare-gray text-sm">
              <Repeat className="w-4 h-4 mr-2 text-warfare-blue" />
              <span>Streak:</span>
              <span className="ml-auto font-bold text-lg text-white">{ritual.streak_count || 0}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
