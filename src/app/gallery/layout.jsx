import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Wedding & Event Photo Gallery Madurai | SSS Studio Portfolio",
  description:
    "Browse SSS Studio client galleries — weddings, pre-wedding, baby, maternity, birthday and school events photographed in Madurai and across Tamil Nadu.",
  path: "/gallery",
});

export default function GalleryLayout({ children }) {
  return children;
}
