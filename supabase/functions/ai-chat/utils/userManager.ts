
export async function getUserProfile(supabase: any, userId: string, userEmail: string) {
  console.log('=== GET USER PROFILE START ===');
  console.log('User ID:', userId);
  console.log('User Email:', userEmail);
  
  // Get or create user profile in users table (for compatibility)
  const { data: existingProfile } = await supabase
    .from("users")
    .select("*")
    .eq("email", userEmail)
    .single();
    
  console.log('=== EXISTING USER PROFILE ===');
  console.log('Existing profile:', JSON.stringify(existingProfile, null, 2));
    
  if (!existingProfile) {
    console.log('=== CREATING NEW USER PROFILE ===');
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
    
    console.log('=== NEW PROFILE CREATED ===');
    console.log('New profile:', JSON.stringify(newProfile, null, 2));
    
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
      .eq("user_id", existingProfile.id)
      .maybeSingle();
    
    console.log('=== EXISTING COMBATANT PROFILE ===');
    console.log('Combatant profile:', JSON.stringify(combatantProfile, null, 2));
    
    return { userProfile: existingProfile, combatantProfile };
  }
}

export async function updateUserProfile(supabase: any, userProfile: any, profileData: any) {
  console.log('=== UPDATE USER PROFILE START ===');
  console.log('Current user profile:', JSON.stringify(userProfile, null, 2));
  console.log('Profile data to update:', JSON.stringify(profileData, null, 2));
  
  // Prepare combatant data - only include fields that have values
  const combatantData: any = {
    user_id: userProfile.id,
  };
  
  // Add each field only if it has a value in profileData
  if (profileData.codename) combatantData.codename = profileData.codename;
  if (profileData.age) combatantData.age = profileData.age;
  if (profileData.physical_condition) combatantData.physical_condition = profileData.physical_condition;
  if (profileData.childhood_summary) combatantData.childhood_summary = profileData.childhood_summary;
  if (profileData.parents) combatantData.parents = profileData.parents;
  if (profileData.siblings) combatantData.siblings = profileData.siblings;
  if (profileData.relationship_status) combatantData.relationship_status = profileData.relationship_status;
  if (profileData.school_experience) combatantData.school_experience = profileData.school_experience;
  if (profileData.vice) combatantData.vice = profileData.vice;
  if (profileData.mission_90_day) combatantData.mission_90_day = profileData.mission_90_day;
  if (profileData.fear_block) combatantData.fear_block = profileData.fear_block;
  if (profileData.intensity_mode) combatantData.intensity_mode = profileData.intensity_mode;
  
  // Only mark as complete if we have all required fields
  const isComplete = combatantData.codename && combatantData.age && combatantData.physical_condition && 
                    combatantData.childhood_summary && combatantData.parents && combatantData.relationship_status && 
                    combatantData.school_experience && combatantData.vice && combatantData.mission_90_day && 
                    combatantData.fear_block && combatantData.intensity_mode;
  
  if (isComplete) {
    combatantData.profile_complete = true;
  }

  console.log('=== COMBATANT DATA TO SAVE ===');
  console.log('Combatant data:', JSON.stringify(combatantData, null, 2));
  console.log('Is complete:', isComplete);

  // Check if combatant profile exists
  const { data: existingCombatant } = await supabase
    .from("combatant_profile")
    .select("id")
    .eq("user_id", userProfile.id)
    .maybeSingle();

  let combatantProfile;
  if (existingCombatant) {
    console.log('=== UPDATING EXISTING COMBATANT PROFILE ===');
    // Update existing combatant profile
    const { data: updatedCombatant, error } = await supabase
      .from("combatant_profile")
      .update(combatantData)
      .eq("id", existingCombatant.id)
      .select()
      .single();
    
    if (error) {
      console.error('=== ERROR UPDATING COMBATANT PROFILE ===', error);
      throw error;
    }
    
    combatantProfile = updatedCombatant;
    console.log('=== COMBATANT PROFILE UPDATED ===');
    console.log('Updated combatant profile:', JSON.stringify(updatedCombatant, null, 2));
  } else {
    console.log('=== CREATING NEW COMBATANT PROFILE ===');
    // Create new combatant profile
    const { data: newCombatant, error } = await supabase
      .from("combatant_profile")
      .insert([combatantData])
      .select()
      .single();
    
    if (error) {
      console.error('=== ERROR CREATING COMBATANT PROFILE ===', error);
      throw error;
    }
    
    combatantProfile = newCombatant;
    console.log('=== COMBATANT PROFILE CREATED ===');
    console.log('New combatant profile:', JSON.stringify(newCombatant, null, 2));
  }

  // Also update the legacy users table for compatibility - but ONLY mark complete if truly complete
  const usersUpdateData: any = {};
  if (combatantData.intensity_mode) usersUpdateData.intensity_mode = combatantData.intensity_mode;
  if (combatantData.mission_90_day) usersUpdateData.current_mission = combatantData.mission_90_day;
  if (isComplete) {
    usersUpdateData.profile_complete = true;
    usersUpdateData.onboarding_completed = true;
  }

  console.log('=== UPDATING USERS TABLE ===');
  console.log('Users update data:', JSON.stringify(usersUpdateData, null, 2));

  const { data: updatedProfile, error: usersError } = await supabase
    .from("users")
    .update(usersUpdateData)
    .eq("id", userProfile.id)
    .select()
    .single();

  if (usersError) {
    console.error('=== ERROR UPDATING USERS TABLE ===', usersError);
    throw usersError;
  }

  console.log('=== USERS TABLE UPDATED ===');
  console.log('Updated user profile:', JSON.stringify(updatedProfile, null, 2));

  console.log('=== UPDATE USER PROFILE END ===');
  return { userProfile: updatedProfile, combatantProfile };
}
