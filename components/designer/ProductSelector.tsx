'use client'

import { useState } from 'react'
import { useProduct2DStore } from '@/lib/store2d'
import { productCatalog, Product2D } from '@/lib/products2d'

interface ProductSelectorProps {
  onClose: () => void
}

type Category = 'all' | Product2D['category']

// Map categories to product images
const categoryImages: Record<string, string> = {
  shirts: '/products/tshirt-front.jpg',
  hoodies: '/products/hoodie-front.jpg',
  polos: '/products/polo-front.jpg',
  jerseys: '/products/jersey-front.jpg',
  jackets: '/products/jacket-front.jpg',
  pants: '/products/pants-front.jpg',
  accessories: '/products/cap-front.jpg',
}

export default function ProductSelector({ onClose }: ProductSelectorProps) {
  const { selectedProduct, setSelectedProduct } = useProduct2DStore()
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories: { id: Category; name: string }[] = [
    { id: 'all', name: 'All Products' },
    { id: 'shirts', name: 'T-Shirts' },
    { id: 'hoodies', name: 'Hoodies' },
    { id: 'polos', name: 'Polos' },
    { id: 'jerseys', name: 'Jerseys' },
    { id: 'jackets', name: 'Jackets' },
    { id: 'pants', name: 'Pants & Shorts' },
    { id: 'accessories', name: 'Accessories' },
  ]

  const filteredProducts = productCatalog.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSelectProduct = (product: Product2D) => {
    setSelectedProduct(product)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-4xl max-h-[80vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Select Product</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-ionic-accent/10"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
              style={{
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 py-4 border-b flex gap-2 overflow-x-auto" style={{ borderColor: 'var(--border-color)' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-ionic-accent text-white'
                  : ''
              }`}
              style={activeCategory !== cat.id ? {
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-secondary)'
              } : undefined}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={`group p-4 rounded-xl border-2 transition-all hover:border-ionic-accent relative ${
                  selectedProduct.id === product.id
                    ? 'border-ionic-accent bg-ionic-accent/10'
                    : ''
                }`}
                style={selectedProduct.id !== product.id ? {
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--border-color)'
                } : undefined}
              >
                {/* Product Image */}
                <div
                  className="aspect-square rounded-lg mb-3 overflow-hidden relative"
                  style={{ backgroundColor: '#f5f5f5' }}
                >
                  <img
                    src={categoryImages[product.category] || '/products/tshirt-front.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    style={{
                      mixBlendMode: 'multiply',
                    }}
                  />
                  {/* Color overlay */}
                  <div
                    className="absolute inset-0 mix-blend-multiply"
                    style={{
                      backgroundColor: product.defaultColor,
                      opacity: product.defaultColor === '#ffffff' ? 0 : 0.6,
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="text-left">
                  <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                    {product.name}
                  </h3>
                  <div className="flex gap-1">
                    {product.colors.slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: color,
                          border: color === '#ffffff' ? '1px solid #ddd' : 'none'
                        }}
                      />
                    ))}
                    {product.colors.length > 5 && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        +{product.colors.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Selected indicator */}
                {selectedProduct.id === product.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-ionic-accent text-white flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
