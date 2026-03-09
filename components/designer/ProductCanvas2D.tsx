'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas as FabricCanvas, FabricText, FabricImage, Rect, Circle, Triangle, Polygon, Line, Path } from 'fabric'
import { useProduct2DStore } from '@/lib/store2d'

// Category to image mapping with view support
const categoryImages: Record<string, Record<string, string>> = {
  shirts: {
    front: '/products/tshirt-front.jpg',
    back: '/products/tshirt-back.jpg',
  },
  hoodies: {
    front: '/products/hoodie-front.jpg',
    back: '/products/hoodie-back.jpg',
  },
  polos: {
    front: '/products/polo-front.jpg',
    back: '/products/polo-front.jpg',
  },
  jerseys: {
    front: '/products/jersey-front.jpg',
    back: '/products/jersey-front.jpg',
  },
  pants: {
    front: '/products/pants-front.jpg',
    back: '/products/pants-front.jpg',
  },
  jackets: {
    front: '/products/jacket-front.jpg',
    back: '/products/jacket-front.jpg',
  },
  accessories: {
    front: '/products/cap-front.jpg',
    back: '/products/cap-front.jpg',
  },
}

export default function ProductCanvas2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<FabricCanvas | null>(null)

  const {
    selectedProduct,
    selectedColor,
    currentViewIndex,
    saveToHistory,
  } = useProduct2DStore()

  const currentView = selectedProduct?.views?.[currentViewIndex] || { name: 'Front', designZones: [] }

  // Get image URL - category and view based lookup
  const viewName = currentView?.name?.toLowerCase() || 'front'
  const viewKey = viewName.includes('back') ? 'back' : 'front'
  const categoryImageSet = categoryImages[selectedProduct?.category] || categoryImages.shirts
  const imageUrl = categoryImageSet?.[viewKey] || categoryImageSet?.front || '/products/tshirt-front.jpg'

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 480,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
    })

    fabricRef.current = canvas

    canvas.on('object:modified', () => {
      saveToHistory()
    })

    return () => {
      canvas.dispose()
      fabricRef.current = null
    }
  }, [])

  // Handle events from panels
  useEffect(() => {
    const handleAddText = (e: CustomEvent) => {
      if (!fabricRef.current) return
      const { text, fontFamily, fontSize, fill } = e.detail
      const textObj = new FabricText(text, {
        left: 200,
        top: 240,
        fontFamily,
        fontSize,
        fill,
        originX: 'center',
        originY: 'center',
      })
      fabricRef.current.add(textObj)
      fabricRef.current.setActiveObject(textObj)
      fabricRef.current.renderAll()
      saveToHistory()
    }

    const handleAddImage = async (e: CustomEvent) => {
      if (!fabricRef.current) return
      const { dataUrl } = e.detail
      try {
        const img = await FabricImage.fromURL(dataUrl)
        const maxSize = 150
        const scale = Math.min(maxSize / (img.width || 150), maxSize / (img.height || 150))
        img.scale(scale)
        img.set({ left: 200, top: 240, originX: 'center', originY: 'center' })
        fabricRef.current.add(img)
        fabricRef.current.setActiveObject(img)
        fabricRef.current.renderAll()
        saveToHistory()
      } catch (error) {
        console.error('Error adding image:', error)
      }
    }

    const handleAddShape = (e: CustomEvent) => {
      if (!fabricRef.current) return
      const { type, fill, stroke, strokeWidth } = e.detail
      let shape: Rect | Circle | Triangle | Polygon | Path | Line | null = null
      const commonProps = {
        left: 200,
        top: 240,
        fill,
        stroke,
        strokeWidth,
        originX: 'center' as const,
        originY: 'center' as const,
      }

      switch (type) {
        case 'rectangle':
          shape = new Rect({ ...commonProps, width: 100, height: 70 })
          break
        case 'circle':
          shape = new Circle({ ...commonProps, radius: 40 })
          break
        case 'triangle':
          shape = new Triangle({ ...commonProps, width: 80, height: 80 })
          break
        case 'star':
          const starPoints = []
          for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? 40 : 20
            const angle = (Math.PI / 5) * i - Math.PI / 2
            starPoints.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius })
          }
          shape = new Polygon(starPoints, commonProps)
          break
        case 'heart':
          shape = new Path('M 0 -25 C -25 -50 -50 -25 -50 0 C -50 25 -25 50 0 65 C 25 50 50 25 50 0 C 50 -25 25 -50 0 -25', {
            ...commonProps, scaleX: 0.7, scaleY: 0.7,
          })
          break
        case 'arrow':
          shape = new Path('M -40 0 L 20 0 L 20 -12 L 40 0 L 20 12 L 20 0', commonProps)
          break
        case 'line':
          shape = new Line([150, 240, 250, 240], { stroke, strokeWidth: strokeWidth || 3 })
          break
        case 'polygon':
          const hexPoints = []
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2
            hexPoints.push({ x: Math.cos(angle) * 40, y: Math.sin(angle) * 40 })
          }
          shape = new Polygon(hexPoints, commonProps)
          break
      }

      if (shape) {
        fabricRef.current.add(shape)
        fabricRef.current.setActiveObject(shape)
        fabricRef.current.renderAll()
        saveToHistory()
      }
    }

    window.addEventListener('addText2D', handleAddText as EventListener)
    window.addEventListener('addImage2D', handleAddImage as EventListener)
    window.addEventListener('addShape2D', handleAddShape as EventListener)

    return () => {
      window.removeEventListener('addText2D', handleAddText as EventListener)
      window.removeEventListener('addImage2D', handleAddImage as EventListener)
      window.removeEventListener('addShape2D', handleAddShape as EventListener)
    }
  }, [saveToHistory])

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: '500px' }}>
      {/* Centered container for product */}
      <div className="relative" style={{ width: '400px', height: '480px' }}>

        {/* Layer 1: Product Image Background */}
        <div
          className="absolute inset-0 rounded-lg shadow-lg overflow-hidden"
          style={{ backgroundColor: '#f5f5f5', zIndex: 1 }}
        >
          <img
            key={`${selectedProduct?.id}-${currentViewIndex}-${imageUrl}`}
            src={imageUrl}
            alt={`${selectedProduct?.name || 'Product'} - ${currentView?.name || 'View'}`}
            className="w-full h-full object-contain p-4"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl)
              e.currentTarget.src = '/products/tshirt-front.jpg'
            }}
          />

          {/* Color tint overlay */}
          {selectedColor !== '#ffffff' && (
            <div
              className="absolute inset-0 mix-blend-multiply pointer-events-none"
              style={{ backgroundColor: selectedColor, opacity: 0.5 }}
            />
          )}
        </div>

        {/* Layer 2: Design Zones */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          {currentView?.designZones?.map((zone) => (
            <div
              key={zone.id}
              className="absolute border-2 border-dashed border-blue-500/60 rounded"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
              }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-blue-600 font-semibold whitespace-nowrap bg-white px-2 py-0.5 rounded shadow">
                {zone.name}
              </span>
            </div>
          ))}
        </div>

        {/* Layer 3: Fabric.js Canvas for user designs */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 rounded-lg"
          style={{ zIndex: 3, background: 'transparent', width: '400px', height: '480px' }}
        />

        {/* Layer 4: View indicator badge */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full"
          style={{ zIndex: 4 }}
        >
          {currentView?.name || 'Front'}
        </div>
      </div>
    </div>
  )
}
