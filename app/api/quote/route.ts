import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_phone,
      pickup_address,
      dropoff_address,
    } = body;

    // 👉 Simple mock calculation (replace later with Google Maps if needed)
    const distanceMiles = 10; // placeholder
    const total = distanceMiles * 2; // £2 per mile example

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        customer_name,
        customer_phone,
        pickup_address,
        dropoff_address,
        service_type: "standard",       // ✅ REQUIRED
        out_of_hours: false,            // ✅ REQUIRED
        quoted_amount: total,           // ✅ REQUIRED
        distance_miles: distanceMiles,  // ✅ REQUIRED
        payment_status: "pending",      // ✅ REQUIRED
        status: "new",                  // ✅ REQUIRED
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