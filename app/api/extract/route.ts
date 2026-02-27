import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt, messages } = await req.json();

    if (prompt) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Extract the dish name and ingredients from: "${prompt}"`,
          },
        ],
      });
      return NextResponse.json({
        result: completion.choices[0].message.content,
      });
    }
    if (messages && Array.isArray(messages)) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
      });
      return NextResponse.json({
        reply: completion.choices[0].message.content,
      });
    }
    return NextResponse.json(
      { error: "prompt or messages is required" },
      { status: 400 },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
