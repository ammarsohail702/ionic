'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ionic-darker/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-ionic-accent to-ionic-accent-light rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="text-white font-display font-bold text-xl">IONIC</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/customize" className="text-white/70 hover:text-white transition-colors">
              Design Kit
            </Link>
          </nav>

          {/* CTA */}
          <Link
            href="/customize"
            className="btn-primary text-sm"
          >
            Start Designing
          </Link>
        </div>
      </div>
    </header>
  )
}
