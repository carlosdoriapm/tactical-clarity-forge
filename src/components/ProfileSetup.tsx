
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
    codename: '',
    age: '',
    physical_condition: 'average' as 'fit' | 'average' | 'overweight' | 'injured' | 'unknown',
    childhood_summary: '',
    parents: '',
    siblings: '',
    relationship_status: 'single' as 'single' | 'partnered' | 'married' | 'divorced' | 'widowed',
    school_experience: 'neutral' as 'war_zone' | 'throne' | 'exile' | 'neutral',
    vice: '',
    mission_90_day: '',
    fear_block: '',
    intensity_mode: 'TACTICAL' as 'TACTICAL' | 'RUTHLESS' | 'LEGION'
  });

  const questions = [
    {
      key: 'codename',
      label: 'Combat Codename',
      placeholder: 'e.g., Shadow Wolf, Iron Phoenix, Night Hawk',
      type: 'input'
    },
    {
      key: 'age',
      label: 'Age (12-80)',
      placeholder: 'e.g., 28',
      type: 'number'
    },
    {
      key: 'physical_condition',
      label: 'Physical Condition',
      type: 'select',
      options: [
        { value: 'fit', label: 'Fit - Regular training, good shape' },
        { value: 'average', label: 'Average - Decent shape, inconsistent' },
        { value: 'overweight', label: 'Overweight - Need to rebuild' },
        { value: 'injured', label: 'Injured - Working around limitations' },
        { value: 'unknown', label: 'Unknown - Need assessment' }
      ]
    },
    {
      key: 'childhood_summary',
      label: 'Childhood Summary (max 3 lines)',
      placeholder: 'Brief overview of your formative years, key experiences that shaped you',
      type: 'textarea'
    },
    {
      key: 'parents',
      label: 'Parents Status',
      placeholder: 'e.g., "Alive, distant", "Father absent", "Both strong anchors"',
      type: 'input'
    },
    {
      key: 'siblings',
      label: 'Siblings',
      placeholder: 'e.g., "1 brother (rival)", "Only child", "2 sisters (supportive)"',
      type: 'input'
    },
    {
      key: 'relationship_status',
      label: 'Relationship Status',
      type: 'select',
      options: [
        { value: 'single', label: 'Single' },
        { value: 'partnered', label: 'Partnered' },
        { value: 'married', label: 'Married' },
        { value: 'divorced', label: 'Divorced' },
        { value: 'widowed', label: 'Widowed' }
      ]
    },
    {
      key: 'school_experience',
      label: 'School Experience',
      type: 'select',
      options: [
        { value: 'war_zone', label: 'War Zone - Bullied, struggled, survival mode' },
        { value: 'throne', label: 'Throne - Popular, successful, leadership' },
        { value: 'exile', label: 'Exile - Outcast, isolated, observer' },
        { value: 'neutral', label: 'Neutral - Average experience, blended in' }
      ]
    },
    {
      key: 'vice',
      label: 'Primary Vice or Weakness',
      placeholder: 'e.g., social media addiction, alcohol, procrastination, anger',
      type: 'textarea'
    },
    {
      key: 'mission_90_day',
      label: 'Core 90-Day Mission',
      placeholder: 'e.g., lose 20lbs and build morning routine, increase income by $2K, quit smoking',
      type: 'textarea'
    },
    {
      key: 'fear_block',
      label: 'Greatest Fear Blocking Action',
      placeholder: 'e.g., failure and judgment, not being good enough, losing control',
      type: 'textarea'
    }
  ];

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(questions.length + 1); // Move to intensity selection
    }
  };

  const handleComplete = () => {
    onComplete({
      ...formData,
      age: parseInt(formData.age) || null
    });
  };

  const isCurrentStepValid = () => {
    const currentQuestion = questions[step - 1];
    if (!currentQuestion) return true;
    
    const value = formData[currentQuestion.key as keyof typeof formData];
    if (currentQuestion.key === 'age') {
      const age = parseInt(formData.age);
      return age >= 12 && age <= 80;
    }
    return value && value.toString().trim() !== '';
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
          
          {currentQuestion.type === 'select' ? (
            <select
              value={formData[currentQuestion.key as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(currentQuestion.key, e.target.value)}
              className="w-full p-3 bg-warfare-dark text-white border border-warfare-blue/30 rounded-md"
            >
              {currentQuestion.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : currentQuestion.type === 'number' ? (
            <Input
              type="number"
              min="12"
              max="80"
              value={formData[currentQuestion.key as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(currentQuestion.key, e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="bg-warfare-dark text-white border-warfare-blue/30"
            />
          ) : currentQuestion.type === 'textarea' ? (
            <Textarea
              value={formData[currentQuestion.key as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(currentQuestion.key, e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="bg-warfare-dark text-white border-warfare-blue/30 min-h-[100px]"
            />
          ) : (
            <Input
              value={formData[currentQuestion.key as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(currentQuestion.key, e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="bg-warfare-dark text-white border-warfare-blue/30"
            />
          )}
          
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
              disabled={!isCurrentStepValid()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Intensity selection
  return (
    <div className="max-w-2xl mx-auto p-6 bg-warfare-dark/90 rounded-xl border border-warfare-blue/30">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Tactical Configuration</h2>
        <p className="text-warfare-blue">Select your operational intensity</p>
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
