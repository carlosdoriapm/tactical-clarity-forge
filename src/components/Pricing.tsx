
import React from 'react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  const handleStartNow = () => {
    // In a real implementation, this would integrate with Stripe
    window.open('https://stripe.com', '_blank');
  };

  return (
    <section id="checkout" className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 rounded-xl text-center">
            <h3 className="text-3xl font-bold mb-4">Warfare Counselor™</h3>
            
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-5xl font-black text-warfare-red">$19</span>
              <span className="text-xl text-warfare-blue ml-2">monthly</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-warfare-yellow rounded-full mr-3"></div>
                Unlimited dilemmas
              </li>
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-warfare-yellow rounded-full mr-3"></div>
                Ruthless Mode toggle
              </li>
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-warfare-yellow rounded-full mr-3"></div>
                All future upgrades
              </li>
            </ul>
            
            <Button 
              onClick={handleStartNow}
              className="w-full bg-warfare-red hover:bg-red-600 text-white py-4 text-lg font-bold rounded-lg mb-6"
            >
              START NOW
            </Button>
            
            <p className="text-sm text-warfare-blue">
              <strong>7-Day Iron-Oath Refund:</strong> cancel within a week and pay nothing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
