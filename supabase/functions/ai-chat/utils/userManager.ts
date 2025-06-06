
export async function getUserProfile(supabase: any, userId: string, userEmail: string) {
  // Get or create user profile in users table (for compatibility)
  const { data: existingProfile } = await supabase
    .from("users")
    .select("*")
    .eq("email", userEmail)
    .single();
    
  if (!existingProfile) {
    // Create new user profile
    const { data: newProfile } = await supabase
      .from("users")
      .insert([{ 
        email: userEmail,
        profile_complete: false,
        last_active: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { userProfile: newProfile, combatantProfile: null };
  } else {
    // Update last active
    await supabase
      .from("users")
      .update({ last_active: new Date().toISOString() })
      .eq("id", existingProfile.id);
    
    // Get combatant profile if it exists
    const { data: combatantProfile } = await supabase
      .from("combatant_profile")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    
    return { userProfile: existingProfile, combatantProfile };
  }
}

export async function updateUserProfile(supabase: any, userProfile: any, profileData: any) {
  // Update the combatant_profile table
  const combatantData = {
    user_id: userProfile.id,
    codename: profileData.codename,
    age: profileData.age,
    physical_condition: profileData.physical_condition,
    childhood_summary: profileData.childhood_summary,
    parents: profileData.parents,
    siblings: profileData.siblings,
    relationship_status: profileData.relationship_status,
    school_experience: profileData.school_experience,
    vice: profileData.vice,
    mission_90_day: profileData.mission_90_day,
    fear_block: profileData.fear_block,
    intensity_mode: profileData.intensity_mode,
    profile_complete: true
  };

  // Check if combatant profile exists
  const { data: existingCombatant } = await supabase
    .from("combatant_profile")
    .select("id")
    .eq("user_id", userProfile.id)
    .maybeSingle();

  let combatantProfile;
  if (existingCombatant) {
    // Update existing combatant profile
    const { data: updatedCombatant } = await supabase
      .from("combatant_profile")
      .update(combatantData)
      .eq("id", existingCombatant.id)
      .select()
      .single();
    combatantProfile = updatedCombatant;
  } else {
    // Create new combatant profile
    const { data: newCombatant } = await supabase
      .from("combatant_profile")
      .insert([combatantData])
      .select()
      .single();
    combatantProfile = newCombatant;
  }

  // Also update the legacy users table for compatibility
  const { data: updatedProfile } = await supabase
    .from("users")
    .update({
      intensity_mode: profileData.intensity_mode,
      current_mission: profileData.mission_90_day,
      profile_complete: true,
      onboarding_completed: true
    })
    .eq("id", userProfile.id)
    .select()
    .single();

  return { userProfile: updatedProfile, combatantProfile };
}
