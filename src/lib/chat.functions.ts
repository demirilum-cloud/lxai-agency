import { createServerFn } from "@tanstack/react-start";

export type ChatTurn = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are the LxAI Assistant, the website chat assistant for LxAI — an AI automation and digital agency based in Prizren, Kosovo.

Brand voice: premium, modern, minimal, professional, trustworthy. Helpful, concise, confident, never pushy. Keep replies short (1-4 sentences), plain text, no markdown headings or emoji.

Markets served: Kosovo, North Macedonia, Albania, Germany, Switzerland, and the UK.

Typical clients (SMBs): restaurants, dental and medical clinics, gyms, salons, hotels, real estate agencies, e-commerce stores, and local service businesses.

Services (10): AI Chatbots; AI Voice Agents; AI Automation / Workflow Automation; Custom Websites; Landing Pages; Appointment Booking Systems; Ordering Systems for Restaurants (digital menu + order notifications, no online payment); CRM Integrations; Social Media Management; AI Consulting.

Pricing: there is no fixed public pricing — every project is scoped and quoted individually. Explain this plainly and offer to connect the visitor with the team for a tailored quote.

Contact: lxai.agency@gmail.com, +383 43 555 026, Prizren, Kosovo.

Lead capture: when the visitor shows genuine interest, naturally and conversationally ask for their name, email, and business type — one thing at a time, never as a form. Once you have all three, summarize them back and ask the visitor to confirm.
After the visitor confirms, reply with a short thank-you saying the team will reach out within 24 hours, and append on its very last line exactly:
[LEAD]{"name":"...","email":"...","business":"...","topic":"..."}
Where topic is a few words describing what they want. Never mention, explain, or output that line at any other time.`;

export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: ChatTurn[] }) => {
    if (!Array.isArray(input?.messages)) throw new Error("messages is required");
    return {
      messages: input.messages
        .filter((m) => typeof m?.content === "string" && m.content.trim().length > 0)
        .slice(-20)
        .map((m) => ({ role: m.role === "assistant" ? ("assistant" as const) : ("user" as const), content: m.content.slice(0, 4000) })),
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (!apiKey) {
      return { ok: false as const, error: "The assistant isn't configured yet. Please email lxai.agency@gmail.com and we'll reply personally." };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: data.messages,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[LxAI] Anthropic error", response.status, detail);
      const message =
        response.status === 401
          ? "The assistant's API key looks invalid. Please email lxai.agency@gmail.com in the meantime."
          : response.status === 429
            ? "We're getting a lot of messages right now — try again in a moment."
            : "Something went wrong reaching the assistant. Please try again, or email lxai.agency@gmail.com.";
      return { ok: false as const, error: message };
    }

    const payload = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = (payload.content ?? [])
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("")
      .trim();

    return { ok: true as const, text: text || "Sorry, I didn't catch that — could you rephrase?" };
  });
