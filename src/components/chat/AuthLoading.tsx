
import React from 'react';

const AuthLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-warfare-dark via-slate-900 to-warfare-dark flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red mx-auto mb-4"></div>
      <p className="text-white">Loading authentication...</p>
    </div>
  </div>
);

export default AuthLoading;
