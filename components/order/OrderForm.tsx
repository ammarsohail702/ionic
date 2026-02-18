'use client'

import { useCustomizerStore } from '@/lib/store'

export default function OrderForm() {
  const { deliveryAddress, setDeliveryAddress } = useCustomizerStore()

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Delivery Details</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Full Name *</label>
            <input
              type="text"
              value={deliveryAddress.name}
              onChange={(e) => setDeliveryAddress({ name: e.target.value })}
              className="input-field w-full"
              placeholder="John Smith"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Email *</label>
            <input
              type="email"
              value={deliveryAddress.email}
              onChange={(e) => setDeliveryAddress({ email: e.target.value })}
              className="input-field w-full"
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={deliveryAddress.phone}
            onChange={(e) => setDeliveryAddress({ phone: e.target.value })}
            className="input-field w-full"
            placeholder="+44 7xxx xxx xxx"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Address *</label>
          <input
            type="text"
            value={deliveryAddress.address}
            onChange={(e) => setDeliveryAddress({ address: e.target.value })}
            className="input-field w-full"
            placeholder="123 Main Street"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">City *</label>
            <input
              type="text"
              value={deliveryAddress.city}
              onChange={(e) => setDeliveryAddress({ city: e.target.value })}
              className="input-field w-full"
              placeholder="London"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Postcode *</label>
            <input
              type="text"
              value={deliveryAddress.postcode}
              onChange={(e) => setDeliveryAddress({ postcode: e.target.value })}
              className="input-field w-full"
              placeholder="SW1A 1AA"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Country</label>
            <input
              type="text"
              value={deliveryAddress.country}
              onChange={(e) => setDeliveryAddress({ country: e.target.value })}
              className="input-field w-full"
              placeholder="United Kingdom"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1">Special Instructions</label>
          <textarea
            value={deliveryAddress.notes}
            onChange={(e) => setDeliveryAddress({ notes: e.target.value })}
            className="input-field w-full h-24 resize-none"
            placeholder="Any special requests or notes for your order..."
          />
        </div>
      </div>
    </div>
  )
}
