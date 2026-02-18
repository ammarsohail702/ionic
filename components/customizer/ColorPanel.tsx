'use client'

import { useCustomizerStore } from '@/lib/store'

export default function ColorPanel() {
  const {
    activeProduct,
    shirt,
    pants,
    setShirtPrimaryColor,
    setShirtSecondaryColor,
    setShirtAccentColor,
    setPantsPrimaryColor,
    setPantsSecondaryColor,
    setPantsAccentColor,
  } = useCustomizerStore()

  const isShirt = activeProduct === 'shirt'
  const colors = isShirt ? shirt : pants

  const setPrimary = isShirt ? setShirtPrimaryColor : setPantsPrimaryColor
  const setSecondary = isShirt ? setShirtSecondaryColor : setPantsSecondaryColor
  const setAccent = isShirt ? setShirtAccentColor : setPantsAccentColor

  const presetColors = [
    '#1e40af', // Blue
    '#dc2626', // Red
    '#16a34a', // Green
    '#000000', // Black
    '#ffffff', // White
    '#f59e0b', // Yellow
    '#7c3aed', // Purple
    '#ec4899', // Pink
    '#0d9488', // Teal
    '#ea580c', // Orange
    '#6b7280', // Gray
    '#1e3a5f', // Navy
  ]

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Colors</h3>

      <div className="space-y-4">
        {/* Primary Color */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Primary Color</label>
          <div className="flex items-center gap-3">
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={colors.primaryColor}
                onChange={(e) => setPrimary(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {presetColors.slice(0, 6).map((color) => (
                <button
                  key={`primary-${color}`}
                  className={`w-8 h-8 rounded-md border-2 transition-transform hover:scale-110 ${
                    colors.primaryColor === color ? 'border-ionic-accent' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setPrimary(color)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Secondary Color</label>
          <div className="flex items-center gap-3">
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={colors.secondaryColor}
                onChange={(e) => setSecondary(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {presetColors.slice(0, 6).map((color) => (
                <button
                  key={`secondary-${color}`}
                  className={`w-8 h-8 rounded-md border-2 transition-transform hover:scale-110 ${
                    colors.secondaryColor === color ? 'border-ionic-accent' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSecondary(color)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Accent Color</label>
          <div className="flex items-center gap-3">
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={colors.accentColor}
                onChange={(e) => setAccent(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {presetColors.slice(6).map((color) => (
                <button
                  key={`accent-${color}`}
                  className={`w-8 h-8 rounded-md border-2 transition-transform hover:scale-110 ${
                    colors.accentColor === color ? 'border-ionic-accent' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setAccent(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
