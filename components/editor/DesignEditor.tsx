'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { Canvas as FabricCanvas, PencilBrush, Circle, Rect, IText, FabricImage, FabricObject } from 'fabric'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useCustomizerStore } from '@/lib/store'
import EditorToolbar from './EditorToolbar'
import EditorLayersPanel from './EditorLayersPanel'
import EditorPropertiesPanel from './EditorPropertiesPanel'
import ShirtModel from '@/components/3d/ShirtModel'
import PantsModel from '@/components/3d/PantsModel'

interface DesignEditorProps {
  onClose: () => void
}

export default function DesignEditor({ onClose }: DesignEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<FabricCanvas | null>(null)
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isRestoringRef = useRef(false)

  const {
    activeProduct,
    shirt,
    pants,
    setDesignFabricJSON,
    setDesignDataUrl,
    setDesignActiveSide,
    setDesignLayers,
  } = useCustomizerStore()

  const currentProduct = activeProduct === 'shirt' ? shirt : pants

  const { activeSide, activeTool, brushConfig, textConfig, shapeConfig } = currentProduct.design

  // Generate unique ID for layers
  const generateId = () => `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Save state to history
  const saveToHistory = useCallback(() => {
    if (!fabricRef.current || isRestoringRef.current) return

    const json = JSON.stringify(fabricRef.current.toJSON())
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(json)
      if (newHistory.length > 50) newHistory.shift()
      return newHistory
    })
    setHistoryIndex((prev) => Math.min(prev + 1, 49))
  }, [historyIndex])

  // Sync canvas to store
  const syncToStore = useCallback(() => {
    if (!fabricRef.current) return

    const json = JSON.stringify(fabricRef.current.toJSON())
    setDesignFabricJSON(activeSide, json)

    // Generate high-res texture with transparency
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = 2048
    tempCanvas.height = 2048
    const tempCtx = tempCanvas.getContext('2d')!

    // Clear with transparent background
    tempCtx.clearRect(0, 0, 2048, 2048)

    // Get the fabric canvas element and draw it scaled up
    const fabricCanvas = fabricRef.current.getElement()
    tempCtx.drawImage(fabricCanvas, 0, 0, 2048, 2048)

    const dataUrl = tempCanvas.toDataURL('image/png')
    setDesignDataUrl(activeSide, dataUrl)

    // Update layers
    const layers = fabricRef.current.getObjects().map((obj, index) => ({
      id: (obj as FabricObject & { data?: { layerId?: string } }).data?.layerId || generateId(),
      name: `${obj.type} ${index + 1}`,
      type: obj.type === 'path' ? 'drawing' : obj.type === 'i-text' ? 'text' : obj.type === 'image' ? 'image' : 'shape',
      visible: obj.visible !== false,
      locked: obj.selectable === false,
    }))
    setDesignLayers(activeSide, layers as any)
  }, [activeSide, setDesignFabricJSON, setDesignDataUrl, setDesignLayers])

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      selection: true,
    })

    fabricRef.current = canvas

    // Load existing design if any
    const existingJSON = currentProduct.design[activeSide].fabricJSON
    if (existingJSON) {
      canvas.loadFromJSON(JSON.parse(existingJSON)).then(() => {
        canvas.renderAll()
        saveToHistory()
      })
    } else {
      saveToHistory()
    }

    // Event listeners
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null)
    })
    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null)
    })
    canvas.on('selection:cleared', () => {
      setSelectedObject(null)
    })

    canvas.on('object:modified', () => {
      syncToStore()
      saveToHistory()
    })
    canvas.on('object:added', () => {
      syncToStore()
    })
    canvas.on('object:removed', () => {
      syncToStore()
      saveToHistory()
    })
    canvas.on('path:created', () => {
      syncToStore()
      saveToHistory()
    })

    return () => {
      canvas.dispose()
    }
  }, [activeSide])

  // Update tool mode
  useEffect(() => {
    if (!fabricRef.current) return
    const canvas = fabricRef.current

    canvas.isDrawingMode = activeTool === 'draw' || activeTool === 'eraser'
    canvas.selection = activeTool === 'select'

    if (activeTool === 'draw') {
      const brush = new PencilBrush(canvas)
      brush.color = brushConfig.color
      brush.width = brushConfig.size
      canvas.freeDrawingBrush = brush
    } else if (activeTool === 'eraser') {
      const brush = new PencilBrush(canvas)
      brush.color = '#ffffff'
      brush.width = brushConfig.size * 2
      canvas.freeDrawingBrush = brush
    }
  }, [activeTool, brushConfig])

  // Add text
  const addText = useCallback(() => {
    if (!fabricRef.current) return

    const text = new IText('Text', {
      left: 250,
      top: 250,
      fontFamily: textConfig.fontFamily,
      fontSize: textConfig.fontSize,
      fill: textConfig.fill,
      stroke: textConfig.stroke || undefined,
      strokeWidth: textConfig.strokeWidth,
      data: { layerId: generateId() },
    })

    fabricRef.current.add(text)
    fabricRef.current.setActiveObject(text)
    fabricRef.current.renderAll()
    saveToHistory()
  }, [textConfig, saveToHistory])

  // Add rectangle
  const addRectangle = useCallback(() => {
    if (!fabricRef.current) return

    const rect = new Rect({
      left: 200,
      top: 200,
      width: 150,
      height: 100,
      fill: shapeConfig.fill,
      stroke: shapeConfig.stroke,
      strokeWidth: shapeConfig.strokeWidth,
      opacity: shapeConfig.opacity,
      data: { layerId: generateId() },
    })

    fabricRef.current.add(rect)
    fabricRef.current.setActiveObject(rect)
    fabricRef.current.renderAll()
    saveToHistory()
  }, [shapeConfig, saveToHistory])

  // Add circle
  const addCircle = useCallback(() => {
    if (!fabricRef.current) return

    const circle = new Circle({
      left: 250,
      top: 250,
      radius: 60,
      fill: shapeConfig.fill,
      stroke: shapeConfig.stroke,
      strokeWidth: shapeConfig.strokeWidth,
      opacity: shapeConfig.opacity,
      data: { layerId: generateId() },
    })

    fabricRef.current.add(circle)
    fabricRef.current.setActiveObject(circle)
    fabricRef.current.renderAll()
    saveToHistory()
  }, [shapeConfig, saveToHistory])

  // Add image
  const addImage = useCallback((dataUrl: string) => {
    if (!fabricRef.current) return

    FabricImage.fromURL(dataUrl).then((img) => {
      img.scaleToWidth(200)
      img.set({
        left: 200,
        top: 200,
        data: { layerId: generateId() },
      })
      fabricRef.current?.add(img)
      fabricRef.current?.setActiveObject(img)
      fabricRef.current?.renderAll()
      saveToHistory()
    })
  }, [saveToHistory])

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        addImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [addImage])

  // Undo
  const undo = useCallback(() => {
    if (historyIndex <= 0 || !fabricRef.current) return

    isRestoringRef.current = true
    const prevState = history[historyIndex - 1]
    fabricRef.current.loadFromJSON(JSON.parse(prevState)).then(() => {
      fabricRef.current?.renderAll()
      isRestoringRef.current = false
      syncToStore()
    })
    setHistoryIndex((prev) => prev - 1)
  }, [history, historyIndex, syncToStore])

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !fabricRef.current) return

    isRestoringRef.current = true
    const nextState = history[historyIndex + 1]
    fabricRef.current.loadFromJSON(JSON.parse(nextState)).then(() => {
      fabricRef.current?.renderAll()
      isRestoringRef.current = false
      syncToStore()
    })
    setHistoryIndex((prev) => prev + 1)
  }, [history, historyIndex, syncToStore])

  // Delete selected
  const deleteSelected = useCallback(() => {
    if (!fabricRef.current) return
    const active = fabricRef.current.getActiveObject()
    if (active) {
      fabricRef.current.remove(active)
      fabricRef.current.renderAll()
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          deleteSelected()
        }
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault()
          if (e.shiftKey) {
            redo()
          } else {
            undo()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [deleteSelected, undo, redo])

  return (
    <div className="fixed inset-0 z-50 bg-ionic-darker flex">
      {/* Left sidebar - Tools */}
      <div className="w-16 bg-ionic-dark border-r border-white/10 p-2 flex flex-col">
        <EditorToolbar
          onAddText={addText}
          onAddRectangle={addRectangle}
          onAddCircle={addCircle}
          onImageUpload={handleImageUpload}
        />
      </div>

      {/* Main canvas area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="h-14 bg-ionic-dark border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setDesignActiveSide('front')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSide === 'front'
                  ? 'bg-ionic-accent text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setDesignActiveSide('back')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSide === 'back'
                  ? 'bg-ionic-accent text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Back
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              ↩️ Undo
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              ↪️ Redo
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={deleteSelected}
              className="px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/10"
            >
              🗑️ Delete
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-ionic-accent text-white hover:bg-ionic-accent-light"
            >
              Done
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center bg-[#1a1a2e] overflow-auto p-8">
          <div className="relative">
            {/* Product template background */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              style={{ zIndex: 0 }}
            >
              <svg
                width="600"
                height="600"
                viewBox="0 0 600 600"
                className="opacity-20"
              >
                {activeProduct === 'shirt' ? (
                  <>
                    {/* Shirt outline */}
                    <path
                      d="M150 80 L100 120 L60 180 L80 200 L120 180 L120 520 L480 520 L480 180 L520 200 L540 180 L500 120 L450 80 L380 80 C380 120 340 150 300 150 C260 150 220 120 220 80 L150 80 Z"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeDasharray="10,5"
                    />
                    {/* Center guide */}
                    <line x1="300" y1="150" x2="300" y2="520" stroke="#ffffff" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                    {/* Chest area guide */}
                    <rect x="150" y="180" width="300" height="200" fill="none" stroke="#4ade80" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                    <text x="300" y="280" textAnchor="middle" fill="#4ade80" fontSize="12" opacity="0.7">Main Design Area</text>
                  </>
                ) : (
                  <>
                    {/* Pants outline */}
                    <path
                      d="M180 60 L180 280 L120 550 L220 550 L260 320 L300 320 L340 550 L480 550 L420 280 L420 60 L180 60 Z"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeDasharray="10,5"
                    />
                    {/* Center guide */}
                    <line x1="300" y1="60" x2="300" y2="320" stroke="#ffffff" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                    {/* Design area guide */}
                    <rect x="200" y="100" width="200" height="150" fill="none" stroke="#4ade80" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                    <text x="300" y="175" textAnchor="middle" fill="#4ade80" fontSize="12" opacity="0.7">Main Design Area</text>
                  </>
                )}
              </svg>
            </div>
            {/* Canvas */}
            <div className="relative bg-transparent rounded-lg shadow-2xl" style={{ zIndex: 1 }}>
              <canvas ref={canvasRef} style={{ backgroundColor: 'transparent' }} />
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="h-10 bg-ionic-dark border-t border-white/10 flex items-center justify-center text-white/40 text-xs gap-4">
          <span>Click to select • Drag to move • Corner handles to resize/rotate</span>
          <span>•</span>
          <span>Delete key to remove • Ctrl+Z undo • Ctrl+Shift+Z redo</span>
        </div>
      </div>

      {/* Right sidebar - Preview, Properties & Layers */}
      <div className="w-80 bg-ionic-dark border-l border-white/10 flex flex-col">
        {/* Live 3D Preview */}
        <div className="p-3 border-b border-white/10">
          <h4 className="text-sm font-medium text-white mb-2">Live Preview</h4>
          <div className="relative bg-ionic-darker rounded-lg overflow-hidden" style={{ height: '220px' }}>
            <Canvas
              camera={{ position: [0, 0, 3], fov: 45 }}
              gl={{ preserveDrawingBuffer: true, antialias: true }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <directionalLight position={[-5, 5, -5]} intensity={0.5} />
              {activeProduct === 'shirt' ? <ShirtModel /> : <PantsModel />}
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={2}
                maxDistance={5}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
              />
              <Environment preset="studio" />
              <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={5} blur={2} />
            </Canvas>
            <div className="absolute bottom-1 left-1 text-white/30 text-[10px]">
              Drag to rotate
            </div>
          </div>
        </div>

        <EditorPropertiesPanel
          selectedObject={selectedObject}
          fabricRef={fabricRef}
          onSync={syncToStore}
        />
        <EditorLayersPanel fabricRef={fabricRef} onSync={syncToStore} />
      </div>
    </div>
  )
}
