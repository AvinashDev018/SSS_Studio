import PackagesClientContent from "@/components/PackagesClientContent";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Photography Packages & District Rates | SSS Studio',
  description: 'Transparent default rates for wedding, pre-wedding, maternity, baby, and event photography across all Tamil Nadu districts.',
};

import { getPackages } from "@/app/actions/packages";

export default async function PackagesPage() {
  let dbPackages = [];
  try {
    dbPackages = await getPackages();
  } catch (e) {
    console.error("Failed to load db packages", e);
  }

  const displayPackages = dbPackages;

  return <PackagesClientContent displayPackages={displayPackages} />;
}

