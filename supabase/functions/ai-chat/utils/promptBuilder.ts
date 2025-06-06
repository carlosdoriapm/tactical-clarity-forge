
import { getFirstContactMessage, getOnboardingQuestion } from "./firstContactHooks.ts";

export function buildEnhancedPrompt(content: string, userProfile: any, ruthless: boolean): string {
  // If user has no profile or profile is incomplete, handle onboarding
  if (!userProfile || !userProfile.profile_complete) {
    // Check if this is the very first interaction (no profile data at all)
    if (!userProfile || !userProfile.codename) {
      const firstContactMsg = getFirstContactMessage(userProfile?.id || 'anonymous');
      return `User is beginning onboarding. Start with this first contact message: "${firstContactMsg}"
      
Then ask the first onboarding question: "${getOnboardingQuestion('codename')}"

Keep it tactical and direct. One question only.`;
    }
    
    // Determine next onboarding step based on what's missing
    const nextStep = getNextOnboardingStep(userProfile);
    if (nextStep) {
      return `User is in onboarding. Ask: "${getOnboardingQuestion(nextStep)}"
      
Current user input: "${content}"

If they answered the previous question, acknowledge briefly and move to the next question. Keep it tactical and direct.`;
    }
  }

  // Standard interaction for complete profiles
  let prompt = `User message: "${content}"

User Profile Context:
- Codename: ${userProfile?.codename || 'Unknown'}
- Age: ${userProfile?.age || 'Unknown'}
- Physical Condition: ${userProfile?.physical_condition || 'Unknown'}
- Intensity Mode: ${userProfile?.intensity_mode || 'TACTICAL'}
- Mission: ${userProfile?.mission_90_day || 'Not set'}
- Primary Vice: ${userProfile?.vice || 'Unknown'}`;

  if (ruthless) {
    prompt += "\n\nUSE RUTHLESS MODE: Short, dry, minimal. Cut 25% of words, strip justification.";
  }

  return prompt;
}

function getNextOnboardingStep(userProfile: any): string | null {
  const steps = [
    'codename', 'age', 'physical_condition', 'relationship_status', 
    'childhood_summary', 'parents', 'siblings', 'school_experience',
    'vice', 'mission_90_day', 'fear_block', 'intensity_mode'
  ];
  
  for (const step of steps) {
    if (!userProfile[step]) {
      return step;
    }
  }
  
  return null; // All steps complete
}
