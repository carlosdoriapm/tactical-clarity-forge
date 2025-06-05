
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    email: '',
    intensity_mode: 'TACTICAL' as 'TACTICAL' | 'RUTHLESS' | 'LEGION',
    domain_focus: '' as 'corpo' | 'dinheiro' | 'influencia' | '',
    current_mission: '',
    profile_complete: false
  });
  const [warLog, setWarLog] = useState([]);

  useEffect(() => {
    loadProfile();
    loadWarLog();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (userProfile) {
        setProfile({
          email: userProfile.email,
          intensity_mode: (userProfile.intensity_mode as 'TACTICAL' | 'RUTHLESS' | 'LEGION') || 'TACTICAL',
          domain_focus: (userProfile.domain_focus as 'corpo' | 'dinheiro' | 'influencia' | '') || '',
          current_mission: userProfile.current_mission || '',
          profile_complete: userProfile.profile_complete || false
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWarLog = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userProfile) {
        const { data: logs } = await supabase
          .from('war_log')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false })
          .limit(10);

        setWarLog(logs || []);
      }
    } catch (error) {
      console.error('Error loading war log:', error);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('users')
        .update({
          intensity_mode: profile.intensity_mode,
          domain_focus: profile.domain_focus || null,
          current_mission: profile.current_mission
        })
        .eq('email', user.email);

      if (error) throw error;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-warfare-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warfare-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Command Profile</h1>
            <Button 
              onClick={() => navigate('/chat')}
              variant="outline"
              className="text-warfare-blue border-warfare-blue hover:bg-warfare-blue hover:text-white"
            >
              Back to Chat
            </Button>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Profile Settings */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Email</Label>
                  <Input 
                    value={profile.email}
                    disabled
                    className="bg-warfare-dark/50 text-white border-warfare-blue/30"
                  />
                </div>

                <div>
                  <Label className="text-white">Intensity Mode</Label>
                  <select
                    value={profile.intensity_mode}
                    onChange={(e) => setProfile(prev => ({ ...prev, intensity_mode: e.target.value as any }))}
                    className="w-full p-2 bg-warfare-dark text-white border border-warfare-blue/30 rounded-md"
                  >
                    <option value="TACTICAL">TACTICAL - Measured, direct</option>
                    <option value="RUTHLESS">RUTHLESS - Blunt, no excuse</option>
                    <option value="LEGION">LEGION - Extreme, field-command</option>
                  </select>
                </div>

                <div>
                  <Label className="text-white">Domain Focus</Label>
                  <select
                    value={profile.domain_focus}
                    onChange={(e) => setProfile(prev => ({ ...prev, domain_focus: e.target.value as any }))}
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
                    value={profile.current_mission}
                    onChange={(e) => setProfile(prev => ({ ...prev, current_mission: e.target.value }))}
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

            {/* War Log */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-6">War Log</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {warLog.length === 0 ? (
                  <p className="text-warfare-blue">No missions logged yet. Start chatting to build your war log.</p>
                ) : (
                  warLog.map((log: any) => (
                    <div key={log.id} className="bg-warfare-dark/50 p-4 rounded-lg border border-warfare-blue/30">
                      <div className="text-xs text-warfare-blue mb-2">
                        {new Date(log.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-white text-sm mb-2">
                        <strong>Dilemma:</strong> {log.dilemma.substring(0, 100)}...
                      </div>
                      {log.decision && (
                        <div className="text-warfare-blue text-sm">
                          <strong>Decision:</strong> {log.decision.substring(0, 100)}...
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
