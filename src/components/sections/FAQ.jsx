"use client";

import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long does it take to receive our photos?",
    answer: "For standard portrait and event sessions, you will receive your digital gallery within 1-2 weeks. For weddings and large-scale events, please allow 4-6 weeks for complete editing and retouching."
  },
  {
    question: "Do you travel for weddings and events?",
    answer: "Absolutely! While we are based in Avaniyapuram, Madurai, we love traveling to capture special moments. Travel fees may apply for locations outside of the Madurai district."
  },
  {
    question: "How do we book a session?",
    answer: "You can book a session by filling out the form on our Contact page or by messaging us directly on WhatsApp. A 30% non-refundable deposit is required to secure your date."
  },
  {
    question: "Do you provide raw/unedited photos?",
    answer: "We do not provide raw or unedited files. Part of our premium service is the meticulous culling, color grading, and retouching process that ensures every delivered photo meets the SSS Studio standard of excellence."
  },
  {
    question: "Can we request a specific editing style?",
    answer: "Our signature style is timeless, elegant, and true-to-color with a slightly moody, cinematic edge. However, if you have a specific vision (like bright & airy or vintage film), let us know during the consultation and we will try to accommodate your preference."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-zinc-200 dark:border-zinc-900/50">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-amber-200 dark:to-yellow-600 drop-shadow-sm">Frequently Asked Questions</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-xl font-light">
          Everything you need to know before booking your session.
        </p>
      </AnimatedSection>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <AnimatedSection key={index} delay={index * 0.1}>
            <div 
              className={`border border-zinc-200 dark:border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-zinc-50 dark:bg-zinc-900/50 shadow-md' : 'bg-white dark:bg-zinc-950/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/30'}`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white pr-8">{faq.question}</h3>
                <ChevronDown 
                  className={`w-5 h-5 text-amber-500 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
