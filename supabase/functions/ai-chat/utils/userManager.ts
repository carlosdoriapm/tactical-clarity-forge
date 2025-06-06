
export async function getUserProfile(supabase: any, userId: string, userEmail: string) {
  // Get or create user profile
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
    return newProfile;
  } else {
    // Update last active
    await supabase
      .from("users")
      .update({ last_active: new Date().toISOString() })
      .eq("id", existingProfile.id);
    return existingProfile;
  }
}

export async function updateUserProfile(supabase: any, userProfile: any, profileData: any) {
  const { data: updatedProfile } = await supabase
    .from("users")
    .update({
      intensity_mode: profileData.intensity_mode,
      domain_focus: profileData.domain_focus,
      current_mission: profileData.current_mission,
      profile_complete: true,
      onboarding_completed: true
    })
    .eq("id", userProfile.id)
    .select()
    .single();
  return updatedProfile;
}
