
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSuccess = async () => {
      const sessionId = searchParams.get('session_id');
      
      console.log("Success page loaded with session_id:", sessionId);
      
      if (!sessionId) {
        const errorMsg = "No session ID found in URL";
        console.error(errorMsg);
        setError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        console.log("Calling handle-checkout-success function...");
        
        const { data, error } = await supabase.functions.invoke('handle-checkout-success', {
          body: { session_id: sessionId }
        });

        console.log("Function response:", { data, error });

        if (error) {
          console.error("Function error:", error);
          throw new Error(error.message || "Failed to process payment");
        }

        if (!data || !data.success) {
          console.error("Invalid response:", data);
          throw new Error("Invalid response from payment processor");
        }

        console.log("Payment processed successfully!");
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
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setError(errorMessage);
        
        toast({
          title: "Error processing payment",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Redirect to home after error
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } finally {
        setProcessing(false);
      }
    };

    handleSuccess();
  }, [searchParams, navigate, toast]);

  if (error) {
    return (
      <div className="min-h-screen bg-warfare-dark flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Error</h2>
          <p className="text-warfare-blue mb-4">{error}</p>
          <p className="text-sm text-warfare-gray">Redirecting you back...</p>
        </div>
      </div>
    );
  }

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
