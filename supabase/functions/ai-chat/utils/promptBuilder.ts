
import { getFirstContactMessage, getOnboardingQuestion, getNextOnboardingStep } from "./firstContactHooks.ts";

export function buildEnhancedPrompt(content: string, userProfileData: any, ruthless: boolean): string {
  // Extract the actual user profile from the nested structure
  const userProfile = userProfileData?.userProfile || userProfileData;
  
  console.log('Building prompt for profile:', JSON.stringify(userProfile));
  
  // If user has no profile or profile is incomplete, handle onboarding
  if (!userProfile || !userProfile.profile_complete) {
    // Check if this is the very first interaction (no profile data at all)
    if (!userProfile) {
      console.log('No profile found - first contact');
      const firstContactMsg = getFirstContactMessage();
      return `This is the user's first contact. Use this exact message: "${firstContactMsg}"`;
    }
    
    // Check if profile is completely empty (no onboarding data at all)
    if (!userProfile.codename && !userProfile.age && !userProfile.physical_condition) {
      console.log('Profile exists but empty - asking for name');
      const firstContactMsg = getFirstContactMessage();
      return `User hasn't provided their name yet. Ask: "${firstContactMsg}"`;
    }
    
    // If we have a name but need more info, determine what's next
    const nextStep = getNextOnboardingStep(userProfile);
    console.log('Next onboarding step needed:', nextStep);
    
    if (nextStep) {
      const nextQuestion = getOnboardingQuestion(nextStep);
      
      return `User is in onboarding. Current user response: "${content}"

Acknowledge their previous answer briefly if appropriate, then ask: "${nextQuestion}"

Keep it direct and clear. One question only.`;
    }
    
    // All onboarding complete but profile not marked complete
    console.log('Onboarding appears complete');
    return `Onboarding appears complete. Current user message: "${content}"

The user has provided all required information. You can now engage in normal counseling conversation. Acknowledge their completion of the initial questions and begin the counseling process.`;
  }

  // Standard interaction for complete profiles
  console.log('Profile complete - normal interaction');
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
