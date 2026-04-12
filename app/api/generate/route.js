import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  const { situation, docType, inputLang } = await req.json();

  const systemPrompt = `You are an expert Italian administrative document writer helping expatriates in Italy.
The user will describe their situation in ${inputLang}.
Respond ONLY in this exact format:
---ITALIAN---
[complete formal Italian letter, ready to send, with placeholders like [NOME], [COGNOME], [INDIRIZZO], [DATA], [FIRMA]]
---SUMMARY---
[2-3 sentence English summary of what the letter says]
Document type: ${docType}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: situation }],
  });

  const text = message.content.map((b) => b.text || "").join("");
  return Response.json({ text });
}
