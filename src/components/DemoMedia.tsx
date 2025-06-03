
import React from 'react';

const DemoMedia = () => {
  return (
    <section className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-warfare-dark/80 rounded-xl p-8 glass-card">
            <div className="aspect-video bg-warfare-dark/50 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              <img 
                src="/lovable-uploads/dbaf48e8-15b0-4d79-a324-0ae8260e4c3b.png" 
                alt="Warfare Counselor chat interface showing tactical advice"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-warfare-blue italic">
              Real speed demo — dilemma in, marching orders out.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoMedia;
