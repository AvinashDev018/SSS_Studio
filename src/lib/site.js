/** Canonical public site URL — keep in sync with domain DNS / hosting */
export const SITE_URL = "https://ssstudio.online";

export const SITE_NAME = "SSS Studio Photography";
export const SITE_NAME_SHORT = "SSS Studio";
export const SITE_TAGLINE =
  "Premium wedding photography & cinematic films in Madurai, Tamil Nadu";

export const SITE_DESCRIPTION =
  "SSS Studio (sssstudio / ssstudio) — premium wedding photography, candid cinematography, pre-wedding, maternity, baby & event shoots in Avaniyapuram, Madurai. 1-Month Album Delivery Guarantee across Tamil Nadu.";

export const SITE_KEYWORDS = [
  "sss studio",
  "sssstudio",
  "ssstudio",
  "ssstudio.online",
  "sss photography studio",
  "sss studio madurai",
  "photography studio madurai",
  "wedding photography madurai",
  "best wedding photographer madurai",
  "candid wedding photography madurai",
  "cinematic wedding films madurai",
  "pre wedding shoot madurai",
  "maternity photo shoot madurai",
  "baby photo shoot madurai",
  "birthday photography madurai",
  "avaniyapuram photography studio",
  "1 month album delivery madurai",
  "wedding photographer tamil nadu",
];

export const SITE_PHONE = "+91 98659 92379";
export const SITE_WHATSAPP = "919865992379";
export const SITE_EMAIL = "hello@ssstudio.online";

export const SITE_ADDRESS = {
  streetAddress: "7th Street, Prasanna Colony, Avaniyapuram",
  addressLocality: "Madurai",
  addressRegion: "Tamil Nadu",
  postalCode: "625012",
  addressCountry: "IN",
};

export const SITE_GEO = { latitude: 9.8828, longitude: 78.1348 };

export const SITE_OG_IMAGE =
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1787504972/kllcuquwxjltq88cmb5n.jpg";

export const SITE_FOUNDER_IMAGE =
  "https://res.cloudinary.com/e5pnwpo5/image/upload/v1790760457/sss-about/siva-kumar-founder.jpg";

export const SITE_SOCIAL = {
  instagram: "https://instagram.com/sss_studio_70",
  facebook: "https://www.facebook.com/sivakumar.subramanianshetty",
};

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = SITE_KEYWORDS,
  image = SITE_OG_IMAGE,
  noIndex = false,
}) {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: typeof title === "string" ? title : SITE_NAME,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title || SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: typeof title === "string" ? title : SITE_NAME,
      description,
      images: [image],
    },
  };
}
