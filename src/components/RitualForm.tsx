
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface RitualFormProps {
  onSubmit: (ritualData: {
    name: string;
    duration_minutes: number;
    stake_attached: boolean;
  }) => void;
  onCancel: () => void;
}

export const RitualForm: React.FC<RitualFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration_minutes: 5,
    stake_attached: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="bg-warfare-card border-warfare-gray/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Create New Ritual</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-warfare-gray hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-warfare-accent">
              Ritual Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Morning Combat Readiness"
              className="bg-warfare-dark border-warfare-gray/30 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="duration" className="text-warfare-accent">
              Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="120"
              value={formData.duration_minutes}
              onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 5 }))}
              className="bg-warfare-dark border-warfare-gray/30 text-white"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="stake"
              checked={formData.stake_attached}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, stake_attached: checked }))}
            />
            <Label htmlFor="stake" className="text-warfare-accent">
              Attach Personal Stake (High Intensity)
            </Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-warfare-gray/30 text-warfare-gray hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-warfare-accent hover:bg-warfare-accent/80 text-white"
            >
              Create Ritual
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
