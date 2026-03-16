import { NextResponse } from "next/server";

import { env, hasSupabaseServiceEnv } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Nem kaptam fájlt." }, { status: 400 });
  }

  if (!hasSupabaseServiceEnv) {
    return NextResponse.json({
      message: "Preview módban a feltöltés nincs perzisztensen bekötve.",
    });
  }

  const client = createAdminSupabaseClient();
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const fileBuffer = await file.arrayBuffer();

  const { error } = await client!.storage
    .from(env.mediaBucket)
    .upload(fileName, fileBuffer, { contentType: file.type, upsert: true });

  if (error) {
    return NextResponse.json({ message: "A feltöltés sikertelen." }, { status: 500 });
  }

  const { data } = client!.storage.from(env.mediaBucket).getPublicUrl(fileName);

  return NextResponse.json({
    message: "Sikeres feltöltés.",
    url: data.publicUrl,
  });
}
