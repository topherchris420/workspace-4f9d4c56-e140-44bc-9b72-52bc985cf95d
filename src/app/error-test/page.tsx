'use client'

import { useEffect, useState } from 'react'

export default function ErrorTestPage() {
  const [error, setError] = useState<string | null>(null)
  const [threeLoaded, setThreeLoaded] = useState(false)

  useEffect(() => {
    const testThreeJs = async () => {
      try {
        // Test if Three.js is available
        if (typeof window !== 'undefined') {
          const test = await import('three')
          console.log('Three.js loaded successfully:', test)
          setThreeLoaded(true)
        }
      } catch (e) {
        console.error('Error loading Three.js:', e)
        setError(e instanceof Error ? e.message : String(e))
      }
    }
    
    testThreeJs()
  }, [])

  return (
    <div className="w-full h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Error Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Three.js Status:</h2>
          <p className={threeLoaded ? 'text-green-400' : 'text-red-400'}>
            {threeLoaded ? '✓ Three.js loaded successfully' : '✗ Three.js failed to load'}
          </p>
        </div>

        {error && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Error:</h2>
            <p className="text-red-400 bg-red-900/20 p-4 rounded">
              {error}
            </p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-2">Browser Console:</h2>
          <p className="text-gray-400">
            Check the browser console (F12) for detailed error messages
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Test Links:</h2>
          <div className="space-y-2">
            <a href="/simple" className="block text-cyan-400 hover:text-cyan-300">
              → Simple 3D Test
            </a>
            <a href="/minimal" className="block text-cyan-400 hover:text-cyan-300">
              → Minimal 3D Test
            </a>
            <a href="/test-three" className="block text-cyan-400 hover:text-cyan-300">
              → Test Three.js
            </a>
            <a href="/demo.html" className="block text-cyan-400 hover:text-cyan-300">
              → Standalone Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}