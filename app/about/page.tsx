'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 pt-32 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))' }} />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ionic-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ionic-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            About
            <span className="block bg-gradient-to-r from-ionic-accent to-ionic-gold bg-clip-text text-transparent">
              AICONZ
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Premium custom uniform manufacturing for sports teams, schools, and brands across the UK and beyond.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Our Story
              </h2>
              <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  AICONZ was founded with a simple mission: to make premium custom uniforms accessible to every team,
                  regardless of size. We believe that looking professional shouldn&apos;t come with a premium price tag.
                </p>
                <p>
                  Starting as a small operation serving local football clubs, we&apos;ve grown into a trusted partner for
                  schools, sports academies, gyms, and corporate teams across the United Kingdom.
                </p>
                <p>
                  Our team combines decades of manufacturing expertise with cutting-edge technology, including our
                  proprietary 3D design tool that lets you visualize your uniforms before production begins.
                </p>
              </div>
            </div>
            <div className="glass-panel p-8 text-center">
              <div className="text-8xl mb-4">🏭</div>
              <p style={{ color: 'var(--text-muted)' }}>Manufacturing Excellence Since 2020</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Teams Served', icon: '🏆' },
              { value: '10,000+', label: 'Kits Delivered', icon: '📦' },
              { value: '15+', label: 'Countries Shipped', icon: '🌍' },
              { value: '100%', label: 'Quality Guarantee', icon: '✅' },
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-6">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-ionic-accent mb-1">{stat.value}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            What We Offer
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '👕',
                title: 'Custom Apparel',
                description: 'T-shirts, hoodies, polos, jerseys, compression wear, and more. All fully customizable with your brand.',
              },
              {
                icon: '🎨',
                title: 'Multiple Print Methods',
                description: 'Sublimation, DTF printing, embroidery, and screen printing. We recommend the best method for your design.',
              },
              {
                icon: '🏃',
                title: 'Sports Specific',
                description: 'Football kits, basketball jerseys, rugby wear, fitness apparel, and team uniforms for any sport.',
              },
              {
                icon: '🏫',
                title: 'Schools & Academies',
                description: 'PE kits, sports day uniforms, school team apparel with durable, wash-friendly fabrics.',
              },
              {
                icon: '💼',
                title: 'Corporate & Events',
                description: 'Staff uniforms, event merchandise, promotional apparel with quick turnaround times.',
              },
              {
                icon: '🎯',
                title: 'Brand Development',
                description: 'Logo placement guidance, color matching, and design consultation to elevate your brand.',
              },
            ].map((item, i) => (
              <div key={i} className="glass-panel p-8 text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            Our Process
          </h2>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Design & Consultation',
                description: 'Use our 3D designer or work directly with our team. We help you create the perfect look for your team, including logo placement, color matching, and fabric selection.',
              },
              {
                step: '02',
                title: 'Sample Approval',
                description: 'For bulk orders, we provide physical samples so you can feel the quality, check colors, and approve the design before full production begins.',
              },
              {
                step: '03',
                title: 'Production',
                description: 'Your order goes into production at our facility. We use state-of-the-art equipment and quality materials to ensure every piece meets our standards.',
              },
              {
                step: '04',
                title: 'Quality Check & Delivery',
                description: 'Every item is inspected before shipping. We offer tracked delivery across the UK with international shipping available.',
              },
            ].map((item, i) => (
              <div key={i} className="glass-panel p-8 flex items-start gap-6">
                <div className="w-16 h-16 bg-ionic-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-ionic-accent">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-10 text-center">
            <h2 className="text-3xl font-display font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Our Quality Promise
            </h2>
            <div className="grid sm:grid-cols-3 gap-8 mb-8">
              {[
                { icon: '🧵', title: 'Premium Fabrics', desc: 'Only high-grade, durable materials' },
                { icon: '🎨', title: 'Color Accuracy', desc: 'Pantone matching for brand consistency' },
                { icon: '🔄', title: 'Wash Tested', desc: 'Guaranteed to last season after season' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Not satisfied? We&apos;ll make it right or give you a full refund. That&apos;s our promise.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-ionic-accent to-ionic-accent-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-ionic-black mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-ionic-black/70 text-lg mb-8">
            Whether you need 20 shirts or 2,000, we&apos;re here to help you look your best.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/samples" className="bg-ionic-black text-white font-semibold py-4 px-8 rounded-lg hover:bg-ionic-black/80 transition-colors inline-block text-lg">
              Request Sample Kit
            </Link>
            <Link href="/customize" className="bg-transparent border-2 border-ionic-black text-ionic-black font-semibold py-4 px-8 rounded-lg hover:bg-ionic-black/10 transition-colors inline-block text-lg">
              Start Designing
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            Get in Touch
          </h2>

          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div className="glass-panel p-6">
              <div className="text-3xl mb-3">📧</div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Email</h4>
              <a href="mailto:hello@aiconz.com" className="text-ionic-accent hover:underline">
                hello@aiconz.com
              </a>
            </div>
            <div className="glass-panel p-6">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>WhatsApp</h4>
              <a href="https://wa.me/447XXXXXXXXX" className="text-ionic-accent hover:underline">
                +44 7XXX XXXXXX
              </a>
            </div>
            <div className="glass-panel p-6">
              <div className="text-3xl mb-3">📍</div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Location</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                United Kingdom
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p style={{ color: 'var(--text-muted)' }}>
              Business Hours: Monday - Friday, 9:00 AM - 6:00 PM GMT
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
