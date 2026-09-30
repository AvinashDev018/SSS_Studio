import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About SSS Studio Madurai | Founder Siva Kumar & Our Story",
  description:
    "Meet SSS Studio (sssstudio) — Avaniyapuram, Madurai photography studio led by Mr. Siva Kumar. Premium wedding storytelling with 1-Month Album Delivery Guarantee.",
  path: "/about",
  image:
    "https://res.cloudinary.com/e5pnwpo5/image/upload/v1790760457/sss-about/siva-kumar-founder.jpg",
});

export default function AboutLayout({ children }) {
  return children;
}
