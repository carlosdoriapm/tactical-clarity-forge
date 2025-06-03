
import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import PainPoints from '../components/PainPoints';
import ProductFeature from '../components/ProductFeature';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Index = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-warfare-dark">
      <Hero />
      <PainPoints />
      <ProductFeature />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
