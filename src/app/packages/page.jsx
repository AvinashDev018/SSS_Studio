import { Check } from "lucide-react";
import Link from "next/link";

export default function Packages() {
  const packages = [
    {
      name: "Standard Wedding",
      price: "₹45,000",
      description: "Perfect for intimate weddings and single-day events.",
      features: [
        "Traditional Photography",
        "Candid Photography",
        "HD Videography",
        "1 Premium Album (40 pages)",
        "Soft copies on Pen Drive",
      ],
    },
    {
      name: "Premium Wedding",
      price: "₹75,000",
      description: "Comprehensive coverage for 2-day wedding events.",
      features: [
        "Traditional & Candid Photography",
        "Cinematic Wedding Film",
        "Drone Coverage (Subject to permission)",
        "2 Premium Albums",
        "Pre-wedding shoot included",
      ],
      popular: true,
    },
    {
      name: "Basic Portrait",
      price: "₹5,000",
      description: "Studio session for individuals or small families.",
      features: [
        "2 Hour Studio Session",
        "2 Changes of Outfit",
        "15 Professionally Retouched Photos",
        "High-res Digital Delivery",
      ],
    }
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#D4AF37]/20 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">Pricing Packages</h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
          Transparent pricing for our most popular services. Contact us for custom requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg, idx) => (
          <div 
            key={idx} 
            className={`relative group backdrop-blur-xl bg-white/50 dark:bg-zinc-900/50 border rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
              pkg.popular 
                ? "border-[#D4AF37]/50 shadow-2xl shadow-[#D4AF37]/10 dark:shadow-[#D4AF37]/5" 
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
                  <Check className={`w-5 h-5 shrink-0 mt-0.5 ${pkg.popular ? "text-[#D4AF37]" : "text-zinc-400 dark:text-zinc-500"}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/contact" 
              className={`w-full text-center py-4 rounded-xl font-semibold transition-all duration-300 ${
                pkg.popular 
                  ? "bg-[#D4AF37] hover:bg-[#c5a028] text-black shadow-lg shadow-[#D4AF37]/25" 
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              Enquire Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
