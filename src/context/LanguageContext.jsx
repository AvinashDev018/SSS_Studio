"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    langCode: "en",
    langName: "English",
    langLabel: "EN",
    announcementOffer: "Pre Wedding Shoot",
    announcementOfferHighlight: "Absolutely FREE!",
    announcementDelivery: "Album Delivered Within",
    announcementDeliveryHighlight: "1 Month — Guaranteed!",
    badgeExclusive: "EXCLUSIVE OFFER",
    badgeDelivery: "DELIVERY GUARANTEE",
    nav: {
      home: "Home",
      services: "Services",
      portfolio: "Portfolio",
      about: "About",
      pricing: "Pricing",
      gifts: "Gifts",
      testimonials: "Testimonials",
      contact: "Contact",
      offer: "Offer Here!",
      getQuote: "Get Quote",
      bookNow: "Book Now",
      track: "Track",
    },
    hero: {
      titleLine1: "Capturing Your Beautiful",
      titleLine2: "Moments",
      subtitle: "WEDDING • MATERNITY • EVENTS • CINEMATIC SHOOTS",
      bookBtn: "Book a Shoot",
      quoteBtn: "Request a Quote",
    },
    services: {
      tag: "What We Offer",
      title: "Our Photography & Film Services",
      subtitle: "Tailored packages designed for every milestone, crafted with creativity and technical mastery.",
      bookBtn: "Book This Service",
    },
    guarantees: {
      tag: "Why SSS Studio is Different",
      title: "Studio Guarantees & Exclusive Perks",
      subtitle: "We combine high-end cinema equipment with strict timelines so your memories are preserved with perfection and delivered within 1 month.",
      inclusions: "Premium Inclusions",
      enquire: "Enquire Now",
    },
    portfolio: {
      tag: "SSS Studio Gallery",
      title: "Recent Shoots & Projects",
      all: "All",
      wedding: "Wedding",
      preWedding: "Pre / Post Wedding",
      maternity: "Baby & Maternity",
      birthday: "Birthdays & Events",
      viewStory: "View Story →",
    },
    testimonials: {
      tag: "Client Love & Stories",
      title: "What Our Clients Say About SSS Studio",
      subtitle: "Real stories from couples and families whose special memories we have had the honor to capture.",
      leaveReview: "Leave a Testimonial",
    },
    contact: {
      tag: "Get in Touch",
      title: "Visit SSS Studio or Schedule a Consultation",
      subtitle: "Whether you are planning a grand South Indian wedding, a destination couple shoot, or a family milestone, our team is ready to craft your story.",
      address: "34, Prasanna New Colony, Avaniyapuram, Madurai, Tamil Nadu 625012",
      hours: "Monday – Sunday: 9:00 AM – 9:30 PM (All 7 Days)",
      bookSlot: "Book Date Availability",
      chatWhatsApp: "WhatsApp Chat",
    },
    whatsapp: {
      greeting: "Hello SSS Photography Studio! I would like to enquire about your photography packages and date availability.",
    }
  },
  ta: {
    langCode: "ta",
    langName: "தமிழ்",
    langLabel: "தமிழ்",
    announcementOffer: "திருமணத்திற்கு முந்தைய போட்டோஷூட்",
    announcementOfferHighlight: "முற்றிலும் இலவசம்!",
    announcementDelivery: "ஆல்பம் டெலிவரி",
    announcementDeliveryHighlight: "1 மாதத்தில் — உறுதி!",
    badgeExclusive: "பிரத்யேக சலுகை",
    badgeDelivery: "டெலிவரி உத்தரவாதம்",
    nav: {
      home: "முகப்பு",
      services: "சேவைகள்",
      portfolio: "கேலரி",
      about: "அறிமுகம்",
      pricing: "கட்டணம்",
      gifts: "பரிசுகள்",
      testimonials: "கருத்துக்கள்",
      contact: "தொடர்பு",
      offer: "சலுகை!",
      getQuote: "விலை விவரம்",
      bookNow: "முன்பதிவு",
      track: "டிராக்கிங்",
    },
    hero: {
      titleLine1: "உங்கள் அழகான தருணங்களை",
      titleLine2: "படம்பிடிக்கிறோம்",
      subtitle: "திருமணம் • மெட்டர்னிட்டி • நிகழ்வுகள் • சினிமாட்டிக் ஷூட்கள்",
      bookBtn: "ஷூட் பதிவு செய்",
      quoteBtn: "விலை விவரம்",
    },
    services: {
      tag: "எங்கள் சேவைகள்",
      title: "புகைப்படம் & திரைப்பட சேவைகள்",
      subtitle: "உங்கள் ஒவ்வொரு சிறப்பு தருணத்திற்கும் ஏற்ற தனிப்பயனாக்கப்பட்ட சேவைகள்.",
      bookBtn: "இந்த சேவையை பதிவு செய்",
    },
    guarantees: {
      tag: "SSS ஸ்டுடியோவின் சிறப்பு",
      title: "ஸ்டுடியோ உத்தரவாதங்கள் & சலுகைகள்",
      subtitle: "1 மாதத்தில் ஆல்பம் டெலிவரி மற்றும் தரமான சினிமா உபகரணங்களுடன் கூடிய சிறந்த புகைப்பட அனுபவம்.",
      inclusions: "சிறப்பு நன்மைகள்",
      enquire: "விவரம் அறிய",
    },
    portfolio: {
      tag: "SSS புகைப்பட தொகுப்பு",
      title: "சமீபத்திய புகைப்படங்கள் & திட்டங்கள்",
      all: "அனைத்தும்",
      wedding: "திருமணம்",
      preWedding: "ப்ரீ / போஸ்ட் வெடிங்",
      maternity: "குழந்தை & மெட்டர்னிட்டி",
      birthday: "பிறந்தநாள் & நிகழ்வுகள்",
      viewStory: "பார்க்க →",
    },
    testimonials: {
      tag: "வாடிக்கையாளர் கருத்துக்கள்",
      title: "SSS ஸ்டுடியோ பற்றி வாடிக்கையாளர்கள் கூறுவது",
      subtitle: "எங்கள் சேவையால் மகிழ்ச்சியடைந்த குடும்பங்கள் மற்றும் தம்பதிகளின் உண்மை அனுபவங்கள்.",
      leaveReview: "கருத்து பதிவு செய்",
    },
    contact: {
      tag: "தொடர்பு கொள்ள",
      title: "SSS ஸ்டுடியோவிற்கு வருகை தாருங்கள் அல்லது ஆலோசனை பெறவும்",
      subtitle: "உங்கள் திருமண மற்றும் குடும்ப விழாக்களுக்கு இன்றே தொடர்பு கொள்ளுங்கள்.",
      address: "34, பிரசன்னா நியூ காலனி, அவனியாபுரம், மதுரை, தமிழ்நாடு 625012",
      hours: "திங்கள் – ஞாயிறு: காலை 9:00 – இரவு 9:30 (7 நாட்களும்)",
      bookSlot: "தேதி முன்பதிவு",
      chatWhatsApp: "வாட்ஸ்அப் சாட்",
    },
    whatsapp: {
      greeting: "வணக்கம் SSS போட்டோகிராபி! உங்கள் புகைப்பட சேவைகள் மற்றும் கட்டண விவரங்களை அறிய விரும்புகிறேன்.",
    }
  },
  hi: {
    langCode: "hi",
    langName: "हिंदी",
    langLabel: "हिंदी",
    announcementOffer: "प्री-वेडिंग शूट",
    announcementOfferHighlight: "बिल्कुल मुफ़्त!",
    announcementDelivery: "एल्बम डिलीवरी",
    announcementDeliveryHighlight: "1 महीने के भीतर — गारंटी!",
    badgeExclusive: "विशेष ऑफर",
    badgeDelivery: "डिलीवरी गारंटी",
    nav: {
      home: "होम",
      services: "सेवाएं",
      portfolio: "गैलरी",
      about: "परिचय",
      pricing: "पैकेज",
      gifts: "उपहार",
      testimonials: "समीक्षाएं",
      contact: "संपर्क",
      offer: "ऑफर!",
      getQuote: "कोटेशन",
      bookNow: "बुक करें",
      track: "ट्रैक",
    },
    hero: {
      titleLine1: "आपके खूबसूरत पलों को",
      titleLine2: "कैद करते हुए",
      subtitle: "शादी • मातृत्व • कार्यक्रम • सिनेमैटिक शूट",
      bookBtn: "शूट बुक करें",
      quoteBtn: "कोटेशन मांगें",
    },
    services: {
      tag: "हमारी सेवाएं",
      title: "फोटोग्राफी और फिल्म सेवाएं",
      subtitle: "हर खास मौके के लिए तैयार किए गए बेहतरीन फोटोग्राफी पैकेज।",
      bookBtn: "यह सेवा बुक करें",
    },
    guarantees: {
      tag: "SSS स्टूडियो की खासियत",
      title: "स्टूडियो गारंटी और विशेष लाभ",
      subtitle: "उच्च गुणवत्ता वाले सिनेमा उपकरण और 1 महीने में एल्बम डिलीवरी की गारंटी।",
      inclusions: "प्रीमियम सुविधाएं",
      enquire: "पूछताछ करें",
    },
    portfolio: {
      tag: "SSS स्टूडियो गैलरी",
      title: "हाल के शूट्स और प्रोजेक्ट्स",
      all: "सभी",
      wedding: "शादी",
      preWedding: "प्री / पोस्ट वेडिंग",
      maternity: "बेबी और मातृत्व",
      birthday: "जन्मदिन और कार्यक्रम",
      viewStory: "देखें →",
    },
    testimonials: {
      tag: "ग्राहकों के अनुभव",
      title: "SSS स्टूडियो के बारे में हमारे ग्राहक क्या कहते हैं",
      subtitle: "उन परिवारों और जोड़ों की असली कहानियां जिनकी यादों को हमने कैद किया।",
      leaveReview: "समीक्षा लिखें",
    },
    contact: {
      tag: "संपर्क करें",
      title: "SSS स्टूडियो आएं या परामर्श बुक करें",
      subtitle: "अपनी शादी या पारिवारिक कार्यक्रम के लिए आज ही हमसे संपर्क करें।",
      address: "34, प्रसन्ना न्यू कॉलोनी, अवनियापुरम, मदुरै, तमिलनाडु 625012",
      hours: "सोमवार – रविवार: सुबह 9:00 – रात 9:30 (सातों दिन)",
      bookSlot: "तारीख बुक करें",
      chatWhatsApp: "व्हाट्सएप चैट",
    },
    whatsapp: {
      greeting: "नमस्ते SSS फोटोग्राफी! मैं आपकी फोटोग्राफी सेवाओं और तारीख की उपलब्धता के बारे में पूछताछ करना चाहता हूँ।",
    }
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sss_lang");
      if (saved && translations[saved]) {
        setCurrentLang(saved);
      }
    }
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setCurrentLang(lang);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("sss_lang", lang);
        } catch (e) {
          // ignore
        }
      }
    }
  };

  const t = translations[currentLang] || translations.en;

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      currentLang: "en",
      changeLanguage: () => {},
      t: translations.en,
      translations,
    };
  }
  return context;
}
