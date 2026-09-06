import { useServerFn } from "@tanstack/react-start";
import { ArrowUp, MessageSquare, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { sendChatMessage, type ChatTurn } from "@/lib/chat.functions";

type Msg = { id: number; from: "bot" | "user"; text: string };

export type Lead = { name: string; email: string; business: string; topic: string };

const GREETING = "Hi! I'm the LxAI Assistant. What can I do for you?";
const QUICK_REPLIES = ["Our Services", "Pricing", "Book a Call", "Something Else"];

// Structured lead handoff — trivial to point at an email/CRM webhook later.
function captureLead(lead: Lead) {
  console.log("[LxAI] New lead captured:", lead);
}

function extractLead(text: string): { clean: string; lead: Lead | null } {
  const match = text.match(/\[LEAD\]\s*(\{[\s\S]*\})\s*$/);
  if (!match?.[1]) return { clean: text, lead: null };
  const clean = text.slice(0, match.index).trim();
  try {
    const parsed = JSON.parse(match[1]) as Partial<Lead>;
    return {
      clean,
      lead: {
        name: parsed.name ?? "",
        email: parsed.email ?? "",
        business: parsed.business ?? "",
        topic: parsed.topic ?? "",
      },
    };
  } catch {
    return { clean, lead: null };
  }
}

export function ChatWidget() {
  const send = useServerFn(sendChatMessage);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, from: "bot", text: GREETING }]);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, open]);

  function push(from: Msg["from"], text: string) {
    setMessages((prev) => [...prev, { id: idRef.current++, from, text }]);
  }

  async function ask(text: string) {
    if (busy) return;
    push("user", text);
    const nextHistory: ChatTurn[] = [...history, { role: "user", content: text }];
    setHistory(nextHistory);
    setBusy(true);
    try {
      const result = await send({ data: { messages: nextHistory } });
      if (!result.ok) {
        push("bot", result.error);
        return;
      }
      const { clean, lead } = extractLead(result.text);
      push("bot", clean || "Thanks! We'll reach out within 24 hours.");
      setHistory([...nextHistory, { role: "assistant", content: result.text }]);
      if (lead && lead.name && lead.email) {
        captureLead(lead);
        setLeads((prev) => [...prev, lead]);
      }
    } catch (error) {
      console.error("[LxAI] chat request failed", error);
      push("bot", "I couldn't reach the assistant just now. Please try again, or email lxai.agency@gmail.com.");
    } finally {
      setBusy(false);
    }
  }

  function handleSend(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value || busy) return;
    setInput("");
    void ask(value);
  }

  const showQuickReplies = messages.length === 1 && !busy;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[60] flex size-14 items-center justify-center rounded-full border border-border bg-foreground text-background shadow-lg transition-transform duration-300 hover:scale-105"
      >
        {open ? <X className="size-6" /> : <MessageSquare className="size-6" />}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="LxAI Assistant chat"
          className="fixed bottom-24 right-3 z-[60] flex max-h-[min(34rem,calc(100dvh-8rem))] w-[calc(100vw-1.5rem)] flex-col border border-border bg-card shadow-2xl sm:right-5 sm:w-[24rem]"
        >
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <p className="font-display text-lg font-bold leading-none text-foreground">LxAI Assistant</p>
              <p className="mt-1 text-xs text-muted-foreground">Usually replies instantly</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((m) => (
              <div key={m.id} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                <p
                  className={
                    m.from === "user"
                      ? "max-w-[85%] whitespace-pre-line rounded-md bg-foreground px-3.5 py-2.5 text-sm leading-6 text-background"
                      : "max-w-[90%] whitespace-pre-line text-sm leading-6 text-muted-foreground"
                  }
                >
                  {m.text}
                </p>
              </div>
            ))}

            {busy ? (
              <div className="flex justify-start" role="status" aria-label="LxAI Assistant is typing">
                <span className="flex items-center gap-1.5 py-1">
                  <span className="typing-dot" />
                  <span className="typing-dot [animation-delay:150ms]" />
                  <span className="typing-dot [animation-delay:300ms]" />
                </span>
              </div>
            ) : null}
          </div>

          {showQuickReplies ? (
            <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
              {QUICK_REPLIES.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => void ask(label)}
                  className="border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border px-4 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              aria-label="Message"
              autoFocus
              disabled={busy}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={busy}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              <ArrowUp className="size-4" />
            </button>
          </form>
          <span className="sr-only">{leads.length} leads captured this session</span>
        </div>
      ) : null}
    </>
  );
}
