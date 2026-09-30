import { Inter, Playfair_Display } from "next/font/google";
import SSSAnnouncementBar from "@/components/layout/SSSAnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MultilingualWhatsAppWidget from "@/components/ui/MultilingualWhatsAppWidget";
import CursorGlow from "@/components/ui/CursorGlow";
import { Providers } from "@/components/Providers";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_PHONE,
  SITE_OG_IMAGE,
  SITE_FOUNDER_IMAGE,
  SITE_ADDRESS,
  SITE_GEO,
  SITE_SOCIAL,
  SITE_WHATSAPP,
} from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default:
      "SSS Studio | Wedding Photography & Cinematic Films Madurai (sssstudio)",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: "SSS Studio", url: SITE_URL }],
  creator: "SSS Studio",
  publisher: SITE_NAME,
  category: "photography",
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "SSS Studio | Premium Wedding Photography & Films Madurai",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_IN",
    alternateLocales: ["ta_IN"],
    type: "website",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "SSS Studio — Luxury Wedding Photography Madurai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSS Studio | Premium Wedding Photography Madurai",
    description:
      "Wedding, candid & cinematic photography in Madurai with 1-Month Album Delivery Guarantee.",
    images: [SITE_OG_IMAGE],
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Madurai",
    "geo.position": `${SITE_GEO.latitude};${SITE_GEO.longitude}`,
    ICBM: `${SITE_GEO.latitude}, ${SITE_GEO.longitude}`,
    "format-detection": "telephone=yes",
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: ["SSS Studio", "sssstudio", "ssstudio", "SSS Photography Studio"],
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: ["en-IN", "ta-IN"],
    },
    {
      "@type": ["LocalBusiness", "Photographer"],
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: [
        "SSS Studio",
        "SSS Photography Studio",
        "sssstudio",
        "ssstudio",
        "SSS Studio Madurai",
      ],
      legalName: "SSS Studio",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      telephone: SITE_PHONE,
      image: [SITE_OG_IMAGE, SITE_FOUNDER_IMAGE],
      logo: SITE_FOUNDER_IMAGE,
      priceRange: "₹₹–₹₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, UPI, Card, Net Banking",
      address: {
        "@type": "PostalAddress",
        ...SITE_ADDRESS,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: SITE_GEO.latitude,
        longitude: SITE_GEO.longitude,
      },
      areaServed: [
        { "@type": "City", name: "Madurai" },
        { "@type": "State", name: "Tamil Nadu" },
      ],
      sameAs: [SITE_SOCIAL.instagram, SITE_SOCIAL.facebook],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: SITE_PHONE,
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Tamil"],
        },
        {
          "@type": "ContactPoint",
          contactType: "WhatsApp",
          url: `https://wa.me/${SITE_WHATSAPP}`,
          availableLanguage: ["English", "Tamil"],
        },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:00",
          closes: "21:30",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Photography & Film Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Wedding & Event Photo Shoot",
              areaServed: "Tamil Nadu",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Pre-Wedding & Post Wedding Shoot",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Maternity & Baby Photo Shoot",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Birthday & School Event Photography",
            },
          },
        ],
      },
      founder: {
        "@type": "Person",
        name: "Siva Kumar",
        jobTitle: "Founder & Managing Director",
        image: SITE_FOUNDER_IMAGE,
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth w-full overflow-x-hidden" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-white text-zinc-900 min-h-screen flex flex-col relative antialiased selection:bg-[#d4af37]/30 w-full max-w-full overflow-x-hidden`}
        suppressHydrationWarning
      >
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#d4af37]/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#b8860b]/5 rounded-full blur-[160px]" />
        </div>

        <div
          className="relative z-10 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden"
          suppressHydrationWarning
        >
          <Providers>
            <CursorGlow />
            <SSSAnnouncementBar />
            <Navbar />
            <main className="flex-grow w-full max-w-full overflow-x-hidden">{children}</main>
            <Footer />
            <MultilingualWhatsAppWidget whatsappNumber={SITE_WHATSAPP} />
          </Providers>
        </div>
      </body>
    </html>
  );
}
