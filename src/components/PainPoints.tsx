
import React from 'react';
import { Slash, AlertTriangle, Target } from 'lucide-react';

const PainPoints = () => {
  const pains = [
    {
      icon: Slash,
      heading: "Marriage fracture",
      body: "You need a line of action, not a therapy worksheet."
    },
    {
      icon: AlertTriangle,
      heading: "Relapse remorse",
      body: "Shame screams. You need orders for hour 1, not platitudes."
    },
    {
      icon: Target,
      heading: "Mission drift",
      body: "Family, career, identity—slipping into chaos unless you course-correct now."
    }
  ];

  return (
    <section className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Moments you can't afford weak advice:
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pains.map((pain, index) => (
            <div 
              key={index}
              className="glass-card p-8 rounded-lg transform hover:scale-105 transition-all duration-300"
            >
              <pain.icon className="w-12 h-12 text-warfare-red mb-6" />
              <h3 className="text-xl font-bold mb-4">{pain.heading}</h3>
              <p className="text-warfare-blue">{pain.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
