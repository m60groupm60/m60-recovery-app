import PricingAdminClient from "./PricingAdminClient";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/pricing-settings`,
    { cache: "no-store" }
  );

  const data = await res.json();

  return <PricingAdminClient initialSettings={data.settings} />;
}