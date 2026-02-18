'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useCustomizerStore } from '@/lib/store'

const DesignEditor = dynamic(() => import('@/components/editor/DesignEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-ionic-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function EditorPanel() {
  const { activeProduct } = useCustomizerStore()
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const productName = activeProduct === 'shirt' ? 'shirt' : 'pants'

  return (
    <>
      <div className="glass-panel p-4">
        <h3 className="text-lg font-semibold mb-4 text-white">Design Editor</h3>

        <div className="space-y-4">
          <p className="text-white/60 text-sm">
            Create custom designs with drawing tools, text, shapes, and images. Your designs will appear on the 3D {productName} in real-time.
          </p>

          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-2xl block mb-1">✏️</span>
              <span className="text-white/70">Draw</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-2xl block mb-1">T</span>
              <span className="text-white/70">Text</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-2xl block mb-1">⬜</span>
              <span className="text-white/70">Shapes</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-2xl block mb-1">🖼</span>
              <span className="text-white/70">Images</span>
            </div>
          </div>

          <button
            onClick={() => setIsEditorOpen(true)}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            <span>✏️</span>
            Open Design Editor
          </button>
        </div>
      </div>

      {isEditorOpen && <DesignEditor onClose={() => setIsEditorOpen(false)} />}
    </>
  )
}
