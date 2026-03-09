'use client'

import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-colors duration-300" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="AICONZ"
              className="h-10 w-auto"
              style={{ maxWidth: '160px' }}
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="transition-colors hover:text-ionic-accent" style={{ color: 'var(--text-secondary)' }}>
              Home
            </Link>
            <Link href="/customize" className="transition-colors hover:text-ionic-accent" style={{ color: 'var(--text-secondary)' }}>
              3D Designer
            </Link>
            <Link href="/designer" className="transition-colors hover:text-ionic-accent" style={{ color: 'var(--text-secondary)' }}>
              2D Designer
            </Link>
            <Link href="/about" className="transition-colors hover:text-ionic-accent" style={{ color: 'var(--text-secondary)' }}>
              About
            </Link>
            <Link href="/samples" className="transition-colors hover:text-ionic-accent" style={{ color: 'var(--text-secondary)' }}>
              Samples
            </Link>
          </nav>

          {/* Theme Toggle & CTA */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/samples"
              className="btn-primary text-sm"
            >
              Get Samples
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
