import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
            alt="Wedding Photography"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Capturing Your Special Moments
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto font-light">
            Professional Photography & Videography for Weddings, Events, and Portraits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact" 
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-zinc-200 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Book a Session <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/gallery" 
              className="bg-zinc-800/50 backdrop-blur-sm text-white border border-zinc-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-zinc-800 transition-colors w-full sm:w-auto"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Expertise</h2>
          <p className="text-zinc-400 mb-12 max-w-2xl mx-auto">We specialize in a variety of photography styles to meet all your needs.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Weddings', 'Portraits', 'Events', 'Birthdays'].map((service) => (
              <div key={service} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors group">
                <h3 className="text-xl font-semibold group-hover:text-white transition-colors">{service}</h3>
              </div>
            ))}
          </div>
          
          <div className="mt-12">
            <Link href="/services" className="text-zinc-400 hover:text-white flex items-center justify-center gap-2 transition-colors">
              See all services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose SSS Studio?</h2>
              <p className="text-zinc-400 mb-8 text-lg">
                With years of experience and a passion for visual storytelling, we deliver exceptional quality and service for every client.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Professional Equipment & Lighting",
                  "Experienced & Creative Team",
                  "High-Quality Retouching & Editing",
                  "Affordable & Transparent Packages"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000&auto=format&fit=crop" alt="Studio Setup" className="rounded-2xl object-cover h-64 w-full" />
              <img src="https://images.unsplash.com/photo-1554048612-b9a35e985871?q=80&w=1000&auto=format&fit=crop" alt="Camera Lens" className="rounded-2xl object-cover h-64 w-full mt-8" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
