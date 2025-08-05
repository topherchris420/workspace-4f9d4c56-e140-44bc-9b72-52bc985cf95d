'use client'

import { useEffect, useRef } from 'react'

export default function BasicTestPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        throw new Error('Could not get 2D context')
      }

      // Draw a simple test pattern
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(50, 50, 100, 100)
      
      ctx.fillStyle = '#00ff00'
      ctx.beginPath()
      ctx.arc(250, 100, 50, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#0000ff'
      ctx.font = '20px Arial'
      ctx.fillText('Canvas Test Working!', 50, 200)
      
      console.log('Canvas test completed successfully')
    } catch (error) {
      console.error('Canvas test failed:', error)
    }
  }, [])

  return (
    <div className="w-full h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Basic Canvas Test</h1>
      <p className="mb-4">If you see red, green, and blue shapes below, Canvas is working:</p>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border border-white"
      />
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Test Links:</h2>
        <div className="space-y-2">
          <a href="/simple" className="block text-cyan-400 hover:text-cyan-300">
            → Simple 3D Test
          </a>
          <a href="/minimal" className="block text-cyan-400 hover:text-cyan-300">
            → Minimal 3D Test
          </a>
          <a href="/error-test" className="block text-cyan-400 hover:text-cyan-300">
            → Error Test
          </a>
          <a href="/demo.html" className="block text-cyan-400 hover:text-cyan-300">
            → Standalone Demo
          </a>
        </div>
      </div>
    </div>
  )
}