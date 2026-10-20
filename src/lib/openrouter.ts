export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/** Primary model first; OpenRouter falls back to the next one if it fails. */
const CHAT_MODELS = ["anthropic/claude-haiku-5.5", "nvidia/nemotron-3-super-120b-a12b:free"];

/** Stream an OpenRouter chat completion back to the browser as server-sent events. */
export async function streamCompletion(messages: ChatMessage[], maxTokens: number) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "The chat is not available right now." }, { status: 503 });
  }

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Title": "Wedding Q&A",
    },
    body: JSON.stringify({
      models: CHAT_MODELS,
      temperature: 0.3,
      max_tokens: maxTokens,
      stream: true,
      reasoning: { effort: "low", exclude: true },
      messages,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    console.error("OpenRouter error", upstream.status);
    return Response.json(
      { error: "The chat could not be reached. Please try again in a moment." },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
