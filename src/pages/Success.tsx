
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleSuccess = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        toast({
          title: "Error",
          description: "No session ID found",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('handle-checkout-success', {
          body: { session_id: sessionId }
        });

        if (error) throw error;

        toast({
          title: "Payment successful!",
          description: "Welcome to Warfare Counselor™ Premium",
        });

        // Redirect to chat after a short delay
        setTimeout(() => {
          navigate('/chat');
        }, 2000);
      } catch (error) {
        console.error('Success handling error:', error);
        toast({
          title: "Error processing payment",
          description: error.message || "Please contact support",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setProcessing(false);
      }
    };

    handleSuccess();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-warfare-dark flex items-center justify-center">
      <div className="glass-card p-8 rounded-xl text-center max-w-md mx-auto">
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warfare-red mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Processing Payment...</h2>
            <p className="text-warfare-blue">Please wait while we set up your account</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-warfare-blue">Redirecting you to chat...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;
