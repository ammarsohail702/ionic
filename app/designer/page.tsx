'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useProduct2DStore } from '@/lib/store2d'
import { productCatalog } from '@/lib/products2d'
import ThemeToggle from '@/components/ThemeToggle'

// Dynamically import the canvas editor to avoid SSR issues
const ProductCanvas2D = dynamic(() => import('@/components/designer/ProductCanvas2D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="w-12 h-12 border-4 border-ionic-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

const ProductSelector = dynamic(() => import('@/components/designer/ProductSelector'), {
  ssr: false,
})

type ToolId = 'select' | 'text' | 'upload' | 'names' | 'shapes'

interface Tool {
  id: ToolId
  name: string
  icon: React.ReactNode
}

const tools: Tool[] = [
  {
    id: 'select',
    name: 'Product',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    id: 'upload',
    name: 'Upload',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    id: 'text',
    name: 'Text',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 19.5h15M12 3v13.5m0 0l-3-3m3 3l3-3" />
        <text x="8" y="10" fontSize="10" fontWeight="bold" fill="currentColor">A</text>
      </svg>
    ),
  },
  {
    id: 'names',
    name: 'Names & Numbers',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <text x="3" y="12" fontSize="8" fontWeight="bold" fill="currentColor">TEAM</text>
        <text x="6" y="20" fontSize="10" fontWeight="bold" fill="currentColor">00</text>
      </svg>
    ),
  },
  {
    id: 'shapes',
    name: 'Shapes',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM16.5 13.5a3 3 0 100 6 3 3 0 000-6z" />
      </svg>
    ),
  },
]

export default function Designer2DPage() {
  const {
    selectedProduct,
    selectedColor,
    currentViewIndex,
    activeTool,
    setActiveTool,
    nextView,
    prevView,
    undo,
    redo,
    history,
    historyIndex,
  } = useProduct2DStore()

  const [showProductSelector, setShowProductSelector] = useState(false)
  const [showTextPanel, setShowTextPanel] = useState(false)
  const [showUploadPanel, setShowUploadPanel] = useState(false)
  const [showNamesPanel, setShowNamesPanel] = useState(false)
  const [showShapesPanel, setShowShapesPanel] = useState(false)

  const currentView = selectedProduct.views[currentViewIndex]
  const prevViewData = selectedProduct.views[currentViewIndex === 0 ? selectedProduct.views.length - 1 : currentViewIndex - 1]
  const nextViewData = selectedProduct.views[(currentViewIndex + 1) % selectedProduct.views.length]

  const handleToolClick = (toolId: ToolId) => {
    setActiveTool(toolId)
    if (toolId === 'select') {
      setShowProductSelector(true)
    } else if (toolId === 'text') {
      setShowTextPanel(true)
    } else if (toolId === 'upload') {
      setShowUploadPanel(true)
    } else if (toolId === 'names') {
      setShowNamesPanel(true)
    } else if (toolId === 'shapes') {
      setShowShapesPanel(true)
    }
  }

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header with stepper */}
      <header className="border-b transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-full mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-ionic-accent to-ionic-accent-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>AICONZ</span>
            </Link>

            {/* Stepper */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-ionic-accent text-white flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-ionic-accent font-medium">CREATE</span>
              </div>
              <div className="w-24 h-0.5" style={{ backgroundColor: 'var(--border-color)' }} />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-muted)' }}>2</div>
                <span style={{ color: 'var(--text-muted)' }}>TEAM FEATURES</span>
              </div>
              <div className="w-24 h-0.5" style={{ backgroundColor: 'var(--border-color)' }} />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-muted)' }}>3</div>
                <span style={{ color: 'var(--text-muted)' }}>PRICE</span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/customize" className="text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>
                Switch to 3D Mode
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Left Toolbar */}
        <div className="w-20 border-r flex flex-col items-center py-4 gap-1 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`w-16 py-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeTool === tool.id ? 'bg-ionic-accent text-white' : ''
              }`}
              style={activeTool !== tool.id ? { color: 'var(--text-secondary)' } : undefined}
            >
              {tool.icon}
              <span className="text-[10px] font-medium text-center leading-tight">{tool.name}</span>
            </button>
          ))}

          <div className="flex-1" />

          {/* Zoom control */}
          <button
            className="w-16 py-3 rounded-lg flex flex-col items-center gap-1 transition-all"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
            <span className="text-[10px] font-medium">Zoom</span>
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative flex items-center justify-center p-8" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          {/* Previous view button */}
          <button
            onClick={prevView}
            className="absolute left-8 flex flex-col items-center gap-2 transition-all hover:scale-105"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <svg className="w-6 h-6" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{prevViewData.name}</span>
          </button>

          {/* Product Canvas */}
          <div className="w-full max-w-2xl aspect-square">
            <ProductCanvas2D />
          </div>

          {/* Next view button */}
          <button
            onClick={nextView}
            className="absolute right-8 flex flex-col items-center gap-2 transition-all hover:scale-105"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <svg className="w-6 h-6" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{nextViewData.name}</span>
          </button>
        </div>

        {/* Right Toolbar - Undo/Redo */}
        <div className="w-20 border-l flex flex-col items-center py-4 gap-1 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`w-16 py-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
              !canUndo ? 'opacity-40 cursor-not-allowed' : 'hover:bg-ionic-accent/10'
            }`}
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            <span className="text-[10px] font-medium">Undo</span>
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className={`w-16 py-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
              !canRedo ? 'opacity-40 cursor-not-allowed' : 'hover:bg-ionic-accent/10'
            }`}
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
            </svg>
            <span className="text-[10px] font-medium">Redo</span>
          </button>
        </div>
      </div>

      {/* Bottom Bar - Product Selection */}
      <div className="h-24 border-t flex items-center px-6 gap-4 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        {/* Add Product Button */}
        <button
          onClick={() => setShowProductSelector(true)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-ionic-accent/10"
          style={{ color: 'var(--text-secondary)' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm font-medium">Add Product</span>
        </button>

        {/* Divider */}
        <div className="w-px h-12" style={{ backgroundColor: 'var(--border-color)' }} />

        {/* Current Product */}
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center border-2 border-ionic-accent"
            style={{ backgroundColor: selectedColor }}
          >
            {/* Product thumbnail placeholder */}
            <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <div>
            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{selectedProduct.name}</div>
            {/* Color selector */}
            <div className="flex gap-1 mt-1">
              {selectedProduct.colors.slice(0, 6).map((color) => (
                <button
                  key={color}
                  onClick={() => useProduct2DStore.getState().setSelectedColor(color)}
                  className={`w-4 h-4 rounded-full border ${
                    selectedColor === color ? 'ring-2 ring-ionic-accent ring-offset-1' : ''
                  }`}
                  style={{ backgroundColor: color, borderColor: color === '#ffffff' ? '#ddd' : 'transparent' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <button className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save
        </button>
        <button className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 bg-ionic-accent hover:bg-ionic-accent-light text-white transition-all">
          Next
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      {/* Product Selector Modal */}
      {showProductSelector && (
        <ProductSelector onClose={() => setShowProductSelector(false)} />
      )}

      {/* Text Panel */}
      {showTextPanel && (
        <TextPanel onClose={() => setShowTextPanel(false)} />
      )}

      {/* Upload Panel */}
      {showUploadPanel && (
        <UploadPanel onClose={() => setShowUploadPanel(false)} />
      )}

      {/* Names Panel */}
      {showNamesPanel && (
        <NamesPanel onClose={() => setShowNamesPanel(false)} />
      )}

      {/* Shapes Panel */}
      {showShapesPanel && (
        <ShapesPanel onClose={() => setShowShapesPanel(false)} />
      )}
    </div>
  )
}

// Text Panel Component
function TextPanel({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('')
  const [fontFamily, setFontFamily] = useState('Inter')
  const [fontSize, setFontSize] = useState(48)
  const [textColor, setTextColor] = useState('#000000')

  const fonts = ['Inter', 'Arial', 'Times New Roman', 'Roboto', 'Montserrat', 'Poppins', 'Bebas Neue', 'Anton']

  const handleAddText = () => {
    // Dispatch event to canvas
    window.dispatchEvent(new CustomEvent('addText2D', {
      detail: { text, fontFamily, fontSize, fill: textColor }
    }))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-96 rounded-xl p-6 shadow-2xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Add Text</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text..."
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Font</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            >
              {fonts.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Size</label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent"
                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-12 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddText}
              disabled={!text.trim()}
              className="flex-1 py-3 rounded-lg font-medium bg-ionic-accent text-white hover:bg-ionic-accent-light transition-all disabled:opacity-50"
            >
              Add Text
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Upload Panel Component
function UploadPanel({ onClose }: { onClose: () => void }) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      window.dispatchEvent(new CustomEvent('addImage2D', {
        detail: { dataUrl: reader.result as string }
      }))
      onClose()
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-96 rounded-xl p-6 shadow-2xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Upload Image</h3>

        <label className="block cursor-pointer">
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center transition-colors hover:border-ionic-accent"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <svg className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p style={{ color: 'var(--text-secondary)' }}>Click to upload or drag and drop</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>PNG, JPG, SVG up to 10MB</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-lg font-medium transition-all"
          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// Names & Numbers Panel Component
function NamesPanel({ onClose }: { onClose: () => void }) {
  const [teamName, setTeamName] = useState('')
  const [playerNumber, setPlayerNumber] = useState('')

  const handleAdd = () => {
    if (teamName.trim()) {
      window.dispatchEvent(new CustomEvent('addText2D', {
        detail: { text: teamName, fontFamily: 'Arial', fontSize: 36, fill: '#000000', isName: true }
      }))
    }
    if (playerNumber.trim()) {
      window.dispatchEvent(new CustomEvent('addText2D', {
        detail: { text: playerNumber, fontFamily: 'Arial', fontSize: 72, fill: '#000000', isNumber: true }
      }))
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-96 rounded-xl p-6 shadow-2xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Names & Numbers</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Team/Player Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value.toUpperCase())}
              placeholder="SMITH"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent uppercase"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Player Number</label>
            <input
              type="text"
              value={playerNumber}
              onChange={(e) => setPlayerNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
              placeholder="10"
              maxLength={2}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ionic-accent text-center text-2xl font-bold"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!teamName.trim() && !playerNumber.trim()}
              className="flex-1 py-3 rounded-lg font-medium bg-ionic-accent text-white hover:bg-ionic-accent-light transition-all disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Shapes Panel Component
function ShapesPanel({ onClose }: { onClose: () => void }) {
  const [shapeColor, setShapeColor] = useState('#000000')
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [fillEnabled, setFillEnabled] = useState(true)

  const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: '▭' },
    { id: 'circle', name: 'Circle', icon: '○' },
    { id: 'triangle', name: 'Triangle', icon: '△' },
    { id: 'star', name: 'Star', icon: '☆' },
    { id: 'heart', name: 'Heart', icon: '♡' },
    { id: 'arrow', name: 'Arrow', icon: '→' },
    { id: 'line', name: 'Line', icon: '―' },
    { id: 'polygon', name: 'Hexagon', icon: '⬡' },
  ]

  const handleAddShape = (shapeType: string) => {
    window.dispatchEvent(new CustomEvent('addShape2D', {
      detail: {
        type: shapeType,
        fill: fillEnabled ? shapeColor : 'transparent',
        stroke: strokeColor,
        strokeWidth
      }
    }))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-[450px] rounded-xl p-6 shadow-2xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Add Shape</h3>

        {/* Shape Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {shapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => handleAddShape(shape.id)}
              className="aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:bg-ionic-accent hover:text-white group"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            >
              <span className="text-3xl">{shape.icon}</span>
              <span className="text-xs">{shape.name}</span>
            </button>
          ))}
        </div>

        {/* Shape Options */}
        <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fillEnabled}
                onChange={(e) => setFillEnabled(e.target.checked)}
                className="w-4 h-4 rounded accent-ionic-accent"
              />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Fill</span>
            </label>
            {fillEnabled && (
              <input
                type="color"
                value={shapeColor}
                onChange={(e) => setShapeColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stroke</span>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="10"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="flex-1 accent-ionic-accent"
            />
            <span className="text-sm w-8" style={{ color: 'var(--text-muted)' }}>{strokeWidth}px</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-lg font-medium transition-all"
          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
