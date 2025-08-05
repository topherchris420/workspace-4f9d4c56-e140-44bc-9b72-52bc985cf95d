'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

function MinimalScene() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  )
}

export default function MinimalPage() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <MinimalScene />
        </Suspense>
      </Canvas>
      <div className="absolute top-4 left-4 text-white">
        Minimal Three.js Test
      </div>
    </div>
  )
}