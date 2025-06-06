
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import ProfileForm from '@/components/ProfileForm';
import WarLogsDisplay from '@/components/WarLogsDisplay';

const Profile = () => {
  const { user } = useAuth();
  const { profile, setProfile, warLogs, setWarLogs, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Command Profile</h1>
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
  );
};

export default Profile;
