
import { getFirstContactMessage, getOnboardingQuestion, getNextOnboardingStep } from "./firstContactHooks.ts";

export function buildEnhancedPrompt(content: string, userProfileData: any, ruthless: boolean): string {
  // Extract the actual user profile from the nested structure
  const userProfile = userProfileData?.userProfile || userProfileData;
  
  // If user has no profile or profile is incomplete, handle onboarding
  if (!userProfile || !userProfile.profile_complete) {
    // Check if this is the very first interaction (no profile data at all)
    if (!userProfile) {
      // Very first contact - show welcome message
      const firstContactMsg = getFirstContactMessage();
      return `This is the user's first contact. Use this exact message: "${firstContactMsg}"`;
    }
    
    // Check if profile is completely empty (no onboarding data at all)
    if (!userProfile.codename && !userProfile.age && !userProfile.physical_condition) {
      // If user is providing their name in response, acknowledge and ask next question
      if (content && (content.toLowerCase().includes('carlos') || content.toLowerCase().includes('name') || content.toLowerCase().includes('call me') || content.toLowerCase().includes("i'm ") || content.toLowerCase().includes('my name') || content.length < 50)) {
        return `User has provided their name: "${content}"

Acknowledge this briefly and ask the next onboarding question: "How old are you?"

Keep it direct and clear. One question only.`;
      }
      
      // Still need the name
      const firstContactMsg = getFirstContactMessage();
      return `User hasn't provided their name yet. Ask: "${firstContactMsg}"`;
    }
    
    // Determine what information we still need using the actual profile data
    const nextStep = getNextOnboardingStep(userProfile);
    if (nextStep) {
      const nextQuestion = getOnboardingQuestion(nextStep);
      
      return `User is in onboarding. Current user response: "${content}"

Acknowledge their previous answer briefly if appropriate, then ask: "${nextQuestion}"

Keep it direct and clear. One question only.`;
    }
    
    // All onboarding complete but profile not marked complete
    return `Onboarding appears complete. Current user message: "${content}"

The user has provided all required information. You can now engage in normal counseling conversation. Acknowledge their completion of the initial questions and begin the counseling process.`;
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
