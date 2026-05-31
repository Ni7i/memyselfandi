'use client'

import { useState, type FormEvent } from 'react'

interface FormState {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

const EMPTY: FormState = { name: '', email: '', phone: '', service: '', message: '' }

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Bitte Namen eingeben'
    if (!form.email.trim()) e.email = 'E-Mail ist erforderlich'
    else if (!validateEmail(form.email)) e.email = 'Ungültige E-Mail-Adresse'
    if (!form.message.trim()) e.message = 'Bitte Nachricht eingeben'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simulate form submission (replace with real API endpoint)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setStatus('success')
    setForm(EMPTY)
  }

  const field = (
    key: keyof FormState,
    label: string,
    type = 'text',
    placeholder = '',
  ) => (
    <div className="form-row">
      <label htmlFor={`cf-${key}`}>{label}</label>
      <input
        id={`cf-${key}`}
        type={type}
        value={form[key]}
        placeholder={placeholder}
        autoComplete={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'off'}
        onChange={(e) => {
          setForm((f) => ({ ...f, [key]: e.target.value }))
          if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
        }}
        aria-describedby={errors[key] ? `cf-${key}-err` : undefined}
        aria-invalid={!!errors[key]}
      />
      {errors[key] && (
        <span id={`cf-${key}-err`} className="form-msg error" style={{ display: 'block', padding: '6px 0', background: 'none', border: 'none' }}>
          {errors[key]}
        </span>
      )}
    </div>
  )

  return (
    <div className="contact-form" role="form" aria-label="Terminanfrage">
      <h3>Termin &amp; Anfragen</h3>

      {status === 'success' && (
        <div className="form-msg success" role="alert">
          ✓ Ihre Nachricht wurde gesendet. Wir melden uns bald!
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid-2">
          {field('name', 'Name *', 'text', 'Max Muster')}
          {field('phone', 'Telefon', 'tel', '+41 79 000 00 00')}
        </div>
        {field('email', 'E-Mail *', 'email', 'name@beispiel.ch')}

        <div className="form-row">
          <label htmlFor="cf-service">Leistung</label>
          <select
            id="cf-service"
            value={form.service}
            onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
          >
            <option value="">Bitte wählen…</option>
            <option value="service">Service & Wartung</option>
            <option value="repair">Reparatur</option>
            <option value="mfk">MFK Vorbereitung</option>
            <option value="diagnosis">Fahrzeugdiagnose</option>
            <option value="klima">Klimaservice</option>
            <option value="reifen">Reifen & Räder</option>
            <option value="other">Sonstiges</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="cf-message">Nachricht *</label>
          <textarea
            id="cf-message"
            value={form.message}
            placeholder="Fahrzeug, Problem, Wunschtermin…"
            onChange={(e) => {
              setForm((f) => ({ ...f, message: e.target.value }))
              if (errors.message) setErrors((er) => ({ ...er, message: undefined }))
            }}
            aria-invalid={!!errors.message}
          />
          {errors.message && (
            <span className="form-msg error" style={{ display: 'block', padding: '6px 0', background: 'none', border: 'none' }}>
              {errors.message}
            </span>
          )}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Sende…' : 'Anfrage senden'}
        </button>
      </form>
    </div>
  )
}
