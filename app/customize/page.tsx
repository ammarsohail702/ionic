'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCustomizerStore } from '@/lib/store'
import { generateOrderPDF } from '@/lib/pdfGenerator'
import { generateWhatsAppMessage, openWhatsApp, validateOrder } from '@/lib/whatsapp'

import ColorPanel from '@/components/customizer/ColorPanel'
import PatternPanel from '@/components/customizer/PatternPanel'
import StylePanel from '@/components/customizer/StylePanel'
import EditorPanel from '@/components/customizer/EditorPanel'
import SizeQuantityTable from '@/components/order/SizeQuantityTable'
import OrderForm from '@/components/order/OrderForm'
import PriceDisplay from '@/components/order/PriceDisplay'

// Dynamically import Canvas3D to avoid SSR issues with Three.js
const Canvas3D = dynamic(() => import('@/components/3d/Canvas3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-ionic-dark">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-ionic-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/50">Loading 3D Viewer...</p>
      </div>
    </div>
  ),
})

type Tab = 'design' | 'order'
type DesignPanel = 'colors' | 'pattern' | 'editor' | 'style'

export default function CustomizePage() {
  const [activeTab, setActiveTab] = useState<Tab>('design')
  const [activePanel, setActivePanel] = useState<DesignPanel>('colors')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const {
    activeProduct,
    setActiveProduct,
    viewAngle,
    setViewAngle,
    shirt,
    pants,
    shirtOrder,
    pantsOrder,
    deliveryAddress,
  } = useCustomizerStore()

  const handleSubmitOrder = useCallback(async () => {
    setErrors([])
    setIsSubmitting(true)

    try {
      // Validate order
      const validation = validateOrder({
        shirtOrder,
        pantsOrder,
        deliveryAddress,
      })

      if (!validation.valid) {
        setErrors(validation.errors)
        setIsSubmitting(false)
        return
      }

      // Generate PDF
      const pdfBlob = await generateOrderPDF({
        shirt,
        pants,
        shirtOrder,
        pantsOrder,
        deliveryAddress,
      })

      // Download PDF
      const pdfUrl = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `ionic-order-${Date.now()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(pdfUrl)

      // Generate WhatsApp message
      const message = generateWhatsAppMessage({
        shirtOrder,
        pantsOrder,
        deliveryAddress,
        shirtDetails: {
          primaryColor: shirt.primaryColor,
          pattern: shirt.pattern,
          collarType: shirt.collarType,
          sleeveType: shirt.sleeveType,
          teamName: shirt.teamName.content || undefined,
          number: shirt.playerNumber.number || undefined,
        },
        pantsDetails: {
          primaryColor: pants.primaryColor,
          pattern: pants.pattern,
          pantsType: pants.pantsType,
        },
      })

      // Open WhatsApp
      openWhatsApp(message)
    } catch (error) {
      console.error('Error submitting order:', error)
      setErrors(['An error occurred while submitting your order. Please try again.'])
    } finally {
      setIsSubmitting(false)
    }
  }, [shirt, pants, shirtOrder, pantsOrder, deliveryAddress])

  const designPanels: { id: DesignPanel; name: string; icon: string }[] = [
    { id: 'colors', name: 'Colors', icon: '🎨' },
    { id: 'pattern', name: 'Pattern', icon: '▦' },
    { id: 'editor', name: 'Editor', icon: '✏️' },
    { id: 'style', name: 'Style', icon: '✂️' },
  ]

  return (
    <div className="min-h-screen bg-ionic-darker">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-ionic-darker/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-full mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ionic-accent to-ionic-accent-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-white font-display font-bold">IONIC</span>
            </Link>

            {/* Product Selector */}
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setActiveProduct('shirt')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeProduct === 'shirt'
                    ? 'bg-ionic-accent text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Shirt
              </button>
              <button
                onClick={() => setActiveProduct('pants')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeProduct === 'pants'
                    ? 'bg-ionic-accent text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Pants
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-ionic-accent text-xs font-medium">3D</span>
              <Link
                href="/customize-2d"
                className="text-white/50 hover:text-white text-xs transition-colors"
              >
                2D
              </Link>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewAngle('front')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  viewAngle === 'front' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setViewAngle('back')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  viewAngle === 'back' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setViewAngle('free')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  viewAngle === 'free' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                360°
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-14 flex h-screen">
        {/* Left Sidebar - Design/Order Tabs */}
        <div className="w-80 lg:w-96 bg-ionic-dark border-r border-white/5 flex flex-col overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === 'design'
                  ? 'text-ionic-accent border-b-2 border-ionic-accent'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Design
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === 'order'
                  ? 'text-ionic-accent border-b-2 border-ionic-accent'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Order
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'design' ? (
              <div className="space-y-4">
                {/* Panel Selector */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {designPanels.map((panel) => (
                    <button
                      key={panel.id}
                      onClick={() => setActivePanel(panel.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                        activePanel === panel.id
                          ? 'bg-ionic-accent text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <span>{panel.icon}</span>
                      <span>{panel.name}</span>
                    </button>
                  ))}
                </div>

                {/* Active Panel */}
                {activePanel === 'colors' && <ColorPanel />}
                {activePanel === 'pattern' && <PatternPanel />}
                {activePanel === 'editor' && <EditorPanel />}
                {activePanel === 'style' && <StylePanel />}
              </div>
            ) : (
              <div className="space-y-4">
                <SizeQuantityTable productType="shirt" />
                <SizeQuantityTable productType="pants" />
                <PriceDisplay />
                <OrderForm />

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h4 className="text-red-400 font-medium mb-2">Please fix the following:</h4>
                    <ul className="text-red-400/80 text-sm space-y-1">
                      {errors.map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Order via WhatsApp
                    </>
                  )}
                </button>

                <p className="text-white/40 text-xs text-center">
                  A PDF with your design will be downloaded automatically.
                  Please attach it to your WhatsApp message.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas3D className="w-full h-full" />

          {/* Help text overlay */}
          <div className="absolute bottom-4 left-4 text-white/30 text-sm">
            Drag to rotate • Scroll to zoom
          </div>
        </div>
      </div>
    </div>
  )
}
