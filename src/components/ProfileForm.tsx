
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileData {
  email: string;
  age: string;
  intensity_mode: 'TACTICAL' | 'RUTHLESS' | 'LEGION';
  domain_focus: 'corpo' | 'dinheiro' | 'influencia' | '';
  current_mission: string;
  profile_complete: boolean;
}

interface ProfileFormProps {
  profile: ProfileData;
  onProfileUpdate: (updatedProfile: ProfileData) => void;
}

const ProfileForm = ({ profile, onProfileUpdate }: ProfileFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      const updateData: any = {
        intensity_mode: localProfile.intensity_mode,
        domain_focus: localProfile.domain_focus || null,
        current_mission: localProfile.current_mission,
        profile_complete: true
      };

      if (localProfile.age) {
        updateData.age = parseInt(localProfile.age);
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('email', user.email);

      if (error) throw error;

      onProfileUpdate(localProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
      
      <div className="space-y-6">
        <div>
          <Label className="text-white">Email</Label>
          <Input 
            value={localProfile.email}
            disabled
            className="bg-warfare-dark/50 text-white border-warfare-blue/30"
          />
        </div>

        <div>
          <Label className="text-white">Age</Label>
          <Input
            type="number"
            value={localProfile.age}
            onChange={(e) => setLocalProfile(prev => ({ ...prev, age: e.target.value }))}
            placeholder="Enter your age"
            className="bg-warfare-dark text-white border-warfare-blue/30"
          />
        </div>

        <div>
          <Label className="text-white mb-3 block">Intensity Mode</Label>
          <RadioGroup
            value={localProfile.intensity_mode}
            onValueChange={(value) => setLocalProfile(prev => ({ ...prev, intensity_mode: value as any }))}
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

        <div>
          <Label className="text-white">Domain Focus</Label>
          <select
            value={localProfile.domain_focus}
            onChange={(e) => setLocalProfile(prev => ({ ...prev, domain_focus: e.target.value as any }))}
            className="w-full p-2 bg-warfare-dark text-white border border-warfare-blue/30 rounded-md"
          >
            <option value="">General Warfare</option>
            <option value="corpo">Corpo - Physical discipline</option>
            <option value="dinheiro">Dinheiro - Wealth strategy</option>
            <option value="influencia">Influencia - Social power</option>
          </select>
        </div>

        <div>
          <Label className="text-white">Current Mission</Label>
          <Textarea
            value={localProfile.current_mission}
            onChange={(e) => setLocalProfile(prev => ({ ...prev, current_mission: e.target.value }))}
            placeholder="Describe your primary 90-day objective..."
            className="bg-warfare-dark text-white border-warfare-blue/30"
          />
        </div>

        <Button
          onClick={saveProfile}
          disabled={saving}
          className="w-full bg-warfare-red hover:bg-warfare-red/80 text-white"
        >
          {saving ? 'Saving...' : 'Update Profile'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
