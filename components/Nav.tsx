'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

export type Page = 'home' | 'services' | 'gallery' | 'about' | 'contact'

interface NavProps {
  activePage: Page
  onNavigate: (page: Page) => void
}

export default function Nav({ activePage, onNavigate }: NavProps) {
  const [pinned, setPinned] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = useCallback(
    (page: Page) => {
      onNavigate(page)
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [onNavigate],
  )

  const link = (page: Page, label: string, cta = false) => (
    <a
      role="link"
      aria-label={label}
      className={`${cta ? 'n-cta' : ''} ${activePage === page ? 'active' : ''}`}
      onClick={() => go(page)}
    >
      {label}
    </a>
  )

  return (
    <>
      <header id="nav" className={pinned ? 'pinned' : ''} role="banner">
        <div className="n-logo" onClick={() => go('home')} aria-label="HP Garage – Startseite">
          <Image src="/logo.png" alt="HP Garage Logo" width={160} height={44} priority />
        </div>
        <nav className="n-links" aria-label="Hauptnavigation">
          {link('home', 'Start')}
          {link('services', 'Leistungen')}
          {link('gallery', 'Galerie')}
          {link('about', 'Über uns')}
          {link('contact', 'Kontakt & Termin', true)}
        </nav>
        <button
          className="burger"
          aria-label="Menü öffnen"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <nav
        className={`mob-menu ${menuOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation"
        aria-hidden={!menuOpen}
      >
        {link('home', 'Start')}
        {link('services', 'Leistungen')}
        {link('gallery', 'Galerie')}
        {link('about', 'Über uns')}
        {link('contact', 'Kontakt & Termin')}
      </nav>
    </>
  )
}
