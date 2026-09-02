import { Inter, Playfair_Display } from "next/font/google";
import SSSAnnouncementBar from "@/components/layout/SSSAnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MultilingualWhatsAppWidget from "@/components/ui/MultilingualWhatsAppWidget";
import ChatbotWidget from "@/components/ChatbotWidget";
import CursorGlow from "@/components/ui/CursorGlow";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata = {
  metadataBase: new URL('https://sssstudiomadurai.com'),
  title: {
    template: '%s | SSS Studio Photography',
    default: 'SSS Studio | Premium Wedding Photography & Cinematic Films Madurai',
  },
  description: 'Luxury wedding photography, candid cinematography, newborn, baby & maternity shoots with guaranteed 1-Month Album Delivery in Madurai and Tamil Nadu. Book with SSS Photography Studio.',
  keywords: [
    'photography studio madurai',
    'wedding photography madurai',
    'best wedding photographer madurai',
    'candid wedding photography',
    'cinematic wedding films',
    'pre wedding shoot madurai',
    'post wedding photography',
    'maternity photo shoot',
    'baby photo shoot',
    'birthday shoot',
    'school college events photography',
    '1 month album delivery guarantee',
    'sss studio avaniyapuram',
    'sss photography studio',
  ],
  authors: [{ name: 'SSS Studio', url: 'https://sssstudiomadurai.com' }],
  creator: 'SSS Studio',
  publisher: 'SSS Studio Photography',
  alternates: {
    canonical: 'https://sssstudiomadurai.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'SSS Studio | Premium Wedding Photography & Films',
    description: 'Luxury wedding photography, candid cinematography, baby & maternity shoots with guaranteed 1-Month Album Delivery in Madurai.',
    url: 'https://sssstudiomadurai.com',
    siteName: 'SSS Studio Photography',
    locale: 'en_US',
    alternateLocales: ['ta_IN', 'hi_IN'],
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg',
        width: 1200,
        height: 630,
        alt: 'SSS Studio - Luxury Wedding Photography & Films Madurai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSS Studio | Premium Wedding Photography & Films',
    description: 'Luxury wedding photography, candid cinematography & guaranteed 1-Month Album Delivery in Madurai.',
    images: ['https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg'],
  },
  other: {
    'geo.region': 'IN-TN',
    'geo.placename': 'Madurai',
    'geo.position': '9.8828;78.1348',
    'ICBM': '9.8828, 78.1348',
    'format-detection': 'telephone=yes',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://sssstudiomadurai.com/#organization',
  name: 'SSS Studio Photography',
  alternateName: 'SSS Photography Studio',
  legalName: 'SSS Studio',
  description: 'Premium wedding photography, candid cinematography, pre-wedding, birthday, baby, and maternity shoots in Madurai, Tamil Nadu with a guaranteed 1-Month Album Delivery.',
  url: 'https://sssstudiomadurai.com',
  telephone: '+91 63835 65425',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
  image: 'https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg',
  logo: 'https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '34, Prasanna New Colony, Avaniyapuram',
    addressLocality: 'Madurai',
    addressRegion: 'Tamil Nadu',
    postalCode: '625012',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 9.8828,
    longitude: 78.1348,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:30',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Photography & Film Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wedding & Event Photo Shoot',
          description: 'High-end cinema cameras and candid storytelling with 1-Month Album Delivery Guarantee.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Pre-Wedding & Post Wedding Shoot',
          description: 'Couple portrait sessions at scenic outdoor locations with signature color grading.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Birthday Shoot',
          description: 'Cake smash setups and candid family birthday photography.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'School / College Events',
          description: 'Institutional functions, graduation days, and campus celebrations coverage.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Baby Photo Shoot',
          description: 'Safe and creative photography with sanitized props for newborns and toddlers.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Maternity Photo Shoot',
          description: 'Graceful and elegant maternity portraits with custom studio gowns and backdrops.',
        },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '184',
    bestRating: '5',
    worstRating: '1',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans bg-[#080c0b] text-zinc-100 min-h-screen flex flex-col relative antialiased selection:bg-teal-500/30`}
        suppressHydrationWarning
      >
        {/* Ambient Global Glow */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-teal-600/25 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen" suppressHydrationWarning>
          <Providers>
            <CursorGlow />
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
