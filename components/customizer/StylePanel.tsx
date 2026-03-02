'use client'

import { useCustomizerStore, CollarType, SleeveType, PantsType, SleeveDesignType } from '@/lib/store'

const collarTypes: { id: CollarType; name: string }[] = [
  { id: 'round', name: 'Round Neck' },
  { id: 'vneck', name: 'V-Neck' },
  { id: 'polo', name: 'Polo Collar' },
  { id: 'mandarin', name: 'Mandarin' },
]

const sleeveTypes: { id: SleeveType; name: string }[] = [
  { id: 'half', name: 'Half Sleeve' },
  { id: 'full', name: 'Full Sleeve' },
]

const sleeveDesigns: { id: SleeveDesignType; name: string; icon: string }[] = [
  { id: 'solid', name: 'Solid', icon: '▬' },
  { id: 'single-stripe', name: '1 Stripe', icon: '═' },
  { id: 'double-stripe', name: '2 Stripes', icon: '≡' },
  { id: 'triple-stripe', name: '3 Stripes', icon: '☰' },
]

const pantsTypes: { id: PantsType; name: string }[] = [
  { id: 'shorts', name: 'Shorts' },
  { id: 'full', name: 'Full Length' },
]

const quickColors = [
  '#1e40af', '#3b82f6', '#ef4444', '#22c55e',
  '#000000', '#374151', '#ffffff', '#fbbf24',
]

export default function StylePanel() {
  const {
    activeProduct,
    shirt,
    pants,
    setShirtCollarType,
    setShirtCollarColor,
    setShirtSleeveType,
    setShirtSleeveDesign,
    setPantsType,
  } = useCustomizerStore()

  if (activeProduct === 'shirt') {
    return (
      <div className="glass-panel p-4">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Style</h3>

        <div className="space-y-5">
          {/* Collar Type */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Collar Style</label>
            <div className="grid grid-cols-2 gap-2">
              {collarTypes.map((collar) => (
                <button
                  key={collar.id}
                  onClick={() => setShirtCollarType(collar.id)}
                  className={`py-3 px-4 rounded-lg text-sm transition-all ${
                    shirt.collarType === collar.id
                      ? 'bg-ionic-accent text-white'
                      : ''
                  }`}
                  style={shirt.collarType !== collar.id ? {
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-secondary)'
                  } : undefined}
                >
                  {collar.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collar Color */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Collar Color</label>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-wrap">
                {quickColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setShirtCollarColor(color)}
                    className={`w-7 h-7 rounded-md border-2 transition-all ${
                      shirt.collarColor === color ? 'border-ionic-accent scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={shirt.collarColor}
                onChange={(e) => setShirtCollarColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Sleeve Type */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Sleeve Length</label>
            <div className="grid grid-cols-2 gap-2">
              {sleeveTypes.map((sleeve) => (
                <button
                  key={sleeve.id}
                  onClick={() => setShirtSleeveType(sleeve.id)}
                  className={`py-3 px-4 rounded-lg text-sm transition-all ${
                    shirt.sleeveType === sleeve.id
                      ? 'bg-ionic-accent text-white'
                      : ''
                  }`}
                  style={shirt.sleeveType !== sleeve.id ? {
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-secondary)'
                  } : undefined}
                >
                  {sleeve.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sleeve Design */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Sleeve Design</label>
            <div className="grid grid-cols-4 gap-2">
              {sleeveDesigns.map((design) => (
                <button
                  key={design.id}
                  onClick={() => setShirtSleeveDesign({ design: design.id })}
                  className={`py-3 px-2 rounded-lg text-xs transition-all flex flex-col items-center gap-1 ${
                    shirt.sleeveDesign.design === design.id
                      ? 'bg-ionic-accent text-white'
                      : ''
                  }`}
                  style={shirt.sleeveDesign.design !== design.id ? {
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-secondary)'
                  } : undefined}
                >
                  <span className="text-lg">{design.icon}</span>
                  <span>{design.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sleeve Color */}
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Sleeve Color</label>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-wrap">
                {quickColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setShirtSleeveDesign({ color })}
                    className={`w-7 h-7 rounded-md border-2 transition-all ${
                      shirt.sleeveDesign.color === color ? 'border-ionic-accent scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={shirt.sleeveDesign.color}
                onChange={(e) => setShirtSleeveDesign({ color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Stripe Color (only show if stripe design selected) */}
          {shirt.sleeveDesign.design !== 'solid' && (
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Stripe Color</label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 flex-wrap">
                  {quickColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setShirtSleeveDesign({ stripeColor: color })}
                      className={`w-7 h-7 rounded-md border-2 transition-all ${
                        shirt.sleeveDesign.stripeColor === color ? 'border-ionic-accent scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={shirt.sleeveDesign.stripeColor}
                  onChange={(e) => setShirtSleeveDesign({ stripeColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Style</h3>

      <div>
        <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Length</label>
        <div className="grid grid-cols-2 gap-2">
          {pantsTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setPantsType(type.id)}
              className={`py-3 px-4 rounded-lg text-sm transition-all ${
                pants.pantsType === type.id
                  ? 'bg-ionic-accent text-white'
                  : ''
              }`}
              style={pants.pantsType !== type.id ? {
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-secondary)'
              } : undefined}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
