import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });

    const body = await request.json();
    const images = Array.isArray(body.images) ? body.images : [];
    const answerKey = String(body.answerKey || "");
    if (!images.length) return NextResponse.json({ error: "Please upload at least one image." }, { status: 400 });

    const content: any[] = [{
      type: "input_text",
      text: `Read these English grammar/TOEIC exercise images carefully. Extract every multiple-choice question in order. Preserve the wording exactly when readable. Each question should have four choices A-D when present. Teacher answer key: ${answerKey}. Return ONLY valid JSON in this exact shape: {"questions":[{"text":"...","options":["...","...","...","..."],"answer":"A"}]}. Match the supplied answer key to question order. Do not invent missing text; use [unclear] for unreadable fragments.`
    }];
    for (const image of images) content.push({ type: "input_image", image_url: image });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-5.6-luna", input: [{ role: "user", content }] })
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || "Image reading failed." }, { status: response.status });

    const text = data.output?.flatMap((item: any) => item.content || []).find((item: any) => item.type === "output_text")?.text;
    if (!text) return NextResponse.json({ error: "No questions could be extracted." }, { status: 422 });
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected extraction error." }, { status: 500 });
  }
}
