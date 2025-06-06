
import { getFirstContactMessage, getOnboardingQuestion } from "./firstContactHooks.ts";

export function buildEnhancedPrompt(content: string, userProfile: any, ruthless: boolean): string {
  // If user has no profile or profile is incomplete, handle onboarding
  if (!userProfile || !userProfile.profile_complete) {
    // Check if this is the very first interaction (no profile data at all)
    if (!userProfile || !userProfile.codename) {
      // If user is providing their name in response, acknowledge and ask next question
      if (content && (content.toLowerCase().includes('carlos') || content.toLowerCase().includes('name') || content.toLowerCase().includes('call me'))) {
        return `User has provided their name in response: "${content}"

Acknowledge this response briefly and ask the next onboarding question: "${getOnboardingQuestion('age')}"

Keep it direct and clear. One question only.`;
      }
      
      const firstContactMsg = getFirstContactMessage(userProfile?.id || 'anonymous');
      return `User is beginning onboarding. Start with this first contact message: "${firstContactMsg}"

Then ask the first onboarding question: "${getOnboardingQuestion('codename')}"

Keep it direct and clear. One question only.`;
    }
    
    // Determine next onboarding step based on what's missing
    const nextStep = getNextOnboardingStep(userProfile);
    if (nextStep) {
      return `User is in onboarding. Current user input: "${content}"

If they answered the previous question, acknowledge briefly and ask: "${getOnboardingQuestion(nextStep)}"

If they haven't answered yet, repeat the current question. Keep it direct and clear.`;
    }
  }

  // Standard interaction for complete profiles
  let prompt = `User message: "${content}"

User Profile Context:
- Name: ${userProfile?.codename || 'Unknown'}
- Age: ${userProfile?.age || 'Unknown'}
- Physical Condition: ${userProfile?.physical_condition || 'Unknown'}
- Intensity Preference: ${userProfile?.intensity_mode || 'DIRECT'}
- Main Goal: ${userProfile?.mission_90_day || 'Not set'}
- Main Challenge: ${userProfile?.vice || 'Unknown'}`;

  if (ruthless) {
    prompt += "\n\nUSE MINIMAL MODE: Short, direct, essential points only. Cut unnecessary words.";
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
