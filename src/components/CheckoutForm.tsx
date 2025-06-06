
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CheckoutForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log("Attempting checkout for email:", email);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to create checkout session");
      }

      if (!data || !data.url) {
        console.error("No checkout URL returned:", data);
        throw new Error("No checkout URL received");
      }

      console.log("Checkout URL received, redirecting...");
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to checkout",
        description: "Opening Stripe checkout in a new tab...",
      });
    } catch (error) {
      console.error('Checkout error:', error);
      
      let errorMessage = "Failed to create checkout session";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Checkout failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheckout} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          required
        />
      </div>
      <Button 
        type="submit"
        disabled={loading}
        className="w-full bg-warfare-red hover:bg-red-600 text-white font-bold py-3"
      >
        {loading ? "Processing..." : "START NOW"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
