import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ContactForm from '@/components/ContactForm'

describe('ContactForm', () => {
  it('renders all required fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/E-Mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nachricht/i)).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty', async () => {
    render(<ContactForm />)
    fireEvent.click(screen.getByRole('button', { name: /Anfrage senden/i }))
    await waitFor(() => {
      expect(screen.getByText('Bitte Namen eingeben')).toBeInTheDocument()
      expect(screen.getByText('E-Mail ist erforderlich')).toBeInTheDocument()
      expect(screen.getByText('Bitte Nachricht eingeben')).toBeInTheDocument()
    })
  })

  it('shows email format error for invalid email', async () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/E-Mail/i), { target: { value: 'not-an-email' } })
    fireEvent.change(screen.getByLabelText(/Nachricht/i), { target: { value: 'Test' } })
    fireEvent.click(screen.getByRole('button', { name: /Anfrage senden/i }))
    await waitFor(() => {
      expect(screen.getByText('Ungültige E-Mail-Adresse')).toBeInTheDocument()
    })
  })

  it('clears field error when user types', async () => {
    render(<ContactForm />)
    fireEvent.click(screen.getByRole('button', { name: /Anfrage senden/i }))
    await waitFor(() => expect(screen.getByText('Bitte Namen eingeben')).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Max' } })
    await waitFor(() => expect(screen.queryByText('Bitte Namen eingeben')).not.toBeInTheDocument())
  })

  it('shows success message after valid submission', async () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Max Muster' } })
    fireEvent.change(screen.getByLabelText(/E-Mail/i), { target: { value: 'max@test.ch' } })
    fireEvent.change(screen.getByLabelText(/Nachricht/i), { target: { value: 'Ich möchte einen Termin' } })
    fireEvent.click(screen.getByRole('button', { name: /Anfrage senden/i }))
    await waitFor(() => {
      expect(screen.getByText(/Ihre Nachricht wurde gesendet/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })
})
