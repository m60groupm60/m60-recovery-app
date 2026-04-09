import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

function isOutOfHours(
  date: Date,
  weekdayStartHour: number,
  weekdayEndHour: number,
  weekendEnabled: boolean
) {
  const day = date.getDay(); // 0 Sunday, 6 Saturday
  const hour = date.getHours();

  const isWeekend = weekendEnabled && (day === 0 || day === 6);

  if (isWeekend) return true;

  // Example:
  // start 20, end 6  => out of hours from 20:00 to 05:59
  if (weekdayStartHour > weekdayEndHour) {
    return hour >= weekdayStartHour || hour < weekdayEndHour;
  }

  // Example:
  // start 18, end 22 => out of hours from 18:00 to 21:59
  if (weekdayStartHour < weekdayEndHour) {
    return hour >= weekdayStartHour && hour < weekdayEndHour;
  }

  // If same hour, treat as disabled
  return false;
}

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
    const serviceSlug = String(service_type || "").trim();

    if (
      !customer_name ||
      !customer_phone ||
      !pickupPostcode ||
      !dropoffPostcode ||
      !serviceSlug
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

    const { data: serviceRow, error: serviceError } = await supabase
      .from("service_types")
      .select(
        "name, slug, base_fare, per_mile, minimum_charge, callout_fee, out_of_hours_extra, is_active"
      )
      .eq("slug", serviceSlug)
      .eq("is_active", true)
      .single();

    if (serviceError || !serviceRow) {
      return NextResponse.json(
        { error: "Invalid or inactive service type" },
        { status: 400 }
      );
    }

    const { data: pricingSettings, error: pricingError } = await supabase
      .from("pricing_settings")
      .select("weekday_start_hour, weekday_end_hour, weekend_enabled")
      .limit(1)
      .single();

    if (pricingError || !pricingSettings) {
      return NextResponse.json(
        { error: "Pricing settings not found" },
        { status: 500 }
      );
    }

    const weekdayStartHour = Number(pricingSettings.weekday_start_hour ?? 20);
    const weekdayEndHour = Number(pricingSettings.weekday_end_hour ?? 6);
    const weekendEnabled = Boolean(pricingSettings.weekend_enabled ?? true);

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
          origin: { address: pickupPostcode },
          destination: { address: dropoffPostcode },
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

    const baseFare = Number(serviceRow.base_fare || 0);
    const perMile = Number(serviceRow.per_mile || 0);
    const minimumCharge = Number(serviceRow.minimum_charge || 0);
    const calloutFee = Number(serviceRow.callout_fee || 0);
    const outOfHoursExtra = Number(serviceRow.out_of_hours_extra || 0);

    const now = new Date();
    const outOfHours = isOutOfHours(
      now,
      weekdayStartHour,
      weekdayEndHour,
      weekendEnabled
    );

    let total = baseFare + calloutFee + distanceMiles * perMile;

    if (outOfHours) {
      total += outOfHoursExtra;
    }

    total = Math.max(total, minimumCharge);
    total = Math.round(total);

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        customer_name,
        customer_phone,
        pickup_address: pickupPostcode,
        dropoff_address: dropoffPostcode,
        service_type: serviceRow.slug,
        out_of_hours: outOfHours,
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
      out_of_hours: outOfHours,
      service: {
        name: serviceRow.name,
        slug: serviceRow.slug,
      },
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}