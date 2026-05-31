import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Nav from '@/components/Nav'

describe('Nav', () => {
  it('renders the logo', () => {
    render(<Nav activePage="home" onNavigate={vi.fn()} />)
    expect(screen.getByAltText('HP Garage Logo')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Nav activePage="home" onNavigate={vi.fn()} />)
    expect(screen.getAllByText('Start').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Leistungen').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Galerie').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Über uns').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Kontakt & Termin').length).toBeGreaterThan(0)
  })

  it('marks the active page link', () => {
    render(<Nav activePage="services" onNavigate={vi.fn()} />)
    const active = document.querySelectorAll('.active')
    const labels = Array.from(active).map((el) => el.textContent)
    expect(labels).toContain('Leistungen')
  })

  it('calls onNavigate when a link is clicked', () => {
    const spy = vi.fn()
    render(<Nav activePage="home" onNavigate={spy} />)
    fireEvent.click(screen.getAllByText('Leistungen')[0])
    expect(spy).toHaveBeenCalledWith('services')
  })

  it('renders burger button for mobile', () => {
    render(<Nav activePage="home" onNavigate={vi.fn()} />)
    expect(screen.getByLabelText('Menü öffnen')).toBeInTheDocument()
  })

  it('opens mobile menu when burger is clicked', () => {
    render(<Nav activePage="home" onNavigate={vi.fn()} />)
    const burger = screen.getByLabelText('Menü öffnen')
    expect(document.querySelector('.mob-menu')?.classList.contains('open')).toBe(false)
    fireEvent.click(burger)
    expect(document.querySelector('.mob-menu')?.classList.contains('open')).toBe(true)
  })
})
