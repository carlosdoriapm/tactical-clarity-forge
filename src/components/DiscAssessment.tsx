
import React from 'react';
import { useDisc } from '@/hooks/useDisc';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface DiscAssessmentProps {
  onComplete: (profile: any) => void;
  onSkip: () => void;
}

const DiscAssessment = ({ onComplete, onSkip }: DiscAssessmentProps) => {
  const { 
    currentQuestion, 
    questionNumber, 
    totalQuestions, 
    answerQuestion, 
    calculateProfile, 
    isComplete, 
    progress 
  } = useDisc();

  const handleAnswer = (selectedType: any) => {
    answerQuestion(currentQuestion.id, selectedType);
  };

  const handleComplete = () => {
    const profile = calculateProfile();
    onComplete(profile);
  };

  if (isComplete) {
    const profile = calculateProfile();
    return (
      <div className="max-w-2xl mx-auto p-6 bg-warfare-dark/90 rounded-xl border border-warfare-blue/30">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Complete DISC Analysis</h2>
          <p className="text-warfare-blue">Your psychological profile has been mapped</p>
        </div>

        <Card className="bg-warfare-dark/50 border-warfare-blue/30 p-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-warfare-red mb-2">
              {profile.primaryType}
              {profile.secondaryType && <span className="text-warfare-blue">/{profile.secondaryType}</span>}
            </div>
            <h3 className="text-xl text-white mb-4">{profile.description}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {Object.entries(profile.scores).map(([type, score]) => (
                <div key={type} className="text-center">
                  <div className="text-lg font-bold text-warfare-blue">{type}</div>
                  <div className="text-2xl text-white">{score}%</div>
                </div>
              ))}
            </div>

            <div className="text-left space-y-3">
              <div>
                <h4 className="font-bold text-warfare-blue">Communication Style:</h4>
                <p className="text-white text-sm">{profile.communicationStyle}</p>
              </div>
              <div>
                <h4 className="font-bold text-warfare-blue">Motivators:</h4>
                <p className="text-white text-sm">{profile.motivators.join(', ')}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button onClick={onSkip} variant="outline" className="text-warfare-blue border-warfare-blue/30">
            Skip for Now
          </Button>
          <Button onClick={handleComplete} className="bg-warfare-red hover:bg-warfare-red/80">
            Save Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-warfare-dark/90 rounded-xl border border-warfare-blue/30">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">DISC Analysis</h2>
          <span className="text-warfare-blue text-sm">
            {questionNumber} of {totalQuestions}
          </span>
        </div>
        <Progress value={progress} className="w-full h-2" />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg text-white mb-4">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(option.type)}
                variant="outline"
                className="w-full text-left p-4 h-auto border-warfare-blue/30 text-white hover:border-warfare-blue hover:bg-warfare-blue/20"
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button onClick={onSkip} variant="outline" className="text-warfare-blue border-warfare-blue/30">
            Skip Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscAssessment;
