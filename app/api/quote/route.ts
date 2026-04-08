import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_phone,
      pickup_address,
      dropoff_address,
    } = body;

    if (
      !customer_name ||
      !customer_phone ||
      !pickup_address ||
      !dropoff_address
    ) {
      return NextResponse.json(
        { error: "Please fill in all fields" },
        { status: 400 }
      );
    }

    const mapsRes = await fetch(
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
            address: pickup_address,
          },
          destination: {
            address: dropoff_address,
          },
          travelMode: "DRIVE",
        }),
      }
    );

    const mapsData = await mapsRes.json();
    const distanceMeters = mapsData?.routes?.[0]?.distanceMeters;

    if (!distanceMeters) {
      return NextResponse.json(
        { error: "Could not calculate distance" },
        { status: 500 }
      );
    }

    const distanceMiles = Math.round(distanceMeters / 1609.34);

    // Simple pricing rule for now
    // You can change this later
    const total = distanceMiles * 2;

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        customer_name,
        customer_phone,
        pickup_address,
        dropoff_address,
        service_type: "standard",
        out_of_hours: false,
        quoted_amount: total,
        distance_miles: distanceMiles,
        payment_status: "pending",
        status: "new",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quote: total,
      distance: distanceMiles,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}