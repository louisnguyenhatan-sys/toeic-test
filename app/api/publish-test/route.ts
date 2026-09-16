import { NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const { title, slug, questions } = await request.json();
    if (!title || !slug || !Array.isArray(questions) || !questions.length) return NextResponse.json({ error: "Missing test data." }, { status: 400 });
    if (!url || !anon) return NextResponse.json({ error: "Supabase environment variables are not configured." }, { status: 500 });

    const res = await fetch(`${url}/rest/v1/tests`, {
      method: "POST",
      headers: { apikey: anon, Authorization: `Bearer ${anon}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ title: title.trim(), slug, listening_audio_url: JSON.stringify({ kind: "grammar", questions }) }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) return NextResponse.json({ error: body?.message || body?.details || `Supabase publish failed (${res.status}).` }, { status: res.status });
    const test = Array.isArray(body) ? body[0] : body;
    return NextResponse.json({ id: test?.id, slug });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not publish test." }, { status: 500 });
  }
}
