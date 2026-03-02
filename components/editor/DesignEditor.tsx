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

  // Save state to history - use ref for historyIndex to avoid stale closures
  const historyIndexRef = useRef(historyIndex)
  historyIndexRef.current = historyIndex

  const saveToHistory = useCallback(() => {
    if (!fabricRef.current || isRestoringRef.current) return

    const json = JSON.stringify(fabricRef.current.toJSON())
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndexRef.current + 1)
      newHistory.push(json)
      if (newHistory.length > 50) newHistory.shift()
      return newHistory
    })
    setHistoryIndex((prev) => Math.min(prev + 1, 49))
  }, [])

  // Sync canvas to store for a specific side
  const syncToStoreForSide = useCallback((side: 'front' | 'back') => {
    if (!fabricRef.current) return

    const json = JSON.stringify(fabricRef.current.toJSON())
    setDesignFabricJSON(side, json)

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
    setDesignDataUrl(side, dataUrl)

    // Update layers
    const layers = fabricRef.current.getObjects().map((obj, index) => ({
      id: (obj as FabricObject & { data?: { layerId?: string } }).data?.layerId || generateId(),
      name: `${obj.type} ${index + 1}`,
      type: obj.type === 'path' ? 'drawing' : obj.type === 'i-text' ? 'text' : obj.type === 'image' ? 'image' : 'shape',
      visible: obj.visible !== false,
      locked: obj.selectable === false,
    }))
    setDesignLayers(side, layers as any)
  }, [setDesignFabricJSON, setDesignDataUrl, setDesignLayers])

  // Use refs to always have access to current values in event handlers
  const activeSideRef = useRef(activeSide)
  activeSideRef.current = activeSide

  const syncToStoreRef = useRef(syncToStoreForSide)
  syncToStoreRef.current = syncToStoreForSide

  // Sync function that uses refs to always get current values
  const syncToStore = useCallback(() => {
    syncToStoreRef.current(activeSideRef.current)
  }, [])

  // Switch side with proper save/load
  const handleSwitchSide = useCallback((newSide: 'front' | 'back') => {
    if (newSide === activeSide) return

    // Save current canvas state to current side before switching
    if (fabricRef.current) {
      syncToStoreForSide(activeSide)
    }

    // Switch to new side - canvas will be reinitialized via useEffect
    setDesignActiveSide(newSide)
  }, [activeSide, syncToStoreForSide, setDesignActiveSide])

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    // Reset history for new side
    setHistory([])
    setHistoryIndex(-1)
    setSelectedObject(null)

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
        // Save initial state to history
        const json = JSON.stringify(canvas.toJSON())
        setHistory([json])
        setHistoryIndex(0)
      })
    } else {
      // Save empty state to history
      const json = JSON.stringify(canvas.toJSON())
      setHistory([json])
      setHistoryIndex(0)
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

  // Get design zone center based on product and side
  const getDesignZoneCenter = useCallback(() => {
    if (activeProduct === 'shirt') {
      // Front chest is upper-left, Back is upper-right
      return activeSide === 'front' ? { left: 160, top: 220 } : { left: 440, top: 220 }
    } else {
      // Pants zones
      return activeSide === 'front' ? { left: 300, top: 140 } : { left: 300, top: 140 }
    }
  }, [activeProduct, activeSide])

  // Add text - place in main design zone
  const addText = useCallback(() => {
    if (!fabricRef.current) return

    const designZoneCenter = getDesignZoneCenter()

    const text = new IText('Text', {
      left: designZoneCenter.left,
      top: designZoneCenter.top,
      originX: 'center',
      originY: 'center',
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
    syncToStore()
    saveToHistory()
  }, [textConfig, saveToHistory, syncToStore, getDesignZoneCenter])

  // Add rectangle - place in main design zone
  const addRectangle = useCallback(() => {
    if (!fabricRef.current) return

    const designZoneCenter = getDesignZoneCenter()

    const rect = new Rect({
      left: designZoneCenter.left - 75,
      top: designZoneCenter.top - 50,
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
    syncToStore()
    saveToHistory()
  }, [shapeConfig, saveToHistory, syncToStore, getDesignZoneCenter])

  // Add circle - place in main design zone
  const addCircle = useCallback(() => {
    if (!fabricRef.current) return

    const designZoneCenter = getDesignZoneCenter()

    const circle = new Circle({
      left: designZoneCenter.left - 60,
      top: designZoneCenter.top - 60,
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
    syncToStore()
    saveToHistory()
  }, [shapeConfig, saveToHistory, syncToStore, getDesignZoneCenter])

  // Add image - place in main design zone
  const addImage = useCallback((dataUrl: string) => {
    if (!fabricRef.current) return

    const designZoneCenter = getDesignZoneCenter()

    FabricImage.fromURL(dataUrl).then((img) => {
      img.scaleToWidth(150)
      img.set({
        left: designZoneCenter.left,
        top: designZoneCenter.top,
        originX: 'center',
        originY: 'center',
        data: { layerId: generateId() },
      })
      fabricRef.current?.add(img)
      fabricRef.current?.setActiveObject(img)
      fabricRef.current?.renderAll()
      // Immediately sync to store so design appears on 3D model
      syncToStore()
      saveToHistory()
    })
  }, [saveToHistory, syncToStore, getDesignZoneCenter])

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
          <div className="flex items-center gap-4">
            {/* Side switcher */}
            <div className="flex bg-ionic-darker rounded-lg p-1">
              <button
                onClick={() => handleSwitchSide('front')}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                  activeSide === 'front'
                    ? 'bg-ionic-accent text-white shadow-lg'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Front Side
              </button>
              <button
                onClick={() => handleSwitchSide('back')}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                  activeSide === 'back'
                    ? 'bg-ionic-accent text-white shadow-lg'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Back Side
              </button>
            </div>
            {/* Current side indicator */}
            <span className="text-white/70 text-sm">
              Editing: <span className="text-ionic-accent font-semibold uppercase">{activeSide}</span>
            </span>
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
            {/* Side indicator badge */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
              <div className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                activeSide === 'front'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
              }`}>
                {activeSide} Design
              </div>
            </div>
            {/* Product template background - UV mapped zones */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 0 }}
            >
              <svg
                width="600"
                height="600"
                viewBox="0 0 600 600"
                className="opacity-40"
              >
                {activeProduct === 'shirt' ? (
                  activeSide === 'front' ? (
                    <>
                      {/* FRONT - UV Layout based on actual GLB model */}
                      {/* FRONT CHEST - positioned in upper-left based on typical shirt UV */}
                      <rect x="40" y="80" width="240" height="280" fill="none" stroke="#4ade80" strokeWidth="2" strokeDasharray="6,4" />
                      <rect x="40" y="80" width="240" height="280" fill="#4ade80" opacity="0.08" />
                      <text x="160" y="200" textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="bold">FRONT CHEST</text>
                      <text x="160" y="220" textAnchor="middle" fill="#4ade80" fontSize="11">Place design here</text>

                      {/* Center area - typically side/seam */}
                      <rect x="300" y="80" width="120" height="280" fill="none" stroke="#666" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="360" y="220" textAnchor="middle" fill="#666" fontSize="9">Side</text>

                      {/* Right area - back wraps here */}
                      <rect x="440" y="80" width="140" height="280" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="510" y="220" textAnchor="middle" fill="#888" fontSize="9">Back area</text>

                      {/* Sleeves at bottom */}
                      <rect x="40" y="400" width="200" height="160" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="140" y="480" textAnchor="middle" fill="#666" fontSize="10">Sleeves</text>
                    </>
                  ) : (
                    <>
                      {/* BACK - UV Layout */}
                      {/* BACK - positioned based on UV wrap */}
                      <rect x="320" y="80" width="240" height="280" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="6,4" />
                      <rect x="320" y="80" width="240" height="280" fill="#a855f7" opacity="0.08" />
                      <text x="440" y="200" textAnchor="middle" fill="#a855f7" fontSize="14" fontWeight="bold">BACK</text>
                      <text x="440" y="220" textAnchor="middle" fill="#a855f7" fontSize="11">Place design here</text>

                      {/* Left area - front wraps here */}
                      <rect x="40" y="80" width="140" height="280" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="110" y="220" textAnchor="middle" fill="#888" fontSize="9">Front area</text>

                      {/* Center - side/seam */}
                      <rect x="200" y="80" width="100" height="280" fill="none" stroke="#666" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="250" y="220" textAnchor="middle" fill="#666" fontSize="9">Side</text>

                      {/* Sleeves at bottom */}
                      <rect x="360" y="400" width="200" height="160" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="460" y="480" textAnchor="middle" fill="#666" fontSize="10">Sleeves</text>
                    </>
                  )
                ) : (
                  activeSide === 'front' ? (
                    <>
                      {/* PANTS FRONT - UV Layout */}
                      {/* Left leg */}
                      <rect x="40" y="200" width="200" height="380" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="140" y="400" textAnchor="middle" fill="#666" fontSize="10">Left Leg</text>

                      {/* Front waist/thigh - main design area */}
                      <rect x="160" y="40" width="280" height="200" fill="none" stroke="#4ade80" strokeWidth="2" strokeDasharray="6,4" />
                      <rect x="160" y="40" width="280" height="200" fill="#4ade80" opacity="0.05" />
                      <text x="300" y="130" textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="bold">FRONT</text>
                      <text x="300" y="150" textAnchor="middle" fill="#4ade80" fontSize="11">Place your design here</text>

                      {/* Right leg */}
                      <rect x="360" y="200" width="200" height="380" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="460" y="400" textAnchor="middle" fill="#666" fontSize="10">Right Leg</text>
                    </>
                  ) : (
                    <>
                      {/* PANTS BACK - UV Layout */}
                      <rect x="40" y="200" width="200" height="380" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="140" y="400" textAnchor="middle" fill="#666" fontSize="10">Left Leg</text>

                      <rect x="160" y="40" width="280" height="200" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="6,4" />
                      <rect x="160" y="40" width="280" height="200" fill="#a855f7" opacity="0.05" />
                      <text x="300" y="130" textAnchor="middle" fill="#a855f7" fontSize="14" fontWeight="bold">BACK</text>
                      <text x="300" y="150" textAnchor="middle" fill="#a855f7" fontSize="11">Place your design here</text>

                      <rect x="360" y="200" width="200" height="380" fill="none" stroke="#888" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="460" y="400" textAnchor="middle" fill="#666" fontSize="10">Right Leg</text>
                    </>
                  )
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
