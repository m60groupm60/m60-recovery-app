import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const { error } = await supabase.from("whatsapp_logs").insert({
    quote_id: body.quote_id ?? null,
    customer_name: body.customer_name,
    customer_phone: body.customer_phone,
    message_preview: body.message,
    status: "sent",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}