'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

function SimpleBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function SimplePage() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SimpleBox />
          
          {/* Environment and Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
          />
          
          {/* Controls */}
          <OrbitControls />
        </Suspense>
      </Canvas>

      <div className="absolute top-8 left-8 z-20">
        <h1 className="text-2xl font-bold text-white">
          Simple 3D Test
        </h1>
        <p className="text-gray-300 text-sm">
          If you see an orange cube, Three.js is working
        </p>
      </div>
    </div>
  )
}