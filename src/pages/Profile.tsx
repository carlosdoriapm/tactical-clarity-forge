
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import ProfileForm from '@/components/ProfileForm';
import WarLogsDisplay from '@/components/WarLogsDisplay';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, setProfile, warLogs, setWarLogs, loading } = useProfile();

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
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="text-warfare-blue border-warfare-blue hover:bg-warfare-blue hover:text-white"
            >
              Back to Dashboard
            </Button>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            <ProfileForm 
              profile={profile} 
              onProfileUpdate={setProfile} 
            />
            <WarLogsDisplay 
              warLogs={warLogs} 
              onWarLogsUpdate={setWarLogs} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
