import BookingWizard from "@/components/sections/BookingWizard";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata = {
 title: 'Book a Session',
 description: 'Secure your date and time with SSS Studio instantly.',
};

export default function BookPage() {
 return (
 <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center relative">
 {/* Background Styling */}
 <div className="absolute inset-0 z-0">
 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white dark:via-zinc-950/80 dark:to-zinc-950 z-10" />
 <img
 src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
 alt="Studio Background"
 className="w-full h-full object-cover object-top opacity-20 dark:opacity-10"
 />
 </div>

 <div className="relative z-10">
 <AnimatedSection className="text-center mb-12 max-w-3xl mx-auto">
 <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-cyan-400 dark:to-violet-500 drop-shadow-sm">Secure Your Spot</h1>
 <p className="text-zinc-600 dark:text-zinc-300 text-xl font-light leading-relaxed">
 Select a package, pick an available time, and we'll take care of the rest.
 </p>
 </AnimatedSection>

 <AnimatedSection delay={0.2} className="w-full flex justify-center">
 <BookingWizard />
 </AnimatedSection>
 </div>
 </div>
 );
}
