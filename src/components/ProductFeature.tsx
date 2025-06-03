
import React from 'react';

const ProductFeature = () => {
  return (
    <section className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-block bg-warfare-yellow text-warfare-dark px-4 py-2 rounded-full text-sm font-bold mb-6">
              Clarity in 60 sec
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Warfare Counselor™
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warfare-red rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg">
                  <span className="font-bold">Fully Private</span>—no data sold, no judgment.
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warfare-red rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg">
                  <span className="font-bold">24/7 AI Assistant</span>—trained on stoic, military, recovery frameworks.
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warfare-red rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg">
                  <span className="font-bold">Ruthless Mode</span>—zero emotional filter for blunt orders.
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warfare-red rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-lg">
                  <span className="font-bold">Rapid Scenario Prompts</span>—clarity in &lt; 60 sec.
                </p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <img 
                src="/lovable-uploads/3232e82f-f041-4c36-8e61-6f183eb7549c.png" 
                alt="Warrior forging tactical clarity" 
                className="w-full max-w-md h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFeature;
