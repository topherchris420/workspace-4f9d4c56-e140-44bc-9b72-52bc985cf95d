'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'
import { Suspense } from 'react'

function DebugScene() {
  return (
    <>
      <Box args={[2, 2, 2]}>
        <meshStandardMaterial color="hotpink" />
      </Box>
      <OrbitControls />
    </>
  )
}

export default function DebugPage() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <DebugScene />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
        </Suspense>
      </Canvas>
      <div className="absolute top-4 left-4 text-white bg-black/50 p-4 rounded">
        <h1 className="text-xl font-bold mb-2">Debug Page</h1>
        <p className="text-sm">If you see a pink cube, React Three Fiber is working</p>
        <p className="text-xs mt-2 text-gray-400">
          Check browser console for errors
        </p>
      </div>
    </div>
  )
}