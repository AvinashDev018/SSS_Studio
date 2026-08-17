import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950 z-10" />
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
            alt="Wedding Photography"
            className="w-full h-full object-cover scale-105"
            style={{ transform: "translateZ(0)" }}
          />
        </div>
        
        <AnimatedSection className="relative z-20 text-center px-4 max-w-5xl mx-auto" yOffset={40}>
          <h1 className="font-serif text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-amber-100 via-amber-300 to-yellow-600 drop-shadow-sm">
            Capturing Your Special Moments
          </h1>
          <p className="text-xl md:text-3xl text-zinc-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Premium Photography & Videography for Weddings, Events, and Portraits in Madurai.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/contact" 
              className="bg-gradient-to-r from-amber-400 to-yellow-600 text-black px-10 py-5 rounded-full text-lg font-bold hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Book a Session <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/gallery" 
              className="bg-zinc-900/40 backdrop-blur-md text-white border border-zinc-700/50 px-10 py-5 rounded-full text-lg font-medium hover:bg-zinc-800/60 hover:border-zinc-500 transition-all duration-300 w-full sm:w-auto"
            >
              View Portfolio
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Services Overview - Modern Bento Box */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-white">Our Expertise</h2>
            <p className="text-zinc-400 text-xl max-w-2xl mx-auto font-light">We specialize in a variety of photography styles to bring your vision to life.</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Main large card */}
            <AnimatedSection delay={0.1} className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl border border-zinc-800/50">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 duration-500" />
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Weddings" />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="font-serif text-3xl font-bold text-white mb-2">Weddings</h3>
                <p className="text-zinc-300">Timeless elegance and candid joy captured perfectly.</p>
              </div>
            </AnimatedSection>

            {/* Top right small card */}
            <AnimatedSection delay={0.2} className="relative group overflow-hidden rounded-3xl border border-zinc-800/50">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 duration-500" />
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Portraits" />
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="font-serif text-2xl font-bold text-white">Portraits</h3>
              </div>
            </AnimatedSection>

            {/* Bottom right small card */}
            <AnimatedSection delay={0.3} className="relative group overflow-hidden rounded-3xl border border-zinc-800/50">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 duration-500" />
              <img src="https://images.unsplash.com/photo-1530103862676-de88b394145b?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Birthdays" />
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="font-serif text-2xl font-bold text-white">Birthday Functions</h3>
              </div>
            </AnimatedSection>
          </div>
          
          <AnimatedSection delay={0.4} className="mt-16 text-center">
            <Link href="/services" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-lg font-medium transition-colors">
              Explore All Services <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 relative">
        {/* Subtle glass background behind the section */}
        <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-xl border-y border-zinc-800/50 z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">Why Choose SSS Studio?</h2>
              <p className="text-zinc-300 mb-10 text-xl font-light leading-relaxed">
                With years of experience and a passion for visual storytelling, we deliver exceptional quality and service for every client.
              </p>
              
              <ul className="space-y-6">
                {[
                  "Professional Equipment & Premium Lighting",
                  "Highly Experienced & Creative Team",
                  "High-End Retouching & Color Grading",
                  "Affordable & Transparent Packages"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-zinc-200">
                    <div className="bg-amber-500/10 p-2 rounded-full border border-amber-500/20 shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-lg pt-1">{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection className="grid grid-cols-2 gap-4" delay={0.2}>
              <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000&auto=format&fit=crop" alt="Studio Setup" className="rounded-3xl object-cover h-72 w-full border border-zinc-800/50 shadow-2xl" />
              <img src="https://images.unsplash.com/photo-1554048612-b9a35e985871?q=80&w=1000&auto=format&fit=crop" alt="Camera Lens" className="rounded-3xl object-cover h-72 w-full mt-12 border border-zinc-800/50 shadow-2xl" />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}
