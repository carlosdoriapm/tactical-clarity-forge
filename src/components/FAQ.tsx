
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      q: "Is Warfare Counselor therapy?",
      a: "No. It's tactical decision support with structured action steps, not psychological diagnosis."
    },
    {
      q: "Do you offer refunds?",
      a: "Yes. Cancel within the first 7 days and you won't pay a cent—our Iron-Oath Guarantee."
    },
    {
      q: "How private are my conversations?",
      a: "Chats are end-to-end encrypted, auto-purged after 30 days, never shared or sold."
    },
    {
      q: "What is *Ruthless Mode* exactly?",
      a: "Removes empathy buffers and delivers blunt orders in ~25% fewer words."
    },
    {
      q: "Will it tell me to seek professional help?",
      a: "Absolutely—if your issue signals self-harm, abuse, or clinical needs."
    },
    {
      q: "Relationship and parenting questions OK?",
      a: "Yes. Counselor includes stoic family-leadership frameworks."
    },
    {
      q: "Is there a usage limit?",
      a: "Unlimited dilemmas for subscribers; only spam is throttled."
    },
    {
      q: "Topics off-limits?",
      a: "Anything illegal, violent, or hateful. We deal in clarity, not crime."
    },
    {
      q: "How can I cancel/pause?",
      a: "Dashboard → Cancel. Two clicks, instant."
    },
    {
      q: "What if the advice ruins my life?",
      a: "You remain 100% responsible. Use it as a thinking tool, not legal directive."
    }
  ];

  return (
    <section className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-card rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-bold text-lg hover:text-warfare-red">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-warfare-blue pt-2">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
