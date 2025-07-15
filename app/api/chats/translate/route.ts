import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, targetLang } = await req.json();

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        format: "text",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error.message },
      { status: response.status }
    );
  }

  return NextResponse.json({
    translatedText: data.data.translations[0].translatedText,
  });
}
