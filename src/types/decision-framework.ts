
export interface DecisionTemplate {
  id: string;
  name: string;
  description: string;
  category: 'career' | 'business' | 'personal' | 'investment' | 'leadership';
  questions: string[];
  framework: DecisionFramework;
}

export interface DecisionFramework {
  type: 'pros-cons' | 'swot' | 'risk-assessment' | 'cost-benefit' | 'decision-matrix';
  structure: any;
}

export interface PerspectiveAnalysis {
  perspective: string;
  viewpoint: string;
  considerations: string[];
  risks: string[];
  opportunities: string[];
}

export interface DecisionAnalysis {
  template: DecisionTemplate;
  userInput: string;
  perspectives: PerspectiveAnalysis[];
  framework_analysis: any;
  recommendations: string[];
  next_steps: string[];
  bias_warnings: string[];
}
