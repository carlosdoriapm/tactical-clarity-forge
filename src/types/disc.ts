
export type DISCType = 'D' | 'I' | 'S' | 'C';

export interface DISCProfile {
  primaryType: DISCType;
  secondaryType?: DISCType;
  scores: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  description: string;
  communicationStyle: string;
  motivators: string[];
  stressors: string[];
}

export interface DISCQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    type: DISCType;
    weight: number;
  }[];
}
