import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const body = await request.json();

  const routeRes = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY!,
        "X-Goog-FieldMask": "routes.distanceMeters",
      },
      body: JSON.stringify({
        origin: {
          address: body.pickup_address,
        },
        destination: {
          address: body.dropoff_address,
        },
        travelMode: "DRIVE",
      }),
    }
  );

  const routeData = await routeRes.json();
  const meters = routeData?.routes?.[0]?.distanceMeters ?? 0;
  const distanceMiles = Number((meters / 1609.34).toFixed(1));

  const { data: settings } = await supabase
    .from("pricing_settings")
    .select("*")
    .single();

  const base =
    Number(settings?.base_fee || 0) +
    Number(settings?.call_out_fee || 0) +
    distanceMiles * Number(settings?.per_mile || 0);

  const total = Math.max(Number(settings?.minimum_quote || 0), base);

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      pickup_address: body.pickup_address,
      dropoff_address: body.dropoff_address,
      quoted_amount: total,
      distance_miles: distanceMiles,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}