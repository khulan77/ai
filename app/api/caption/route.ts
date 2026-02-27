import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, image_url, messages } = body;

    if (prompt) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a food expert. Extract only the dish name and ingredients from the text. Return them as a simple comma-separated list in English.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return NextResponse.json({
        result: completion.choices[0].message.content,
      });
    }

   
    if (image_url) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Describe this food image in one concise English sentence." },
              {
                type: "image_url",
                image_url: { url: image_url },
              },
            ],
          },
        ],
      });

      return NextResponse.json({
        output: completion.choices[0].message.content,
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
      { error: "Invalid request. Provide prompt or image_url." },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}