
import { DecisionTemplate } from '@/types/decision-framework';

export const DECISION_TEMPLATES: DecisionTemplate[] = [
  {
    id: 'career-change',
    name: 'Career Change Decision',
    description: 'Navigate major career transitions with strategic analysis',
    category: 'career',
    questions: [
      'What is your current role and what role are you considering?',
      'What are your primary motivations for this change?',
      'What skills do you currently have vs. what you need?',
      'What is your financial situation and timeline?',
      'What are the market conditions in your target field?'
    ],
    framework: {
      type: 'pros-cons',
      structure: {
        categories: ['Financial Impact', 'Career Growth', 'Personal Fulfillment', 'Risk Factors', 'Timeline']
      }
    }
  },
  {
    id: 'business-investment',
    name: 'Business Investment Analysis',
    description: 'Evaluate business opportunities and investment decisions',
    category: 'business',
    questions: [
      'What is the investment opportunity and required capital?',
      'What is your risk tolerance and investment timeline?',
      'What market research have you conducted?',
      'What is your experience in this industry?',
      'What are your exit strategy options?'
    ],
    framework: {
      type: 'risk-assessment',
      structure: {
        risk_categories: ['Market Risk', 'Financial Risk', 'Operational Risk', 'Competitive Risk'],
        assessment_scale: 'high-medium-low'
      }
    }
  },
  {
    id: 'team-management',
    name: 'Team Management Challenge',
    description: 'Address leadership and team performance issues',
    category: 'leadership',
    questions: [
      'What specific team challenge are you facing?',
      'What is the current team dynamic and performance?',
      'What have you tried so far?',
      'What are the constraints and resources available?',
      'What is the desired outcome and timeline?'
    ],
    framework: {
      type: 'swot',
      structure: {
        focus_areas: ['Team Strengths', 'Team Weaknesses', 'Growth Opportunities', 'External Threats']
      }
    }
  },
  {
    id: 'major-purchase',
    name: 'Major Purchase Decision',
    description: 'Evaluate significant financial purchases and investments',
    category: 'personal',
    questions: [
      'What are you considering purchasing and why?',
      'What is your current financial situation?',
      'What alternatives have you considered?',
      'What is the urgency and timeline?',
      'How will this impact your other financial goals?'
    ],
    framework: {
      type: 'cost-benefit',
      structure: {
        time_horizons: ['Immediate', '1 Year', '5 Years'],
        cost_categories: ['Direct Costs', 'Opportunity Costs', 'Maintenance Costs']
      }
    }
  }
];

export const PERSPECTIVE_TEMPLATES = {
  'career-change': [
    'Financial Advisor: Focus on monetary implications and stability',
    'Career Coach: Emphasize growth potential and skill development',
    'Family Counselor: Consider impact on personal relationships and work-life balance',
    'Industry Expert: Provide market insights and realistic expectations',
    'Risk Manager: Highlight potential downsides and mitigation strategies'
  ],
  'business-investment': [
    'Venture Capitalist: Evaluate scalability and ROI potential',
    'Financial Advisor: Assess portfolio diversification and risk',
    'Industry Analyst: Provide market trends and competitive landscape',
    'Operations Expert: Focus on execution challenges and requirements',
    'Exit Strategy Specialist: Consider long-term liquidity options'
  ],
  'team-management': [
    'HR Professional: Focus on policies, culture, and employee satisfaction',
    'Performance Coach: Emphasize skill development and motivation',
    'Organizational Psychologist: Analyze team dynamics and communication',
    'Strategic Consultant: Align team goals with business objectives',
    'Change Management Expert: Plan transition and adoption strategies'
  ],
  'major-purchase': [
    'Financial Planner: Evaluate budget impact and alternatives',
    'Consumer Advocate: Focus on value and consumer protection',
    'Investment Advisor: Consider opportunity costs and asset allocation',
    'Minimalist Coach: Question necessity and lifestyle impact',
    'Insurance Specialist: Assess protection and risk factors'
  ]
};
