import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

interface UserData {
  userMessage: string;
}

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: UserData = await req.json();

    const stream = await openai.chat.completions.create({
      messages: [{ role: "user", content: data.userMessage }],
      model: "gpt-3.5-turbo",
      stream: true,
    });
    let assistantResponse = "";
    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content === undefined) break;
      assistantResponse += chunk.choices[0]?.delta?.content;
      console.log("CHUNK:", chunk.choices[0]?.delta.content);
    }
    return NextResponse.json({ assistantResponse });
  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json({ error: "Error while sending message(api)" });
  }
}
