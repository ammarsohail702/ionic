'use client'

import { useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Canvas as FabricCanvas, FabricObject } from 'fabric'
import { useCustomizerStore } from '@/lib/store'

interface EditorLayersPanelProps {
  fabricRef: React.MutableRefObject<FabricCanvas | null>
  onSync: () => void
}

export default function EditorLayersPanel({ fabricRef, onSync }: EditorLayersPanelProps) {
  const { shirt, updateDesignLayer, setDesignLayers } = useCustomizerStore()
  const { activeSide } = shirt.design
  const layers = shirt.design[activeSide].layers

  const handleVisibilityToggle = useCallback(
    (layerId: string, visible: boolean) => {
      updateDesignLayer(activeSide, layerId, { visible })

      if (fabricRef.current) {
        const objects = fabricRef.current.getObjects()
        const obj = objects.find(
          (o) => (o as FabricObject & { data?: { layerId?: string } }).data?.layerId === layerId
        )
        if (obj) {
          obj.visible = visible
          fabricRef.current.renderAll()
          onSync()
        }
      }
    },
    [activeSide, updateDesignLayer, fabricRef, onSync]
  )

  const handleDelete = useCallback(
    (layerId: string) => {
      if (fabricRef.current) {
        const objects = fabricRef.current.getObjects()
        const obj = objects.find(
          (o) => (o as FabricObject & { data?: { layerId?: string } }).data?.layerId === layerId
        )
        if (obj) {
          fabricRef.current.remove(obj)
          fabricRef.current.renderAll()
          onSync()
        }
      }
    },
    [fabricRef, onSync]
  )

  const handleSelect = useCallback(
    (layerId: string) => {
      if (fabricRef.current) {
        const objects = fabricRef.current.getObjects()
        const obj = objects.find(
          (o) => (o as FabricObject & { data?: { layerId?: string } }).data?.layerId === layerId
        )
        if (obj) {
          fabricRef.current.setActiveObject(obj)
          fabricRef.current.renderAll()
        }
      }
    },
    [fabricRef]
  )

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || !fabricRef.current) return

      const sourceIndex = result.source.index
      const destIndex = result.destination.index

      if (sourceIndex === destIndex) return

      // Reorder layers in store
      const newLayers = Array.from(layers)
      const [removed] = newLayers.splice(sourceIndex, 1)
      newLayers.splice(destIndex, 0, removed)
      setDesignLayers(activeSide, newLayers)

      // Reorder objects in Fabric canvas by removing and re-adding
      const objects = [...fabricRef.current.getObjects()]
      const objToMove = objects[sourceIndex]
      if (objToMove) {
        // Remove all objects
        fabricRef.current.clear()
        // Re-arrange the array
        objects.splice(sourceIndex, 1)
        objects.splice(destIndex, 0, objToMove)
        // Re-add in new order
        objects.forEach((obj) => fabricRef.current?.add(obj))
        fabricRef.current.renderAll()
        onSync()
      }
    },
    [layers, activeSide, setDesignLayers, fabricRef, onSync]
  )

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'drawing':
        return '✏️'
      case 'text':
        return 'T'
      case 'shape':
        return '⬜'
      case 'image':
        return '🖼'
      default:
        return '📦'
    }
  }

  return (
    <div className="flex-1 p-3 border-t border-white/10 overflow-y-auto">
      <h4 className="text-sm font-medium text-white mb-3">Layers</h4>

      {layers.length === 0 ? (
        <p className="text-white/40 text-xs text-center py-4">
          No layers yet. Start drawing or add elements.
        </p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="layers">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-1">
                {layers.map((layer, index) => (
                  <Draggable key={layer.id} draggableId={layer.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-all ${
                          snapshot.isDragging
                            ? 'bg-ionic-accent/30'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => handleSelect(layer.id)}
                      >
                        <span className="text-base">{getLayerIcon(layer.type)}</span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVisibilityToggle(layer.id, !layer.visible)
                          }}
                          className={`w-5 h-5 flex items-center justify-center ${
                            layer.visible ? 'text-white' : 'text-white/30'
                          }`}
                        >
                          {layer.visible ? '👁' : '👁‍🗨'}
                        </button>

                        <span className="flex-1 text-white/80 truncate text-xs">
                          {layer.name}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(layer.id)
                          }}
                          className="text-red-400/60 hover:text-red-400 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}
