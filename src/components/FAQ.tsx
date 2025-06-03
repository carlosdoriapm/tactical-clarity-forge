
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
      a: "No. It's tactical decision support. We provide structured action steps, not psychological diagnosis."
    },
    {
      q: "How private are my conversations?",
      a: "Chats are end-to-end encrypted, auto-purged after 30 days by default, and never shared or sold."
    },
    {
      q: "What is *Ruthless Mode* exactly?",
      a: "When activated, the assistant strips empathy buffers and gives blunt, military-style orders in ~25% fewer words."
    },
    {
      q: "Does the AI ever tell me to seek professional help?",
      a: "Yes. If your dilemma signals self-harm, abuse, or clinical issues, it will recommend licensed resources immediately."
    },
    {
      q: "Can it handle relationship or parenting questions?",
      a: "Absolutely. The Counselor is trained on stoic, family-leadership, and sobriety frameworks—perfect for those scenarios."
    },
    {
      q: "Is there a usage limit?",
      a: "Paid plans include unlimited dilemmas. We throttle only obvious spam to keep latency low for everyone."
    },
    {
      q: "What topics are off-limits?",
      a: "Anything illegal, violent, or hateful is rejected. We deal in clarity, not criminal counsel."
    },
    {
      q: "How do I cancel or pause my subscription?",
      a: "Inside your dashboard you'll see a **Cancel** button—two clicks, instant. No retention hoops."
    },
    {
      q: "What if the advice ruins my life?",
      a: "You remain 100% responsible for your actions. Use the Counselor as a thinking tool, not legal directive."
    },
    {
      q: "Do you offer refunds?",
      a: "Yes. Cancel within the first 7 days and you won't pay a cent—our Iron-Oath Guarantee."
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
