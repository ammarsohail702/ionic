'use client'

import { useState } from 'react'
import { useCustomizerStore, CollarType, SleeveType, SleeveDesignType, PatternType } from '@/lib/store'
import ShirtSVG from '@/components/2d/ShirtSVG'
import Link from 'next/link'

const quickColors = [
  '#1e40af', '#3b82f6', '#ef4444', '#22c55e',
  '#000000', '#374151', '#ffffff', '#fbbf24',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
]

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

const sleeveDesigns: { id: SleeveDesignType; name: string }[] = [
  { id: 'solid', name: 'Solid' },
  { id: 'single-stripe', name: '1 Stripe' },
  { id: 'double-stripe', name: '2 Stripes' },
  { id: 'triple-stripe', name: '3 Stripes' },
]

type PanelType = 'colors' | 'style' | 'text'

export default function Customize2DPage() {
  const [view, setView] = useState<'front' | 'back'>('front')
  const [activePanel, setActivePanel] = useState<PanelType>('colors')

  const {
    shirt,
    setShirtPrimaryColor,
    setShirtSecondaryColor,
    setShirtCollarType,
    setShirtCollarColor,
    setShirtSleeveType,
    setShirtSleeveDesign,
    setShirtTeamName,
    setShirtNumber,
  } = useCustomizerStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ionic-accent rounded-lg flex items-center justify-center text-white font-bold">
              I
            </div>
            <span className="text-xl font-bold text-white">IONIC</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/customize"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              3D View
            </Link>
            <span className="text-ionic-accent text-sm font-medium">2D View</span>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setView('front')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'front'
                  ? 'bg-ionic-accent text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setView('back')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'back'
                  ? 'bg-ionic-accent text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Back
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Controls */}
        <div className="w-96 bg-black/20 border-r border-white/10 overflow-y-auto">
          {/* Panel Tabs */}
          <div className="flex border-b border-white/10">
            {(['colors', 'style', 'text'] as PanelType[]).map((panel) => (
              <button
                key={panel}
                onClick={() => setActivePanel(panel)}
                className={`flex-1 py-4 text-sm font-medium transition-all ${
                  activePanel === panel
                    ? 'text-ionic-accent border-b-2 border-ionic-accent'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {panel.charAt(0).toUpperCase() + panel.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            {/* Colors Panel */}
            {activePanel === 'colors' && (
              <>
                {/* Body Color */}
                <div>
                  <label className="block text-sm text-white/70 mb-3">Body Color</label>
                  <div className="flex flex-wrap gap-2">
                    {quickColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setShirtPrimaryColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          shirt.primaryColor === color
                            ? 'border-ionic-accent scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={shirt.primaryColor}
                      onChange={(e) => setShirtPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Sleeve Color */}
                <div>
                  <label className="block text-sm text-white/70 mb-3">Sleeve Color</label>
                  <div className="flex flex-wrap gap-2">
                    {quickColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setShirtSleeveDesign({ color })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          shirt.sleeveDesign.color === color
                            ? 'border-ionic-accent scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={shirt.sleeveDesign.color}
                      onChange={(e) => setShirtSleeveDesign({ color: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Collar Color */}
                <div>
                  <label className="block text-sm text-white/70 mb-3">Collar Color</label>
                  <div className="flex flex-wrap gap-2">
                    {quickColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setShirtCollarColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          shirt.collarColor === color
                            ? 'border-ionic-accent scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={shirt.collarColor}
                      onChange={(e) => setShirtCollarColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-sm text-white/70 mb-3">Accent Color (Cuffs & Hem)</label>
                  <div className="flex flex-wrap gap-2">
                    {quickColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setShirtSecondaryColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          shirt.secondaryColor === color
                            ? 'border-ionic-accent scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={shirt.secondaryColor}
                      onChange={(e) => setShirtSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Style Panel */}
            {activePanel === 'style' && (
              <>
                {/* Collar Type */}
                <div>
                  <label className="block text-sm text-white/70 mb-3">Collar Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {collarTypes.map((collar) => (
                      <button
                        key={collar.id}
                        onClick={() => setShirtCollarType(collar.id)}
                        className={`py-3 px-4 rounded-lg text-sm transition-all ${
                          shirt.collarType === collar.id
                            ? 'bg-ionic-accent text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {collar.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sleeve Length */}
                <div>
                  <label className="block text-sm text-white/70 mb-3">Sleeve Length</label>
                  <div className="grid grid-cols-2 gap-2">
                    {sleeveTypes.map((sleeve) => (
                      <button
                        key={sleeve.id}
                        onClick={() => setShirtSleeveType(sleeve.id)}
                        className={`py-3 px-4 rounded-lg text-sm transition-all ${
                          shirt.sleeveType === sleeve.id
                            ? 'bg-ionic-accent text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {sleeve.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sleeve Design */}
                <div>
                  <label className="block text-sm text-white/70 mb-3">Sleeve Design</label>
                  <div className="grid grid-cols-2 gap-2">
                    {sleeveDesigns.map((design) => (
                      <button
                        key={design.id}
                        onClick={() => setShirtSleeveDesign({ design: design.id })}
                        className={`py-3 px-4 rounded-lg text-sm transition-all ${
                          shirt.sleeveDesign.design === design.id
                            ? 'bg-ionic-accent text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {design.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stripe Color (only if stripes selected) */}
                {shirt.sleeveDesign.design !== 'solid' && (
                  <div>
                    <label className="block text-sm text-white/70 mb-3">Stripe Color</label>
                    <div className="flex flex-wrap gap-2">
                      {quickColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setShirtSleeveDesign({ stripeColor: color })}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            shirt.sleeveDesign.stripeColor === color
                              ? 'border-ionic-accent scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input
                        type="color"
                        value={shirt.sleeveDesign.stripeColor}
                        onChange={(e) => setShirtSleeveDesign({ stripeColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Text Panel */}
            {activePanel === 'text' && (
              <>
                {/* Team Name */}
                <div>
                  <label className="block text-sm text-white/70 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={shirt.teamName.content}
                    onChange={(e) => setShirtTeamName({ content: e.target.value })}
                    placeholder="Enter team name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-ionic-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Name Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShirtTeamName({ position: 'front' })}
                      className={`py-3 px-4 rounded-lg text-sm transition-all ${
                        shirt.teamName.position === 'front'
                          ? 'bg-ionic-accent text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      Front
                    </button>
                    <button
                      onClick={() => setShirtTeamName({ position: 'back' })}
                      className={`py-3 px-4 rounded-lg text-sm transition-all ${
                        shirt.teamName.position === 'back'
                          ? 'bg-ionic-accent text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      Back
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Name Color</label>
                  <div className="flex flex-wrap gap-2">
                    {quickColors.slice(0, 8).map((color) => (
                      <button
                        key={color}
                        onClick={() => setShirtTeamName({ color })}
                        className={`w-8 h-8 rounded-md border-2 transition-all ${
                          shirt.teamName.color === color
                            ? 'border-ionic-accent scale-110'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Player Number */}
                <div className="pt-4 border-t border-white/10">
                  <label className="block text-sm text-white/70 mb-2">Player Number</label>
                  <input
                    type="text"
                    value={shirt.playerNumber.number}
                    onChange={(e) => setShirtNumber({ number: e.target.value.slice(0, 2) })}
                    placeholder="00"
                    maxLength={2}
                    className="w-24 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center text-2xl font-bold placeholder-white/40 focus:outline-none focus:border-ionic-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Show Number On</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white/70">
                      <input
                        type="checkbox"
                        checked={shirt.playerNumber.showFront}
                        onChange={(e) => setShirtNumber({ showFront: e.target.checked })}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-ionic-accent focus:ring-ionic-accent"
                      />
                      Front
                    </label>
                    <label className="flex items-center gap-2 text-white/70">
                      <input
                        type="checkbox"
                        checked={shirt.playerNumber.showBack}
                        onChange={(e) => setShirtNumber({ showBack: e.target.checked })}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-ionic-accent focus:ring-ionic-accent"
                      />
                      Back
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Number Color</label>
                  <div className="flex flex-wrap gap-2">
                    {quickColors.slice(0, 8).map((color) => (
                      <button
                        key={color}
                        onClick={() => setShirtNumber({ color })}
                        className={`w-8 h-8 rounded-md border-2 transition-all ${
                          shirt.playerNumber.color === color
                            ? 'border-ionic-accent scale-110'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          <div className="relative">
            {/* Shirt Preview */}
            <div className="transition-all duration-300">
              <ShirtSVG view={view} width={450} height={550} />
            </div>

            {/* View indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-sm">
              {view === 'front' ? 'Front View' : 'Back View'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
