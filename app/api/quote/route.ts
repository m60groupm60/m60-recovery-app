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
      service_type,
    } = body;

    const ukPostcodeRegex =
      /^([A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2})$/i;

    const pickupPostcode = String(pickup_address || "").trim().toUpperCase();
    const dropoffPostcode = String(dropoff_address || "").trim().toUpperCase();

    if (
      !customer_name ||
      !customer_phone ||
      !pickupPostcode ||
      !dropoffPostcode ||
      !service_type
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    if (!ukPostcodeRegex.test(pickupPostcode)) {
      return NextResponse.json(
        { error: "Invalid pickup postcode" },
        { status: 400 }
      );
    }

    if (!ukPostcodeRegex.test(dropoffPostcode)) {
      return NextResponse.json(
        { error: "Invalid drop-off postcode" },
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
            address: pickupPostcode,
          },
          destination: {
            address: dropoffPostcode,
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

    let baseFare = 0;
    let perMile = 0;

    switch (service_type) {
      case "vehicle_recovery":
        baseFare = 25;
        perMile = 2.0;
        break;
      case "off_road_rescue":
        baseFare = 45;
        perMile = 3.0;
        break;
      case "vehicle_transportation":
        baseFare = 35;
        perMile = 2.5;
        break;
      case "new_car_purchases":
        baseFare = 30;
        perMile = 2.2;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid service type" },
          { status: 400 }
        );
    }

    const total = Math.round(baseFare + distanceMiles * perMile);

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        customer_name,
        customer_phone,
        pickup_address: pickupPostcode,
        dropoff_address: dropoffPostcode,
        service_type,
        out_of_hours: false,
        quoted_amount: total,
        distance_miles: distanceMiles,
        payment_status: "pending",
        status: "new",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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