import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are not configured." },
        { status: 500 }
      );
    }

    const { title, slug, questions } = await request.json();

    if (!title || !slug || !Array.isArray(questions) || !questions.length) {
      return NextResponse.json({ error: "Missing test data." }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
      .from("tests")
      .insert({
        title: String(title).trim(),
        slug,
        listening_audio_url: JSON.stringify({ kind: "grammar", questions }),
      })
      .select("id, slug")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Supabase: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ id: data.id, slug: data.slug });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? `Publish error: ${error.message}` : "Could not publish test." },
      { status: 500 }
    );
  }
}
