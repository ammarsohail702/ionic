'use client'

import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useCustomizerStore, PatternType } from '@/lib/store'
import * as THREE from 'three'

// Preload the model
useGLTF.preload('/models/shirt.glb')

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
  backDesignUrl: string | null,
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

    // Load and draw design images
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

      // Map blend mode
      const blendModeMap: Record<string, GlobalCompositeOperation> = {
        normal: 'source-over',
        multiply: 'multiply',
        overlay: 'overlay',
      }
      ctx.globalCompositeOperation = blendModeMap[blendMode] || 'source-over'

      // Draw front design - covers the entire texture area
      // The design editor already has positioning built in
      if (frontDesignUrl) {
        try {
          const frontImg = await loadImage(frontDesignUrl)
          // Draw the design to cover the full texture
          // Users position elements within the editor canvas
          ctx.drawImage(frontImg, 0, 0, 2048, 2048)
        } catch (e) {
          console.warn('Failed to load front design')
        }
      }

      // Draw back design on the back UV area
      if (backDesignUrl) {
        try {
          const backImg = await loadImage(backDesignUrl)
          // For back, we might need different UV coordinates
          // This depends on the GLB model's UV layout
          ctx.drawImage(backImg, 0, 0, 2048, 2048)
        } catch (e) {
          console.warn('Failed to load back design')
        }
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      texture.flipY = false // Try not flipping
      resolve(texture)
    }

    drawDesigns()
  })
}

// Create text texture
function createTextTexture(text: string, color: string, fontSize: number = 64): THREE.CanvasTexture | null {
  if (typeof window === 'undefined' || !text) return null

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, 512, 256)
  ctx.fillStyle = color
  ctx.font = `bold ${fontSize}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 3
  ctx.strokeText(text.toUpperCase(), 256, 128)
  ctx.fillText(text.toUpperCase(), 256, 128)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Create number texture
function createNumberTexture(number: string, color: string, large: boolean = false): THREE.CanvasTexture | null {
  if (typeof window === 'undefined' || !number) return null

  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, 256, 256)
  const fontSize = large ? 180 : 100
  ctx.fillStyle = color
  ctx.font = `bold ${fontSize}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = large ? 6 : 4
  ctx.strokeText(number, 128, 128)
  ctx.fillText(number, 128, 128)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// Text on shirt
function ShirtText() {
  const { shirt } = useCustomizerStore()
  const [frontNameTex, setFrontNameTex] = useState<THREE.CanvasTexture | null>(null)
  const [backNameTex, setBackNameTex] = useState<THREE.CanvasTexture | null>(null)
  const [frontNumTex, setFrontNumTex] = useState<THREE.CanvasTexture | null>(null)
  const [backNumTex, setBackNumTex] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    if (shirt.teamName.content && shirt.teamName.position === 'front') {
      setFrontNameTex(createTextTexture(shirt.teamName.content, shirt.teamName.color, 48))
    } else {
      setFrontNameTex(null)
    }

    if (shirt.teamName.content && shirt.teamName.position === 'back') {
      setBackNameTex(createTextTexture(shirt.teamName.content, shirt.teamName.color, 48))
    } else {
      setBackNameTex(null)
    }

    if (shirt.playerNumber.number && shirt.playerNumber.showFront) {
      setFrontNumTex(createNumberTexture(shirt.playerNumber.number, shirt.playerNumber.color, false))
    } else {
      setFrontNumTex(null)
    }

    if (shirt.playerNumber.number && shirt.playerNumber.showBack) {
      setBackNumTex(createNumberTexture(shirt.playerNumber.number, shirt.playerNumber.color, true))
    } else {
      setBackNumTex(null)
    }
  }, [shirt.teamName, shirt.playerNumber])

  return (
    <>
      {/* Front team name */}
      {frontNameTex && (
        <mesh position={[0, 0.08, 0.042]}>
          <planeGeometry args={[0.12, 0.04]} />
          <meshBasicMaterial map={frontNameTex} transparent depthWrite={false} />
        </mesh>
      )}

      {/* Back team name */}
      {backNameTex && (
        <mesh position={[0, 0.12, -0.042]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.12, 0.04]} />
          <meshBasicMaterial map={backNameTex} transparent depthWrite={false} />
        </mesh>
      )}

      {/* Front number */}
      {frontNumTex && (
        <mesh position={[0, 0.02, 0.042]}>
          <planeGeometry args={[0.06, 0.06]} />
          <meshBasicMaterial map={frontNumTex} transparent depthWrite={false} />
        </mesh>
      )}

      {/* Back number */}
      {backNumTex && (
        <mesh position={[0, 0.04, -0.042]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.12, 0.12]} />
          <meshBasicMaterial map={backNumTex} transparent depthWrite={false} />
        </mesh>
      )}
    </>
  )
}

// Logo component
function ShirtLogo() {
  const { shirt } = useCustomizerStore()
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!shirt.logo.image) {
      setLogoTexture(null)
      return
    }

    const loader = new THREE.TextureLoader()
    loader.load(shirt.logo.image, (tex) => {
      tex.needsUpdate = true
      setLogoTexture(tex)
    })
  }, [shirt.logo.image])

  if (!logoTexture) return null

  const size = shirt.logo.scale * 0.06

  const getTransform = (): { pos: [number, number, number]; rot: [number, number, number] } => {
    switch (shirt.logo.position) {
      case 'chest-left':
        return { pos: [-0.04, 0.1, 0.042], rot: [0, 0, 0] }
      case 'chest-center':
        return { pos: [0, 0.1, 0.042], rot: [0, 0, 0] }
      case 'chest-right':
        return { pos: [0.04, 0.1, 0.042], rot: [0, 0, 0] }
      case 'back':
        return { pos: [0, 0, -0.042], rot: [0, Math.PI, 0] }
      case 'sleeve-left':
        return { pos: [-0.1, 0.14, 0.02], rot: [0, 0.4, 0] }
      case 'sleeve-right':
        return { pos: [0.1, 0.14, 0.02], rot: [0, -0.4, 0] }
      default:
        return { pos: [-0.04, 0.1, 0.042], rot: [0, 0, 0] }
    }
  }

  const { pos, rot } = getTransform()

  return (
    <mesh position={pos} rotation={rot}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={logoTexture} transparent alphaTest={0.5} depthWrite={false} />
    </mesh>
  )
}

export default function ShirtModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { shirt } = useCustomizerStore()
  const { scene } = useGLTF('/models/shirt.glb')
  const [compositeTexture, setCompositeTexture] = useState<THREE.CanvasTexture | null>(null)

  // Clone the scene so we can modify materials
  const clonedScene = useMemo(() => scene.clone(), [scene])

  // Get design data URLs
  const frontDesignUrl = shirt.design?.front?.canvasDataUrl || null
  const backDesignUrl = shirt.design?.back?.canvasDataUrl || null
  const blendMode = shirt.design?.blendMode || 'normal'
  const designOpacity = shirt.design?.designOpacity ?? 1

  // Update materials when colors/pattern/design change
  useEffect(() => {
    if (!clonedScene) return

    const patternTexture = createPatternTexture(
      shirt.pattern,
      shirt.primaryColor,
      shirt.secondaryColor
    )

    // Check if we have any design
    const hasDesign = frontDesignUrl || backDesignUrl

    if (hasDesign) {
      // Create composite texture with design overlay
      createCompositeTexture(
        shirt.primaryColor,
        patternTexture,
        frontDesignUrl,
        backDesignUrl,
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
            color: patternTexture ? '#ffffff' : shirt.primaryColor,
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
  }, [clonedScene, shirt.primaryColor, shirt.secondaryColor, shirt.pattern, frontDesignUrl, backDesignUrl, blendMode, designOpacity])

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.01
    }
  })

  return (
    <group ref={groupRef} scale={2} position={[0, -0.3, 0]}>
      <primitive object={clonedScene} />
      <ShirtText />
      <ShirtLogo />
    </group>
  )
}
