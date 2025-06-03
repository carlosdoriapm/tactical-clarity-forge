
import React from 'react';

const ProductFeature = () => {
  return (
    <section className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <svg width="400" height="400" viewBox="0 0 400 400" className="mx-auto">
              {/* Marble bust base */}
              <defs>
                <linearGradient id="marbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#92bbc1" stopOpacity="0.3"/>
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#92bbc1" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              
              {/* Bust silhouette */}
              <path d="M120 350 Q120 280 140 250 Q160 200 200 180 Q240 200 260 250 Q280 280 280 350 Z" 
                    fill="url(#marbleGrad)" stroke="#92bbc1" strokeWidth="2"/>
              
              {/* Head */}
              <circle cx="200" cy="150" r="60" fill="url(#marbleGrad)" stroke="#92bbc1" strokeWidth="2"/>
              
              {/* Headset */}
              <path d="M140 140 Q140 120 160 120 L240 120 Q260 120 260 140" 
                    fill="none" stroke="#f1372b" strokeWidth="4"/>
              <circle cx="140" cy="150" r="15" fill="#f1372b"/>
              <circle cx="260" cy="150" r="15" fill="#f1372b"/>
              
              {/* Microphone */}
              <line x1="140" y1="150" x2="120" y2="170" stroke="#f1372b" strokeWidth="3"/>
              <circle cx="118" cy="172" r="3" fill="#f1372b"/>
              
              {/* Face details */}
              <circle cx="185" cy="140" r="2" fill="#020b1c"/>
              <circle cx="215" cy="140" r="2" fill="#020b1c"/>
              <path d="M190 155 Q200 165 210 155" fill="none" stroke="#020b1c" strokeWidth="2"/>
            </svg>
          </div>
          
          <div>
            <div className="inline-block bg-warfare-yellow text-warfare-dark px-3 py-1 rounded-full text-sm font-bold mb-4">
              Clarity in 60 sec
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Warfare Counselor™
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-warfare-red rounded-full mt-3"></div>
                <div>
                  <span className="font-bold">24/7 AI Assistant</span>
                  <span className="text-warfare-blue">—trained on stoic, military, and recovery frameworks.</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-warfare-red rounded-full mt-3"></div>
                <div>
                  <span className="font-bold">Ruthless Mode</span>
                  <span className="text-warfare-blue">—zero emotional filter when you want raw tactical orders.</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-warfare-red rounded-full mt-3"></div>
                <div>
                  <span className="font-bold">Rapid Scenario Prompts</span>
                  <span className="text-warfare-blue">—ask, get clarity in &lt; 60 sec.</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-warfare-red rounded-full mt-3"></div>
                <div>
                  <span className="font-bold">Fully Private</span>
                  <span className="text-warfare-blue">—no data sold, no judgment, no fluff.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFeature;
