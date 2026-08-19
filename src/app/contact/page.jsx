"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Contact() {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
      <AnimatedSection className="text-center mb-16">
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-amber-100 dark:to-yellow-600 drop-shadow-sm">Get in Touch</h1>
        <p className="text-zinc-600 dark:text-zinc-300 text-xl max-w-2xl mx-auto font-light leading-relaxed">
          We'd love to hear from you. Find our studio or drop us a message.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Contact Information */}
        <AnimatedSection delay={0.2} className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-transparent">
              <MapPin className="w-6 h-6 text-amber-600 dark:text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-amber-400">Visit Our Studio</h3>
              <p className="text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed text-lg">34, prasanna new colony, Avaniyapuram,<br/>Madurai.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-transparent">
              <Phone className="w-6 h-6 text-amber-600 dark:text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-amber-400">Call Us</h3>
              <p className="text-zinc-600 dark:text-zinc-300 mt-1 text-lg">+91 63835 65425</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-transparent">
              <Mail className="w-6 h-6 text-amber-600 dark:text-white" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-amber-400">Email Us</h3>
              <p className="text-zinc-600 dark:text-zinc-300 mt-1 text-lg">ajayavinashsss@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-transparent">
              <Clock className="w-6 h-6 text-amber-600 dark:text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">Opening Hours</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1 text-lg">Monday - Sunday: 9:00 AM - 8:00 PM</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Map */}
        <AnimatedSection delay={0.4} className="bg-zinc-100 dark:bg-zinc-900 h-96 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative shadow-2xl">
          <iframe 
            src="https://maps.google.com/maps?q=34,%20prasanna%20new%20colony,%20Avaniyapuram,%20Madurai&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Studio Location"
            className="absolute inset-0"
          ></iframe>
        </AnimatedSection>
      </div>
    </div>
  );
}
