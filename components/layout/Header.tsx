'use client'

import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-colors duration-300" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-ionic-accent to-ionic-accent-light rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>AICONZ</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Home
            </Link>
            <Link href="/customize" className="transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Design Kit
            </Link>
          </nav>

          {/* Theme Toggle & CTA */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/customize"
              className="btn-primary text-sm"
            >
              Start Designing
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
