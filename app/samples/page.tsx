'use client'

import { useState, useRef } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface FormData {
  // Section 1: Contact Info
  fullName: string
  organizationName: string
  role: string
  workEmail: string
  phone: string
  shippingAddress: string
  city: string
  country: string
  postalCode: string

  // Section 2: Project Scope
  orderVolume: string
  customizationTypes: string[]
  timeline: string

  // Section 3: Sample Selection
  productInterests: string[]
  fabricInterest: string

  // Section 4: Logo Upload
  logo: File | null
  additionalNotes: string
}

const initialFormData: FormData = {
  fullName: '',
  organizationName: '',
  role: '',
  workEmail: '',
  phone: '',
  shippingAddress: '',
  city: '',
  country: '',
  postalCode: '',
  orderVolume: '',
  customizationTypes: [],
  timeline: '',
  productInterests: [],
  fabricInterest: '',
  logo: null,
  additionalNotes: '',
}

export default function SamplesPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (field: 'customizationTypes' | 'productInterests', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, logo: file }))
    setFileName(file?.name || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const formDataToSend = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'logo' && value instanceof File) {
          formDataToSend.append('logo', value)
        } else if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value))
        } else if (value !== null) {
          formDataToSend.append(key, value as string)
        }
      })

      const response = await fetch('/api/samples', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData(initialFormData)
        setFileName('')
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyles = {
    backgroundColor: 'var(--input-bg)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  }

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
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <span className="w-2 h-2 bg-ionic-gold rounded-full animate-pulse" />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Limited Sample Kits Available</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Experience the
            <span className="block bg-gradient-to-r from-ionic-accent to-ionic-gold bg-clip-text text-transparent">
              AICONZ Quality
            </span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            Stop guessing and start feeling. Our Sample Kits are designed for decision-makers who need to
            see the stitching, feel the fabric, and test the durability before committing to a bulk order.
          </p>
        </div>
      </section>

      {/* What's in the Box */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
            What&apos;s in the Box?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: '👕', text: 'A garment featuring your chosen customization (Sublimation, Embroidery, or DTF)' },
              { icon: '📖', text: 'Our 2026 Fabric Swatch Book (all available colors and weights)' },
              { icon: '✅', text: 'A "Wash-Test" certificate of durability' },
              { icon: '💰', text: 'A physical copy of our Bulk Pricing Guide' },
            ].map((item, i) => (
              <div key={i} className="glass-panel p-6 flex items-start gap-4">
                <span className="text-3xl">{item.icon}</span>
                <p style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Pricing Note */}
          <div className="mt-8 p-6 rounded-xl bg-ionic-accent/10 border border-ionic-accent/30 text-center">
            <p style={{ color: 'var(--text-primary)' }}>
              <strong>Sample kits are $30</strong> to cover shipping and production,
              <span className="text-ionic-accent font-semibold"> fully refundable on your first order of 30+ units.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {submitStatus === 'success' ? (
            <div className="glass-panel p-12 text-center">
              <div className="text-6xl mb-6">📦</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Your Sample Request is Being Prepared!
              </h2>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                Thanks for reaching out! Our team is reviewing your request and you&apos;ll receive
                a tracking number within 48 hours. Check your email for confirmation.
              </p>
              <button
                onClick={() => setSubmitStatus('idle')}
                className="btn-primary"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Section 1: Contact Info */}
              <div className="glass-panel p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-8 h-8 bg-ionic-accent rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                  Contact Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Organization/Brand Name *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                      placeholder="Westside High School"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Your Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                    >
                      <option value="">Select your role</option>
                      <option value="coach">Coach</option>
                      <option value="athletic_director">Athletic Director</option>
                      <option value="founder">Founder / Owner</option>
                      <option value="purchasing_manager">Purchasing Manager</option>
                      <option value="team_manager">Team Manager</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Work Email *
                    </label>
                    <input
                      type="email"
                      name="workEmail"
                      value={formData.workEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                      placeholder="john@organization.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                      placeholder="+44 7XXX XXXXXX"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Shipping Address *
                    </label>
                    <input
                      type="text"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                      placeholder="123 Main Street, Building A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                      placeholder="London"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                      placeholder="United Kingdom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                      placeholder="SW1A 1AA"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Project Scope */}
              <div className="glass-panel p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-8 h-8 bg-ionic-gold rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                  Project Scope
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Estimated Order Volume *
                    </label>
                    <select
                      name="orderVolume"
                      value={formData.orderVolume}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                    >
                      <option value="">Select quantity range</option>
                      <option value="10-50">10-50 units</option>
                      <option value="51-200">51-200 units</option>
                      <option value="201-500">201-500 units</option>
                      <option value="500+">500+ units</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Primary Customization Needed *
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {['Sublimation', 'DTF Printing', 'Embroidery', 'Screen Printing'].map(type => (
                        <label
                          key={type}
                          className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all"
                          style={{
                            backgroundColor: formData.customizationTypes.includes(type) ? 'rgba(99, 102, 241, 0.1)' : 'var(--input-bg)',
                            border: formData.customizationTypes.includes(type) ? '2px solid var(--ionic-accent)' : '1px solid var(--border-color)',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={formData.customizationTypes.includes(type)}
                            onChange={() => handleCheckboxChange('customizationTypes', type)}
                            className="w-5 h-5 rounded text-ionic-accent focus:ring-ionic-accent"
                          />
                          <span style={{ color: 'var(--text-primary)' }}>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Timeline *
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP - Urgent Order</option>
                      <option value="3_months">Within 3 months</option>
                      <option value="next_season">Next Season (3-6 months)</option>
                      <option value="researching">Just Researching</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Sample Selection */}
              <div className="glass-panel p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                  Sample Selection
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                      What would you like to see? *
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { id: 'performance_tee', label: 'Performance Tee', icon: '👕' },
                        { id: 'hoodie', label: 'Hoodie', icon: '🧥' },
                        { id: 'compression', label: 'Compression/Rashguard', icon: '🎽' },
                        { id: 'polo', label: 'Polo Shirt', icon: '👔' },
                        { id: 'jersey', label: 'Sports Jersey', icon: '🏃' },
                        { id: 'shorts', label: 'Shorts/Pants', icon: '🩳' },
                      ].map(product => (
                        <label
                          key={product.id}
                          className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all"
                          style={{
                            backgroundColor: formData.productInterests.includes(product.id) ? 'rgba(34, 197, 94, 0.1)' : 'var(--input-bg)',
                            border: formData.productInterests.includes(product.id) ? '2px solid #22c55e' : '1px solid var(--border-color)',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={formData.productInterests.includes(product.id)}
                            onChange={() => handleCheckboxChange('productInterests', product.id)}
                            className="w-5 h-5 rounded text-green-500 focus:ring-green-500"
                          />
                          <span className="text-xl">{product.icon}</span>
                          <span style={{ color: 'var(--text-primary)' }}>{product.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Specific Fabric Interest
                    </label>
                    <select
                      name="fabricInterest"
                      value={formData.fabricInterest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                      style={inputStyles}
                    >
                      <option value="">Select fabric type (optional)</option>
                      <option value="moisture_wicking">Moisture-Wicking Performance</option>
                      <option value="recycled_eco">Recycled/Eco-Fabric</option>
                      <option value="heavyweight_cotton">Heavyweight Cotton-Blend</option>
                      <option value="compression">Compression/Spandex Blend</option>
                      <option value="mesh">Breathable Mesh</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Logo Upload */}
              <div className="glass-panel p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-8 h-8 bg-ionic-accent rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                  Logo & Additional Info
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Upload Your Logo (Optional)
                    </label>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                      Upload your logo, and we will include a digital mockup with your sample pack.
                    </p>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:border-ionic-accent"
                      style={{ borderColor: fileName ? 'var(--ionic-accent)' : 'var(--border-color)' }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.svg,.ai,.eps,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {fileName ? (
                        <div className="flex items-center justify-center gap-3">
                          <svg className="w-8 h-8 text-ionic-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span style={{ color: 'var(--text-primary)' }}>{fileName}</span>
                        </div>
                      ) : (
                        <>
                          <svg className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p style={{ color: 'var(--text-secondary)' }}>
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            PNG, JPG, SVG, AI, EPS, PDF (max 10MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Additional Notes
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent resize-none"
                      style={inputStyles}
                      placeholder="Tell us more about your project, specific requirements, or any questions..."
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting Request...
                    </span>
                  ) : (
                    'Request Sample Kit - $30'
                  )}
                </button>
                <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  100% refundable on your first order of 30+ units
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            Trusted by Teams Across the UK
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: '500+', label: 'Teams Served' },
              { stat: '10K+', label: 'Kits Delivered' },
              { stat: '48hr', label: 'Sample Dispatch' },
              { stat: '100%', label: 'Satisfaction' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-ionic-accent">{item.stat}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
