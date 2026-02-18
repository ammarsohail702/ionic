'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-ionic-darker">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ionic-dark via-ionic-darker to-ionic-darker" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ionic-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ionic-gold/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/70 text-sm">Now accepting orders for 2024 season</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Design Your
            <span className="block bg-gradient-to-r from-ionic-accent to-ionic-gold bg-clip-text text-transparent">
              Perfect Kit
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Create stunning custom uniforms for your football club, school, or sports team
            with our interactive 3D designer. See your design come to life instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/customize" className="btn-primary text-lg px-8 py-4 animate-glow">
              Start Designing Now
            </Link>
            <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-ionic-accent">500+</div>
              <div className="text-white/50 text-sm">Teams Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-ionic-gold">10K+</div>
              <div className="text-white/50 text-sm">Kits Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">100%</div>
              <div className="text-white/50 text-sm">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-ionic-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Getting your custom uniforms is simple. Design, review, and order in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-panel p-8 text-center">
              <div className="w-16 h-16 bg-ionic-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-ionic-accent">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Design Your Kit</h3>
              <p className="text-white/60">
                Use our 3D customizer to choose colors, patterns, add your logo, team name, and numbers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-8 text-center">
              <div className="w-16 h-16 bg-ionic-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-ionic-gold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Choose Quantities</h3>
              <p className="text-white/60">
                Select sizes and quantities for your team. Bulk discounts available for larger orders.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-8 text-center">
              <div className="w-16 h-16 bg-green-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-green-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Order via WhatsApp</h3>
              <p className="text-white/60">
                Submit your design directly to us on WhatsApp. We&apos;ll confirm details and start production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-ionic-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Full Customization
                <span className="block text-ionic-accent">Endless Possibilities</span>
              </h2>
              <ul className="space-y-4">
                {[
                  'Choose from multiple collar styles',
                  'Select sleeve length (half or full)',
                  'Pick your team colors',
                  'Add patterns: stripes, gradients, checkered',
                  'Upload your club or school logo',
                  'Add team name and player numbers',
                  'Design matching pants/shorts',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-ionic-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/customize" className="btn-primary inline-block mt-8">
                Start Designing
              </Link>
            </div>
            <div className="glass-panel p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">👕</div>
                <p className="text-white/50">Interactive 3D Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-ionic-accent to-ionic-accent-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-6">
            Ready to Design Your Team&apos;s New Look?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join hundreds of teams who trust Ionic for their custom uniforms.
            Start designing now and see your vision come to life.
          </p>
          <Link href="/customize" className="bg-white text-ionic-accent font-semibold py-4 px-8 rounded-lg hover:bg-white/90 transition-colors inline-block text-lg">
            Launch 3D Designer
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
