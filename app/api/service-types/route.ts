import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("service_types")
    .select("id, name, slug, base_fare, per_mile, is_active, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ services: data || [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, slug, base_fare, per_mile, is_active, sort_order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("service_types")
      .insert({
        name: String(name).trim(),
        slug: String(slug).trim(),
        base_fare: Number(base_fare || 0),
        per_mile: Number(per_mile || 0),
        is_active: Boolean(is_active),
        sort_order: Number(sort_order || 0),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ service: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}