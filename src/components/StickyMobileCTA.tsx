
import React from 'react';
import { Button } from '@/components/ui/button';

const StickyMobileCTA = () => {
  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sticky-cta lg:hidden">
      <Button 
        onClick={scrollToCheckout}
        className="w-full bg-warfare-red hover:bg-red-600 text-white font-bold py-3"
      >
        Start 7-Day Trial — $0
      </Button>
    </div>
  );
};

export default StickyMobileCTA;
