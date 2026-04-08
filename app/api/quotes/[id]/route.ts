import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ⚠️ ADMIN CLIENT (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ DELETE handler
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { error } = await supabaseAdmin
    .from("quotes")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// ✅ FORM SUPPORT (because forms send POST)
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const formData = await req.formData();
  const method = formData.get("_method");

  if (method === "DELETE") {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from("quotes")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // redirect back to dashboard
    return NextResponse.redirect(new URL("/portal-x7k9a2", req.url));
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}