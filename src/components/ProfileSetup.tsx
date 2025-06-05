
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileSetupProps {
  onComplete: (profileData: any) => void;
  onSkip: () => void;
}

const ProfileSetup = ({ onComplete, onSkip }: ProfileSetupProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age_condition: '',
    relationship_status: '',
    top_pains: '',
    addiction_vice: '',
    mission_90_day: '',
    greatest_fear: '',
    intensity_mode: 'TACTICAL' as 'TACTICAL' | 'RUTHLESS' | 'LEGION',
    domain_focus: '' as 'corpo' | 'dinheiro' | 'influencia' | ''
  });

  const questions = [
    {
      key: 'age_condition',
      label: 'Age & Physical Condition',
      placeholder: 'e.g., 28, decent shape but inconsistent training'
    },
    {
      key: 'relationship_status',
      label: 'Relationship Status',
      placeholder: 'e.g., single, married, complicated'
    },
    {
      key: 'top_pains',
      label: 'Top 3 Pains Right Now',
      placeholder: 'e.g., lack of direction, financial stress, poor discipline'
    },
    {
      key: 'addiction_vice',
      label: 'Main Addiction or Vice (if any)',
      placeholder: 'e.g., social media, alcohol, procrastination'
    },
    {
      key: 'mission_90_day',
      label: 'Core 90-Day Mission',
      placeholder: 'e.g., lose 20lbs, increase income, build morning routine'
    },
    {
      key: 'greatest_fear',
      label: 'Greatest Fear Blocking Action',
      placeholder: 'e.g., failure, judgment, not being good enough'
    }
  ];

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(questions.length + 1); // Move to intensity/domain selection
    }
  };

  const handleComplete = () => {
    onComplete({
      ...formData,
      current_mission: formData.mission_90_day
    });
  };

  if (step <= questions.length) {
    const currentQuestion = questions[step - 1];
    
    return (
      <div className="max-w-2xl mx-auto p-6 bg-warfare-dark/90 rounded-xl border border-warfare-blue/30">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Intel Sweep</h2>
            <span className="text-warfare-blue text-sm">
              {step} of {questions.length + 1}
            </span>
          </div>
          <div className="w-full bg-warfare-dark rounded-full h-2">
            <div 
              className="bg-warfare-red h-2 rounded-full transition-all"
              style={{ width: `${(step / (questions.length + 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">
            {step}. {currentQuestion.label}
          </Label>
          
          <Textarea
            value={formData[currentQuestion.key as keyof typeof formData] as string}
            onChange={(e) => handleInputChange(currentQuestion.key, e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="bg-warfare-dark text-white border-warfare-blue/30 min-h-[100px]"
          />
          
          <div className="flex justify-between">
            <Button 
              onClick={onSkip}
              variant="outline"
              className="text-warfare-blue border-warfare-blue/30"
            >
              Skip Setup
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-warfare-red hover:bg-warfare-red/80"
              disabled={!(formData[currentQuestion.key as keyof typeof formData] as string).trim()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Intensity and domain selection
  return (
    <div className="max-w-2xl mx-auto p-6 bg-warfare-dark/90 rounded-xl border border-warfare-blue/30">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Tactical Configuration</h2>
        <p className="text-warfare-blue">Select your operational parameters</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-white text-lg mb-3 block">Intensity Mode</Label>
          <div className="grid gap-3">
            {(['TACTICAL', 'RUTHLESS', 'LEGION'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFormData(prev => ({ ...prev, intensity_mode: mode }))}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData.intensity_mode === mode
                    ? 'border-warfare-red bg-warfare-red/20 text-white'
                    : 'border-warfare-blue/30 bg-warfare-dark text-warfare-blue hover:border-warfare-blue/50'
                }`}
              >
                <div className="font-bold">{mode}</div>
                <div className="text-sm mt-1">
                  {mode === 'TACTICAL' && 'Measured, direct guidance'}
                  {mode === 'RUTHLESS' && 'Blunt, no-excuse approach'}
                  {mode === 'LEGION' && 'Extreme, field-command discipline'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-white text-lg mb-3 block">Domain Focus (Optional)</Label>
          <div className="grid gap-3">
            <button
              onClick={() => setFormData(prev => ({ ...prev, domain_focus: '' }))}
              className={`p-3 rounded-lg border text-left ${
                formData.domain_focus === ''
                  ? 'border-warfare-red bg-warfare-red/20 text-white'
                  : 'border-warfare-blue/30 bg-warfare-dark text-warfare-blue'
              }`}
            >
              General Warfare
            </button>
            {(['corpo', 'dinheiro', 'influencia'] as const).map((domain) => (
              <button
                key={domain}
                onClick={() => setFormData(prev => ({ ...prev, domain_focus: domain }))}
                className={`p-3 rounded-lg border text-left ${
                  formData.domain_focus === domain
                    ? 'border-warfare-red bg-warfare-red/20 text-white'
                    : 'border-warfare-blue/30 bg-warfare-dark text-warfare-blue'
                }`}
              >
                {domain.charAt(0).toUpperCase() + domain.slice(1)}
                <div className="text-sm mt-1">
                  {domain === 'corpo' && 'Physical discipline & health'}
                  {domain === 'dinheiro' && 'Wealth & financial strategy'}
                  {domain === 'influencia' && 'Status & social power'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            onClick={onSkip}
            variant="outline"
            className="text-warfare-blue border-warfare-blue/30"
          >
            Skip Setup
          </Button>
          <Button 
            onClick={handleComplete}
            className="bg-warfare-red hover:bg-warfare-red/80"
          >
            Begin Mission
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
