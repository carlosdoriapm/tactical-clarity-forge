
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center marble-bg animate-on-scroll">
      <div className="container mx-auto px-4 text-center z-10">
        <div className="inline-block bg-warfare-yellow text-warfare-dark px-4 py-2 rounded-full text-sm font-bold mb-6">
          PRIVATE • ANONYMOUS • 24/7
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          TACTICAL CLARITY<br />
          <span className="text-warfare-red">UNDER FIRE</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-warfare-blue mb-8 max-w-2xl mx-auto">
          AI counsel for men who refuse to drown in emotion.
        </p>
        
        <Button 
          onClick={scrollToCheckout}
          className="bg-warfare-red hover:bg-red-600 text-white px-8 py-6 text-lg font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          🔒 LAUNCH WARFARE COUNSELOR
        </Button>
      </div>
    </section>
  );
};

export default Hero;
