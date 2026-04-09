import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("pricing_settings")
    .select("id, weekday_start_hour, weekday_end_hour, weekend_enabled")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      weekday_start_hour,
      weekday_end_hour,
      weekend_enabled,
    } = body;

    const { data, error } = await supabaseAdmin
      .from("pricing_settings")
      .update({
        weekday_start_hour: Number(weekday_start_hour),
        weekday_end_hour: Number(weekday_end_hour),
        weekend_enabled: Boolean(weekend_enabled),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}