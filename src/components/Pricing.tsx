
import React from 'react';
import CheckoutForm from './CheckoutForm';

const Pricing = () => {
  return (
    <section id="checkout" className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 rounded-xl text-center">
            <h3 className="text-3xl font-bold mb-4">Warfare Counselor™</h3>
            
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-5xl font-black text-warfare-red">$19</span>
              <span className="text-xl text-warfare-blue ml-2">monthly</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-warfare-yellow rounded-full mr-3"></div>
                Unlimited dilemmas
              </li>
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-warfare-yellow rounded-full mr-3"></div>
                Ruthless Mode toggle
              </li>
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-warfare-yellow rounded-full mr-3"></div>
                All future upgrades
              </li>
            </ul>
            
            <CheckoutForm />
            
            <p className="text-sm mt-6">
              <span className="guarantee">7-Day Iron-Oath Refund — cancel in a week and pay nothing.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
