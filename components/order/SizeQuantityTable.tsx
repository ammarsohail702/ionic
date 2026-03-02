'use client'

import { useCustomizerStore, OrderItem } from '@/lib/store'
import { siteConfig } from '@/config/settings'

interface SizeQuantityTableProps {
  productType: 'shirt' | 'pants'
}

export default function SizeQuantityTable({ productType }: SizeQuantityTableProps) {
  const {
    shirtOrder,
    pantsOrder,
    setShirtOrder,
    setPantsOrder,
  } = useCustomizerStore()

  const order = productType === 'shirt' ? shirtOrder : pantsOrder
  const setOrder = productType === 'shirt' ? setShirtOrder : setPantsOrder

  const getQuantity = (size: string): number => {
    const item = order.find((o) => o.size === size)
    return item?.quantity || 0
  }

  const updateQuantity = (size: string, quantity: number) => {
    const newOrder = [...order]
    const index = newOrder.findIndex((o) => o.size === size)

    if (quantity <= 0) {
      if (index > -1) {
        newOrder.splice(index, 1)
      }
    } else {
      if (index > -1) {
        newOrder[index].quantity = quantity
      } else {
        newOrder.push({ size, quantity })
      }
    }

    setOrder(newOrder)
  }

  const totalQuantity = order.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        {productType === 'shirt' ? 'Shirt' : 'Pants'} Quantities
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th className="text-left py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Size</th>
              <th className="text-center py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {siteConfig.sizes.map((size) => (
              <tr key={size} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td className="py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{size}</td>
                <td className="py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateQuantity(size, getQuantity(size) - 1)}
                      className="w-8 h-8 rounded-lg transition-colors"
                      style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={getQuantity(size)}
                      onChange={(e) => updateQuantity(size, parseInt(e.target.value) || 0)}
                      className="w-16 text-center rounded-lg py-1"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button
                      onClick={() => updateQuantity(size, getQuantity(size) + 1)}
                      className="w-8 h-8 rounded-lg transition-colors"
                      style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--border-color)' }}>
              <td className="py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Total</td>
              <td className="py-3 text-center text-ionic-accent font-bold text-lg">
                {totalQuantity}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
