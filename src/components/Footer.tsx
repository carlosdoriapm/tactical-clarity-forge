
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-12 bg-warfare-dark border-t border-warfare-blue/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Legionary Diary</h4>
            <a 
              href="https://legionarydiary.substack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-warfare-blue hover:text-warfare-yellow transition-colors"
            >
              Newsletter
            </a>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <a 
              href="https://x.com/LegionaryDiary" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-warfare-blue hover:text-warfare-yellow transition-colors"
            >
              X (Twitter)
            </a>
          </div>
        </div>
        
        <div className="text-center text-warfare-blue text-sm">
          © 2025 Legionary Diary. All rights reserved. Not medical or legal advice.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
