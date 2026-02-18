import { create } from 'zustand'

export type ProductType = 'shirt' | 'pants'
export type SleeveType = 'half' | 'full'
export type CollarType = 'round' | 'vneck' | 'polo' | 'mandarin'
export type PantsType = 'full' | 'shorts'
export type PatternType = 'solid' | 'vertical-stripes' | 'horizontal-stripes' | 'gradient' | 'checkered'
export type SleeveDesignType = 'solid' | 'single-stripe' | 'double-stripe' | 'triple-stripe'
export type EditorToolType = 'select' | 'draw' | 'text' | 'shape' | 'image' | 'eraser'
export type BlendModeType = 'normal' | 'multiply' | 'overlay'

// Design Editor Types
export interface EditorLayer {
  id: string
  name: string
  type: 'drawing' | 'text' | 'shape' | 'image'
  visible: boolean
  locked: boolean
}

export interface EditorBrushConfig {
  size: number
  color: string
  opacity: number
}

export interface EditorTextConfig {
  fontFamily: string
  fontSize: number
  fill: string
  stroke: string
  strokeWidth: number
}

export interface EditorShapeConfig {
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
}

export interface DesignCanvasState {
  fabricJSON: string | null
  layers: EditorLayer[]
  canvasDataUrl: string | null
}

export interface DesignEditorConfig {
  front: DesignCanvasState
  back: DesignCanvasState
  activeSide: 'front' | 'back'
  blendMode: BlendModeType
  designOpacity: number
  activeTool: EditorToolType
  brushConfig: EditorBrushConfig
  textConfig: EditorTextConfig
  shapeConfig: EditorShapeConfig
}

export interface TextConfig {
  content: string
  position: 'front' | 'back'
  fontSize: number
  color: string
}

export interface NumberConfig {
  number: string
  showFront: boolean
  showBack: boolean
  fontSize: number
  color: string
}

export interface LogoConfig {
  image: string | null
  position: 'chest-left' | 'chest-right' | 'chest-center' | 'back' | 'sleeve-left' | 'sleeve-right'
  scale: number
}

export interface SleeveConfig {
  design: SleeveDesignType
  color: string
  stripeColor: string
}

export interface OrderItem {
  size: string
  quantity: number
}

export interface DeliveryAddress {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postcode: string
  country: string
  notes: string
}

interface CustomizerState {
  // Active product
  activeProduct: ProductType

  // Shirt customization
  shirt: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    pattern: PatternType
    collarType: CollarType
    collarColor: string
    sleeveType: SleeveType
    sleeveDesign: SleeveConfig
    teamName: TextConfig
    playerNumber: NumberConfig
    logo: LogoConfig
    design: DesignEditorConfig
  }

  // Pants customization
  pants: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    pattern: PatternType
    pantsType: PantsType
    logo: LogoConfig
    design: DesignEditorConfig
  }

  // Order details
  shirtOrder: OrderItem[]
  pantsOrder: OrderItem[]
  deliveryAddress: DeliveryAddress

  // View controls
  viewAngle: 'front' | 'back' | 'free'

  // Actions
  setActiveProduct: (product: ProductType) => void
  setViewAngle: (angle: 'front' | 'back' | 'free') => void

  // Shirt actions
  setShirtPrimaryColor: (color: string) => void
  setShirtSecondaryColor: (color: string) => void
  setShirtAccentColor: (color: string) => void
  setShirtPattern: (pattern: PatternType) => void
  setShirtCollarType: (collar: CollarType) => void
  setShirtCollarColor: (color: string) => void
  setShirtSleeveType: (sleeve: SleeveType) => void
  setShirtSleeveDesign: (config: Partial<SleeveConfig>) => void
  setShirtTeamName: (config: Partial<TextConfig>) => void
  setShirtNumber: (config: Partial<NumberConfig>) => void
  setShirtLogo: (config: Partial<LogoConfig>) => void

  // Design Editor actions
  setDesignActiveSide: (side: 'front' | 'back') => void
  setDesignActiveTool: (tool: EditorToolType) => void
  setDesignBrushConfig: (config: Partial<EditorBrushConfig>) => void
  setDesignTextConfig: (config: Partial<EditorTextConfig>) => void
  setDesignShapeConfig: (config: Partial<EditorShapeConfig>) => void
  setDesignBlendMode: (mode: BlendModeType) => void
  setDesignOpacity: (opacity: number) => void
  setDesignFabricJSON: (side: 'front' | 'back', json: string | null) => void
  setDesignDataUrl: (side: 'front' | 'back', dataUrl: string | null) => void
  setDesignLayers: (side: 'front' | 'back', layers: EditorLayer[]) => void
  updateDesignLayer: (side: 'front' | 'back', layerId: string, updates: Partial<EditorLayer>) => void
  deleteDesignLayer: (side: 'front' | 'back', layerId: string) => void
  clearDesign: (side: 'front' | 'back') => void

  // Pants actions
  setPantsPrimaryColor: (color: string) => void
  setPantsSecondaryColor: (color: string) => void
  setPantsAccentColor: (color: string) => void
  setPantsPattern: (pattern: PatternType) => void
  setPantsType: (type: PantsType) => void
  setPantsLogo: (config: Partial<LogoConfig>) => void

  // Order actions
  setShirtOrder: (order: OrderItem[]) => void
  setPantsOrder: (order: OrderItem[]) => void
  setDeliveryAddress: (address: Partial<DeliveryAddress>) => void

  // Reset
  resetAll: () => void
}

const defaultDesignCanvas: DesignCanvasState = {
  fabricJSON: null,
  layers: [],
  canvasDataUrl: null,
}

const defaultDesignEditor: DesignEditorConfig = {
  front: { ...defaultDesignCanvas },
  back: { ...defaultDesignCanvas },
  activeSide: 'front',
  blendMode: 'normal',
  designOpacity: 1,
  activeTool: 'select',
  brushConfig: {
    size: 10,
    color: '#000000',
    opacity: 1,
  },
  textConfig: {
    fontFamily: 'Inter',
    fontSize: 48,
    fill: '#000000',
    stroke: '',
    strokeWidth: 0,
  },
  shapeConfig: {
    fill: '#3b82f6',
    stroke: '#1e40af',
    strokeWidth: 2,
    opacity: 1,
  },
}

const defaultShirt = {
  primaryColor: '#1e40af',
  secondaryColor: '#ffffff',
  accentColor: '#fbbf24',
  pattern: 'solid' as PatternType,
  collarType: 'round' as CollarType,
  collarColor: '#1e40af',
  sleeveType: 'half' as SleeveType,
  sleeveDesign: {
    design: 'solid' as SleeveDesignType,
    color: '#1e40af',
    stripeColor: '#ffffff',
  },
  teamName: {
    content: '',
    position: 'front' as const,
    fontSize: 24,
    color: '#ffffff',
  },
  playerNumber: {
    number: '',
    showFront: true,
    showBack: true,
    fontSize: 48,
    color: '#ffffff',
  },
  logo: {
    image: null,
    position: 'chest-left' as const,
    scale: 1,
  },
  design: defaultDesignEditor,
}

const defaultPants = {
  primaryColor: '#1e40af',
  secondaryColor: '#ffffff',
  accentColor: '#fbbf24',
  pattern: 'solid' as PatternType,
  pantsType: 'full' as PantsType,
  logo: {
    image: null,
    position: 'chest-left' as const,
    scale: 1,
  },
  design: { ...defaultDesignEditor },
}

const defaultDeliveryAddress: DeliveryAddress = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postcode: '',
  country: 'United Kingdom',
  notes: '',
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
  activeProduct: 'shirt',
  shirt: defaultShirt,
  pants: defaultPants,
  shirtOrder: [],
  pantsOrder: [],
  deliveryAddress: defaultDeliveryAddress,
  viewAngle: 'front',

  setActiveProduct: (product) => set({ activeProduct: product }),
  setViewAngle: (angle) => set({ viewAngle: angle }),

  // Shirt actions
  setShirtPrimaryColor: (color) =>
    set((state) => ({ shirt: { ...state.shirt, primaryColor: color } })),
  setShirtSecondaryColor: (color) =>
    set((state) => ({ shirt: { ...state.shirt, secondaryColor: color } })),
  setShirtAccentColor: (color) =>
    set((state) => ({ shirt: { ...state.shirt, accentColor: color } })),
  setShirtPattern: (pattern) =>
    set((state) => ({ shirt: { ...state.shirt, pattern } })),
  setShirtCollarType: (collar) =>
    set((state) => ({ shirt: { ...state.shirt, collarType: collar } })),
  setShirtCollarColor: (color) =>
    set((state) => ({ shirt: { ...state.shirt, collarColor: color } })),
  setShirtSleeveType: (sleeve) =>
    set((state) => ({ shirt: { ...state.shirt, sleeveType: sleeve } })),
  setShirtSleeveDesign: (config) =>
    set((state) => ({
      shirt: { ...state.shirt, sleeveDesign: { ...state.shirt.sleeveDesign, ...config } },
    })),
  setShirtTeamName: (config) =>
    set((state) => ({
      shirt: { ...state.shirt, teamName: { ...state.shirt.teamName, ...config } },
    })),
  setShirtNumber: (config) =>
    set((state) => ({
      shirt: { ...state.shirt, playerNumber: { ...state.shirt.playerNumber, ...config } },
    })),
  setShirtLogo: (config) =>
    set((state) => ({
      shirt: { ...state.shirt, logo: { ...state.shirt.logo, ...config } },
    })),

  // Design Editor actions (work with active product)
  setDesignActiveSide: (side) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: { ...state[product], design: { ...state[product].design, activeSide: side } },
      }
    }),
  setDesignActiveTool: (tool) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: { ...state[product], design: { ...state[product].design, activeTool: tool } },
      }
    }),
  setDesignBrushConfig: (config) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: {
          ...state[product],
          design: {
            ...state[product].design,
            brushConfig: { ...state[product].design.brushConfig, ...config },
          },
        },
      }
    }),
  setDesignTextConfig: (config) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: {
          ...state[product],
          design: {
            ...state[product].design,
            textConfig: { ...state[product].design.textConfig, ...config },
          },
        },
      }
    }),
  setDesignShapeConfig: (config) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: {
          ...state[product],
          design: {
            ...state[product].design,
            shapeConfig: { ...state[product].design.shapeConfig, ...config },
          },
        },
      }
    }),
  setDesignBlendMode: (mode) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: { ...state[product], design: { ...state[product].design, blendMode: mode } },
      }
    }),
  setDesignOpacity: (opacity) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: { ...state[product], design: { ...state[product].design, designOpacity: opacity } },
      }
    }),
  setDesignFabricJSON: (side, json) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: {
          ...state[product],
          design: {
            ...state[product].design,
            [side]: { ...state[product].design[side], fabricJSON: json },
          },
        },
      }
    }),
  setDesignDataUrl: (side, dataUrl) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: {
          ...state[product],
          design: {
            ...state[product].design,
            [side]: { ...state[product].design[side], canvasDataUrl: dataUrl },
          },
        },
      }
    }),
  setDesignLayers: (side, layers) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: {
          ...state[product],
          design: {
            ...state[product].design,
            [side]: { ...state[product].design[side], layers },
          },
        },
      }
    }),
  updateDesignLayer: (side, layerId, updates) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: {
          ...state[product],
          design: {
            ...state[product].design,
            [side]: {
              ...state[product].design[side],
              layers: state[product].design[side].layers.map((layer) =>
                layer.id === layerId ? { ...layer, ...updates } : layer
              ),
            },
          },
        },
      }
    }),
  deleteDesignLayer: (side, layerId) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: {
          ...state[product],
          design: {
            ...state[product].design,
            [side]: {
              ...state[product].design[side],
              layers: state[product].design[side].layers.filter((layer) => layer.id !== layerId),
            },
          },
        },
      }
    }),
  clearDesign: (side) =>
    set((state) => {
      const product = state.activeProduct
      return {
        [product]: {
          ...state[product],
          design: {
            ...state[product].design,
            [side]: { ...defaultDesignCanvas },
          },
        },
      }
    }),

  // Pants actions
  setPantsPrimaryColor: (color) =>
    set((state) => ({ pants: { ...state.pants, primaryColor: color } })),
  setPantsSecondaryColor: (color) =>
    set((state) => ({ pants: { ...state.pants, secondaryColor: color } })),
  setPantsAccentColor: (color) =>
    set((state) => ({ pants: { ...state.pants, accentColor: color } })),
  setPantsPattern: (pattern) =>
    set((state) => ({ pants: { ...state.pants, pattern } })),
  setPantsType: (type) =>
    set((state) => ({ pants: { ...state.pants, pantsType: type } })),
  setPantsLogo: (config) =>
    set((state) => ({
      pants: { ...state.pants, logo: { ...state.pants.logo, ...config } },
    })),

  // Order actions
  setShirtOrder: (order) => set({ shirtOrder: order }),
  setPantsOrder: (order) => set({ pantsOrder: order }),
  setDeliveryAddress: (address) =>
    set((state) => ({
      deliveryAddress: { ...state.deliveryAddress, ...address },
    })),

  // Reset
  resetAll: () =>
    set({
      shirt: defaultShirt,
      pants: defaultPants,
      shirtOrder: [],
      pantsOrder: [],
      deliveryAddress: defaultDeliveryAddress,
    }),
}))
