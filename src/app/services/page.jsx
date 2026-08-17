import { Camera, Video, User, Users, Gift, Stamp } from "lucide-react";

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
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Our Services</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          From grand weddings to professional headshots, we offer a comprehensive range of photography and videography services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors">
            <div className="bg-zinc-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              {service.icon}
            </div>
            <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
            <p className="text-zinc-400">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
