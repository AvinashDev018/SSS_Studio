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
      icon: <Camera className="w-8 h-8 text-white drop-shadow-md" />,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg"
    },
    {
      title: "Cinematic Videography",
      description: "Beautifully edited highlight reels and full-length wedding films that tell your unique love story.",
      icon: <Video className="w-8 h-8 text-white drop-shadow-md" />,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504974/zsttc9iwgpwvwtipukq0.jpg"
    },
    {
      title: "Portrait Sessions",
      description: "Professional solo, couple, and family portraits taken in our studio or at a location of your choice.",
      icon: <Users className="w-8 h-8 text-white drop-shadow-md" />,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505577/iqimm503wxxauaksjjzt.jpg"
    },
    {
      title: "Birthday Functions",
      description: "Fun, vibrant coverage of birthday parties and family events, ensuring you never forget a moment.",
      icon: <Sparkles className="w-8 h-8 text-white drop-shadow-md" />,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505207/rm2cysblt45dofw4myda.jpg"
    },
    {
      title: "Corporate Events",
      description: "Professional documentation of seminars, product launches, and corporate get-togethers.",
      icon: <Briefcase className="w-8 h-8 text-white drop-shadow-md" />,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505160/eyjrkwxibelkaybtdsxj.jpg"
    },
    {
      title: "Real Estate & Architecture",
      description: "High-quality, wide-angle photography highlighting the best features of properties and architecture.",
      icon: <Building className="w-8 h-8 text-white drop-shadow-md" />,
      image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787505161/yoibaxbg0hd4epzqgoou.jpg"
    }
  ];

 return (
 <div className="py-24 max-w-7xl mx-auto min-h-screen">
 <div className="px-4 sm:px-6 lg:px-8 mb-32">
 <AnimatedSection className="text-center mb-16">
 <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-cyan-400 dark:to-violet-600 drop-shadow-sm">Our Services</h1>
 <p className="text-zinc-600 dark:text-zinc-300 text-xl max-w-2xl mx-auto font-light leading-relaxed">
 From grand weddings to professional headshots, we offer a comprehensive range of photography and videography services.
 </p>
 </AnimatedSection>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {services.map((service, idx) => (
        <AnimatedSection key={idx} delay={idx * 0.1} className="h-[450px]">
          <div className="relative overflow-hidden rounded-3xl h-full group border border-zinc-200 dark:border-zinc-800/80 shadow-xl">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${service.image})` }}
            />
            
            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10 group-hover:from-black/100 group-hover:via-black/70 transition-colors duration-500" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8 z-10">
              <div className="mb-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="bg-white/10 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg group-hover:bg-brand-gradient group-hover:border-transparent transition-all duration-300">
                  {service.icon}
                </div>
              </div>
              <h3 className="font-serif text-3xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-zinc-300 leading-relaxed text-lg line-clamp-3">
                {service.description}
              </p>
            </div>
          </div>
        </AnimatedSection>
 ))}
 </div>
 </div>

 <FAQ />
 </div>
 );
}
