
export function buildEnhancedPrompt(content: string, userProfile: any, ruthless: boolean): string {
  let enhancedPrompt = content;
  
  // Add user context if profile exists
  if (userProfile) {
    const contextInfo = [];
    if (userProfile.intensity_mode) contextInfo.push(`intensity_mode: ${userProfile.intensity_mode}`);
    if (userProfile.domain_focus) contextInfo.push(`domain_focus: ${userProfile.domain_focus}`);
    if (userProfile.current_mission) contextInfo.push(`current_mission: ${userProfile.current_mission}`);
    if (!userProfile.profile_complete) contextInfo.push(`profile_complete: false`);
    
    if (contextInfo.length > 0) {
      enhancedPrompt = `${content}\n\nUser context: ${contextInfo.join(', ')}`;
    }
  }
  
  // Add ruthless mode indicator
  if (ruthless) {
    enhancedPrompt += `\n\nruthless mode: on`;
  }

  return enhancedPrompt;
}
