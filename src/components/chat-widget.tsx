import { ArrowUp, MessageSquare, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

type Msg = { id: number; from: "bot" | "user"; text: string };
type Stage =
  | "menu"
  | "servicesFollowUp"
  | "freeText"
  | "askName"
  | "askEmail"
  | "askBusiness"
  | "confirm"
  | "done";

export type Lead = { name: string; email: string; business: string; topic: string };

const SERVICES =
  "Here's what we do:\n• AI Chatbots\n• AI Voice Agents\n• Workflow Automation\n• Custom Websites\n• Landing Pages\n• Booking Systems\n• Restaurant Ordering\n• CRM Integrations\n• Social Media Management\n• AI Consulting";

const GREETING = "Hi! I'm the LxAI Assistant. What can I do for you?";

// Swap this for an email/CRM webhook call later.
async function submitLead(lead: Lead) {
  console.log("[LxAI] New lead captured:", lead);
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("menu");
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, from: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const [lead, setLead] = useState<Lead>({ name: "", email: "", business: "", topic: "" });
  const [leads, setLeads] = useState<Lead[]>([]);
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, stage, open]);

  function push(from: Msg["from"], text: string) {
    setMessages((prev) => [...prev, { id: idRef.current++, from, text }]);
  }

  function reset() {
    idRef.current = 1;
    setMessages([{ id: 0, from: "bot", text: GREETING }]);
    setStage("menu");
    setInput("");
    setLead({ name: "", email: "", business: "", topic: "" });
  }

  function startCapture(topic: string) {
    setLead((l) => ({ ...l, topic }));
    push("bot", "Great — let's get you connected with the team. What's your name?");
    setStage("askName");
  }

  function handleQuick(label: string) {
    push("user", label);
    if (label === "Our Services") {
      push("bot", SERVICES);
      push("bot", "Want a quote for any of these?");
      setStage("servicesFollowUp");
      return;
    }
    if (label === "Pricing") {
      push("bot", "Pricing depends on scope — every project is quoted after a short discovery chat. I can pass your details to the team for a tailored quote.");
      startCapture("Pricing");
      return;
    }
    if (label === "Book a Call") {
      startCapture("Book a Call");
      return;
    }
    if (label === "Something Else") {
      push("bot", "Of course — type your question below and I'll make sure it reaches the right person.");
      setStage("freeText");
      return;
    }
    if (label === "Yes") {
      startCapture("Services quote");
      return;
    }
    if (label === "No") {
      push("bot", "No problem. Anything else I can help with?");
      setStage("menu");
      return;
    }
    if (label === "Submit") {
      void submitLead(lead);
      setLeads((prev) => [...prev, lead]);
      push("bot", "Thanks! We'll reach out within 24 hours.");
      setStage("done");
      return;
    }
    if (label === "Start over") {
      reset();
    }
  }

  function handleSend(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    push("user", value);
    setInput("");
    if (stage === "freeText") {
      setLead((l) => ({ ...l, topic: value }));
      push("bot", "Thanks for sharing that. A member of the team can answer it properly — leave your details and we'll get back to you.");
      push("bot", "What's your name?");
      setStage("askName");
      return;
    }
    if (stage === "askName") {
      setLead((l) => ({ ...l, name: value }));
      push("bot", `Nice to meet you, ${value}. What's the best email to reach you on?`);
      setStage("askEmail");
      return;
    }
    if (stage === "askEmail") {
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        push("bot", "That email doesn't look quite right — could you try again?");
        return;
      }
      setLead((l) => ({ ...l, email: value }));
      push("bot", "And what type of business do you run?");
      setStage("askBusiness");
      return;
    }
    if (stage === "askBusiness") {
      setLead((l) => ({ ...l, business: value }));
      push("bot", "Here's what I've got — ready to send it over?");
      setStage("confirm");
    }
  }

  const quickReplies =
    stage === "menu"
      ? ["Our Services", "Pricing", "Book a Call", "Something Else"]
      : stage === "servicesFollowUp"
        ? ["Yes", "No"]
        : stage === "confirm"
          ? ["Submit"]
          : stage === "done"
            ? ["Start over"]
            : [];

  const showInput = stage === "freeText" || stage === "askName" || stage === "askEmail" || stage === "askBusiness";

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

            {stage === "confirm" ? (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border border-border p-4 text-sm">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
                <dd className="text-foreground">{lead.name}</dd>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt>
                <dd className="break-all text-foreground">{lead.email}</dd>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Business</dt>
                <dd className="text-foreground">{lead.business}</dd>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Topic</dt>
                <dd className="text-foreground">{lead.topic || "General enquiry"}</dd>
              </dl>
            ) : null}
          </div>

          {quickReplies.length > 0 ? (
            <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
              {quickReplies.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleQuick(label)}
                  className="border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          {showInput ? (
            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border px-4 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your reply…"
                aria-label="Message"
                autoFocus
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-85"
              >
                <ArrowUp className="size-4" />
              </button>
            </form>
          ) : null}
          <span className="sr-only">{leads.length} leads captured this session</span>
        </div>
      ) : null}
    </>
  );
}
