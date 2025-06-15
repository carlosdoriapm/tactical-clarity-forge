
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const createUserProfile = async (user: User) => {
  try {
    const { data: existingProfile } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id) // Check by ID for more reliability
      .single();

    if (!existingProfile) {
      const { error } = await supabase
        .from('users')
        .insert([{
          id: user.id, // Fix: Added user ID to the insert payload
          email: user.email,
          intensity_mode: 'TACTICAL',
          profile_complete: false,
          onboarding_completed: false
        }]);
      
      if (error) {
        console.error('Error creating user profile:', error);
      } else {
        console.log('User profile created successfully');
      }
    }
  } catch (error) {
    // Catching errors specifically for the case where .single() finds no rows
    if (error && (error as any).code === 'PGRST116') {
      // This is expected if the profile doesn't exist, so we can proceed with creation
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email,
          intensity_mode: 'TACTICAL',
          profile_complete: false,
          onboarding_completed: false
        }]);

      if (insertError) {
        console.error('Error creating user profile after initial check failed:', insertError);
      } else {
        console.log('User profile created successfully after initial check failed');
      }
    } else {
      console.error('Error in createUserProfile:', error);
    }
  }
};
