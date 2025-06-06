
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, X } from 'lucide-react';

interface RitualTimerProps {
  ritual: {
    id: string;
    name: string;
    duration_minutes: number;
  };
  onComplete: () => void;
  onCancel: () => void;
}

export const RitualTimer: React.FC<RitualTimerProps> = ({ ritual, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(ritual.duration_minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalTime = ritual.duration_minutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <Card className="bg-warfare-card border-warfare-gray/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">{ritual.name}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-warfare-gray hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="flex justify-center space-x-2">
          {!isRunning && timeLeft > 0 && !isCompleted && (
            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          )}
          
          {isRunning && (
            <Button onClick={handlePause} className="bg-yellow-600 hover:bg-yellow-700">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          {timeLeft < totalTime && !isCompleted && (
            <Button onClick={handleStop} variant="outline" className="border-warfare-gray/30">
              <Square className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {isCompleted && (
          <div className="text-center space-y-4">
            <div className="text-green-500 font-bold text-lg">Ritual Complete!</div>
            <Button 
              onClick={handleComplete}
              className="bg-warfare-accent hover:bg-warfare-accent/80 w-full"
            >
              Mark as Completed & Update Streak
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
