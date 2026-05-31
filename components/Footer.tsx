'use client'

import Image from 'next/image'

interface FooterProps {
  onNavigate: (page: string) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="ft-grid">
        <div className="ft-logo">
          <Image
            src="/logo.png"
            alt="HP Garage"
            width={160}
            height={40}
            onClick={() => onNavigate('home')}
            style={{ cursor: 'pointer' }}
          />
          <p>
            Ihre Autogarage in Rudolfstetten — persönlich, fair und professionell.
            Technik, Performance &amp; Pflege aus einer Hand.
          </p>
          <div className="ft-social">
            <a
              href="https://www.instagram.com/hpgarage.rudolfstetten"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@hpgarage.ch"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.25 8.25 0 004.83 1.55V6.79a4.85 4.85 0 01-1.06-.1z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/hpgarage.rudolfstetten"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="ft-col">
          <h4>Navigation</h4>
          <a onClick={() => onNavigate('home')}>Start</a>
          <a onClick={() => onNavigate('services')}>Leistungen</a>
          <a onClick={() => onNavigate('gallery')}>Galerie</a>
          <a onClick={() => onNavigate('about')}>Über uns</a>
          <a onClick={() => onNavigate('contact')}>Kontakt</a>
        </div>

        <div className="ft-col">
          <h4>Kontakt</h4>
          <p>Rudolfstetten-Friedlisberg</p>
          <p>Aargau, Schweiz</p>
          <a href="https://www.instagram.com/hpgarage.rudolfstetten" target="_blank" rel="noopener noreferrer">
            @hpgarage.rudolfstetten
          </a>
        </div>
      </div>

      <div className="ft-bottom">
        <p>© {year} HP Garage Rudolfstetten. Alle Rechte vorbehalten.</p>
        <p>Rudolfstetten-Friedlisberg, Aargau</p>
      </div>
    </footer>
  )
}
