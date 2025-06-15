import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface CombatantProfileData {
  id?: string;
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
}

interface ProfileFormProps {
  profile: any; // Legacy profile data
  onProfileUpdate: (updatedProfile: any) => void;
}

const ProfileForm = ({ profile, onProfileUpdate }: ProfileFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [localProfile, setLocalProfile] = useState<CombatantProfileData>({
    codename: '',
    age: null,
    physical_condition: 'average',
    childhood_summary: '',
    parents: null,
    siblings: null,
    relationship_status: 'single',
    school_experience: 'neutral',
    vice: '',
    mission_90_day: profile?.current_mission || '',
    fear_block: '',
    intensity_mode: profile?.intensity_mode || 'TACTICAL',
    first_recognition: null,
    profile_complete: false
  });

  const loadCombatantProfile = async () => {
    if (!user) return;

    try {
      const { data: combatantProfile } = await supabase
        .from('combatant_profile')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (combatantProfile) {
        // Type assertion to ensure compatibility with our interface
        setLocalProfile({
          ...combatantProfile,
          physical_condition: combatantProfile.physical_condition as 'fit' | 'average' | 'overweight' | 'injured' | 'unknown',
          relationship_status: combatantProfile.relationship_status as 'single' | 'partnered' | 'married' | 'divorced' | 'widowed',
          school_experience: combatantProfile.school_experience as 'war_zone' | 'throne' | 'exile' | 'neutral',
          intensity_mode: combatantProfile.intensity_mode as 'TACTICAL' | 'RUTHLESS' | 'LEGION'
        });
      }
    } catch (error) {
      console.error('Error loading combatant profile:', error);
    }
  };

  React.useEffect(() => {
    loadCombatantProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);

      // Validate required fields
      if (!localProfile.codename || !localProfile.childhood_summary || !localProfile.vice || 
          !localProfile.mission_90_day || !localProfile.fear_block) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // Validate age
      if (localProfile.age && (localProfile.age < 12 || localProfile.age > 80)) {
        toast({
          title: "Invalid Age",
          description: "Age must be between 12 and 80",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const profileData = {
        ...localProfile,
        user_id: user.id,
        profile_complete: true
      };

      let data;
      let error;

      if (localProfile.id) {
        // Update existing profile and get the updated row back
        const { data: updateData, error: updateError } = await supabase
          .from('combatant_profile')
          .update(profileData)
          .eq('id', localProfile.id)
          .select()
          .single();
        data = updateData;
        error = updateError;
      } else {
        // Create new profile and get the new row back
        const { data: insertData, error: insertError } = await supabase
          .from('combatant_profile')
          .insert([profileData])
          .select()
          .single();
        data = insertData;
        error = insertError;
      }

      if (error) throw error;

      if (data) {
        // Update local state with the definitive data from the database
        setLocalProfile({
          ...data,
          physical_condition: data.physical_condition as 'fit' | 'average' | 'overweight' | 'injured' | 'unknown',
          relationship_status: data.relationship_status as 'single' | 'partnered' | 'married' | 'divorced' | 'widowed',
          school_experience: data.school_experience as 'war_zone' | 'throne' | 'exile' | 'neutral',
          intensity_mode: data.intensity_mode as 'TACTICAL' | 'RUTHLESS' | 'LEGION'
        });
      }

      // Also update the legacy users table for compatibility
      await supabase
        .from('users')
        .update({
          intensity_mode: data?.intensity_mode || localProfile.intensity_mode,
          current_mission: data?.mission_90_day || localProfile.mission_90_day,
          profile_complete: true
        })
        .eq('email', user.email);

      onProfileUpdate({
        ...profile,
        intensity_mode: data?.intensity_mode || localProfile.intensity_mode,
        current_mission: data?.mission_90_day || localProfile.mission_90_day,
        profile_complete: true
      });

      toast({
        title: "Success",
        description: "Combatant profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error saving combatant profile:', error);
      toast({
        title: "Error",
        description: `Failed to save combatant profile: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-bold text-white mb-6">Combatant Profile</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Codename *</Label>
            <Input 
              value={localProfile.codename}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, codename: e.target.value }))}
              placeholder="e.g., Shadow Wolf, Iron Phoenix"
              className="bg-warfare-dark/50 text-white border-warfare-blue/30"
            />
          </div>
          <div>
            <Label className="text-white">Age (12-80)</Label>
            <Input 
              type="number"
              min="12"
              max="80"
              value={localProfile.age || ''}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : null }))}
              className="bg-warfare-dark/50 text-white border-warfare-blue/30"
            />
          </div>
        </div>

        <div>
          <Label className="text-white">Physical Condition *</Label>
          <select
            value={localProfile.physical_condition}
            onChange={(e) => setLocalProfile(prev => ({ ...prev, physical_condition: e.target.value as 'fit' | 'average' | 'overweight' | 'injured' | 'unknown' }))}
            className="w-full p-2 bg-warfare-dark text-white border border-warfare-blue/30 rounded-md"
          >
            <option value="fit">Fit - Regular training, good shape</option>
            <option value="average">Average - Decent shape, inconsistent</option>
            <option value="overweight">Overweight - Need to rebuild</option>
            <option value="injured">Injured - Working around limitations</option>
            <option value="unknown">Unknown - Need assessment</option>
          </select>
        </div>

        <div>
          <Label className="text-white">Childhood Summary *</Label>
          <Textarea
            value={localProfile.childhood_summary}
            onChange={(e) => setLocalProfile(prev => ({ ...prev, childhood_summary: e.target.value }))}
            placeholder="Brief overview of your formative years..."
            className="bg-warfare-dark text-white border-warfare-blue/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Parents</Label>
            <Input 
              value={localProfile.parents || ''}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, parents: e.target.value || null }))}
              placeholder="e.g., Alive, distant"
              className="bg-warfare-dark/50 text-white border-warfare-blue/30"
            />
          </div>
          <div>
            <Label className="text-white">Siblings</Label>
            <Input 
              value={localProfile.siblings || ''}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, siblings: e.target.value || null }))}
              placeholder="e.g., 1 brother (rival)"
              className="bg-warfare-dark/50 text-white border-warfare-blue/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Relationship Status *</Label>
            <select
              value={localProfile.relationship_status}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, relationship_status: e.target.value as 'single' | 'partnered' | 'married' | 'divorced' | 'widowed' }))}
              className="w-full p-2 bg-warfare-dark text-white border border-warfare-blue/30 rounded-md"
            >
              <option value="single">Single</option>
              <option value="partnered">Partnered</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div>
            <Label className="text-white">School Experience *</Label>
            <select
              value={localProfile.school_experience}
              onChange={(e) => setLocalProfile(prev => ({ ...prev, school_experience: e.target.value as 'war_zone' | 'throne' | 'exile' | 'neutral' }))}
              className="w-full p-2 bg-warfare-dark text-white border border-warfare-blue/30 rounded-md"
            >
              <option value="war_zone">War Zone - Bullied/hostile</option>
              <option value="throne">Throne - Popular/dominant</option>
              <option value="exile">Exile - Outcast/loner</option>
              <option value="neutral">Neutral - Average experience</option>
            </select>
          </div>
        </div>

        <div>
          <Label className="text-white">Primary Vice *</Label>
          <Textarea
            value={localProfile.vice}
            onChange={(e) => setLocalProfile(prev => ({ ...prev, vice: e.target.value }))}
            placeholder="e.g., social media addiction, procrastination..."
            className="bg-warfare-dark text-white border-warfare-blue/30"
          />
        </div>

        <div>
          <Label className="text-white">90-Day Mission *</Label>
          <Textarea
            value={localProfile.mission_90_day}
            onChange={(e) => setLocalProfile(prev => ({ ...prev, mission_90_day: e.target.value }))}
            placeholder="e.g., lose 20lbs and build morning routine..."
            className="bg-warfare-dark text-white border-warfare-blue/30"
          />
        </div>

        <div>
          <Label className="text-white">Fear Block *</Label>
          <Textarea
            value={localProfile.fear_block}
            onChange={(e) => setLocalProfile(prev => ({ ...prev, fear_block: e.target.value }))}
            placeholder="e.g., failure and judgment, not being good enough..."
            className="bg-warfare-dark text-white border-warfare-blue/30"
          />
        </div>

        <div>
          <Label className="text-white mb-3 block">Intensity Mode</Label>
          <RadioGroup
            value={localProfile.intensity_mode}
            onValueChange={(value) => setLocalProfile(prev => ({ ...prev, intensity_mode: value as 'TACTICAL' | 'RUTHLESS' | 'LEGION' }))}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-warfare-blue/30 hover:border-warfare-blue/50">
              <RadioGroupItem value="TACTICAL" id="tactical" className="border-warfare-blue text-warfare-blue" />
              <div>
                <Label htmlFor="tactical" className="text-white font-medium cursor-pointer">TACTICAL</Label>
                <p className="text-warfare-blue text-sm">Measured, direct guidance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-warfare-blue/30 hover:border-warfare-blue/50">
              <RadioGroupItem value="RUTHLESS" id="ruthless" className="border-warfare-blue text-warfare-blue" />
              <div>
                <Label htmlFor="ruthless" className="text-white font-medium cursor-pointer">RUTHLESS</Label>
                <p className="text-warfare-blue text-sm">Blunt, no-excuse approach</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-warfare-blue/30 hover:border-warfare-blue/50">
              <RadioGroupItem value="LEGION" id="legion" className="border-warfare-blue text-warfare-blue" />
              <div>
                <Label htmlFor="legion" className="text-white font-medium cursor-pointer">LEGION</Label>
                <p className="text-warfare-blue text-sm">Extreme, field-command discipline</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <Button
          onClick={saveProfile}
          disabled={saving}
          className="w-full bg-warfare-red hover:bg-warfare-red/80 text-white"
        >
          {saving ? 'Saving...' : 'Update Combatant Profile'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
