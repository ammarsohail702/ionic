'use client'

import { useCustomizerStore } from '@/lib/store'
import { siteConfig } from '@/config/settings'

export default function PriceDisplay() {
  const { shirt, pants, shirtOrder, pantsOrder } = useCustomizerStore()

  if (!siteConfig.showPricing) return null

  const calculateItemPrice = (type: 'shirt' | 'pants') => {
    const config = type === 'shirt' ? shirt : pants
    const pricing = siteConfig.pricing[type]
    let price = pricing.base

    // Add costs for customizations
    if (config.logo.image) price += pricing.customLogo
    if (type === 'shirt') {
      if (shirt.teamName.content) price += pricing.customText
      if (shirt.playerNumber.number) price += pricing.customText
    }
    if (config.pattern !== 'solid') price += pricing.premiumPattern

    return price
  }

  const shirtQuantity = shirtOrder.reduce((sum, item) => sum + item.quantity, 0)
  const pantsQuantity = pantsOrder.reduce((sum, item) => sum + item.quantity, 0)
  const totalQuantity = shirtQuantity + pantsQuantity

  const shirtUnitPrice = calculateItemPrice('shirt')
  const pantsUnitPrice = calculateItemPrice('pants')

  const shirtSubtotal = shirtUnitPrice * shirtQuantity
  const pantsSubtotal = pantsUnitPrice * pantsQuantity
  const subtotal = shirtSubtotal + pantsSubtotal

  // Calculate discount
  const discount = siteConfig.quantityDiscounts
    .filter((d) => totalQuantity >= d.minQty)
    .reduce((max, d) => Math.max(max, d.discount), 0)

  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  if (totalQuantity === 0) {
    return (
      <div className="glass-panel p-4">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Price Estimate</h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add items to see pricing</p>
      </div>
    )
  }

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Price Estimate</h3>

      <div className="space-y-3">
        {shirtQuantity > 0 && (
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>
              Shirts ({shirtQuantity} x {siteConfig.currency}{shirtUnitPrice})
            </span>
            <span style={{ color: 'var(--text-primary)' }}>
              {siteConfig.currency}{shirtSubtotal.toFixed(2)}
            </span>
          </div>
        )}

        {pantsQuantity > 0 && (
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>
              Pants ({pantsQuantity} x {siteConfig.currency}{pantsUnitPrice})
            </span>
            <span style={{ color: 'var(--text-primary)' }}>
              {siteConfig.currency}{pantsSubtotal.toFixed(2)}
            </span>
          </div>
        )}

        <div className="pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
            <span style={{ color: 'var(--text-primary)' }}>{siteConfig.currency}{subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-400 mt-1">
              <span>Bulk Discount ({discount}%)</span>
              <span>-{siteConfig.currency}{discountAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex justify-between">
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Total</span>
            <span className="text-ionic-accent font-bold text-xl">
              {siteConfig.currency}{total.toFixed(2)}
            </span>
          </div>
        </div>

        {totalQuantity < 10 && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Order 10+ items for 5% off, 25+ for 10% off, 50+ for 15% off, 100+ for 20% off
          </p>
        )}
      </div>
    </div>
  )
}
