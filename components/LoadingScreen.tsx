'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function LoadingScreen() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.classList.add('out')
    }, 1600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div id="loader" ref={ref} role="status" aria-label="Seite wird geladen">
      <span style={{ fontWeight: 900, fontSize: '1.6rem', letterSpacing: '0.2em', color: '#fff' }}>MEMYSELFANDI</span>
      <div className="ld-bar-track">
        <div className="ld-bar-fill" />
      </div>
    </div>
  )
}
