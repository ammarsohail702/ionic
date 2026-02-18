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
      <h3 className="text-lg font-semibold mb-4 text-white">
        {productType === 'shirt' ? 'Shirt' : 'Pants'} Quantities
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 text-sm text-white/70">Size</th>
              <th className="text-center py-2 text-sm text-white/70">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {siteConfig.sizes.map((size) => (
              <tr key={size} className="border-b border-white/5">
                <td className="py-3 text-white font-medium">{size}</td>
                <td className="py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateQuantity(size, getQuantity(size) - 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={getQuantity(size)}
                      onChange={(e) => updateQuantity(size, parseInt(e.target.value) || 0)}
                      className="w-16 text-center bg-white/5 border border-white/10 rounded-lg py-1 text-white"
                    />
                    <button
                      onClick={() => updateQuantity(size, getQuantity(size) + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/20">
              <td className="py-3 text-white font-semibold">Total</td>
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
