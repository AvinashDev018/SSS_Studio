import { Check, MapPin, Truck, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PackageCalculator from "@/components/PackageCalculator";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Photography Packages & District Rates | SSS Studio',
  description: 'Transparent default rates for wedding, pre-wedding, maternity, baby, and event photography across all Tamil Nadu districts.',
};

import { getPackages } from "@/app/actions/packages";

export default async function PackagesPage() {
  let dbPackages = [];
  try {
    dbPackages = await getPackages();
  } catch (e) {
    console.error("Failed to load db packages", e);
  }

  const defaultPackages = [
    {
      id: "1",
      name: "Premium Wedding & Cinematic",
      price: "₹75,000",
      description: "Our flagship signature package for comprehensive wedding day coverage & memories.",
      features: [
        "Full Day Coverage (12 Hours)",
        "2 Senior Photographers & 1 Cinema Videographer",
        "Licensed 4K Aerial Drone Coverage",
        "FREE Outdoor Pre-Wedding Shoot Perk",
        "Handcrafted 40-Page Layflat Master Album",
        "1-Month Delivery Guarantee (or ₹1,000 Cash Credit)"
      ],
      popular: true
    },
    {
      id: "2",
      name: "Standard Muhurtham & Event",
      price: "₹18,000",
      description: "Traditional ceremony rituals, candid portraits & master photobook album.",
      features: [
        "Traditional Rituals & Stage Coverage",
        "1 Senior Photographer & 1 Videographer",
        "30-Page Master Leather Photobook Album",
        "1-Month Delivery Guarantee"
      ],
      popular: false
    },
    {
      id: "3",
      name: "Outdoor Pre-Wedding Shoot",
      price: "₹8,000",
      description: "Scenic hill stations (Kodaikanal, Munnar), tea estates or heritage temple shoots.",
      features: [
        "4-6 Hours Outdoor Session",
        "Creative Couple & Bridal Styling",
        "30 Master Retouched High-Res Photos",
        "3-Minute HD Cinematic Teaser"
      ],
      popular: false
    },
    {
      id: "4",
      name: "Maternity Portrait Shoot",
      price: "₹6,000",
      description: "Safe, tender & creative indoor studio or outdoor couple maternity session.",
      features: [
        "Studio Gowns & Backdrop Access",
        "Indoor & Outdoor Posing Concepts",
        "25 Master Retouched High-Res Photos",
        "1-Month Delivery Guarantee"
      ],
      popular: false
    },
    {
      id: "5",
      name: "Baby Milestone & Birthday",
      price: "₹5,000",
      description: "Sanitized wooden props, wraps & cake smash themes for 3M, 6M, 1Y milestones.",
      features: [
        "Full Birthday / Milestone Session",
        "Sanitized Props & Baby Wraps",
        "20 Master Retouched High-Res Photos",
        "Private Digital Cloud Gallery (6 Months)"
      ],
      popular: false
    }
  ];

  // Merge database packages added in Admin CMS with default packages
  const displayPackages = [...dbPackages, ...defaultPackages];

  const travelTiers = [
    {
      district: "Local Base District (Madurai & Suburbs)",
      cost: "FREE / Included",
      desc: "Zero travel charges for Madurai city, Avaniyapuram, Thiruparankundram, Mattuthavani & 30 km radius."
    },
    {
      district: "Neighboring Districts (Dindigul, Theni, Virudhunagar, Sivagangai, Ramnad)",
      cost: "₹1,500 – ₹3,000",
      desc: "Nominal cab & fuel travel charge added based on exact location distance from Madurai."
    },
    {
      district: "Far Districts & Hill Stations (Chennai, Coimbatore, Kodaikanal, Ooty, Tirunelveli, Salem)",
      cost: "Actual Transport + Stay",
      desc: "Direct actual fuel/vehicle charges + basic accommodation for the 2–4 photographer crew."
    }
  ];

  return (
    <div className="py-12 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-16 relative px-2">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-32 h-28 sm:h-32 bg-brand-gradient hover-glow-brand/20 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-zinc-900 dark:text-white font-serif leading-tight">
          Pricing Packages &amp; Rates
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Transparent, fixed default package rates for weddings, maternity, baby milestone shoots, and event photography across Tamil Nadu.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
        {displayPackages.map((pkg, idx) => (
          <AnimatedSection key={pkg.id || idx} delay={idx * 0.1}>
            <div 
              className={`h-full relative group backdrop-blur-xl bg-[#0b0c07] border rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 shadow-2xl ${
                pkg.popular 
                  ? "border-amber-400/80 shadow-amber-500/10 ring-2 ring-amber-400/50 mt-4 sm:mt-0" 
                  : "border-amber-500/30 hover:border-amber-400/60"
              }`}
            >
              {pkg.popular && (
                <>
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-t-2xl sm:rounded-t-3xl" />
                  <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-xl flex items-center gap-1.5 z-20 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-black" /> Most Popular
                  </div>
                </>
              )}
              
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white mt-1 leading-snug font-serif">{pkg.name}</h3>
              <p className="text-zinc-300 mb-5 sm:mb-6 text-xs sm:text-sm flex-grow-0 leading-relaxed font-light">{pkg.description}</p>
              
              <div className="mb-6 sm:mb-8">
                <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
                  pkg.popular 
                    ? "text-amber-300 drop-shadow-sm" 
                    : "text-amber-400"
                }`}>
                  {pkg.price}
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 font-medium block mt-1">Default Studio Rate</span>
              </div>
              
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                {(Array.isArray(pkg.features) 
                  ? pkg.features 
                  : (typeof pkg.features === 'string' ? pkg.features.split(',') : [])
                ).map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 sm:gap-3 text-zinc-100 text-xs sm:text-sm font-medium">
                    <Check className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 ${pkg.popular ? "text-amber-400 font-bold" : "text-amber-400/80"}`} />
                    <span className="leading-tight">{typeof feature === 'string' ? feature.trim() : feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/contact" 
                className={`w-full text-center py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-extrabold transition-all duration-300 shadow-xl ${
                  pkg.popular 
                    ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-amber-500/20" 
                    : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/40"
                }`}
              >
                Book Package / Enquire
              </Link>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* District Travel Policy Section */}
      <AnimatedSection className="mb-16 sm:mb-24">
        <div className="bg-zinc-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-cyan-500/10 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-wide leading-snug">
                All-District Travel Charges (எல்லா மாவட்டங்களுக்கும் பயணம்)
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm mt-1 font-medium leading-relaxed">
                SSS Photography Studio is based in Avaniyapuram, Madurai and covers all 38 districts of Tamil Nadu.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {travelTiers.map((tier, tIdx) => (
              <div key={tIdx} className="bg-zinc-800/90 border border-zinc-700/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-cyan-400/60 transition-all shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg sm:text-xl mb-2 sm:mb-3">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
                    {tier.cost}
                  </div>
                  <h3 className="font-bold text-white text-sm sm:text-base mb-2 leading-snug">{tier.district}</h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-normal mt-2 pt-2 border-t border-zinc-700/50">
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-800 flex items-start sm:items-center gap-2.5 sm:gap-3 text-zinc-200 text-xs sm:text-sm font-medium leading-relaxed">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              All packages include our signature <strong className="text-white">1-Month Album Delivery Guarantee</strong> (or ₹1,000 cash credit) &amp; 100% Transit Damage Replacement Guarantee.
            </span>
          </div>
        </div>
      </AnimatedSection>

      {/* Package Calculator Section */}
      <AnimatedSection delay={0.4}>
        <PackageCalculator />
      </AnimatedSection>
    </div>
  );
}
