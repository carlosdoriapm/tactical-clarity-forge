
import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      quote: "She cheated. Counselor stopped my spiral and gave me a battle plan.",
      author: "Anthony, 38"
    },
    {
      quote: "Job loss crisis. Got a 48-hour triage that worked.",
      author: "Derek, 45"
    },
    {
      quote: "Facing relapse. Ruthless Mode hit like a drill sergeant—stayed sober.",
      author: "Logan, 33"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative h-64 flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 ${
                  index === currentIndex ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full'
                }`}
              >
                <blockquote className="text-2xl md:text-3xl font-medium mb-6 text-warfare-blue">
                  "{testimonial.quote}"
                </blockquote>
                <cite className="text-lg font-bold text-warfare-yellow">
                  {testimonial.author}
                </cite>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-warfare-red' : 'bg-warfare-blue'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
