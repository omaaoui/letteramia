import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY environment variable is not set");
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
const ipMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipMap.get(ip) ?? { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count++;
  ipMap.set(ip, entry);
  return entry.count > RATE_LIMIT;
}

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  try {
    const { situation, docType, inputLang } = await req.json();

    if (!situation?.trim() || !docType || !inputLang) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

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
  } catch (err) {
    console.error("Generate error:", err);
    const status = err.status ?? 500;
    const message = err.message ?? "An unexpected error occurred.";
    return Response.json({ error: message }, { status });
  }
}
