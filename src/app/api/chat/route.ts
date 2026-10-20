import { z } from "zod";
import { buildChatSystemPrompt } from "@/lib/chat-prompt";
import { streamCompletion } from "@/lib/openrouter";
import { isRateLimited } from "@/lib/rate-limit";
import { getWeddingSettings } from "@/lib/settings";

const chatRequest = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(1000),
      }),
    )
    .min(1)
    .max(20),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip, 10, 60_000)) {
    return Response.json(
      { error: "You're sending messages too quickly. Please wait a minute." },
      { status: 429 },
    );
  }

  const parsed = chatRequest.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid message." }, { status: 400 });
  }

  const settings = await getWeddingSettings();
  return streamCompletion(
    [{ role: "system", content: buildChatSystemPrompt(settings) }, ...parsed.data.messages],
    400,
  );
}
