
import React from 'react';
import { Bolt, ShieldLock, CheckCircle } from 'lucide-react';

const TrustStrip = () => {
  const trustItems = [
    { icon: Bolt, text: "Avg. response < 3 s" },
    { icon: ShieldLock, text: "End-to-end encrypted" },
    { icon: CheckCircle, text: "2,100+ dilemmas solved" }
  ];

  return (
    <section className="hidden lg:block py-8 bg-warfare-dark/50 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center space-x-12">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 text-warfare-blue">
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
