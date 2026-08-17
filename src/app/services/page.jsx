import { Camera, Video, User, Users, Gift, Stamp } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata = {
  title: 'Our Services',
  description: 'Explore our range of professional photography services in Madurai, including weddings, events, birthdays, and portraits.',
};

export default function Services() {
  const services = [
    {
      title: "Wedding Photography",
      description: "Traditional and candid photography for your special day. We capture every emotion and detail.",
      icon: <Users className="w-8 h-8 text-white" />,
    },
    {
      title: "Pre-Wedding Shoots",
      description: "Cinematic and beautiful pre-wedding photography and videography at locations of your choice.",
      icon: <Camera className="w-8 h-8 text-white" />,
    },
    {
      title: "Portrait Photography",
      description: "Professional portraits for family, baby, and modeling portfolios.",
      icon: <User className="w-8 h-8 text-white" />,
    },
    {
      title: "Event Coverage",
      description: "Birthdays, engagements, receptions, and corporate event photography.",
      icon: <Video className="w-8 h-8 text-white" />,
    },
    {
      title: "Birthday Functions",
      description: "Capture the joy and celebrations of your special day with our fun and vibrant birthday coverage.",
      icon: <Gift className="w-8 h-8 text-white" />,
    },
    {
      title: "Passport & ID Photos",
      description: "Quick, professional passport and visa photos adhering to all official guidelines.",
      icon: <Stamp className="w-8 h-8 text-white" />,
    },
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-amber-100 to-yellow-600 drop-shadow-sm">Our Services</h1>
        <p className="text-zinc-300 text-xl max-w-2xl mx-auto font-light leading-relaxed">
          From grand weddings to professional headshots, we offer a comprehensive range of photography and videography services.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <AnimatedSection key={idx} delay={idx * 0.1}>
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 p-10 rounded-3xl hover:border-amber-500/30 transition-all duration-300 shadow-xl h-full group">
              <div className="bg-gradient-to-br from-amber-400 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="font-serif text-3xl font-bold mb-4 text-white group-hover:text-amber-300 transition-colors">{service.title}</h3>
              <p className="text-zinc-300 leading-relaxed text-lg">{service.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
