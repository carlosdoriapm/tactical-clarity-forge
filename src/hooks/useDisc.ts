
import { useState } from 'react';
import { DISCType, DISCProfile, DISCQuestion } from '@/types/disc';

const discQuestions: DISCQuestion[] = [
  {
    id: '1',
    question: 'In a conflict situation, you tend to:',
    options: [
      { text: 'Confront the issue quickly', type: 'D', weight: 3 },
      { text: 'Seek consensus with everyone', type: 'I', weight: 3 },
      { text: 'Avoid the conflict and keep peace', type: 'S', weight: 3 },
      { text: 'Analyze the facts before acting', type: 'C', weight: 3 }
    ]
  },
  {
    id: '2',
    question: 'When you need to make an important decision:',
    options: [
      { text: 'Decide quickly based on intuition', type: 'D', weight: 3 },
      { text: 'Consult friends and family', type: 'I', weight: 3 },
      { text: 'Carefully weigh all options', type: 'S', weight: 3 },
      { text: 'Research extensively before choosing', type: 'C', weight: 3 }
    ]
  },
  {
    id: '3',
    question: 'In a work environment, you prefer to:',
    options: [
      { text: 'Lead projects and set direction', type: 'D', weight: 3 },
      { text: 'Work in a team and collaborate', type: 'I', weight: 3 },
      { text: 'Have stable and predictable routines', type: 'S', weight: 3 },
      { text: 'Focus on precision and quality', type: 'C', weight: 3 }
    ]
  },
  {
    id: '4',
    question: 'Your greatest motivation is:',
    options: [
      { text: 'Achieving results and overcoming challenges', type: 'D', weight: 3 },
      { text: 'Being recognized and influencing others', type: 'I', weight: 3 },
      { text: 'Contributing to team well-being', type: 'S', weight: 3 },
      { text: 'Doing correct and accurate work', type: 'C', weight: 3 }
    ]
  },
  {
    id: '5',
    question: 'Under pressure, you:',
    options: [
      { text: 'Become assertive and direct', type: 'D', weight: 3 },
      { text: 'Seek external support and motivation', type: 'I', weight: 3 },
      { text: 'Withdraw and look for stability', type: 'S', weight: 3 },
      { text: 'Focus on detail and perfection', type: 'C', weight: 3 }
    ]
  },
  {
    id: '6',
    question: 'When starting a new project, you:',
    options: [
      { text: 'Jump right in and figure it out', type: 'D', weight: 3 },
      { text: 'Rally everyone with excitement', type: 'I', weight: 3 },
      { text: 'Wait for clear instructions', type: 'S', weight: 3 },
      { text: 'Create a detailed plan first', type: 'C', weight: 3 }
    ]
  },
  {
    id: '7',
    question: 'In group discussions, you often:',
    options: [
      { text: 'Take charge and drive the talk', type: 'D', weight: 3 },
      { text: 'Share stories and ideas enthusiastically', type: 'I', weight: 3 },
      { text: 'Listen carefully and support others', type: 'S', weight: 3 },
      { text: 'Provide data and structure', type: 'C', weight: 3 }
    ]
  },
  {
    id: '8',
    question: 'What frustrates you the most?',
    options: [
      { text: 'Delays and indecision', type: 'D', weight: 3 },
      { text: 'Lack of social interaction', type: 'I', weight: 3 },
      { text: 'Unexpected changes', type: 'S', weight: 3 },
      { text: 'Low standards or sloppy work', type: 'C', weight: 3 }
    ]
  },
  {
    id: '9',
    question: 'Which environment makes you thrive?',
    options: [
      { text: 'Competitive and fast-paced', type: 'D', weight: 3 },
      { text: 'Friendly and energetic', type: 'I', weight: 3 },
      { text: 'Stable and predictable', type: 'S', weight: 3 },
      { text: 'Organized and systematic', type: 'C', weight: 3 }
    ]
  },
  {
    id: '10',
    question: 'When giving feedback, you:',
    options: [
      { text: 'Are direct and to the point', type: 'D', weight: 3 },
      { text: 'Keep it positive and encouraging', type: 'I', weight: 3 },
      { text: 'Are careful not to upset anyone', type: 'S', weight: 3 },
      { text: 'Provide detailed observations', type: 'C', weight: 3 }
    ]
  },
  {
    id: '11',
    question: 'You measure success by:',
    options: [
      { text: 'Winning and ambitious goals achieved', type: 'D', weight: 3 },
      { text: 'Being liked and inspiring others', type: 'I', weight: 3 },
      { text: 'Maintaining close relationships', type: 'S', weight: 3 },
      { text: 'Delivering accurate, quality work', type: 'C', weight: 3 }
    ]
  },
  {
    id: '12',
    question: 'How do you handle setbacks?',
    options: [
      { text: 'Quickly find another solution', type: 'D', weight: 3 },
      { text: 'Talk it through with others', type: 'I', weight: 3 },
      { text: 'Take time to regain balance', type: 'S', weight: 3 },
      { text: 'Analyze what went wrong', type: 'C', weight: 3 }
    ]
  },
  {
    id: '13',
    question: 'Your leadership style is best described as:',
    options: [
      { text: 'Commanding and results-oriented', type: 'D', weight: 3 },
      { text: 'Charismatic and motivational', type: 'I', weight: 3 },
      { text: 'Supportive and consistent', type: 'S', weight: 3 },
      { text: 'Methodical and planning-focused', type: 'C', weight: 3 }
    ]
  },
  {
    id: '14',
    question: 'In team settings, you value:',
    options: [
      { text: 'Decisive action and rapid progress', type: 'D', weight: 3 },
      { text: 'Open communication and enthusiasm', type: 'I', weight: 3 },
      { text: 'Cooperation and stability', type: 'S', weight: 3 },
      { text: 'Clear procedures and roles', type: 'C', weight: 3 }
    ]
  },
  {
    id: '15',
    question: 'When faced with a tight deadline, you:',
    options: [
      { text: 'Take charge and push to finish', type: 'D', weight: 3 },
      { text: 'Motivate the team with energy', type: 'I', weight: 3 },
      { text: 'Stay calm and maintain routine', type: 'S', weight: 3 },
      { text: 'Organize tasks meticulously', type: 'C', weight: 3 }
    ]
  }
];

const discProfiles: Record<DISCType, Omit<DISCProfile, 'primaryType' | 'secondaryType' | 'scores'>> = {
  D: {
    description: 'Dominant - Results-oriented, direct, decisive and competitive.',
    communicationStyle: 'Direct and objective, focused on outcomes. Prefers quick and efficient communication.',
    motivators: ['Challenges', 'Control', 'Achievements', 'Competition', 'Authority'],
    stressors: ['Indecision', 'Inefficiency', 'Routine', 'Unnecessary details']
  },
  I: {
    description: 'Influential - Sociable, optimistic, enthusiastic and persuasive.',
    communicationStyle: 'Expressive and enthusiastic, people-focused. Enjoys storytelling and inspiring others.',
    motivators: ['Recognition', 'Social interaction', 'Variety', 'Inspiration', 'Popularity'],
    stressors: ['Isolation', 'Criticism', 'Technical details', 'Monotonous routine']
  },
  S: {
    description: 'Steady - Patient, loyal, consistent and cooperative.',
    communicationStyle: 'Calm and patient, harmony oriented. Prefers listening and building consensus.',
    motivators: ['Stability', 'Harmony', 'Team support', 'Security', 'Tradition'],
    stressors: ['Sudden changes', 'Conflict', 'Time pressure', 'Uncertainty']
  },
  C: {
    description: 'Conscientious - Analytical, precise, systematic and cautious.',
    communicationStyle: 'Fact-based and quality focused. Prefers data and evidence.',
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
