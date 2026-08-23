import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata = {
 title: {
 template: '%s | SSS Studio Madurai',
 default: 'SSS Studio | Professional Photography in Madurai',
 },
 description: 'Premium photography services in Avaniyapuram, Madurai. Specializing in weddings, portraits, birthday functions, and events.',
 keywords: ['photography', 'madurai', 'wedding photographer', 'photo studio', 'avaniyapuram', 'birthday photography'],
 openGraph: {
 title: 'SSS Studio | Professional Photography in Madurai',
 description: 'Premium photography services in Avaniyapuram, Madurai. Specializing in weddings, portraits, birthday functions, and events.',
 url: 'https://sssstudiomadurai.com',
 siteName: 'SSS Studio',
 locale: 'en_US',
 type: 'website',
 },
 twitter: {
 card: 'summary_large_image',
 title: 'SSS Studio | Professional Photography in Madurai',
 description: 'Premium photography services in Avaniyapuram, Madurai.',
 },
};

export default function RootLayout({ children }) {
 return (
 <html lang="en" className="dark" suppressHydrationWarning>
 <body className={`${inter.variable} ${playfair.variable} font-sans bg-zinc-950 text-zinc-50 min-h-screen flex flex-col relative antialiased selection:bg-cyan-500/30`}>
 {/* Ambient Global Glow */}
  <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/30 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/30 rounded-full blur-[150px]" />
  </div>
 
 <div className="relative z-10 flex flex-col min-h-screen">
 <Providers>
 <Navbar />
 <main className="flex-grow">{children}</main>
 </Providers>
 <WhatsAppButton />
 </div>
 </body>
 </html>
 );
}
