'use client'

import { useRef, useState } from 'react'
import { useCustomizerStore, EditorToolType } from '@/lib/store'

interface EditorToolbarProps {
  onAddText: () => void
  onAddRectangle: () => void
  onAddCircle: () => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const tools: { id: EditorToolType; icon: string; name: string }[] = [
  { id: 'select', icon: '↖', name: 'Select' },
  { id: 'draw', icon: '✏️', name: 'Draw' },
  { id: 'eraser', icon: '🧽', name: 'Eraser' },
]

export default function EditorToolbar({
  onAddText,
  onAddRectangle,
  onAddCircle,
  onImageUpload,
}: EditorToolbarProps) {
  const { shirt, setDesignActiveTool, setDesignBrushConfig } = useCustomizerStore()
  const { activeTool, brushConfig } = shirt.design
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [showShapeMenu, setShowShapeMenu] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      {/* Main tools */}
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setDesignActiveTool(tool.id)}
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg transition-all ${
            activeTool === tool.id
              ? 'bg-ionic-accent text-white'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
          title={tool.name}
        >
          {tool.icon}
        </button>
      ))}

      <div className="border-t border-white/10 my-2" />

      {/* Text tool */}
      <button
        onClick={() => {
          setDesignActiveTool('text')
          onAddText()
        }}
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg transition-all ${
          activeTool === 'text'
            ? 'bg-ionic-accent text-white'
            : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}
        title="Add Text"
      >
        T
      </button>

      {/* Shape tool */}
      <div className="relative">
        <button
          onClick={() => setShowShapeMenu(!showShapeMenu)}
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg transition-all ${
            activeTool === 'shape'
              ? 'bg-ionic-accent text-white'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
          title="Add Shape"
        >
          ⬜
        </button>

        {showShapeMenu && (
          <div className="absolute left-14 top-0 bg-ionic-dark border border-white/10 rounded-lg p-2 flex flex-col gap-1 z-10">
            <button
              onClick={() => {
                onAddRectangle()
                setShowShapeMenu(false)
                setDesignActiveTool('select')
              }}
              className="px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded flex items-center gap-2"
            >
              ⬜ Rectangle
            </button>
            <button
              onClick={() => {
                onAddCircle()
                setShowShapeMenu(false)
                setDesignActiveTool('select')
              }}
              className="px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded flex items-center gap-2"
            >
              ⚪ Circle
            </button>
          </div>
        )}
      </div>

      {/* Image upload */}
      <button
        onClick={() => imageInputRef.current?.click()}
        className="w-12 h-12 rounded-lg flex items-center justify-center text-lg text-white/60 hover:bg-white/10 hover:text-white transition-all"
        title="Upload Image"
      >
        🖼
      </button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />

      <div className="border-t border-white/10 my-2" />

      {/* Brush size (when draw/eraser active) */}
      {(activeTool === 'draw' || activeTool === 'eraser') && (
        <div className="px-1">
          <label className="text-white/50 text-xs block mb-1 text-center">Size</label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushConfig.size}
            onChange={(e) => setDesignBrushConfig({ size: parseInt(e.target.value) })}
            className="w-full"
          />
          <span className="text-white/50 text-xs block text-center">{brushConfig.size}px</span>
        </div>
      )}

      {/* Brush color (when draw active) */}
      {activeTool === 'draw' && (
        <div className="px-1 mt-2">
          <label className="text-white/50 text-xs block mb-1 text-center">Color</label>
          <input
            type="color"
            value={brushConfig.color}
            onChange={(e) => setDesignBrushConfig({ color: e.target.value })}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}
