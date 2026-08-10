import Link from "next/link";

const PROJECTS = [
  { name: "stockrendite",        stack: "c# · blazor",     year: 2026, blurb: "track holdings, see actual returns.", url: "https://stock-rendite.vercel.app/" },
  { name: "whiteplayer",         stack: "c# · wpf",        year: 2026, blurb: "minimal wpf music player i actually use." },
  { name: "memyselfandi",        stack: "typescript",      year: 2026, blurb: "this site.",                          url: "https://github.com/Ni7i/memyselfandi" },
  { name: "quizlot",             stack: "typescript",      year: 2026, blurb: "quiz platform." },
  { name: "ict-regios-2026",     stack: "javascript",      year: 2026, blurb: "competition project." },
  { name: "trackmyfood",         stack: "javascript",      year: 2026, blurb: "food tracking, frontend." },
  { name: "imposter · whoami",   stack: "javascript",      year: 2026, blurb: "first paid job." },
  { name: "screentime-blocker",  stack: "javascript",      year: 2026, blurb: "less phone. more life." },
  { name: "oase jugendraum",     stack: "python",          year: 2026, blurb: "web app for a youth room." },
  { name: "swissskills25",       stack: "—",               year: 2026, blurb: "swiss skills 2025." },
  { name: "midnight-calculator", stack: "c#",              year: 2025, blurb: "calculator for a local sme." },
  { name: "budgetbuddy",         stack: "python",          year: 2025, blurb: "budgets." },
  { name: "reactprojekt",        stack: "javascript",      year: 2025, blurb: "learning ui in public." },
  { name: "lcr",                 stack: "c#",              year: 2025, blurb: "little random oop game." },
  { name: "zitate",              stack: "python",          year: 2025, blurb: "quotes." },
];

const RECITERS = [
  { name: "muhammad ayyub",    where: "al-nabawi · madinah" },
  { name: "yasser al-dosari",  where: "king khalid · riyadh" },
  { name: "ali jabir",         where: "al-haram · makkah" },
  { name: "maher al-muaiqly",  where: "al-haram · makkah" },
];

const LINKS = [
  { label: "mail",     handle: "shorra.enis@hotmail.com", href: "mailto:shorra.enis@hotmail.com" },
  { label: "github",   handle: "Ni7i",                    href: "https://github.com/Ni7i" },
  { label: "linkedin", handle: "enis-shorra",             href: "https://linkedin.com/in/enis-shorra" },
  { label: "discord",  handle: "nisi_17",                 href: "https://discord.com/users/nisi_17" },
];

function byYear(a: { year: number }, b: { year: number }) { return b.year - a.year; }

export default function Home() {
  const projects = [...PROJECTS].sort(byYear);
  const grouped: Record<number, typeof projects> = {};
  for (const p of projects) (grouped[p.year] ||= []).push(p);
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <main className="page">
      <header className="head">
        <h1>enis shorra</h1>
        <p className="sub">
          17. rudolfstetten, ch. kosovo roots. muslim. writes code — mostly c#.
        </p>
      </header>

      <section className="block">
        <span className="marker">now</span>
        <ul className="notes">
          <li>apprenticing / competing — ict regios 2026.</li>
          <li>reading through al-mulk again.</li>
          <li>gym or bike when i&rsquo;m not at the keyboard.</li>
        </ul>
      </section>

      <section className="block">
        <span className="marker">code</span>
        <p>
          c# is home — .net, blazor, wpf. python for scripts.
          typescript and react/next for the web. sql when the data won&rsquo;t sit still.
        </p>
        <p className="dim">
          fifteen-ish public repos on{" "}
          <a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">github/Ni7i</a>.
        </p>
      </section>

      <section className="block">
        <span className="marker">things i built</span>
        {years.map((y) => (
          <div key={y} className="year">
            <span className="year-num">{y}</span>
            <ul className="proj">
              {grouped[y].map((p) => (
                <li key={p.name}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" className="proj-name">{p.name}</a>
                  ) : (
                    <span className="proj-name">{p.name}</span>
                  )}
                  <span className="proj-stack">{p.stack}</span>
                  <span className="proj-blurb">{p.blurb}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="block">
        <span className="marker">setup</span>
        <p>
          m4 macbook pro 16&Prime; · 24 gb — for work.<br />
          custom pc — ryzen 7 7800x3d, rtx 4070 ti super, 32 gb ddr5 — for everything else.<br />
          mx master 3s. mx mechanical mini.
        </p>
      </section>

      <section className="block">
        <span className="marker">on repeat</span>
        <ul className="notes">
          {RECITERS.map((r) => (
            <li key={r.name}>
              {r.name} <span className="dim">— {r.where}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="block">
        <span className="marker">reach me</span>
        <ul className="links">
          {LINKS.map((l) => (
            <li key={l.label}>
              <span className="link-label">{l.label}</span>
              <a href={l.href} target="_blank" rel="noreferrer">{l.handle}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="block hire">
        <span className="marker">hiring?</span>
        <p>
          17, looking for an ict internship in the zurich/aargau area.
          i can build, i learn fast, i show up.{" "}
          <a href="mailto:shorra.enis@hotmail.com">send a mail</a>.
        </p>
      </section>

      <footer className="foot">
        <span>last touched · 10 aug 2026</span>
        <span className="dim">
          also: <Link href="/blog">blog</Link> · <Link href="/projects">projects</Link>
        </span>
      </footer>
    </main>
  );
}
