
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface WarLogFormProps {
  onSubmit: (logData: {
    dilemma: string;
    decision_path: string;
    commands: any;
    intensity: 'Low' | 'Medium' | 'High';
    result: string;
    reflections?: string;
    date: string;
  }) => void;
  onCancel: () => void;
}

export const WarLogForm: React.FC<WarLogFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    dilemma: '',
    decision_path: '',
    commands: '',
    intensity: 'Medium' as 'Low' | 'Medium' | 'High',
    result: '',
    reflections: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      ...formData,
      commands: formData.commands ? JSON.parse(formData.commands) : {},
      date: new Date().toISOString()
    });
  };

  return (
    <Card className="bg-warfare-card border-warfare-gray/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">New War Log Entry</CardTitle>
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
            <Label htmlFor="dilemma" className="text-warfare-accent">
              Tactical Dilemma
            </Label>
            <Textarea
              id="dilemma"
              value={formData.dilemma}
              onChange={(e) => setFormData(prev => ({ ...prev, dilemma: e.target.value }))}
              placeholder="Describe the tactical situation or dilemma..."
              className="bg-warfare-dark border-warfare-gray/30 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="decision_path" className="text-warfare-accent">
              Decision Path
            </Label>
            <Textarea
              id="decision_path"
              value={formData.decision_path}
              onChange={(e) => setFormData(prev => ({ ...prev, decision_path: e.target.value }))}
              placeholder="Describe your decision-making process..."
              className="bg-warfare-dark border-warfare-gray/30 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="commands" className="text-warfare-accent">
              Commands Executed (JSON format)
            </Label>
            <Textarea
              id="commands"
              value={formData.commands}
              onChange={(e) => setFormData(prev => ({ ...prev, commands: e.target.value }))}
              placeholder='{"action": "execute", "priority": "high"}'
              className="bg-warfare-dark border-warfare-gray/30 text-white font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="intensity" className="text-warfare-accent">
              Intensity Level
            </Label>
            <Select
              value={formData.intensity}
              onValueChange={(value: 'Low' | 'Medium' | 'High') => 
                setFormData(prev => ({ ...prev, intensity: value }))
              }
            >
              <SelectTrigger className="bg-warfare-dark border-warfare-gray/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-warfare-card border-warfare-gray/20">
                <SelectItem value="Low" className="text-white">Low</SelectItem>
                <SelectItem value="Medium" className="text-white">Medium</SelectItem>
                <SelectItem value="High" className="text-white">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="result" className="text-warfare-accent">
              Result/Outcome
            </Label>
            <Textarea
              id="result"
              value={formData.result}
              onChange={(e) => setFormData(prev => ({ ...prev, result: e.target.value }))}
              placeholder="Describe the outcome or result..."
              className="bg-warfare-dark border-warfare-gray/30 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="reflections" className="text-warfare-accent">
              Tactical Reflections (Optional)
            </Label>
            <Textarea
              id="reflections"
              value={formData.reflections}
              onChange={(e) => setFormData(prev => ({ ...prev, reflections: e.target.value }))}
              placeholder="Any additional reflections or lessons learned..."
              className="bg-warfare-dark border-warfare-gray/30 text-white"
            />
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
              Create Log Entry
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
