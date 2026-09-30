import PackagesClientContent from "@/components/PackagesClientContent";
import { pageMetadata } from "@/lib/site";
import { getPackages } from "@/app/actions/packages";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Wedding & Event Photography Packages Madurai | Transparent Rates",
  description:
    "Official SSS Studio photography packages for Madurai & all Tamil Nadu districts — wedding cinema tiers, portraits, inclusions and travel charges with 1-Month Delivery Guarantee.",
  path: "/packages",
});

export default async function PackagesPage() {
  let dbPackages = [];
  try {
    dbPackages = await getPackages();
  } catch (e) {
    console.error("Failed to load db packages", e);
  }

  return <PackagesClientContent displayPackages={dbPackages} />;
}
