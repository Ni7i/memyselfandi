import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Footer from '@/components/Footer'

describe('Footer', () => {
  it('renders the company logo', () => {
    render(<Footer onNavigate={vi.fn()} />)
    expect(screen.getByAltText('HP Garage')).toBeInTheDocument()
  })

  it('renders all social media links', () => {
    render(<Footer onNavigate={vi.fn()} />)
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument()
    expect(screen.getByLabelText('TikTok')).toBeInTheDocument()
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument()
  })

  it('social links open in new tab with noopener', () => {
    render(<Footer onNavigate={vi.fn()} />)
    const ig = screen.getByLabelText('Instagram')
    expect(ig).toHaveAttribute('target', '_blank')
    expect(ig).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('calls onNavigate when navigation links are clicked', () => {
    const spy = vi.fn()
    render(<Footer onNavigate={spy} />)
    fireEvent.click(screen.getByText('Leistungen'))
    expect(spy).toHaveBeenCalledWith('services')
  })

  it('displays the current year in copyright', () => {
    render(<Footer onNavigate={vi.fn()} />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })

  it('Instagram link points to correct URL', () => {
    render(<Footer onNavigate={vi.fn()} />)
    expect(screen.getByLabelText('Instagram')).toHaveAttribute(
      'href',
      'https://www.instagram.com/hpgarage.rudolfstetten',
    )
  })
})
