import { Inter, Playfair_Display } from "next/font/google";
import SSSAnnouncementBar from "@/components/layout/SSSAnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MultilingualWhatsAppWidget from "@/components/ui/MultilingualWhatsAppWidget";
import ChatbotWidget from "@/components/ChatbotWidget";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata = {
  title: {
    template: '%s | SSS Studio Photography',
    default: 'SSS Studio | Premium Wedding Photography & Films',
  },
  description: 'Luxury wedding photography, candid cinematography, newborn & maternity shoots with a guaranteed 20-Day Album Delivery in Madurai and Tamil Nadu.',
  keywords: ['photography', 'wedding photography', 'cinematic films', 'maternity photoshoot', 'madurai', 'sss studio', 'album delivery'],
  openGraph: {
    title: 'SSS Studio | Premium Wedding Photography & Films',
    description: 'Luxury wedding photography, candid cinematography, and maternity shoots with guaranteed 20-Day Album Delivery.',
    url: 'https://sssstudiomadurai.com',
    siteName: 'SSS Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSS Studio | Premium Wedding Photography & Films',
    description: 'Luxury wedding photography & films in Madurai.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#080c0b] text-zinc-100 min-h-screen flex flex-col relative antialiased selection:bg-teal-500/30`}>
        {/* Ambient Global Glow */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-teal-600/25 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Providers>
            <SSSAnnouncementBar />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ChatbotWidget />
            <MultilingualWhatsAppWidget whatsappNumber="916383565425" />
          </Providers>
        </div>
      </body>
    </html>
  );
}
