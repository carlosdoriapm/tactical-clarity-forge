
import { useState } from 'react';
import { DISCType, DISCProfile, DISCQuestion } from '@/types/disc';

const discQuestions: DISCQuestion[] = [
  {
    id: '1',
    question: 'Em uma situação de conflito, você tende a:',
    options: [
      { text: 'Enfrentar diretamente e resolver rapidamente', type: 'D', weight: 3 },
      { text: 'Buscar consenso e envolver todos', type: 'I', weight: 3 },
      { text: 'Evitar o conflito e manter a harmonia', type: 'S', weight: 3 },
      { text: 'Analisar os fatos antes de agir', type: 'C', weight: 3 }
    ]
  },
  {
    id: '2',
    question: 'Quando você precisa tomar uma decisão importante:',
    options: [
      { text: 'Decide rapidamente baseado na intuição', type: 'D', weight: 3 },
      { text: 'Consulta amigos e familiares', type: 'I', weight: 3 },
      { text: 'Considera cuidadosamente todas as opções', type: 'S', weight: 3 },
      { text: 'Pesquisa exaustivamente antes de decidir', type: 'C', weight: 3 }
    ]
  },
  {
    id: '3',
    question: 'Em um ambiente de trabalho, você prefere:',
    options: [
      { text: 'Liderar projetos e definir direções', type: 'D', weight: 3 },
      { text: 'Trabalhar em equipe e colaborar', type: 'I', weight: 3 },
      { text: 'Ter rotinas estáveis e previsíveis', type: 'S', weight: 3 },
      { text: 'Trabalhar com precisão e qualidade', type: 'C', weight: 3 }
    ]
  },
  {
    id: '4',
    question: 'Sua maior motivação é:',
    options: [
      { text: 'Alcançar resultados e vencer desafios', type: 'D', weight: 3 },
      { text: 'Ser reconhecido e influenciar outros', type: 'I', weight: 3 },
      { text: 'Contribuir para o bem-estar da equipe', type: 'S', weight: 3 },
      { text: 'Fazer um trabalho correto e preciso', type: 'C', weight: 3 }
    ]
  },
  {
    id: '5',
    question: 'Quando sob pressão, você:',
    options: [
      { text: 'Torna-se mais assertivo e direto', type: 'D', weight: 3 },
      { text: 'Busca apoio e motivação externa', type: 'I', weight: 3 },
      { text: 'Tende a se retrair e procurar estabilidade', type: 'S', weight: 3 },
      { text: 'Foca nos detalhes e na perfeição', type: 'C', weight: 3 }
    ]
  }
];

const discProfiles: Record<DISCType, Omit<DISCProfile, 'primaryType' | 'secondaryType' | 'scores'>> = {
  D: {
    description: 'Dominante - Orientado a resultados, direto, decisivo e competitivo.',
    communicationStyle: 'Direto, objetivo, focado em resultados. Prefere comunicação rápida e eficiente.',
    motivators: ['Desafios', 'Controle', 'Resultados', 'Competição', 'Autoridade'],
    stressors: ['Indecisão', 'Ineficiência', 'Rotina', 'Detalhes desnecessários']
  },
  I: {
    description: 'Influente - Sociável, otimista, entusiástico e persuasivo.',
    communicationStyle: 'Expressivo, entusiástico, focado em pessoas. Gosta de contar histórias e inspirar.',
    motivators: ['Reconhecimento', 'Interação social', 'Variedade', 'Inspiração', 'Popularidade'],
    stressors: ['Isolamento', 'Críticas', 'Detalhes técnicos', 'Rotina repetitiva']
  },
  S: {
    description: 'Estável - Paciente, leal, consistente e cooperativo.',
    communicationStyle: 'Calmo, paciente, focado em harmonia. Prefere ouvir e construir consenso.',
    motivators: ['Estabilidade', 'Harmonia', 'Apoio à equipe', 'Segurança', 'Tradição'],
    stressors: ['Mudanças súbitas', 'Conflitos', 'Pressão de tempo', 'Incerteza']
  },
  C: {
    description: 'Consciencioso - Analítico, preciso, sistemático e cauteloso.',
    communicationStyle: 'Preciso, baseado em fatos, focado em qualidade. Prefere dados e evidências.',
    motivators: ['Precisão', 'Qualidade', 'Conhecimento', 'Sistemas', 'Especialização'],
    stressors: ['Pressão de tempo', 'Ambiguidade', 'Críticas pessoais', 'Improvisação']
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
