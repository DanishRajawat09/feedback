import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json();

    const prompt = `
You are generating content for an anonymous social messaging platform (like Qooh.me).

Task:
Create a list of THREE open-ended and engaging questions.
- Format the output as a SINGLE STRING
- Separate each question using "||"
- Avoid personal, sensitive, or controversial topics
- Focus on universal, friendly, and curiosity-driven themes
- Keep the tone positive and welcoming

Optional context from the user:
"${userMessage ?? "No additional context provided"}"

Example output format:
"What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?"
`;

    const result = streamText({
      model: openai("gpt-5.1"),
      temperature: 0.6,
      prompt, // ✅ USE PROMPT DIRECTLY
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        { name, status, headers, message },
        { status }
      );
    }

    console.error("Unexpected error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
