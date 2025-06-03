
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      n: 1,
      title: "Describe the threat",
      text: "Type your dilemma—no essays needed."
    },
    {
      n: 2,
      title: "Choose intensity",
      text: "Standard stoic guidance or *Ruthless Mode*."
    },
    {
      n: 3,
      title: "Execute the plan",
      text: "Step-by-step actions + encrypted history. Re-ask anytime."
    }
  ];

  return (
    <section className="py-20 bg-warfare-dark animate-on-scroll">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          From Turmoil to Tactics
        </h2>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start mb-12 last:mb-0">
              <div className="flex-shrink-0 w-16 h-16 bg-warfare-red rounded-full flex items-center justify-center text-2xl font-bold mr-8">
                {step.n}
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-warfare-blue text-lg">{step.text}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="absolute left-8 mt-16 w-0.5 h-12 bg-warfare-yellow"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
