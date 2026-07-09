import { NextResponse } from "next/server";
import { generateChatReply, type ChatMessage } from "@/lib/chat-assistant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, lang, website } = body;

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const validLang = lang === "FR" ? "FR" : "EN";
    const sanitized: ChatMessage[] = messages
      .filter((m: { role?: string; content?: string }) => m.role === "user" || m.role === "assistant")
      .slice(-12)
      .map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: String(m.content).slice(0, 2000),
      }));

    if (!sanitized.some((m) => m.role === "user")) {
      return NextResponse.json({ error: "User message required" }, { status: 400 });
    }

    const result = await generateChatReply(sanitized, validLang);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Chat failed" },
      { status: 500 },
    );
  }
}