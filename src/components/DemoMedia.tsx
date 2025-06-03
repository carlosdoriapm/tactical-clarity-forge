
import React from 'react';

const DemoMedia = () => {
  return (
    <section className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-warfare-dark/80 rounded-xl p-8 glass-card">
            <div className="aspect-video bg-warfare-dark/50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-warfare-blue">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">Demo GIF Placeholder</p>
              </div>
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
