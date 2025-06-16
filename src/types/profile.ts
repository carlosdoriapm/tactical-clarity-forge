
export interface CombatantProfileData {
  id?: string;
  user_id?: string;
  codename: string;
  age: number | null;
  physical_condition: 'fit' | 'average' | 'overweight' | 'injured' | 'unknown';
  childhood_summary: string;
  parents: string | null;
  siblings: string | null;
  relationship_status: 'single' | 'partnered' | 'married' | 'divorced' | 'widowed';
  school_experience: 'war_zone' | 'throne' | 'exile' | 'neutral';
  vice: string;
  mission_90_day: string;
  fear_block: string;
  intensity_mode: 'TACTICAL' | 'RUTHLESS' | 'LEGION';
  first_recognition: string | null;
  profile_complete: boolean;
  disc_profile?: any;
  onboarding_completed?: boolean;
}
