'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

function TestScene() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  )
}

export default function TestThreePage() {
  return (
    <div className="w-full h-screen bg-black">
      <h1 className="absolute top-4 left-4 text-white z-10">Test Three.js</h1>
      <Canvas>
        <Suspense fallback={null}>
          <TestScene />
        </Suspense>
      </Canvas>
    </div>
  )
}