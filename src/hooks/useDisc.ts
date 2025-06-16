
import { useState } from 'react';
import { DISCType, DISCProfile, DISCQuestion } from '@/types/disc';

const discQuestions: DISCQuestion[] = [
  {
    id: '1',
    question: 'In a conflict situation, you tend to:',
    options: [
      { text: 'Face it head-on and resolve quickly', type: 'D', weight: 3 },
      { text: 'Seek consensus and involve everyone', type: 'I', weight: 3 },
      { text: 'Avoid conflict and keep the peace', type: 'S', weight: 3 },
      { text: 'Analyze the facts before acting', type: 'C', weight: 3 }
    ]
  },
  {
    id: '2',
    question: 'When you need to make an important decision:',
    options: [
      { text: 'Decide quickly based on intuition', type: 'D', weight: 3 },
      { text: 'Consult friends and family', type: 'I', weight: 3 },
      { text: 'Carefully consider all options', type: 'S', weight: 3 },
      { text: 'Research thoroughly before deciding', type: 'C', weight: 3 }
    ]
  },
  {
    id: '3',
    question: 'In a work environment, you prefer:',
    options: [
      { text: 'Lead projects and set direction', type: 'D', weight: 3 },
      { text: 'Work in a team and collaborate', type: 'I', weight: 3 },
      { text: 'Have stable, predictable routines', type: 'S', weight: 3 },
      { text: 'Work with precision and quality', type: 'C', weight: 3 }
    ]
  },
  {
    id: '4',
    question: 'Your biggest motivation is:',
    options: [
      { text: 'Achieving results and overcoming challenges', type: 'D', weight: 3 },
      { text: 'Being recognized and influencing others', type: 'I', weight: 3 },
      { text: 'Contributing to the team’s well-being', type: 'S', weight: 3 },
      { text: 'Doing precise, correct work', type: 'C', weight: 3 }
    ]
  },
  {
    id: '5',
    question: 'When under pressure, you:',
    options: [
      { text: 'Become more assertive and direct', type: 'D', weight: 3 },
      { text: 'Look for external support and motivation', type: 'I', weight: 3 },
      { text: 'Withdraw and seek stability', type: 'S', weight: 3 },
      { text: 'Focus on details and perfection', type: 'C', weight: 3 }
    ]
  }
];

const discProfiles: Record<DISCType, Omit<DISCProfile, 'primaryType' | 'secondaryType' | 'scores'>> = {
  D: {
    description: 'Dominant - results-oriented, direct, decisive and competitive.',
    communicationStyle: 'Direct and objective, focused on results. Prefers quick and efficient communication.',
    motivators: ['Challenges', 'Control', 'Results', 'Competition', 'Authority'],
    stressors: ['Indecision', 'Inefficiency', 'Routine', 'Unnecessary details']
  },
  I: {
    description: 'Influential - sociable, optimistic, enthusiastic and persuasive.',
    communicationStyle: 'Expressive and people-focused. Enjoys telling stories and inspiring.',
    motivators: ['Recognition', 'Social interaction', 'Variety', 'Inspiration', 'Popularity'],
    stressors: ['Isolation', 'Criticism', 'Technical details', 'Repetitive routine']
  },
  S: {
    description: 'Steady - patient, loyal, consistent and cooperative.',
    communicationStyle: 'Calm and harmony seeking. Prefers listening and building consensus.',
    motivators: ['Stability', 'Harmony', 'Team support', 'Security', 'Tradition'],
    stressors: ['Sudden changes', 'Conflict', 'Time pressure', 'Uncertainty']
  },
  C: {
    description: 'Conscientious - analytical, precise, systematic and cautious.',
    communicationStyle: 'Accurate, fact-based and focused on quality. Prefers data and evidence.',
    motivators: ['Accuracy', 'Quality', 'Knowledge', 'Systems', 'Expertise'],
    stressors: ['Time pressure', 'Ambiguity', 'Personal criticism', 'Improvisation']
  }
};

export const useDisc = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, DISCType>>({});
  const [isComplete, setIsComplete] = useState(false);

  const answerQuestion = (questionId: string, selectedType: DISCType) => {
    const newAnswers = { ...answers, [questionId]: selectedType };
    setAnswers(newAnswers);

    if (currentQuestion < discQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const calculateProfile = (): DISCProfile => {
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    
    Object.values(answers).forEach(type => {
      scores[type] += 1;
    });

    // Normalizar scores para percentual
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    Object.keys(scores).forEach(key => {
      scores[key as DISCType] = Math.round((scores[key as DISCType] / total) * 100);
    });

    // Determinar tipo primário e secundário
    const sortedTypes = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .map(([type]) => type as DISCType);

    const primaryType = sortedTypes[0];
    const secondaryType = scores[sortedTypes[1]] > 20 ? sortedTypes[1] : undefined;

    return {
      primaryType,
      secondaryType,
      scores,
      ...discProfiles[primaryType]
    };
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
  };

  return {
    currentQuestion: discQuestions[currentQuestion],
    questionNumber: currentQuestion + 1,
    totalQuestions: discQuestions.length,
    answerQuestion,
    calculateProfile,
    resetAssessment,
    isComplete,
    progress: ((currentQuestion + (isComplete ? 1 : 0)) / discQuestions.length) * 100
  };
};
