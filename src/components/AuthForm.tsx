
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onModeChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      let result;
      if (mode === 'login') {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password);
      }

      if (result.error) {
        let errorMessage = result.error.message;
        
        // Handle common errors with user-friendly messages
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (errorMessage.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Try logging in instead.';
          onModeChange('login');
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link.';
        }

        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        if (mode === 'signup') {
          toast({
            title: "Account Created",
            description: "Please check your email for a confirmation link.",
          });
        } else {
          toast({
            title: "Welcome Back",
            description: "Successfully logged in!",
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {mode === 'login' ? 'Command Login' : 'Join the Legion'}
        </h2>
        <p className="text-warfare-blue">
          {mode === 'login' 
            ? 'Access your tactical command center' 
            : 'Begin your warfare transformation'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@domain.com"
            className="bg-warfare-dark text-white border-warfare-blue/30 focus:border-warfare-blue"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-white">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="bg-warfare-dark text-white border-warfare-blue/30 focus:border-warfare-blue"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-warfare-red hover:bg-warfare-red/80 text-white py-3 font-bold"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {mode === 'login' ? 'Logging in...' : 'Creating account...'}
            </div>
          ) : (
            mode === 'login' ? 'Login to Command' : 'Join the Legion'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-warfare-blue">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
            className="text-warfare-red hover:underline font-medium"
          >
            {mode === 'login' ? 'Sign up here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};
