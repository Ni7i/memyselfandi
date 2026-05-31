'use client'

import { useState, useEffect, useCallback } from 'react'
import Nav, { type Page } from '@/components/Nav'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import ContactForm from '@/components/ContactForm'
import Image from 'next/image'

export default function HPGarage() {
  const [page, setPage] = useState<Page>('home')

  const navigate = useCallback((p: string) => {
    setPage(p as Page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Scroll-reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [page])

  return (
    <>
      <LoadingScreen />
      <Nav activePage={page} onNavigate={setPage} />

      {/* ─── HOME ─────────────────────────────── */}
      <main className={`page ${page === 'home' ? 'active' : ''}`} id="page-home">
        {/* Hero */}
        <section className="hero" aria-label="Willkommen bei HP Garage">
          <div className="hero-bg">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=85"
              alt="HP Garage Werkstatt Rudolfstetten"
              fill
              priority
              style={{ objectFit: 'cover' }}
              onLoad={(e) => (e.target as HTMLImageElement).classList.add('loaded')}
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-content fade-up">
            <div className="hero-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Ihre Garage in Rudolfstetten
            </div>
            <h1>Technik. Performance.<br /><span>Leidenschaft.</span></h1>
            <p className="hero-sub">
              HP Garage – Ihre All-in-One Garage in Rudolfstetten, Aargau. Professioneller Service, faire Preise, persönliche Betreuung.
            </p>
            <div className="hero-btns">
              <button className="btn btn-primary" onClick={() => navigate('contact')}>
                Termin vereinbaren
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('services')}>
                Leistungen entdecken
              </button>
            </div>
          </div>
        </section>

        {/* Services preview */}
        <section className="section section-dark reveal" aria-labelledby="home-services-heading">
          <div className="section-head">
            <span className="section-tag">Was wir bieten</span>
            <h2 id="home-services-heading">Unsere Leistungen</h2>
            <p>Von der Inspektion bis zur Motorrevision — alles aus einer Hand, transparent und zuverlässig.</p>
          </div>
          <div className="cards-grid">
            {[
              {
                img: 'photo-1558618666-fcd25c85cd64',
                title: 'Service & Wartung',
                desc: 'Ölwechsel, Inspektion, Bremsservice – alles nach Herstellervorgabe.',
              },
              {
                img: 'photo-1530046339160-ce3e530c7d2f',
                title: 'Reparaturen',
                desc: 'Motor, Getriebe, Fahrwerk – fachgerechte Reparatur mit Garantie.',
              },
              {
                img: 'photo-1486262715619-67b85e0b08d3',
                title: 'Fahrzeugdiagnose',
                desc: 'Modernste OBD-Diagnose für alle Marken und Modelle.',
              },
            ].map((s) => (
              <article key={s.title} className="card" aria-label={s.title}>
                <div className="card-img">
                  <Image
                    src={`https://images.unsplash.com/${s.img}?auto=format&fit=crop&w=800&q=80`}
                    alt={s.title}
                    width={800}
                    height={200}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div className="card-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button className="btn btn-ghost" onClick={() => navigate('services')}>
              Alle Leistungen ansehen →
            </button>
          </div>
        </section>

        {/* About teaser */}
        <section className="section section-card reveal" aria-labelledby="home-about-heading">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span className="section-tag">Über uns</span>
              <h2 id="home-about-heading" style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 900, color: '#fff', margin: '0 0 16px' }}>
                Über 15 Jahre Erfahrung in Rudolfstetten
              </h2>
              <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: '24px' }}>
                Wir sind eine lokale Garage mit Herzblut. Kurze Wege, direkte Kommunikation, faire Preise — so verstehen wir Service.
              </p>
              <button className="btn btn-ghost" onClick={() => navigate('about')}>Mehr über uns</button>
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', background: '#111' }}>
              <Image
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80"
                alt="HP Garage Team"
                width={800}
                height={600}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </div>
          <style>{`@media(max-width:768px){#home-about-grid{grid-template-columns:1fr!important}}`}</style>
        </section>

        <Footer onNavigate={navigate} />
      </main>

      {/* ─── LEISTUNGEN ───────────────────────── */}
      <main className={`page ${page === 'services' ? 'active' : ''}`} id="page-services">
        <div style={{ paddingTop: '68px' }}>
          <div style={{ position: 'relative', height: '50vh', minHeight: '360px', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80"
              alt="HP Garage Leistungen"
              fill
              style={{ objectFit: 'cover', opacity: 0.3 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.6) 100%)' }} />
            <div style={{ position: 'relative' }}>
              <span className="section-tag">Leistungen</span>
              <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', margin: '8px 0' }}>
                Unsere Leistungen
              </h1>
              <p style={{ color: 'var(--text-dim)', maxWidth: '500px' }}>
                Professioneller Autoservice – transparent, zuverlässig und fair.
              </p>
            </div>
          </div>
        </div>

        <section className="section section-dark">
          <div className="cards-grid">
            {[
              { img: 'photo-1558618666-fcd25c85cd64', title: 'Service & Wartung', desc: 'Ölwechsel, Filterwechsel, Bremsservice, Inspektionen nach Herstellervorgabe – wir halten Ihr Fahrzeug in Topform.' },
              { img: 'photo-1530046339160-ce3e530c7d2f', title: 'Reparaturen', desc: 'Motor, Getriebe, Kupplung, Fahrwerk – professionelle Reparaturen mit Garantie auf Arbeit und Teile.' },
              { img: 'photo-1549317661-bd32c8ce0db2', title: 'MFK Vorbereitung', desc: 'Wir bereiten Ihr Fahrzeug optimal auf die Motorfahrzeugkontrolle vor und begleiten Sie durch den Prozess.' },
              { img: 'photo-1486262715619-67b85e0b08d3', title: 'Fahrzeugdiagnose', desc: 'Modernste Diagnosetechnik für alle Marken – wir finden das Problem, bevor es teuer wird.' },
              { img: 'photo-1503376780353-7e6692767b70', title: 'Klimaservice', desc: 'Klimaanlage prüfen, befüllen und warten – für angenehmes Fahren im Sommer.' },
              { img: 'photo-1544636331-e26879cd4d9b', title: 'Reifen & Räder', desc: 'Reifenmontage, Auswuchten, Reifeneinlagerung – komplett rund ums Rad.' },
            ].map((s) => (
              <article key={s.title} className="card reveal" aria-label={s.title}>
                <div className="card-img">
                  <Image
                    src={`https://images.unsplash.com/${s.img}?auto=format&fit=crop&w=700&q=80`}
                    alt={s.title}
                    width={700}
                    height={200}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div className="card-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Footer onNavigate={navigate} />
      </main>

      {/* ─── GALERIE ──────────────────────────── */}
      <main className={`page ${page === 'gallery' ? 'active' : ''}`} id="page-gallery">
        <div style={{ paddingTop: '68px' }}>
          <div style={{ position: 'relative', height: '40vh', minHeight: '300px', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
            <Image
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1920&q=80"
              alt="HP Garage Galerie"
              fill
              style={{ objectFit: 'cover', opacity: 0.3 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.6) 100%)' }} />
            <div style={{ position: 'relative' }}>
              <span className="section-tag">Galerie</span>
              <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', margin: '8px 0' }}>Einblicke</h1>
            </div>
          </div>
        </div>

        <section className="section section-dark">
          <div className="gallery-grid">
            {[
              { img: 'photo-1558618666-fcd25c85cd64', alt: 'Hebebühne', big: true },
              { img: 'photo-1544636331-e26879cd4d9b', alt: 'Fahrzeug', big: false },
              { img: 'photo-1530046339160-ce3e530c7d2f', alt: 'Mechaniker', big: false },
              { img: 'photo-1486262715619-67b85e0b08d3', alt: 'Diagnose', big: false },
              { img: 'photo-1549317661-bd32c8ce0db2', alt: 'Reparatur', big: true },
              { img: 'photo-1503376780353-7e6692767b70', alt: 'Werkstatt', big: false },
            ].map((g) => (
              <div key={g.img} className={`gallery-cell ${g.big ? 'big' : ''}`}>
                <Image
                  src={`https://images.unsplash.com/${g.img}?auto=format&fit=crop&w=${g.big ? 1200 : 600}&q=80`}
                  alt={g.alt}
                  width={g.big ? 1200 : 600}
                  height={400}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
            ))}
          </div>
        </section>

        <Footer onNavigate={navigate} />
      </main>

      {/* ─── ÜBER UNS ─────────────────────────── */}
      <main className={`page ${page === 'about' ? 'active' : ''}`} id="page-about">
        <div style={{ paddingTop: '68px' }}>
          <div style={{ position: 'relative', height: '50vh', minHeight: '360px', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
              alt="HP Garage Team"
              fill
              style={{ objectFit: 'cover', opacity: 0.25 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.6) 100%)' }} />
            <div style={{ position: 'relative', maxWidth: '600px' }}>
              <span className="section-tag">Über uns</span>
              <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', margin: '8px 0 16px' }}>
                Ihre Garage<br />mit Herzblut
              </h1>
              <p style={{ color: '#aaa', lineHeight: 1.7 }}>
                HP Garage steht für persönlichen Service, technische Kompetenz und Ehrlichkeit — seit über 15 Jahren in Rudolfstetten.
              </p>
            </div>
          </div>
        </div>

        <section className="section section-dark reveal">
          <div className="section-head">
            <span className="section-tag">Unsere Werte</span>
            <h2>Was uns ausmacht</h2>
            <p>Wir glauben daran, dass guter Autoservice auf Vertrauen basiert.</p>
          </div>
          <div className="values-grid">
            {[
              {
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
                title: 'Vertrauen',
                desc: 'Transparente Kommunikation, klare Preise, keine versteckten Kosten.',
              },
              {
                icon: <><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></>,
                title: 'Qualität',
                desc: 'Nur geprüfte Teile, fachgerechte Arbeit, Garantie auf alle Reparaturen.',
              },
              {
                icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
                title: 'Persönlichkeit',
                desc: 'Kein Grossbetrieb — bei uns kennt man Sie mit Namen.',
              },
              {
                icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
                title: 'Pünktlichkeit',
                desc: 'Ihr Fahrzeug ist zum vereinbarten Termin fertig — wir halten, was wir versprechen.',
              },
            ].map((v) => (
              <div key={v.title} className="value-card reveal">
                <div className="value-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {v.icon}
                  </svg>
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Footer onNavigate={navigate} />
      </main>

      {/* ─── KONTAKT ──────────────────────────── */}
      <main className={`page ${page === 'contact' ? 'active' : ''}`} id="page-contact">
        <div style={{ paddingTop: '68px' }}>
          <section className="section section-dark">
            <div className="section-head">
              <span className="section-tag">Kontakt & Termin</span>
              <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', margin: '0 0 16px' }}>
                Kommen Sie vorbei
              </h1>
              <p>Termin vereinbaren oder einfach anrufen — wir freuen uns auf Sie.</p>
            </div>

            <div className="contact-grid">
              <div>
                <div className="contact-info">
                  <h3>So erreichen Sie uns</h3>
                  {[
                    {
                      icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />,
                      label: 'Adresse',
                      val: 'Rudolfstetten-Friedlisberg, Aargau',
                    },
                    {
                      icon: <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
                      label: 'Instagram',
                      val: '@hpgarage.rudolfstetten',
                    },
                    {
                      icon: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.17 .19 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0120 14h3a2 2 0 012 1.92z"/></>,
                      label: 'Öffnungszeiten',
                      val: 'Mo–Fr 07:30–17:30',
                    },
                  ].map((c) => (
                    <div key={c.label} className="ci-row">
                      <div className="ci-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {c.icon}
                        </svg>
                      </div>
                      <div>
                        <div className="ci-label">{c.label}</div>
                        <div className="ci-val">{c.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="map-wrap" style={{ marginTop: '28px' }}>
                  <iframe
                    src="https://maps.google.com/maps?q=Rudolfstetten-Friedlisberg,+Aargau,+Schweiz&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    title="HP Garage Standort"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              <ContactForm />
            </div>
          </section>
        </div>

        <Footer onNavigate={navigate} />
      </main>
    </>
  )
}
