'use client'

import { useCustomizerStore, PatternType } from '@/lib/store'

const patterns: { id: PatternType; name: string; icon: string }[] = [
  { id: 'solid', name: 'Solid', icon: '⬛' },
  { id: 'vertical-stripes', name: 'Vertical Stripes', icon: '|||' },
  { id: 'horizontal-stripes', name: 'Horizontal Stripes', icon: '≡' },
  { id: 'gradient', name: 'Gradient', icon: '▓' },
  { id: 'checkered', name: 'Checkered', icon: '▦' },
]

export default function PatternPanel() {
  const {
    activeProduct,
    shirt,
    pants,
    setShirtPattern,
    setPantsPattern,
  } = useCustomizerStore()

  const isShirt = activeProduct === 'shirt'
  const currentPattern = isShirt ? shirt.pattern : pants.pattern
  const setPattern = isShirt ? setShirtPattern : setPantsPattern

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Pattern</h3>

      <div className="grid grid-cols-2 gap-3">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => setPattern(pattern.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              currentPattern === pattern.id
                ? 'border-ionic-accent bg-ionic-accent/20'
                : ''
            }`}
            style={currentPattern !== pattern.id ? {
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--input-bg)'
            } : undefined}
          >
            <div className="text-2xl mb-1">{pattern.icon}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{pattern.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
