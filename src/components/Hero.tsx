
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '@/components/UserMenu';

const Hero = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-warfare-dark relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/lovable-uploads/3232e82f-f041-4c36-8e61-6f183eb7549c.png')"
        }}
      />
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-white">Warfare Counselor™</h1>
        </div>
        <div className="flex items-center space-x-4">
          {!loading && <UserMenu />}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="max-w-4xl mx-auto animate-on-scroll">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Personal
            <span className="text-warfare-red block">Warfare Counselor™</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-warfare-blue mb-8 max-w-3xl mx-auto">
            Get ruthless, tactical advice for any situation. No excuses. No weakness. 
            Only results that matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button 
                  onClick={() => navigate('/chat')}
                  size="lg" 
                  className="bg-warfare-red hover:bg-red-600 text-white font-bold py-4 px-8 text-lg"
                >
                  Start Chat Mission
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="lg" 
                  variant="outline"
                  className="border-warfare-blue text-warfare-blue hover:bg-warfare-blue hover:text-white py-4 px-8 text-lg"
                >
                  Command Center
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={scrollToCheckout}
                  size="lg" 
                  className="bg-warfare-red hover:bg-red-600 text-white font-bold py-4 px-8 text-lg"
                >
                  Start 7-Day Trial — $0
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg" 
                  variant="outline"
                  className="border-warfare-blue text-warfare-blue hover:bg-warfare-blue hover:text-white py-4 px-8 text-lg"
                >
                  Login to Command
                </Button>
              </>
            )}
          </div>

          {!user && (
            <p className="text-warfare-gray mt-4">
              No credit card required • Cancel anytime • Join 10,000+ operators
            </p>
          )}
        </div>
      </div>

      {/* Tactical Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
    </div>
  );
};

export default Hero;
