
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [profile, setProfile] = useState({
    email: '',
    age: '',
    intensity_mode: 'TACTICAL' as 'TACTICAL' | 'RUTHLESS' | 'LEGION',
    domain_focus: '' as 'corpo' | 'dinheiro' | 'influencia' | '',
    current_mission: '',
    profile_complete: false
  });
  const [warLogs, setWarLogs] = useState([]);

  useEffect(() => {
    loadProfile();
    loadWarLogs();
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
          age: (userProfile as any).age?.toString() || '',
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

  const loadWarLogs = async () => {
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
          .from('war_logs')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('date', { ascending: false })
          .limit(10);

        setWarLogs(logs || []);
      }
    } catch (error) {
      console.error('Error loading war logs:', error);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updateData: any = {
        intensity_mode: profile.intensity_mode,
        domain_focus: profile.domain_focus || null,
        current_mission: profile.current_mission
      };

      if (profile.age) {
        updateData.age = parseInt(profile.age);
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
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

  const resetWarLogs = async () => {
    try {
      setResetting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userProfile) {
        const { error } = await supabase
          .from('war_logs')
          .delete()
          .eq('user_id', userProfile.id);

        if (error) throw error;

        setWarLogs([]);
        toast({
          title: "Success",
          description: "War logs cleared successfully",
        });
      }
    } catch (error) {
      console.error('Error resetting war logs:', error);
      toast({
        title: "Error",
        description: "Failed to reset war logs",
        variant: "destructive",
      });
    } finally {
      setResetting(false);
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
              
              <div className="space-y-6">
                <div>
                  <Label className="text-white">Email</Label>
                  <Input 
                    value={profile.email}
                    disabled
                    className="bg-warfare-dark/50 text-white border-warfare-blue/30"
                  />
                </div>

                <div>
                  <Label className="text-white">Age</Label>
                  <Input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Enter your age"
                    className="bg-warfare-dark text-white border-warfare-blue/30"
                  />
                </div>

                <div>
                  <Label className="text-white mb-3 block">Intensity Mode</Label>
                  <RadioGroup
                    value={profile.intensity_mode}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, intensity_mode: value as any }))}
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

            {/* War Logs */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">War Logs</h2>
                <Button
                  onClick={resetWarLogs}
                  disabled={resetting || warLogs.length === 0}
                  variant="destructive"
                  size="sm"
                >
                  {resetting ? 'Clearing...' : 'Reset War Logs'}
                </Button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {warLogs.length === 0 ? (
                  <p className="text-warfare-blue">No missions logged yet. Start chatting to build your war logs.</p>
                ) : (
                  warLogs.map((log: any) => (
                    <div key={log.id} className="bg-warfare-dark/50 p-4 rounded-lg border border-warfare-blue/30">
                      <div className="text-xs text-warfare-blue mb-2">
                        {new Date(log.date).toLocaleDateString()}
                        {log.intensity && (
                          <span className="ml-2 px-2 py-1 bg-warfare-red/20 text-warfare-red rounded text-xs">
                            {log.intensity}
                          </span>
                        )}
                        {log.result && (
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            log.result === 'success' ? 'bg-green-500/20 text-green-400' :
                            log.result === 'fail' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {log.result}
                          </span>
                        )}
                      </div>
                      
                      {log.dilemma && (
                        <div className="text-white text-sm mb-2">
                          <strong>Dilemma:</strong> {log.dilemma.substring(0, 100)}...
                        </div>
                      )}
                      
                      {log.decision_path && (
                        <div className="text-warfare-blue text-sm mb-2">
                          <strong>Decision:</strong> {log.decision_path.substring(0, 100)}...
                        </div>
                      )}
                      
                      {log.commands && (
                        <div className="text-xs text-gray-400 mt-2">
                          <strong>Commands:</strong> {Object.keys(log.commands).join(', ')}
                        </div>
                      )}
                      
                      {log.reflections && (
                        <div className="text-xs text-warfare-blue mt-2 italic">
                          "{log.reflections.substring(0, 80)}..."
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
