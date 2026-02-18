'use client'

import { useCallback } from 'react'
import { useCustomizerStore } from '@/lib/store'

const logoPositions = [
  { id: 'chest-left', name: 'Chest Left' },
  { id: 'chest-center', name: 'Chest Center' },
  { id: 'chest-right', name: 'Chest Right' },
  { id: 'back', name: 'Back' },
  { id: 'sleeve-left', name: 'Left Sleeve' },
  { id: 'sleeve-right', name: 'Right Sleeve' },
] as const

export default function LogoPanel() {
  const {
    activeProduct,
    shirt,
    pants,
    setShirtLogo,
    setPantsLogo,
  } = useCustomizerStore()

  const isShirt = activeProduct === 'shirt'
  const logo = isShirt ? shirt.logo : pants.logo
  const setLogo = isShirt ? setShirtLogo : setPantsLogo

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo({ image: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }, [setLogo])

  const handleRemoveLogo = () => {
    setLogo({ image: null })
  }

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Logo</h3>

      <div className="space-y-4">
        {/* Upload Area */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Upload Logo</label>
          {logo.image ? (
            <div className="relative">
              <img
                src={logo.image}
                alt="Uploaded logo"
                className="w-full h-32 object-contain bg-white/10 rounded-lg"
              />
              <button
                onClick={handleRemoveLogo}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-ionic-accent/50 transition-colors">
              <svg className="w-8 h-8 text-white/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-white/50">Click to upload logo</span>
              <span className="text-xs text-white/30 mt-1">PNG, JPG up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Position Selection (only for shirt) */}
        {isShirt && logo.image && (
          <div>
            <label className="block text-sm text-white/70 mb-2">Position</label>
            <div className="grid grid-cols-2 gap-2">
              {logoPositions.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setLogo({ position: pos.id })}
                  className={`py-2 px-3 rounded-lg text-sm transition-all ${
                    logo.position === pos.id
                      ? 'bg-ionic-accent text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {pos.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scale Slider */}
        {logo.image && (
          <div>
            <label className="block text-sm text-white/70 mb-2">
              Size: {Math.round(logo.scale * 100)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={logo.scale}
              onChange={(e) => setLogo({ scale: parseFloat(e.target.value) })}
              className="w-full accent-ionic-accent"
            />
          </div>
        )}
      </div>
    </div>
  )
}
