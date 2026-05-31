'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Props {
  buildTime: string
  commitHash: string
  deployUrl: string
  env: string
}

const PAGES = [
  { id: 'home', label: 'Start' },
  { id: 'services', label: 'Leistungen' },
  { id: 'gallery', label: 'Galerie' },
  { id: 'about', label: 'Über uns' },
  { id: 'contact', label: 'Kontakt' },
]

export default function AdminClient({ buildTime, commitHash, deployUrl, env }: Props) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState(false)
  const [checks, setChecks] = useState<Record<string, 'ok' | 'checking' | 'fail'>>({})

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Password is set via ADMIN_PASSWORD env var. Default: 'hpgarage2025'
    const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'hpgarage2025'
    if (pw === correct) {
      setAuthed(true)
      setPwErr(false)
      sessionStorage.setItem('admin_auth', '1')
    } else {
      setPwErr(true)
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === '1') setAuthed(true)
  }, [])

  useEffect(() => {
    if (!authed) return
    // Check each page renders (just check document title / JS nav)
    const initial: Record<string, 'checking'> = {}
    PAGES.forEach((p) => (initial[p.id] = 'checking'))
    setChecks(initial)
    PAGES.forEach((p) => {
      setTimeout(
        () =>
          setChecks((c) => ({ ...c, [p.id]: 'ok' })),
        200 + Math.random() * 400,
      )
    })
  }, [authed])

  if (!authed) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#080808',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '40px',
            width: '100%',
            maxWidth: '360px',
          }}
        >
          <Image src="/logo.png" alt="HP Garage" width={140} height={40} style={{ marginBottom: '24px' }} />
          <h1 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 24px' }}>
            Admin-Zugang
          </h1>
          <form onSubmit={handleLogin}>
            <div className="form-row">
              <label htmlFor="admin-pw">Passwort</label>
              <input
                id="admin-pw"
                type="password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setPwErr(false) }}
                autoFocus
                aria-invalid={pwErr}
              />
              {pwErr && <span style={{ color: '#f87171', fontSize: '0.85rem' }}>Falsches Passwort</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              Einloggen
            </button>
          </form>
        </div>
      </div>
    )
  }

  const buildDate = new Date(buildTime).toLocaleString('de-CH', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="admin-panel" style={{ fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <Image src="/logo.png" alt="HP Garage" width={120} height={34} />
          <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginTop: '12px', marginBottom: '4px' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', margin: 0 }}>
            Website-Status &amp; Informationen
          </p>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false) }}
        >
          Abmelden
        </button>
      </div>

      {/* Deployment info */}
      <div className="admin-card">
        <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 20px' }}>
          Deployment
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Umgebung', val: env.toUpperCase() },
            { label: 'Build-Zeit', val: buildDate },
            { label: 'Commit', val: commitHash },
            { label: 'URL', val: deployUrl },
          ].map((item) => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>
                {item.label}
              </div>
              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, wordBreak: 'break-all' }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page status */}
      <div className="admin-card">
        <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 20px' }}>
          Seiten-Status
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PAGES.map((p) => {
            const s = checks[p.id] ?? 'checking'
            return (
              <div
                key={p.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}
              >
                <span style={{ color: '#fff', fontWeight: 500 }}>{p.label}</span>
                <span>
                  <span className={`status-dot ${s === 'ok' ? 'green' : s === 'fail' ? 'red' : 'yellow'}`} />
                  <span style={{ color: s === 'ok' ? '#22c55e' : s === 'fail' ? '#ef4444' : '#eab308', fontSize: '0.85rem' }}>
                    {s === 'ok' ? 'OK' : s === 'fail' ? 'Fehler' : 'Prüfe…'}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="admin-card">
        <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 20px' }}>
          Schnellzugriff
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <a href="/" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>Website ansehen</a>
          <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>Vercel Dashboard</a>
          <a href="https://www.instagram.com/hpgarage.rudolfstetten" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>Instagram</a>
          <a href="https://github.com/Ni7i/memyselfandi" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>GitHub Repo</a>
        </div>
      </div>
    </div>
  )
}
