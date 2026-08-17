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
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Pricing Packages</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Transparent pricing for our most popular services. Contact us for custom requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg, idx) => (
          <div 
            key={idx} 
            className={`relative bg-zinc-900 border rounded-3xl p-8 flex flex-col ${
              pkg.popular ? "border-zinc-500 shadow-xl shadow-zinc-800/50" : "border-zinc-800"
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
            <p className="text-zinc-400 mb-6">{pkg.description}</p>
            <div className="text-4xl font-bold mb-8">{pkg.price}</div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {pkg.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-start gap-3 text-zinc-300">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/contact" 
              className={`w-full text-center py-4 rounded-xl font-semibold transition-colors ${
                pkg.popular 
                  ? "bg-white text-black hover:bg-zinc-200" 
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
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
