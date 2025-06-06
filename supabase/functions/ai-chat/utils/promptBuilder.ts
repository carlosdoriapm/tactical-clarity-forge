
import { getFirstContactMessage, getOnboardingQuestion, getNextOnboardingStep } from "./firstContactHooks.ts";

export function buildEnhancedPrompt(content: string, userProfile: any, ruthless: boolean): string {
  // If user has no profile or profile is incomplete, handle onboarding
  if (!userProfile || !userProfile.profile_complete) {
    // Check if this is the very first interaction (no profile data at all)
    if (!userProfile || !userProfile.codename) {
      // If user is providing their name in response, acknowledge and ask next question
      if (content && (content.toLowerCase().includes('carlos') || content.toLowerCase().includes('name') || content.toLowerCase().includes('call me') || content.toLowerCase().includes("i'm ") || content.toLowerCase().includes('my name'))) {
        const nextStep = getNextOnboardingStep({ codename: 'provided' });
        if (nextStep) {
          return `User has provided their name in response: "${content}"

Acknowledge this response briefly and ask the next onboarding question: "${getOnboardingQuestion(nextStep)}"

Keep it direct and clear. One question only.`;
        }
      }
      
      const firstContactMsg = getFirstContactMessage();
      return `User is beginning onboarding. Use this first contact message: "${firstContactMsg}"

Keep it direct and clear.`;
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
- Intensity Preference: ${userProfile?.intensity_mode || 'TACTICAL'}
- Main Goal: ${userProfile?.mission_90_day || 'Not set'}
- Main Challenge: ${userProfile?.vice || 'Unknown'}`;

  if (ruthless) {
    prompt += "\n\nUSE MINIMAL MODE: Short, direct, essential points only. Cut unnecessary words.";
  }

  return prompt;
}
