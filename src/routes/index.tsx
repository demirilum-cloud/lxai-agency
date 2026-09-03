import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Globe2,
  Menu,
  MessageSquareText,
  PhoneCall,
  Workflow,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const services = [
  ["01", "AI Chatbots", "Smart, always-on support that answers, qualifies, and converts."],
  ["02", "AI Voice Agents", "Natural voice systems for calls, follow-ups, and customer care."],
  ["03", "Workflow Automation", "Connect repetitive tasks into fast, reliable automated workflows."],
  ["04", "Custom Websites", "High-performance digital experiences built around your business."],
  ["05", "Landing Pages", "Focused, conversion-ready pages for campaigns and new offers."],
  ["06", "Booking Systems", "Frictionless appointment scheduling that works around the clock."],
  ["07", "Restaurant Ordering", "Digital menus and instant order notifications—without online payment."],
  ["08", "CRM Integrations", "Keep leads, conversations, and customer data working together."],
  ["09", "Social Media", "Consistent strategy, content, and management for your brand."],
  ["10", "AI Consulting", "Practical guidance to find and prioritize high-value AI opportunities."],
];

const industries = [
  "Restaurants",
  "Dental & medical clinics",
  "Gyms",
  "Salons",
  "Hotels",
  "Real estate agencies",
  "E-commerce stores",
  "Local service businesses",
];

const steps = [
  ["01", "Discover", "We map your goals, bottlenecks, customers, and the opportunities that matter."],
  ["02", "Design", "We shape a clear solution, workflow, and experience around how you operate."],
  ["03", "Build & automate", "We create, integrate, test, and refine every part of the system."],
  ["04", "Launch & support", "We deploy with care, monitor performance, and stay available as you grow."],
];

const values = [
  ["Craft over clutter", "Every interaction is intentional, every detail refined, and every solution built to last."],
  ["Speed with standards", "Lean execution and clear communication keep momentum high without compromising quality."],
  ["Local understanding. International ambition.", "Based in Prizren, working across Kosovo, Europe, and the UK."],
  ["A partner after launch", "We stay close with practical support, iteration, and continuous improvement."],
];

const faqs = [
  ["What can AI automation do for my business?", "It can reduce repetitive work, respond to customers faster, qualify leads, coordinate bookings, connect your tools, and help your team focus on higher-value work. We begin with the use cases that offer the clearest practical return."],
  ["How long does a typical project take?", "Focused landing pages and simple automations can take one to three weeks. Larger websites, voice agents, and multi-step systems typically take longer. After discovery, you receive a clear scope and timeline before work starts."],
  ["Do I need to understand AI or technical tools?", "No. We translate the technology into a straightforward business solution, handle implementation, and explain what your team needs to know in plain language."],
  ["Can you work with our existing tools?", "In most cases, yes. We can connect with many CRM, booking, communication, and operational platforms. We review your current setup during discovery and recommend the most reliable approach."],
  ["Do you provide support after launch?", "Yes. We can provide ongoing monitoring, maintenance, optimization, and team support based on what the solution requires."],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LxAI — AI Automation Agency in Kosovo" },
      { name: "description", content: "LxAI is an AI automation and digital agency in Prizren, Kosovo, building AI agents, workflows, websites, and growth systems across Europe." },
      { property: "og:title", content: "LxAI — AI Automation Agency in Kosovo" },
      { property: "og:description", content: "AI automation, digital systems, and premium websites built to help ambitious businesses move faster." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "LxAI",
          description: "AI automation and digital agency based in Prizren, Kosovo.",
          address: { "@type": "PostalAddress", addressLocality: "Prizren", addressCountry: "XK" },
          areaServed: ["Kosovo", "North Macedonia", "Albania", "Germany", "Switzerland", "United Kingdom"],
          serviceType: ["AI Automation", "AI Agents", "Web Design", "Digital Consulting"],
        }),
      },
    ],
  }),
  component: Index,
});

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        node.dataset["visible"] = "true";
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`font-display text-2xl font-black tracking-normal text-logo ${className}`}>LxAI</span>;
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="grid gap-7 border-t border-border pt-7 md:grid-cols-[1fr_2.15fr] md:gap-12">
      <p className="section-label">{eyebrow}</p>
      <div>
        <h2 className="max-w-4xl font-display text-4xl font-bold leading-[0.98] tracking-normal text-foreground sm:text-5xl lg:text-6xl">{title}</h2>
        {copy ? <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{copy}</p> : null}
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["Services", "#services"], ["About", "#about"], ["Process", "#process"], ["Contact", "#contact"]];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" aria-label="LxAI home"><Wordmark /></a>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {links.map(([label, href]) => <a key={href} href={href} className="nav-link">{label}</a>)}
        </nav>
        <div className="hidden lg:block"><Button asChild variant="outline" size="lg"><a href="#contact">Book a Call <ArrowDownRight /></a></Button></div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open ? (
        <nav className="border-t border-border bg-background px-5 py-6 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-[1440px] flex-col">
            {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="border-b border-border py-4 font-display text-2xl font-semibold text-foreground">{label}</a>)}
            <Button asChild size="lg" className="mt-6"><a href="#contact" onClick={() => setOpen(false)}>Book a Call <ArrowRight /></a></Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function Index() {
  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />
      <main>
        <section className="relative flex min-h-[92vh] items-end pt-36">
          <div className="page-shell w-full pb-12 sm:pb-16 lg:pb-20">
            <div className="mb-16 flex items-center gap-3 sm:mb-24">
              <span className="status-dot" aria-hidden="true" />
              <p className="section-label">AI systems for ambitious businesses</p>
            </div>
            <h1 className="max-w-7xl font-display text-[clamp(3.8rem,10vw,9.5rem)] font-black leading-[0.82] tracking-normal text-foreground">
              Automate more.<br /><span className="text-logo">Grow smarter.</span>
            </h1>
            <div className="mt-10 grid gap-8 border-t border-border pt-8 lg:grid-cols-[1fr_1fr] lg:items-end">
              <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">LxAI designs AI agents, intelligent workflows, and digital experiences that make your business faster, sharper, and ready to scale.</p>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Button asChild size="xl"><a href="#contact">Book a Free Consultation <ArrowRight /></a></Button>
                <Button asChild variant="outline" size="xl"><a href="#services">See Our Services <ArrowDownRight /></a></Button>
              </div>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold uppercase text-muted-foreground">
              <span>Prizren · Kosovo</span><span>Serving Europe & the UK</span><span>Strategy · Design · Automation</span>
            </div>
          </div>
        </section>

        <section id="services" className="section-space bg-surface">
          <div className="page-shell"><Reveal><SectionHeading eyebrow="01 / Capabilities" title="One partner for smarter operations and stronger digital growth." copy="From a single automation to a complete digital system, we design around your customers, team, and business goals." /></Reveal>
            <div className="mt-16 grid border-l border-t border-border md:grid-cols-2 xl:grid-cols-3">
              {services.map(([number, title, copy]) => (
                <Reveal key={title} className="h-full">
                  <article className="service-item group h-full border-b border-r border-border p-6 sm:p-8">
                    <div className="flex items-start justify-between"><span className="section-label">{number}</span><ArrowDownRight className="size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" /></div>
                    <h3 className="mt-16 font-display text-2xl font-bold tracking-normal text-foreground">{title}</h3>
                    <p className="mt-3 max-w-sm leading-6 text-muted-foreground">{copy}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section-space"><div className="page-shell"><Reveal><SectionHeading eyebrow="02 / Who we help" title="Built for businesses where every missed call, slow process, and lost lead matters." /></Reveal>
          <Reveal className="mt-16"><div className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, i) => <div key={industry} className="industry-row"><span className="text-xs text-muted-foreground">0{i + 1}</span><span className="font-display text-xl font-semibold text-foreground">{industry}</span></div>)}
          </div></Reveal>
          <Reveal className="mt-20 grid gap-10 bg-foreground px-6 py-10 text-background sm:px-10 sm:py-14 lg:grid-cols-[1.35fr_1fr] lg:p-16">
            <p className="font-display text-4xl font-bold leading-none tracking-normal sm:text-5xl lg:text-6xl">Rooted in Prizren.<br /><span className="text-inverse-muted">Built to travel.</span></p>
            <div className="flex flex-col justify-between gap-10"><p className="max-w-lg text-base leading-7 text-inverse-muted sm:text-lg">We combine local insight with international standards—serving teams across Kosovo, North Macedonia, Albania, Germany, Switzerland, and the UK.</p><div className="flex items-center gap-3 text-sm font-semibold uppercase"><Globe2 className="size-5" /> Six markets. One standard.</div></div>
          </Reveal>
        </div></section>

        <section id="process" className="section-space bg-surface"><div className="page-shell"><Reveal><SectionHeading eyebrow="03 / Process" title="Clear from first conversation to lasting results." copy="No black box. No unnecessary complexity. A focused process that keeps decisions visible and momentum strong." /></Reveal>
          <div className="mt-16 grid gap-px bg-border lg:grid-cols-4">{steps.map(([number, title, copy]) => <Reveal key={title} className="h-full bg-surface"><article className="min-h-72 p-7 sm:p-8"><span className="section-label">{number}</span><h3 className="mt-16 font-display text-3xl font-bold tracking-normal">{title}</h3><p className="mt-4 leading-7 text-muted-foreground">{copy}</p></article></Reveal>)}</div>
        </div></section>

        <section className="section-space"><div className="page-shell"><Reveal><SectionHeading eyebrow="04 / Why LxAI" title="Technology is only valuable when it makes business feel simpler." /></Reveal>
          <div className="mt-16 grid gap-x-12 gap-y-0 lg:grid-cols-2">{values.map(([title, copy], i) => <Reveal key={title}><article className="grid grid-cols-[auto_1fr] gap-5 border-t border-border py-8"><span className="section-label">0{i + 1}</span><div><h3 className="font-display text-2xl font-bold tracking-normal">{title}</h3><p className="mt-3 max-w-xl leading-7 text-muted-foreground">{copy}</p></div></article></Reveal>)}</div>
        </div></section>

        <section className="section-space border-y border-border bg-surface"><div className="page-shell"><Reveal><p className="section-label">Perspective / Sample copy</p><blockquote className="mt-12 max-w-6xl font-display text-4xl font-semibold leading-[1.05] tracking-normal sm:text-5xl lg:text-7xl">“The best automation doesn’t feel like more technology. It feels like <span className="text-logo">less friction.</span>”</blockquote><p className="mt-10 max-w-xl text-sm leading-6 text-muted-foreground">Representative brand statement shown as sample social-proof placement—not a customer testimonial.</p></Reveal></div></section>

        <section className="section-space bg-surface"><div className="page-shell"><Reveal><SectionHeading eyebrow="06 / FAQ" title="Straight answers before we get started." /></Reveal>
          <div className="mt-14 ml-auto max-w-4xl">{faqs.map(([question, answer]) => <details key={question} className="faq group"><summary><span>{question}</span><ChevronDown className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-180" /></summary><p>{answer}</p></details>)}</div>
        </div></section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

function ContactSection() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    if (!String(form.get("name") ?? "").trim()) next["name"] = "Please enter your name.";
    const email = String(form.get("email") ?? "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) next["email"] = "Please enter a valid email.";
    if (!String(form.get("business") ?? "").trim()) next["business"] = "Please select a business type.";
    if (String(form.get("message") ?? "").trim().length < 10) next["message"] = "Tell us a little more about your project.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }
  return (
    <section id="contact" className="section-space bg-foreground text-background"><div className="page-shell"><Reveal><div className="grid gap-8 border-t border-inverse-border pt-8 lg:grid-cols-[1fr_2fr]"><p className="section-label text-inverse-muted">07 / Start a project</p><h2 className="font-display text-5xl font-black leading-[0.9] tracking-normal sm:text-7xl lg:text-8xl">Ready to make<br /><span className="text-inverse-muted">work work better?</span></h2></div></Reveal>
      <div className="mt-16 grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
        <Reveal>{sent ? <div role="status" aria-live="polite" className="flex min-h-[32rem] flex-col items-start justify-center border border-inverse-border p-8 sm:p-12"><div className="flex size-12 items-center justify-center rounded-full border border-inverse-border"><Check /></div><h3 className="mt-8 font-display text-4xl font-bold tracking-normal">Message received.</h3><p className="mt-4 max-w-md leading-7 text-inverse-muted">Thanks for reaching out. Your details are ready for review, and we’ll be in touch soon.</p><Button variant="inverseOutline" className="mt-8" onClick={() => setSent(false)}>Send another message</Button></div> : <form onSubmit={submit} noValidate className="grid gap-7 sm:grid-cols-2">
          <Field label="Your name" name="name" placeholder="Name" error={errors["name"]} />
          <Field label="Work email" name="email" type="email" placeholder="you@company.com" error={errors["email"]} />
          <label className="field-label">Business type<select name="business" defaultValue="" className="field-control" aria-invalid={Boolean(errors["business"])}><option value="" disabled>Select an industry</option>{industries.map(item => <option key={item}>{item}</option>)}<option>Other</option></select>{errors["business"] ? <span role="alert" className="field-error">{errors["business"]}</span> : null}</label>
          <div className="hidden sm:block" />
          <label className="field-label sm:col-span-2">How can we help?<textarea name="message" rows={5} placeholder="Tell us about the challenge, idea, or result you have in mind." className="field-control resize-none" aria-invalid={Boolean(errors["message"])} />{errors["message"] ? <span role="alert" className="field-error">{errors["message"]}</span> : null}</label>
          <div className="sm:col-span-2"><Button type="submit" variant="inverse" size="xl">Send enquiry <ArrowRight /></Button></div>
        </form>}</Reveal>
        <Reveal><aside className="border-t border-inverse-border pt-7"><p className="section-label text-inverse-muted">Prefer a conversation?</p><div className="mt-8 border border-inverse-border p-7"><CalendarDays className="size-6" /><h3 className="mt-10 font-display text-2xl font-bold tracking-normal">Book a discovery call</h3><p className="mt-3 text-sm leading-6 text-inverse-muted">Choose a convenient time to discuss your goals and see where automation can create the most value.</p><Button asChild variant="inverseOutline" className="mt-8 w-full"><a href="mailto:hello@lxai.agency?subject=Discovery call request">Request a time <ArrowRight /></a></Button><p className="mt-4 text-center text-xs text-inverse-muted">Calendar availability provided after request</p></div><div className="mt-10 space-y-4 text-sm"><a href="mailto:hello@lxai.agency" className="flex items-center gap-3 text-inverse-muted transition-colors hover:text-background"><MessageSquareText className="size-4" /> hello@lxai.agency</a><p className="flex items-center gap-3 text-inverse-muted"><PhoneCall className="size-4" /> Prizren, Kosovo</p></div></aside></Reveal>
      </div>
    </div></section>
  );
}

function Field({ label, name, type = "text", placeholder, error }: { label: string; name: string; type?: string; placeholder: string; error: string | undefined }) {
  return <label className="field-label">{label}<input name={name} type={type} placeholder={placeholder} className="field-control" aria-invalid={Boolean(error)} />{error ? <span role="alert" className="field-error">{error}</span> : null}</label>;
}

function Footer() {
  return <footer className="bg-foreground text-background"><div className="page-shell border-t border-inverse-border py-10"><div className="grid gap-12 md:grid-cols-3"><div><Wordmark className="text-background" /><p className="mt-4 max-w-xs text-sm leading-6 text-inverse-muted">AI automation and digital systems for ambitious businesses.</p></div><nav className="flex flex-col gap-3 text-sm" aria-label="Footer navigation"><a href="#services">Services</a><a href="#about">About</a><a href="#process">Process</a><a href="#contact">Contact</a></nav><div className="text-sm text-inverse-muted md:text-right"><p>Prizren, Kosovo</p><a href="mailto:hello@lxai.agency" className="mt-2 block hover:text-background">hello@lxai.agency</a><div className="mt-5 flex gap-5 md:justify-end"><a href="#contact">LinkedIn</a><a href="#contact">Instagram</a></div></div></div><div className="mt-16 flex flex-col gap-3 border-t border-inverse-border pt-6 text-xs text-inverse-muted sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} LxAI. All rights reserved.</p><p>Made in Prizren. Built for everywhere.</p></div></div></footer>;
}