'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import { useCustomizerStore } from '@/lib/store'
import ShirtModel from './ShirtModel'
import PantsModel from './PantsModel'
import * as THREE from 'three'

function LoadingSpinner() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  )
}

function Scene() {
  const { activeProduct, viewAngle } = useCustomizerStore()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current) {
      if (viewAngle === 'front') {
        controlsRef.current.setAzimuthalAngle(0)
        controlsRef.current.setPolarAngle(Math.PI / 2)
      } else if (viewAngle === 'back') {
        controlsRef.current.setAzimuthalAngle(Math.PI)
        controlsRef.current.setPolarAngle(Math.PI / 2)
      }
      controlsRef.current.update()
    }
  }, [viewAngle])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={2}
        maxDistance={6}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.5} penumbra={1} />

      <Suspense fallback={<LoadingSpinner />}>
        {activeProduct === 'shirt' ? <ShirtModel /> : <PantsModel />}
      </Suspense>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.5}
        scale={5}
        blur={2}
        far={4}
      />

      <Environment preset="studio" />
    </>
  )
}

interface Canvas3DProps {
  className?: string
}

export default function Canvas3D({ className }: Canvas3DProps) {
  return (
    <div className={`canvas-container ${className || ''}`}>
      <Canvas shadows gl={{ preserveDrawingBuffer: true }} id="customizer-canvas">
        <Scene />
      </Canvas>
    </div>
  )
}
