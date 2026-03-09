// 2D Product Catalog - Product images and design zones for each view

export interface DesignZone {
  id: string
  name: string
  x: number      // percentage from left
  y: number      // percentage from top
  width: number  // percentage width
  height: number // percentage height
}

export interface ProductView {
  id: string
  name: string
  image: string  // URL or path to product image
  designZones: DesignZone[]
}

export interface Product2D {
  id: string
  name: string
  category: 'shirts' | 'hoodies' | 'polos' | 'pants' | 'jerseys' | 'jackets' | 'accessories'
  thumbnail: string
  colors: string[]
  defaultColor: string
  views: ProductView[]
  price?: number
  description?: string
}

// Product catalog with realistic products
export const productCatalog: Product2D[] = [
  {
    id: 'classic-crew-tshirt',
    name: 'Classic Crew Neck T-Shirt',
    category: 'shirts',
    thumbnail: '/products/tshirt-thumb.png',
    colors: ['#ffffff', '#000000', '#1e3a5f', '#dc2626', '#16a34a', '#f59e0b', '#7c3aed', '#6b7280', '#0ea5e9', '#ec4899'],
    defaultColor: '#ffffff',
    price: 24.99,
    description: 'Premium cotton crew neck t-shirt, perfect for everyday wear',
    views: [
      {
        id: 'front',
        name: 'Front',
        image: '/products/tshirt-front.png',
        designZones: [
          { id: 'chest-full', name: 'Full Chest', x: 22, y: 22, width: 56, height: 40 },
          { id: 'chest-left', name: 'Left Chest', x: 52, y: 24, width: 18, height: 14 },
        ]
      },
      {
        id: 'back',
        name: 'Back',
        image: '/products/tshirt-back.png',
        designZones: [
          { id: 'back-full', name: 'Full Back', x: 22, y: 18, width: 56, height: 48 },
          { id: 'back-upper', name: 'Upper Back', x: 28, y: 14, width: 44, height: 16 },
        ]
      },
      {
        id: 'left',
        name: 'Left Side',
        image: '/products/tshirt-left.png',
        designZones: [
          { id: 'sleeve-left', name: 'Left Sleeve', x: 30, y: 20, width: 40, height: 25 },
        ]
      },
      {
        id: 'right',
        name: 'Right Side',
        image: '/products/tshirt-right.png',
        designZones: [
          { id: 'sleeve-right', name: 'Right Sleeve', x: 30, y: 20, width: 40, height: 25 },
        ]
      }
    ]
  },
  {
    id: 'premium-hoodie',
    name: 'Premium Pullover Hoodie',
    category: 'hoodies',
    thumbnail: '/products/hoodie-thumb.png',
    colors: ['#d4a574', '#000000', '#1e3a5f', '#374151', '#7c3aed', '#dc2626', '#16a34a', '#ffffff'],
    defaultColor: '#d4a574',
    price: 54.99,
    description: 'Cozy fleece-lined pullover hoodie with kangaroo pocket',
    views: [
      {
        id: 'front',
        name: 'Front',
        image: '/products/hoodie-front.png',
        designZones: [
          { id: 'chest', name: 'Chest Area', x: 26, y: 28, width: 48, height: 32 },
          { id: 'kangaroo', name: 'Kangaroo Pocket', x: 28, y: 62, width: 44, height: 14 },
        ]
      },
      {
        id: 'back',
        name: 'Back',
        image: '/products/hoodie-back.png',
        designZones: [
          { id: 'back-full', name: 'Full Back', x: 24, y: 22, width: 52, height: 44 },
        ]
      },
      {
        id: 'hood-left',
        name: 'Hood Left',
        image: '/products/hoodie-hood-left.png',
        designZones: [
          { id: 'hood-l', name: 'Hood Side', x: 28, y: 20, width: 44, height: 40 },
        ]
      },
      {
        id: 'hood-right',
        name: 'Hood Right',
        image: '/products/hoodie-hood-right.png',
        designZones: [
          { id: 'hood-r', name: 'Hood Side', x: 28, y: 20, width: 44, height: 40 },
        ]
      }
    ]
  },
  {
    id: 'performance-polo',
    name: 'Performance Polo Shirt',
    category: 'polos',
    thumbnail: '/products/polo-thumb.png',
    colors: ['#ffffff', '#1e3a5f', '#000000', '#16a34a', '#dc2626', '#0ea5e9', '#f59e0b'],
    defaultColor: '#ffffff',
    price: 39.99,
    description: 'Moisture-wicking polo shirt, ideal for sports and business casual',
    views: [
      {
        id: 'front',
        name: 'Front',
        image: '/products/polo-front.png',
        designZones: [
          { id: 'chest', name: 'Chest', x: 24, y: 28, width: 52, height: 34 },
          { id: 'pocket', name: 'Left Chest Logo', x: 52, y: 30, width: 16, height: 12 },
        ]
      },
      {
        id: 'back',
        name: 'Back',
        image: '/products/polo-back.png',
        designZones: [
          { id: 'back-full', name: 'Full Back', x: 24, y: 20, width: 52, height: 42 },
        ]
      }
    ]
  },
  {
    id: 'football-jersey',
    name: 'Football Jersey',
    category: 'jerseys',
    thumbnail: '/products/jersey-thumb.png',
    colors: ['#1e3a5f', '#dc2626', '#000000', '#16a34a', '#f59e0b', '#7c3aed', '#ffffff'],
    defaultColor: '#1e3a5f',
    price: 49.99,
    description: 'Professional-grade football jersey with breathable mesh',
    views: [
      {
        id: 'front',
        name: 'Front',
        image: '/products/jersey-front.png',
        designZones: [
          { id: 'chest', name: 'Chest', x: 18, y: 22, width: 64, height: 36 },
          { id: 'number-front', name: 'Front Number', x: 34, y: 32, width: 32, height: 24 },
        ]
      },
      {
        id: 'back',
        name: 'Back',
        image: '/products/jersey-back.png',
        designZones: [
          { id: 'name', name: 'Player Name', x: 24, y: 14, width: 52, height: 10 },
          { id: 'number-back', name: 'Back Number', x: 28, y: 26, width: 44, height: 36 },
        ]
      }
    ]
  },
  {
    id: 'basketball-jersey',
    name: 'Basketball Tank Jersey',
    category: 'jerseys',
    thumbnail: '/products/basketball-thumb.png',
    colors: ['#dc2626', '#1e3a5f', '#000000', '#f59e0b', '#16a34a', '#ffffff'],
    defaultColor: '#dc2626',
    price: 44.99,
    description: 'Sleeveless basketball jersey with mesh panels',
    views: [
      {
        id: 'front',
        name: 'Front',
        image: '/products/basketball-front.png',
        designZones: [
          { id: 'chest', name: 'Chest', x: 20, y: 24, width: 60, height: 38 },
          { id: 'number-front', name: 'Front Number', x: 34, y: 34, width: 32, height: 26 },
        ]
      },
      {
        id: 'back',
        name: 'Back',
        image: '/products/basketball-back.png',
        designZones: [
          { id: 'name', name: 'Player Name', x: 24, y: 16, width: 52, height: 10 },
          { id: 'number-back', name: 'Back Number', x: 28, y: 28, width: 44, height: 36 },
        ]
      }
    ]
  },
  {
    id: 'jogger-pants',
    name: 'Athletic Jogger Pants',
    category: 'pants',
    thumbnail: '/products/jogger-thumb.png',
    colors: ['#000000', '#374151', '#1e3a5f', '#dc2626', '#16a34a'],
    defaultColor: '#000000',
    price: 39.99,
    description: 'Comfortable jogger pants with elastic cuffs',
    views: [
      {
        id: 'front',
        name: 'Front',
        image: '/products/jogger-front.png',
        designZones: [
          { id: 'left-thigh', name: 'Left Thigh', x: 12, y: 18, width: 28, height: 22 },
          { id: 'right-thigh', name: 'Right Thigh', x: 60, y: 18, width: 28, height: 22 },
        ]
      },
      {
        id: 'back',
        name: 'Back',
        image: '/products/jogger-back.png',
        designZones: [
          { id: 'back-pocket', name: 'Back', x: 32, y: 22, width: 36, height: 18 },
        ]
      }
    ]
  },
  {
    id: 'sports-shorts',
    name: 'Athletic Sports Shorts',
    category: 'pants',
    thumbnail: '/products/shorts-thumb.png',
    colors: ['#000000', '#1e3a5f', '#dc2626', '#ffffff', '#16a34a'],
    defaultColor: '#000000',
    price: 29.99,
    description: 'Lightweight sports shorts with side pockets',
    views: [
      {
        id: 'front',
        name: 'Front',
        image: '/products/shorts-front.png',
        designZones: [
          { id: 'left-leg', name: 'Left Leg', x: 14, y: 20, width: 30, height: 35 },
          { id: 'right-leg', name: 'Right Leg', x: 56, y: 20, width: 30, height: 35 },
        ]
      },
      {
        id: 'back',
        name: 'Back',
        image: '/products/shorts-back.png',
        designZones: [
          { id: 'back-center', name: 'Back Center', x: 30, y: 25, width: 40, height: 30 },
        ]
      }
    ]
  },
  {
    id: 'varsity-jacket',
    name: 'Varsity Bomber Jacket',
    category: 'jackets',
    thumbnail: '/products/jacket-thumb.png',
    colors: ['#1e3a5f', '#000000', '#dc2626', '#16a34a', '#7c3aed'],
    defaultColor: '#1e3a5f',
    price: 79.99,
    description: 'Classic varsity jacket with leather sleeves',
    views: [
      {
        id: 'front',
        name: 'Front',
        image: '/products/jacket-front.png',
        designZones: [
          { id: 'chest-left', name: 'Left Chest', x: 52, y: 26, width: 20, height: 16 },
          { id: 'chest-right', name: 'Right Chest', x: 28, y: 26, width: 20, height: 16 },
        ]
      },
      {
        id: 'back',
        name: 'Back',
        image: '/products/jacket-back.png',
        designZones: [
          { id: 'back-full', name: 'Full Back', x: 20, y: 18, width: 60, height: 50 },
        ]
      }
    ]
  },
  {
    id: 'zip-hoodie',
    name: 'Full Zip Hoodie',
    category: 'hoodies',
    thumbnail: '/products/zip-hoodie-thumb.png',
    colors: ['#374151', '#000000', '#1e3a5f', '#dc2626', '#ffffff'],
    defaultColor: '#374151',
    price: 59.99,
    description: 'Full zip hoodie with front pockets',
    views: [
      {
        id: 'front',
        name: 'Front',
        image: '/products/zip-hoodie-front.png',
        designZones: [
          { id: 'chest-left', name: 'Left Chest', x: 52, y: 28, width: 18, height: 14 },
          { id: 'chest-right', name: 'Right Chest', x: 30, y: 28, width: 18, height: 14 },
        ]
      },
      {
        id: 'back',
        name: 'Back',
        image: '/products/zip-hoodie-back.png',
        designZones: [
          { id: 'back-full', name: 'Full Back', x: 24, y: 20, width: 52, height: 46 },
        ]
      }
    ]
  },
  {
    id: 'baseball-cap',
    name: 'Classic Baseball Cap',
    category: 'accessories',
    thumbnail: '/products/cap-thumb.png',
    colors: ['#000000', '#1e3a5f', '#dc2626', '#ffffff', '#16a34a', '#f59e0b'],
    defaultColor: '#000000',
    price: 24.99,
    description: 'Adjustable snapback baseball cap',
    views: [
      {
        id: 'front',
        name: 'Front',
        image: '/products/cap-front.png',
        designZones: [
          { id: 'front-panel', name: 'Front Panel', x: 25, y: 25, width: 50, height: 35 },
        ]
      },
      {
        id: 'side',
        name: 'Side',
        image: '/products/cap-side.png',
        designZones: [
          { id: 'side-panel', name: 'Side Panel', x: 30, y: 30, width: 40, height: 30 },
        ]
      }
    ]
  }
]

export function getProductById(id: string): Product2D | undefined {
  return productCatalog.find(p => p.id === id)
}

export function getProductsByCategory(category: Product2D['category']): Product2D[] {
  return productCatalog.filter(p => p.category === category)
}

export function getAllCategories(): Product2D['category'][] {
  return [...new Set(productCatalog.map(p => p.category))]
}
