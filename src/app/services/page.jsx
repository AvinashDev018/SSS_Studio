import { Camera, Video, Users, Sparkles, Building, Briefcase } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FAQ from "@/components/sections/FAQ";

export const metadata = {
  title: 'Our Services',
  description: 'Explore our range of professional photography services in Madurai, including weddings, events, birthdays, and portraits.',
};

export default function Services() {
  const services = [
    {
      title: "Wedding Photography",
      description: "Comprehensive coverage of your special day, capturing every emotion from preparation to the grand reception.",
      icon: <Camera className="w-8 h-8 text-white" />
    },
    {
      title: "Cinematic Videography",
      description: "Beautifully edited highlight reels and full-length wedding films that tell your unique love story.",
      icon: <Video className="w-8 h-8 text-white" />
    },
    {
      title: "Portrait Sessions",
      description: "Professional solo, couple, and family portraits taken in our studio or at a location of your choice.",
      icon: <Users className="w-8 h-8 text-white" />
    },
    {
      title: "Birthday Functions",
      description: "Fun, vibrant coverage of birthday parties and family events, ensuring you never forget a moment.",
      icon: <Sparkles className="w-8 h-8 text-white" />
    },
    {
      title: "Corporate Events",
      description: "Professional documentation of seminars, product launches, and corporate get-togethers.",
      icon: <Briefcase className="w-8 h-8 text-white" />
    },
    {
      title: "Real Estate & Architecture",
      description: "High-quality, wide-angle photography highlighting the best features of properties and architecture.",
      icon: <Building className="w-8 h-8 text-white" />
    }
  ];

  return (
    <div className="py-24 max-w-7xl mx-auto min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 mb-32">
        <AnimatedSection className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-amber-100 dark:to-yellow-600 drop-shadow-sm">Our Services</h1>
          <p className="text-zinc-600 dark:text-zinc-300 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            From grand weddings to professional headshots, we offer a comprehensive range of photography and videography services.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <AnimatedSection key={idx} delay={idx * 0.1}>
              <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800/50 p-10 rounded-3xl hover:border-amber-500/50 dark:hover:border-amber-500/30 transition-all duration-300 shadow-xl h-full group">
                <div className="bg-gradient-to-br from-amber-400 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="font-serif text-3xl font-bold mb-4 text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">{service.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg">{service.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <FAQ />
    </div>
  );
}
