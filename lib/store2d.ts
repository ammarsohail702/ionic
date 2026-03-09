import { create } from 'zustand'
import { Product2D, productCatalog } from './products2d'

export interface DesignElement {
  id: string
  type: 'text' | 'image' | 'shape'
  viewId: string  // Which view this element belongs to
  zoneId?: string // Optional zone constraint
  // Fabric.js serialized object
  fabricObject: string
}

export interface Product2DState {
  // Selected product
  selectedProduct: Product2D
  selectedColor: string
  currentViewIndex: number

  // Design elements per product
  designs: Record<string, DesignElement[]> // productId -> elements

  // Editor state
  activeTool: 'select' | 'text' | 'upload' | 'names' | 'shapes'
  zoom: number

  // History
  history: string[]
  historyIndex: number

  // Actions
  setSelectedProduct: (product: Product2D) => void
  setSelectedColor: (color: string) => void
  setCurrentViewIndex: (index: number) => void
  nextView: () => void
  prevView: () => void
  setActiveTool: (tool: Product2DState['activeTool']) => void
  setZoom: (zoom: number) => void

  // Design actions
  addDesignElement: (element: DesignElement) => void
  updateDesignElement: (id: string, fabricObject: string) => void
  removeDesignElement: (id: string) => void
  getDesignsForView: (viewId: string) => DesignElement[]

  // History
  saveToHistory: () => void
  undo: () => void
  redo: () => void
}

export const useProduct2DStore = create<Product2DState>((set, get) => ({
  selectedProduct: productCatalog[0],
  selectedColor: productCatalog[0].defaultColor,
  currentViewIndex: 0,
  designs: {},
  activeTool: 'select',
  zoom: 1,
  history: [],
  historyIndex: -1,

  setSelectedProduct: (product) => set({
    selectedProduct: product,
    selectedColor: product.defaultColor,
    currentViewIndex: 0,
  }),

  setSelectedColor: (color) => set({ selectedColor: color }),

  setCurrentViewIndex: (index) => set({ currentViewIndex: index }),

  nextView: () => {
    const { selectedProduct, currentViewIndex } = get()
    const nextIndex = (currentViewIndex + 1) % selectedProduct.views.length
    set({ currentViewIndex: nextIndex })
  },

  prevView: () => {
    const { selectedProduct, currentViewIndex } = get()
    const prevIndex = currentViewIndex === 0
      ? selectedProduct.views.length - 1
      : currentViewIndex - 1
    set({ currentViewIndex: prevIndex })
  },

  setActiveTool: (tool) => set({ activeTool: tool }),

  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2, zoom)) }),

  addDesignElement: (element) => {
    const { selectedProduct, designs } = get()
    const productDesigns = designs[selectedProduct.id] || []
    set({
      designs: {
        ...designs,
        [selectedProduct.id]: [...productDesigns, element]
      }
    })
  },

  updateDesignElement: (id, fabricObject) => {
    const { selectedProduct, designs } = get()
    const productDesigns = designs[selectedProduct.id] || []
    set({
      designs: {
        ...designs,
        [selectedProduct.id]: productDesigns.map(el =>
          el.id === id ? { ...el, fabricObject } : el
        )
      }
    })
  },

  removeDesignElement: (id) => {
    const { selectedProduct, designs } = get()
    const productDesigns = designs[selectedProduct.id] || []
    set({
      designs: {
        ...designs,
        [selectedProduct.id]: productDesigns.filter(el => el.id !== id)
      }
    })
  },

  getDesignsForView: (viewId) => {
    const { selectedProduct, designs } = get()
    const productDesigns = designs[selectedProduct.id] || []
    return productDesigns.filter(el => el.viewId === viewId)
  },

  saveToHistory: () => {
    const { designs, history, historyIndex } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.stringify(designs))
    if (newHistory.length > 50) newHistory.shift()
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    })
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      set({
        designs: JSON.parse(history[newIndex]),
        historyIndex: newIndex
      })
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      set({
        designs: JSON.parse(history[newIndex]),
        historyIndex: newIndex
      })
    }
  },
}))
