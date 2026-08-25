import { Camera, CalendarCheck, Image as ImageIcon, Gift } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const STEPS = [
  {
    icon: <Camera className="w-8 h-8 text-cyan-400" />,
    title: "1. Choose Your Service",
    description: "Browse our expertise and select the photography or videography service that fits your needs.",
  },
  {
    icon: <CalendarCheck className="w-8 h-8 text-cyan-400" />,
    title: "2. Book a Session",
    description: "Use our easy online booking system to schedule your date and time with our team.",
  },
  {
    icon: <ImageIcon className="w-8 h-8 text-cyan-400" />,
    title: "3. Capture Memories",
    description: "We bring our professional equipment and creativity to capture your special moments perfectly.",
  },
  {
    icon: <Gift className="w-8 h-8 text-cyan-400" />,
    title: "4. Receive Your Photos",
    description: "Get your high-quality, beautifully edited photos delivered to you through a secure gallery.",
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative bg-zinc-900/20 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-cyan-400 dark:to-violet-500 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            How It Works
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-xl max-w-2xl mx-auto font-light">
            Our simple and seamless process ensures you get the best experience from start to finish.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, index) => (
            <AnimatedSection
              key={index}
              delay={0.1 * index}
              className="relative group bg-zinc-950/50 p-8 rounded-3xl border border-zinc-800/50 hover:border-cyan-500/30 transition-colors duration-300"
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                {step.description}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
