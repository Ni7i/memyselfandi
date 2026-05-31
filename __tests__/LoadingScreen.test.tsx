import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LoadingScreen from '@/components/LoadingScreen'

describe('LoadingScreen', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('renders the logo', () => {
    render(<LoadingScreen />)
    expect(screen.getByAltText('HP Garage')).toBeInTheDocument()
  })

  it('renders the loading bar', () => {
    render(<LoadingScreen />)
    expect(document.querySelector('.ld-bar-fill')).toBeInTheDocument()
  })

  it('has role=status for accessibility', () => {
    render(<LoadingScreen />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('adds .out class after 1600ms', async () => {
    render(<LoadingScreen />)
    const loader = document.getElementById('loader')
    expect(loader?.classList.contains('out')).toBe(false)
    act(() => { vi.advanceTimersByTime(1600) })
    expect(loader?.classList.contains('out')).toBe(true)
  })
})
