
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CombatantProfileData } from '@/types/profile';

const initialProfileState: CombatantProfileData = {
  codename: '',
  age: null,
  physical_condition: 'average',
  childhood_summary: '',
  parents: null,
  siblings: null,
  relationship_status: 'single',
  school_experience: 'neutral',
  vice: '',
  mission_90_day: '',
  fear_block: '',
  intensity_mode: 'TACTICAL',
  first_recognition: null,
  profile_complete: false,
};

interface ProfileFormProps {
  profile: Partial<CombatantProfileData>;
  onProfileUpdate: (updatedProfile: any) => void;
}

const ProfileForm = ({ profile, onProfileUpdate }: ProfileFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CombatantProfileData>(initialProfileState);

  useEffect(() => {
    // Sync props to state, preserving initial state as default
    setFormData({ ...initialProfileState, ...profile });
  }, [profile]);
  
  const handleInputChange = (field: keyof CombatantProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);

      // Validate required fields
      if (!formData.codename || !formData.childhood_summary || !formData.vice || 
          !formData.mission_90_day || !formData.fear_block) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // Validate age
      if (formData.age && (formData.age < 12 || formData.age > 80)) {
        toast({
          title: "Invalid Age",
          description: "Age must be between 12 and 80",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const profileData = {
        ...formData,
        user_id: user.id,
        profile_complete: true
      };

      let data;
      let error;

      if (formData.id) {
        // Update existing profile and get the updated row back
        const { data: updateData, error: updateError } = await supabase
          .from('combatant_profile')
          .update(profileData)
          .eq('id', formData.id)
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
        onProfileUpdate(data);
      }

      // Also update the legacy users table for compatibility
      await supabase
        .from('users')
        .update({
          intensity_mode: data?.intensity_mode || formData.intensity_mode,
          current_mission: data?.mission_90_day || formData.mission_90_day,
          profile_complete: true
        })
        .eq('email', user.email);

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
              value={formData.codename}
              onChange={(e) => handleInputChange('codename', e.target.value)}
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
              value={formData.age || ''}
              onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
              className="bg-warfare-dark/50 text-white border-warfare-blue/30"
            />
          </div>
        </div>

        <div>
          <Label className="text-white">Physical Condition *</Label>
          <select
            value={formData.physical_condition}
            onChange={(e) => handleInputChange('physical_condition', e.target.value as CombatantProfileData['physical_condition'])}
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
            value={formData.childhood_summary}
            onChange={(e) => handleInputChange('childhood_summary', e.target.value)}
            placeholder="Brief overview of your formative years..."
            className="bg-warfare-dark text-white border-warfare-blue/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Parents</Label>
            <Input 
              value={formData.parents || ''}
              onChange={(e) => handleInputChange('parents', e.target.value || null)}
              placeholder="e.g., Alive, distant"
              className="bg-warfare-dark/50 text-white border-warfare-blue/30"
            />
          </div>
          <div>
            <Label className="text-white">Siblings</Label>
            <Input 
              value={formData.siblings || ''}
              onChange={(e) => handleInputChange('siblings', e.target.value || null)}
              placeholder="e.g., 1 brother (rival)"
              className="bg-warfare-dark/50 text-white border-warfare-blue/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Relationship Status *</Label>
            <select
              value={formData.relationship_status}
              onChange={(e) => handleInputChange('relationship_status', e.target.value as CombatantProfileData['relationship_status'])}
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
              value={formData.school_experience}
              onChange={(e) => handleInputChange('school_experience', e.target.value as CombatantProfileData['school_experience'])}
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
            value={formData.vice}
            onChange={(e) => handleInputChange('vice', e.target.value)}
            placeholder="e.g., social media addiction, procrastination..."
            className="bg-warfare-dark text-white border-warfare-blue/30"
          />
        </div>

        <div>
          <Label className="text-white">90-Day Mission *</Label>
          <Textarea
            value={formData.mission_90_day}
            onChange={(e) => handleInputChange('mission_90_day', e.target.value)}
            placeholder="e.g., lose 20lbs and build morning routine..."
            className="bg-warfare-dark text-white border-warfare-blue/30"
          />
        </div>

        <div>
          <Label className="text-white">Fear Block *</Label>
          <Textarea
            value={formData.fear_block}
            onChange={(e) => handleInputChange('fear_block', e.target.value)}
            placeholder="e.g., failure and judgment, not being good enough..."
            className="bg-warfare-dark text-white border-warfare-blue/30"
          />
        </div>

        <div>
          <Label className="text-white mb-3 block">Intensity Mode</Label>
          <RadioGroup
            value={formData.intensity_mode}
            onValueChange={(value) => handleInputChange('intensity_mode', value as CombatantProfileData['intensity_mode'])}
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
