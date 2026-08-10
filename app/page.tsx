import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Enis Shorra</h1>
      <p>
        <small className="meta">
          Rudolfstetten, Switzerland &middot;{" "}
          <a href="mailto:shorra.enis@hotmail.com">shorra.enis@hotmail.com</a>
        </small>
      </p>

      <p>
        I&apos;m 17. Born to Kosovar parents, grew up in the Aargau. Muslim.
        I write code &mdash; mostly C# &mdash; and I&apos;m currently
        doing an ICT apprenticeship. That&apos;s the short version.
      </p>

      <p>
        This page is on purpose ugly. I got tired of every portfolio looking
        like the same designer template, so I threw the design away.
      </p>

      <h2>What I do</h2>
      <p>
        C# is where I live: .NET, Blazor, WPF. I reach for Python when I
        need a script, TypeScript with React or Next.js when it has to
        run in a browser, and SQL when the data misbehaves.
      </p>
      <p>
        I&apos;m preparing for the ICT Regios 2026 competition. Before that
        I did SwissSkills 25. Between school and training I ship stuff on
        weekends.
      </p>

      <h2>Things I&apos;ve built</h2>
      <ul>
        <li>
          <span className="year">2026</span>
          <a href="https://stock-rendite.vercel.app/" target="_blank" rel="noreferrer">
            <b>stockrendite</b>
          </a>{" "}
          <span className="tag">C#</span> &mdash; track your holdings, see your
          actual return (not the one the broker wants you to see).
        </li>
        <li>
          <span className="year">2026</span>
          <b>whiteplayer</b> <span className="tag">WPF</span> &mdash; a
          minimal music player. I use it every day.
        </li>
        <li>
          <span className="year">2026</span>
          <a href="https://github.com/Ni7i/memyselfandi" target="_blank" rel="noreferrer">
            <b>memyselfandi</b>
          </a>{" "}
          <span className="tag">TS</span> &mdash; this website.
        </li>
        <li>
          <span className="year">2026</span>
          <b>Quizlot</b>, <b>trackmyfood</b>, <b>screentime-blocker</b>,
          <b> impostergame</b>, <b>ICT-Regios-2026</b>, <b>Oase Jugendraum</b>
          &mdash; stuff for school, for clients, for fun.
        </li>
        <li>
          <span className="year">2025</span>
          <b>midnight-calculator</b> <span className="tag">C#</span> &mdash;
          calculator for a local SME.
        </li>
        <li>
          <span className="year">2025</span>
          <b>BudgetBuddy</b>, <b>Zitate</b>, <b>LCR</b>, <b>ReactProjekt</b>
          &mdash; earlier stuff, kept for the diff.
        </li>
      </ul>
      <p>
        The full list lives on GitHub:{" "}
        <a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">
          github.com/Ni7i
        </a>.
      </p>

      <h2>Hardware</h2>
      <table>
        <tbody>
          <tr>
            <td className="k">Laptop</td>
            <td>MacBook Pro 16&quot;, M4 Pro, 24 GB</td>
          </tr>
          <tr>
            <td className="k">Desktop</td>
            <td>Ryzen 7 7800X3D &middot; RTX 4070 Ti Super &middot; 32 GB DDR5</td>
          </tr>
          <tr>
            <td className="k">Keyboard</td>
            <td>Logitech MX Mechanical Mini</td>
          </tr>
          <tr>
            <td className="k">Mouse</td>
            <td>Logitech MX Master 3S</td>
          </tr>
        </tbody>
      </table>

      <h2>Outside of the screen</h2>
      <p>
        Gym, bike, family, food. I listen to Qur&apos;an a lot &mdash;
        Muhammad Ayyub, Yasser Al-Dosari, Ali Jabir, Maher Al-Muaiqly are on
        heavy rotation. Right now I&apos;m going through Surah al-Mulk again.
      </p>

      <h2>Contact</h2>
      <table>
        <tbody>
          <tr>
            <td className="k">e-mail</td>
            <td><a href="mailto:shorra.enis@hotmail.com">shorra.enis@hotmail.com</a></td>
          </tr>
          <tr>
            <td className="k">github</td>
            <td><a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">Ni7i</a></td>
          </tr>
          <tr>
            <td className="k">linkedin</td>
            <td><a href="https://linkedin.com/in/enis-shorra" target="_blank" rel="noreferrer">enis-shorra</a></td>
          </tr>
          <tr>
            <td className="k">discord</td>
            <td><a href="https://discord.com/users/nisi_17" target="_blank" rel="noreferrer">nisi_17</a></td>
          </tr>
        </tbody>
      </table>

      <div className="warn">
        <strong>hiring?</strong> I&apos;m 17, open to an ICT internship
        somewhere between Zurich and Aargau. I can build. I learn fast.
        Write me: <a href="mailto:shorra.enis@hotmail.com">shorra.enis@hotmail.com</a>.
      </div>

      <div className="foot">
        Last updated 10 Aug 2026. Also here: <Link href="/blog">blog</Link>,
        {" "}<Link href="/projects">projects</Link>.
      </div>
    </>
  );
}
