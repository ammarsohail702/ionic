'use client'

import { useCustomizerStore } from '@/lib/store'

export default function TextPanel() {
  const {
    activeProduct,
    shirt,
    setShirtTeamName,
    setShirtNumber,
  } = useCustomizerStore()

  if (activeProduct !== 'shirt') {
    return (
      <div className="glass-panel p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">Text & Numbers</h3>
        <p className="text-white/50 text-sm">Text options are only available for shirts.</p>
      </div>
    )
  }

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Text & Numbers</h3>

      <div className="space-y-4">
        {/* Team Name */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Team Name</label>
          <input
            type="text"
            value={shirt.teamName.content}
            onChange={(e) => setShirtTeamName({ content: e.target.value })}
            placeholder="Enter team name"
            className="input-field w-full"
            maxLength={20}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShirtTeamName({ position: 'front' })}
              className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                shirt.teamName.position === 'front'
                  ? 'bg-ionic-accent text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setShirtTeamName({ position: 'back' })}
              className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                shirt.teamName.position === 'back'
                  ? 'bg-ionic-accent text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Back
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <label className="text-sm text-white/70">Color:</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={shirt.teamName.color}
                onChange={(e) => setShirtTeamName({ color: e.target.value })}
                className="w-8 h-8"
              />
            </div>
          </div>
        </div>

        {/* Player Number */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Number</label>
          <input
            type="text"
            value={shirt.playerNumber.number}
            onChange={(e) => setShirtNumber({ number: e.target.value.replace(/[^0-9]/g, '').slice(0, 2) })}
            placeholder="00"
            className="input-field w-24 text-center text-2xl font-bold"
            maxLength={2}
          />
          <div className="flex gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shirt.playerNumber.showFront}
                onChange={(e) => setShirtNumber({ showFront: e.target.checked })}
                className="w-4 h-4 rounded accent-ionic-accent"
              />
              <span className="text-sm text-white/70">Show on Front</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shirt.playerNumber.showBack}
                onChange={(e) => setShirtNumber({ showBack: e.target.checked })}
                className="w-4 h-4 rounded accent-ionic-accent"
              />
              <span className="text-sm text-white/70">Show on Back</span>
            </label>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <label className="text-sm text-white/70">Color:</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={shirt.playerNumber.color}
                onChange={(e) => setShirtNumber({ color: e.target.value })}
                className="w-8 h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
