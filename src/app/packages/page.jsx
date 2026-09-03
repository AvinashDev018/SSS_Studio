import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PackageCalculator from "@/components/PackageCalculator";
import { getPackages } from "@/app/actions/packages";

export const dynamic = 'force-dynamic';

export const metadata = {
 title: 'Pricing Packages',
 description: 'Transparent pricing for our wedding, event, and portrait photography services in Madurai.',
};

export default async function PackagesPage() {
 const dbPackages = await getPackages();
 
 const displayPackages = dbPackages.length > 0 ? dbPackages : [
 {
 id: "1",
 name: "Basic Session",
 price: "₹15,000",
 description: "Perfect for quick portraits or small pre-wedding shoots.",
 features: [
 "4 Hours of Coverage",
 "1 Senior Photographer",
 "50 Edited High-Res Photos",
 "Online Delivery Link"
 ],
 popular: false
 },
 {
 id: "2",
 name: "Premium Wedding",
 price: "₹75,000",
 description: "Our most popular package for comprehensive wedding day coverage.",
 features: [
 "Full Day Coverage (12 Hours)",
 "2 Senior Photographers",
 "1 Videographer (4K Signature Video)",
 "300+ Edited High-Res Photos",
 "Premium Layflat Album (40 Pages)",
 "Creative Couple & Bridal Portraits"
 ],
 popular: true
 },
 {
 id: "3",
 name: "Luxury Event",
 price: "₹1,50,000",
 description: "The ultimate coverage for multi-day grand events.",
 features: [
 "2 Days Full Coverage",
 "3 Photographers & 2 Videographers",
 "Pre-wedding or Post-wedding Shoot",
 "Next Day Same-Day-Edit Teaser",
 "2 Premium Layflat Albums",
 "All Raw Footage Delivered"
 ],
 popular: false
 }
 ];

 return (
 <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
 <div className="text-center mb-16 relative">
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-gradient hover-glow-brand/20 blur-[100px] rounded-full pointer-events-none" />
 <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white font-serif">Pricing Packages</h1>
 <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
 Transparent pricing for our most popular services. Contact us for custom requirements.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
 {displayPackages.map((pkg, idx) => (
 <AnimatedSection key={pkg.id || idx} delay={idx * 0.2}>
 <div 
 className={`h-full relative group backdrop-blur-xl bg-white/50 dark:bg-zinc-900/50 border rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
 pkg.popular 
 ? "border-cyan-500/50 shadow-2xl shadow-[#D4AF37]/10 dark:shadow-[#D4AF37]/5" 
 : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl"
 }`}
 >
 {pkg.popular && (
 <>
 <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-100" />
 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-zinc-900 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">
 Most Popular
 </div>
 </>
 )}
 
 <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">{pkg.name}</h3>
 <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">{pkg.description}</p>
 
 <div className="mb-8">
 <span className={`text-4xl font-bold tracking-tight ${
 pkg.popular 
 ? "bg-gradient-to-r from-[#D4AF37] to-[#aa8920] dark:to-[#F3E5AB] bg-clip-text text-transparent" 
 : "text-zinc-900 dark:text-white"
 }`}>
 {pkg.price}
 </span>
 </div>
 
 <ul className="space-y-4 mb-8 flex-grow">
 {pkg.features.map((feature, fIdx) => (
 <li key={fIdx} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 text-sm">
 <Check className={`w-5 h-5 shrink-0 mt-0.5 ${pkg.popular ? "text-brand-gradient" : "text-zinc-400 dark:text-zinc-500"}`} />
 <span>{feature}</span>
 </li>
 ))}
 </ul>

 <Link 
 href="/contact" 
 className={`w-full text-center py-4 rounded-xl font-semibold transition-all duration-300 ${
 pkg.popular 
 ? "bg-brand-gradient hover-glow-brand hover:bg-[#c5a028] text-black shadow-lg shadow-[#D4AF37]/25" 
 : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
 }`}
 >
 Enquire Now
 </Link>
 </div>
 </AnimatedSection>
 ))}
 </div>

 <AnimatedSection delay={0.4} className="mt-20">
 <PackageCalculator />
 </AnimatedSection>
 </div>
 );
}
