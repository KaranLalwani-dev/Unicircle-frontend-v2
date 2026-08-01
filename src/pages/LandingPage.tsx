import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Users,
  Search,
  UserPlus,
  LayoutDashboard,
  ArrowRight,
  ChevronDown,
  Shield,
  Tag,
  CheckCircle2,
} from "lucide-react";

/* ─── Scroll-reveal ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.6s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Animated counter ─── */
function Counter({ value, label }: { value: string; label: string }) {
  const { ref, visible } = useReveal(0.25);
  const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let cur = 0;
    const step = Math.max(1, Math.floor(num / 50));
    const iv = setInterval(() => {
      cur += step;
      if (cur >= num) { setCount(num); clearInterval(iv); }
      else setCount(cur);
    }, 20);
    return () => clearInterval(iv);
  }, [visible, num]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        {visible ? `${count}${suffix}` : value}
      </p>
      <p className="mt-1 text-sm text-neutral-500">{label}</p>
    </div>
  );
}

/* ─── FAQ item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-6 text-[15px] font-medium text-neutral-900 sm:text-base">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-neutral-500">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Data ─── */
const FEATURES = [
  {
    icon: Search,
    title: "Discover",
    body: "Browse open groups filtered by tags like hackathon, trek, cab share, or study group. Filter by year and branch to find people from your circle.",
  },
  {
    icon: UserPlus,
    title: "Join",
    body: "Send a join request with one tap. Group creators review and approve — keeping every group intentional and spam-free.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage",
    body: "Track groups you've created, joined, or requested. Accept or decline incoming requests from a single dashboard.",
  },
];

const EXAMPLES = [
  {
    title: "Namma Bengaluru Run Club",
    tags: ["Sports", "Hangout"],
    members: "2 / 8",
    status: "Open",
    description: "A running plan for people who want to join a short run, pace together, and build a habit without going solo. Weekday runs and weekend efforts welcome.",
    date: "Apr 21, 2026 · 8:00 AM",
    creator: "Dhyan · 2nd Year CYS",
  },
  {
    title: "PESU Hackathon Team (24h)",
    tags: ["Hackathon"],
    members: "1 / 4",
    status: "Open",
    description: "Participating in an upcoming 24-hour hackathon at PES University. Looking for 3 committed people — preferably full-stack or ML background.",
    date: "Apr 24, 2026 · 9:00 AM",
    creator: "Aarav Rao · 2nd Year DS",
  },
  {
    title: "Nandi Hills Sunrise Trek",
    tags: ["Travel/Trip", "Hangout"],
    members: "5 / 8",
    status: "Open",
    description: "Early morning trek to catch the sunrise from Nandi Hills. We'll carpool from campus at 4 AM. Great for first-timers and photography enthusiasts.",
    date: "Apr 20, 2026 · 4:00 AM",
    creator: "Sanya Sharma · 1st Year IT",
  },
  {
    title: "Bengaluru Photowalks",
    tags: ["Travel/Trip"],
    members: "4 / 4",
    status: "Full",
    description: "A group for photography lovers who want to capture the city's streets, architecture, sunsets, and everyday life. From Vidhana Soudha to local lanes.",
    date: "Apr 18, 2026 · 5:00 PM",
    creator: "Karan Kapoor · 2nd Year CSE",
  },
  {
    title: "Airport Cab Share — BLR",
    tags: ["Cab Share"],
    members: "3 / 4",
    status: "Open",
    description: "Sharing a cab to Kempegowda International Airport on Friday evening. Splitting fare 4 ways. Departure from campus gate around 6 PM.",
    date: "Apr 25, 2026 · 6:00 PM",
    creator: "Rohan Mehta · 3rd Year ECE",
  },
  {
    title: "DBMS Study Group",
    tags: ["Study Group"],
    members: "6 / 6",
    status: "Full",
    description: "Group study sessions for the upcoming DBMS mid-semester. Covering ER diagrams, normalization, SQL queries, and transaction management.",
    date: "Apr 22, 2026 · 7:00 PM",
    creator: "Priya Nair · 2nd Year CSE",
  },
];

const STEPS = [
  { num: "1", icon: Shield, title: "Create your account", body: "Sign up with your @learner.manipal.edu email. Only verified MIT Bengaluru students can join." },
  { num: "2", icon: Tag, title: "Explore what's happening", body: "Search and filter groups by category, year, or branch. New groups are posted every day." },
  { num: "3", icon: CheckCircle2, title: "Join or start your own", body: "Request to join a group, or create one in under 30 seconds. It's that simple." },
];

const FAQS = [
  { q: "Who can use Unicircle?", a: "Unicircle is available to students of MIT Bengaluru (MAHE). A valid @learner.manipal.edu email is required to register." },
  { q: "What kind of groups can I create?", a: "Any kind — hackathon teams, cab shares to the airport, trek plans, study circles, gaming squads, food runs, or project collaborations. If you need people for something, create a group." },
  { q: "How does joining work?", a: "Click 'Request to Join' on any open group. The creator receives your request and can accept or decline. This keeps groups curated and relevant." },
  { q: "Is there a cost?", a: "No. Unicircle is completely free with no ads and no premium tier." },
  { q: "Can I create multiple groups?", a: "Yes. There's no limit on how many groups you can create or join." },
  { q: "What happens when a group is full?", a: "The group is marked as 'Full' and new requests are paused. Creators can increase the limit if they want to accept more members." },
];

/* ─── Page ─── */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page min-h-screen bg-white text-neutral-900" style={{ backgroundImage: "none" }}>
      {/* ─── Nav ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Unicircle</span>
          </a>
          <nav className="hidden items-center gap-6 text-[13px] font-medium text-neutral-500 sm:flex">
            <a href="#features" className="transition-colors hover:text-neutral-900">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-neutral-900">How it works</a>
            <a href="#faq" className="transition-colors hover:text-neutral-900">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative px-6 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="mb-4 text-sm font-medium text-neutral-400">For MIT Bengaluru students</p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight sm:text-6xl md:text-7xl">
              Stop searching.
              <br />
              Start connecting.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-neutral-500 sm:text-lg">
              Unicircle helps you discover and join student groups for hackathons, treks,
              cab shares, study sessions, and more — all in one place.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => navigate("/login")}
                className="group inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Create free account
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900"
              >
                Learn more
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="border-y border-neutral-200 bg-neutral-50/50 px-6 py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          <Counter value="500+" label="Students" />
          <Counter value="200+" label="Groups created" />
          <Counter value="50+" label="Weekly events" />
          <Counter value="9" label="Branches" />
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-14 text-center">
              <p className="mb-2 text-sm font-medium text-neutral-400">Platform</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Discover. Join. Manage.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500">
                Three simple workflows that make group coordination effortless.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="rounded-xl border border-neutral-200 bg-white p-7 transition-all duration-200 hover:border-neutral-300 hover:shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <f.icon className="h-5 w-5 text-neutral-700" />
                  </div>
                  <h3 className="mb-1.5 text-base font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-500">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Example groups ─── */}
      <section className="border-y border-neutral-200 bg-neutral-50/50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-14 text-center">
              <p className="mb-2 text-sm font-medium text-neutral-400">Examples</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                See what students are creating
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500">
                Here's a preview of the kinds of groups you'll find on Unicircle.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAMPLES.map((g, i) => (
              <Reveal key={g.title} delay={i * 60}>
                <div className="group/card relative rounded-xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-neutral-300 hover:shadow-md hover:-translate-y-1">
                  {/* Header row */}
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-neutral-900 leading-snug pr-3">{g.title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      g.status === "Open"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-neutral-100 text-neutral-400"
                    }`}>
                      {g.status}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {g.tags.map((t) => (
                      <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">{t}</span>
                    ))}
                  </div>

                  {/* Description — always visible */}
                  <p className="mt-3 text-[13px] leading-relaxed text-neutral-500 line-clamp-2 group-hover/card:line-clamp-none transition-all duration-300">
                    {g.description}
                  </p>

                  {/* Details — revealed on hover */}
                  <div className="grid transition-all duration-300 grid-rows-[0fr] group-hover/card:grid-rows-[1fr] opacity-0 group-hover/card:opacity-100">
                    <div className="overflow-hidden">
                      <div className="mt-3 space-y-1 border-t border-neutral-100 pt-3">
                        <p className="text-xs text-neutral-400">📅 {g.date}</p>
                        <p className="text-xs text-neutral-400">👤 {g.creator}</p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <span className="rounded-md border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-500">
                          View Details
                        </span>
                        {g.status === "Open" && (
                          <span className="rounded-md bg-neutral-900 px-2.5 py-1 text-[11px] font-medium text-white">
                            Request to Join
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Members — always visible */}
                  <p className="mt-3 text-xs text-neutral-400">👥 {g.members}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how-it-works" className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="mb-14 text-center">
              <p className="mb-2 text-sm font-medium text-neutral-400">Getting started</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Up and running in minutes
              </h2>
            </div>
          </Reveal>
          <div className="space-y-0">
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 80}>
                <div className={`flex gap-5 py-8 ${i < STEPS.length - 1 ? "border-b border-neutral-200" : ""}`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-sm font-semibold text-white">
                    {s.num}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-500">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="border-y border-neutral-200 bg-neutral-50/50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="mb-2 text-sm font-medium text-neutral-400">Support</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Frequently asked questions
              </h2>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-xl border border-neutral-200 bg-white px-6">
              {FAQS.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 py-24 sm:py-32">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to find your crew?
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm text-neutral-500">
              Join hundreds of MIT Bengaluru students already using Unicircle.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Get started — it's free
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </Reveal>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-neutral-200 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900">
              <Users className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold">Unicircle</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-neutral-400">
            <a href="#faq" className="transition-colors hover:text-neutral-600">FAQ</a>
            <a href="#features" className="transition-colors hover:text-neutral-600">Features</a>
          </div>
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Unicircle · MIT Bengaluru
          </p>
        </div>
      </footer>
    </div>
  );
}
