'use client'

import { useCallback, useEffect, useState } from 'react'
import { Canvas as FabricCanvas, FabricObject, IText, Rect, Circle } from 'fabric'
import { useCustomizerStore } from '@/lib/store'

const GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Poppins',
  'Oswald',
  'Bebas Neue',
  'Anton',
  'Racing Sans One',
  'Black Ops One',
]

interface EditorPropertiesPanelProps {
  selectedObject: FabricObject | null
  fabricRef: React.MutableRefObject<FabricCanvas | null>
  onSync: () => void
}

export default function EditorPropertiesPanel({
  selectedObject,
  fabricRef,
  onSync,
}: EditorPropertiesPanelProps) {
  const { shirt, setDesignTextConfig, setDesignShapeConfig } = useCustomizerStore()
  const { textConfig, shapeConfig } = shirt.design

  const [localProps, setLocalProps] = useState({
    fill: '',
    stroke: '',
    strokeWidth: 0,
    fontSize: 48,
    fontFamily: 'Inter',
    opacity: 1,
  })

  // Load fonts
  useEffect(() => {
    GOOGLE_FONTS.forEach((font) => {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}&display=swap`
      link.rel = 'stylesheet'
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link)
      }
    })
  }, [])

  // Update local props when selection changes
  useEffect(() => {
    if (selectedObject) {
      setLocalProps({
        fill: (selectedObject.fill as string) || '#000000',
        stroke: (selectedObject.stroke as string) || '',
        strokeWidth: selectedObject.strokeWidth || 0,
        fontSize: (selectedObject as IText).fontSize || 48,
        fontFamily: (selectedObject as IText).fontFamily || 'Inter',
        opacity: selectedObject.opacity ?? 1,
      })
    }
  }, [selectedObject])

  const updateProperty = useCallback(
    (key: string, value: any) => {
      if (!selectedObject || !fabricRef.current) return

      selectedObject.set(key as keyof FabricObject, value)
      fabricRef.current.renderAll()
      onSync()

      setLocalProps((prev) => ({ ...prev, [key]: value }))

      // Also update store config
      if (selectedObject.type === 'i-text') {
        if (key === 'fill') setDesignTextConfig({ fill: value })
        if (key === 'fontSize') setDesignTextConfig({ fontSize: value })
        if (key === 'fontFamily') setDesignTextConfig({ fontFamily: value })
      } else if (selectedObject.type === 'rect' || selectedObject.type === 'circle') {
        if (key === 'fill') setDesignShapeConfig({ fill: value })
        if (key === 'stroke') setDesignShapeConfig({ stroke: value })
        if (key === 'strokeWidth') setDesignShapeConfig({ strokeWidth: value })
        if (key === 'opacity') setDesignShapeConfig({ opacity: value })
      }
    },
    [selectedObject, fabricRef, onSync, setDesignTextConfig, setDesignShapeConfig]
  )

  const isText = selectedObject?.type === 'i-text'
  const isShape = selectedObject?.type === 'rect' || selectedObject?.type === 'circle'
  const isImage = selectedObject?.type === 'image'

  return (
    <div className="p-3 min-h-[200px]">
      <h4 className="text-sm font-medium text-white mb-3">Properties</h4>

      {!selectedObject ? (
        <p className="text-white/40 text-xs">Select an object to edit its properties</p>
      ) : (
        <div className="space-y-4">
          {/* Text properties */}
          {isText && (
            <>
              <div>
                <label className="text-white/60 text-xs block mb-1">Font Family</label>
                <select
                  value={localProps.fontFamily}
                  onChange={(e) => updateProperty('fontFamily', e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded px-2 py-1.5 text-white text-sm"
                  style={{ fontFamily: localProps.fontFamily }}
                >
                  {GOOGLE_FONTS.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/60 text-xs block mb-1">Font Size</label>
                <input
                  type="number"
                  min="8"
                  max="200"
                  value={localProps.fontSize}
                  onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
                  className="w-full bg-white/10 border border-white/10 rounded px-2 py-1.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-white/60 text-xs block mb-1">Text Color</label>
                <input
                  type="color"
                  value={localProps.fill}
                  onChange={(e) => updateProperty('fill', e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
            </>
          )}

          {/* Shape properties */}
          {isShape && (
            <>
              <div>
                <label className="text-white/60 text-xs block mb-1">Fill Color</label>
                <input
                  type="color"
                  value={localProps.fill}
                  onChange={(e) => updateProperty('fill', e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-white/60 text-xs block mb-1">Stroke Color</label>
                <input
                  type="color"
                  value={localProps.stroke || '#000000'}
                  onChange={(e) => updateProperty('stroke', e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-white/60 text-xs block mb-1">Stroke Width</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={localProps.strokeWidth}
                  onChange={(e) => updateProperty('strokeWidth', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-white/50 text-xs">{localProps.strokeWidth}px</span>
              </div>
            </>
          )}

          {/* Common opacity */}
          {(isText || isShape || isImage) && (
            <div>
              <label className="text-white/60 text-xs block mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localProps.opacity}
                onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-white/50 text-xs">{Math.round(localProps.opacity * 100)}%</span>
            </div>
          )}

          {/* Object type indicator */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-white/40 text-xs">
              Type: {selectedObject.type}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
