
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface WarLogFormProps {
  onSubmit: (logData: {
    dilemma: string;
    decision_path: string;
    commands: any;
    intensity: 'Low' | 'Medium' | 'High';
    result: 'Success' | 'Partial Success' | 'Fail';
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
    result: 'Partial Success' as 'Success' | 'Partial Success' | 'Fail',
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

          <div className="grid grid-cols-2 gap-4">
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
              <Select
                value={formData.result}
                onValueChange={(value: 'Success' | 'Partial Success' | 'Fail') =>
                  setFormData(prev => ({ ...prev, result: value }))
                }
              >
                <SelectTrigger className="bg-warfare-dark border-warfare-gray/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-warfare-card border-warfare-gray/20">
                  <SelectItem value="Success" className="text-green-400">Success</SelectItem>
                  <SelectItem value="Partial Success" className="text-yellow-400">Partial Success</SelectItem>
                  <SelectItem value="Fail" className="text-red-400">Fail</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-warfare-gray/30 text-warfare-gray hover:bg-warfare-dark hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-warfare-accent hover:bg-warfare-accent/80 text-white"
            >
              Log Mission
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
