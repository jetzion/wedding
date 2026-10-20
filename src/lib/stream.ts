/** POST to the chat API and call onText with the growing reply. */
export async function streamChat(body: unknown, onText: (text: string) => void) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Something went wrong. Please try again.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const data = line.trim().replace(/^data:\s*/, "");
      if (!line.startsWith("data:") || data === "[DONE]") continue;
      text += JSON.parse(data).choices?.[0]?.delta?.content ?? "";
      onText(text);
    }
  }

  if (!text.trim()) throw new Error("No reply received. Please try again.");
}
