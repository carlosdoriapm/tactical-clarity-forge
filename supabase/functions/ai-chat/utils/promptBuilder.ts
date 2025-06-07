
import { getFirstContactMessage, getOnboardingQuestion, getNextOnboardingStep } from "./firstContactHooks.ts";

export function buildEnhancedPrompt(content: string, userProfileData: any, ruthless: boolean): string {
  console.log('=== PROMPT BUILDER START ===');
  console.log('Input userProfileData:', JSON.stringify(userProfileData, null, 2));
  
  // Extract profiles from the data structure
  const userProfile = userProfileData?.userProfile;
  const combatantProfile = userProfileData?.combatantProfile;
  
  console.log('=== EXTRACTED PROFILES ===');
  console.log('User profile:', JSON.stringify(userProfile, null, 2));
  console.log('Combatant profile:', JSON.stringify(combatantProfile, null, 2));
  
  // If user has no profile data at all, this is first contact
  if (!userProfile) {
    console.log('=== FIRST CONTACT - NO PROFILE ===');
    const firstContactMsg = getFirstContactMessage();
    return `This is the user's first contact. Use this exact message: "${firstContactMsg}"`;
  }
  
  // Check if we actually have a complete combatant profile with all required fields
  const hasCompleteProfile = combatantProfile && 
    combatantProfile.codename && 
    combatantProfile.age && 
    combatantProfile.physical_condition && 
    combatantProfile.childhood_summary && 
    combatantProfile.parents && 
    combatantProfile.relationship_status && 
    combatantProfile.school_experience && 
    combatantProfile.vice && 
    combatantProfile.mission_90_day && 
    combatantProfile.fear_block && 
    combatantProfile.intensity_mode;

  console.log('=== PROFILE COMPLETENESS CHECK ===');
  console.log('Has complete profile:', hasCompleteProfile);
  
  // If we truly have a complete profile, proceed with normal conversation
  if (hasCompleteProfile) {
    console.log('=== PROFILE COMPLETE - NORMAL CONVERSATION ===');
    let prompt = `User message: "${content}"

User Profile Context:
- Name: ${combatantProfile.codename}
- Age: ${combatantProfile.age}
- Physical Condition: ${combatantProfile.physical_condition}
- Intensity Preference: ${combatantProfile.intensity_mode}
- Main Goal: ${combatantProfile.mission_90_day}
- Main Challenge: ${combatantProfile.vice}`;

    if (ruthless) {
      prompt += "\n\nUSE MINIMAL MODE: Short, direct, essential points only. Cut unnecessary words.";
    }

    return prompt;
  }
  
  // We're in onboarding - check what information we still need
  console.log('=== ONBOARDING MODE ===');
  
  // If no combatant profile exists at all, ask for name
  if (!combatantProfile) {
    console.log('=== NO COMBATANT PROFILE - ASKING FOR NAME ===');
    const firstContactMsg = getFirstContactMessage();
    return `User is starting onboarding. Ask: "${firstContactMsg}"`;
  }
  
  // If we have combatant profile but no name, ask for name
  if (!combatantProfile.codename) {
    console.log('=== NO CODENAME - ASKING FOR NAME ===');
    const firstContactMsg = getFirstContactMessage();
    return `User hasn't provided their name yet. Ask: "${firstContactMsg}"`;
  }
  
  // We have a name, determine what's next
  console.log('=== DETERMINING NEXT ONBOARDING STEP ===');
  const nextStep = getNextOnboardingStep(combatantProfile);
  console.log('Next step needed:', nextStep);
  
  if (nextStep) {
    const nextQuestion = getOnboardingQuestion(nextStep);
    console.log('Next question:', nextQuestion);
    
    return `User is in onboarding. Current user response: "${content}"

Acknowledge their previous answer briefly if appropriate, then ask: "${nextQuestion}"

Keep it direct and clear. One question only.`;
  }
  
  // All onboarding steps complete but not marked as complete
  console.log('=== ONBOARDING COMPLETE - MARKING AS DONE ===');
  return `Onboarding appears complete. Current user message: "${content}"

The user has provided all required information. You can now engage in normal counseling conversation. Acknowledge their completion of the initial questions and begin the counseling process.`;
}
