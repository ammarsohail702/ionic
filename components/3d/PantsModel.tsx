'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useCustomizerStore, PatternType } from '@/lib/store'
import * as THREE from 'three'

// Preload the model
useGLTF.preload('/models/pants.glb')

// Create pattern texture
function createPatternTexture(
  pattern: PatternType,
  primaryColor: string,
  secondaryColor: string
): THREE.CanvasTexture | null {
  if (typeof window === 'undefined') return null
  if (pattern === 'solid') return null

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = primaryColor
  ctx.fillRect(0, 0, 512, 512)
  ctx.fillStyle = secondaryColor

  switch (pattern) {
    case 'vertical-stripes':
      for (let i = 0; i < 8; i += 2) {
        ctx.fillRect(i * 64, 0, 64, 512)
      }
      break
    case 'horizontal-stripes':
      for (let i = 0; i < 8; i += 2) {
        ctx.fillRect(0, i * 64, 512, 64)
      }
      break
    case 'gradient':
      const gradient = ctx.createLinearGradient(0, 0, 0, 512)
      gradient.addColorStop(0, primaryColor)
      gradient.addColorStop(1, secondaryColor)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 512, 512)
      break
    case 'checkered':
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(i * 64, j * 64, 64, 64)
          }
        }
      }
      break
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

// Create composite texture with design overlay
function createCompositeTexture(
  primaryColor: string,
  patternTexture: THREE.CanvasTexture | null,
  frontDesignUrl: string | null,
  blendMode: string,
  designOpacity: number
): Promise<THREE.CanvasTexture> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(new THREE.CanvasTexture(document.createElement('canvas')))
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 2048
    const ctx = canvas.getContext('2d')!

    // Layer 1: Base color
    ctx.fillStyle = primaryColor
    ctx.fillRect(0, 0, 2048, 2048)

    // Layer 2: Pattern (if exists)
    if (patternTexture && patternTexture.image) {
      ctx.drawImage(patternTexture.image as HTMLCanvasElement, 0, 0, 2048, 2048)
    }

    // Load and draw design image
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = url
      })
    }

    const drawDesigns = async () => {
      ctx.globalAlpha = designOpacity

      const blendModeMap: Record<string, GlobalCompositeOperation> = {
        normal: 'source-over',
        multiply: 'multiply',
        overlay: 'overlay',
      }
      ctx.globalCompositeOperation = blendModeMap[blendMode] || 'source-over'

      if (frontDesignUrl) {
        try {
          const frontImg = await loadImage(frontDesignUrl)
          ctx.drawImage(frontImg, 0, 0, 2048, 2048)
        } catch (e) {
          console.warn('Failed to load design')
        }
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      resolve(texture)
    }

    drawDesigns()
  })
}

export default function PantsModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { pants } = useCustomizerStore()
  const { scene } = useGLTF('/models/pants.glb')
  const [compositeTexture, setCompositeTexture] = useState<THREE.CanvasTexture | null>(null)

  // Clone the scene so we can modify materials
  const clonedScene = useMemo(() => scene.clone(), [scene])

  // Get design data URL
  const frontDesignUrl = pants.design?.front?.canvasDataUrl || null
  const blendMode = pants.design?.blendMode || 'normal'
  const designOpacity = pants.design?.designOpacity ?? 1

  // Update materials when colors/pattern/design change
  useEffect(() => {
    if (!clonedScene) return

    const patternTexture = createPatternTexture(
      pants.pattern,
      pants.primaryColor,
      pants.secondaryColor
    )

    // Check if we have any design
    const hasDesign = frontDesignUrl

    if (hasDesign) {
      // Create composite texture with design overlay
      createCompositeTexture(
        pants.primaryColor,
        patternTexture,
        frontDesignUrl,
        blendMode,
        designOpacity
      ).then((texture) => {
        setCompositeTexture(texture)

        clonedScene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const material = new THREE.MeshStandardMaterial({
              color: '#ffffff',
              map: texture,
              roughness: 0.8,
              metalness: 0,
              side: THREE.DoubleSide,
            })
            child.material = material
            child.castShadow = true
            child.receiveShadow = true
          }
        })
      })
    } else {
      // No design, use pattern or solid color
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = new THREE.MeshStandardMaterial({
            color: patternTexture ? '#ffffff' : pants.primaryColor,
            map: patternTexture || null,
            roughness: 0.8,
            metalness: 0,
            side: THREE.DoubleSide,
          })
          child.material = material
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }

    return () => {
      if (patternTexture) patternTexture.dispose()
      if (compositeTexture) compositeTexture.dispose()
    }
  }, [clonedScene, pants.primaryColor, pants.secondaryColor, pants.pattern, frontDesignUrl, blendMode, designOpacity])

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -1.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01
    }
  })

  return (
    <group ref={groupRef} scale={2} position={[0, -1.2, 0]}>
      <primitive object={clonedScene} />
    </group>
  )
}
