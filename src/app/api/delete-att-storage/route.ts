import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { filePiths } = await req.json();
    if (!filePiths) return NextResponse.json({ error: `file piths is underfund` }, { status: 400 });

    // تنفيذ عملية الحذف من قاعدة البيانات
    const supabase = await createClient();
  await supabase.storage
    .from(process.env.SUPABASE_BUCKETS_NAME!)
    .remove(filePiths);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error delete-att-storage:", error);

    return NextResponse.json({ error: false }, { status: 500 });
  }
}
