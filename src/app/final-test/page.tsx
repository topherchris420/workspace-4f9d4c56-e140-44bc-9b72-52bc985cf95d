'use client'

import { useState, useEffect } from 'react'

export default function FinalTestPage() {
  const [threeStatus, setThreeStatus] = useState('Loading...')
  const [webglStatus, setWebglStatus] = useState('Loading...')
  const [canvas2DStatus, setCanvas2DStatus] = useState('Loading...')

  useEffect(() => {
    // Test Canvas 2D
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'red'
        ctx.fillRect(0, 0, 10, 10)
        setCanvas2DStatus('✅ Canvas 2D Working')
      } else {
        setCanvas2DStatus('❌ Canvas 2D Failed')
      }
    } catch (e) {
      setCanvas2DStatus(`❌ Canvas 2D Error: ${e}`)
    }

    // Test WebGL
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl) {
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        setWebglStatus('✅ WebGL Working')
      } else {
        setWebglStatus('❌ WebGL Not Available')
      }
    } catch (e) {
      setWebglStatus(`❌ WebGL Error: ${e}`)
    }

    // Test Three.js
    import('three').then(THREE => {
      setThreeStatus('✅ Three.js Loaded Successfully')
      console.log('Three.js version:', THREE.VERSION)
    }).catch(e => {
      setThreeStatus(`❌ Three.js Failed: ${e}`)
    })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🧪 Final Test Page</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="font-medium mb-2">Canvas 2D</h3>
              <p className={canvas2DStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}>
                {canvas2DStatus}
              </p>
            </div>
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="font-medium mb-2">WebGL</h3>
              <p className={webglStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}>
                {webglStatus}
              </p>
            </div>
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="font-medium mb-2">Three.js</h3>
              <p className={threeStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}>
                {threeStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Results Summary</h2>
          <div className="space-y-4">
            {canvas2DStatus.includes('✅') && webglStatus.includes('✅') && threeStatus.includes('✅') ? (
              <div className="p-4 bg-green-900/20 border border-green-500 rounded">
                <h3 className="text-green-400 font-semibold mb-2">✅ All Systems Working!</h3>
                <p className="text-green-300">
                  Your browser supports all required technologies. The 3D visualization should work.
                  If you're still having issues, check the browser console for JavaScript errors.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-900/20 border border-red-500 rounded">
                <h3 className="text-red-400 font-semibold mb-2">❌ Issues Detected</h3>
                <p className="text-red-300">
                  Your browser has compatibility issues that may prevent the 3D visualization from working.
                  Please check the specific errors above and try the troubleshooting steps.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Available Test Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="/simple" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
              <h3 className="font-medium text-cyan-400">Simple 3D Test</h3>
              <p className="text-sm text-gray-400">Basic React Three Fiber setup</p>
            </a>
            
            <a href="/minimal" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
              <h3 className="font-medium text-cyan-400">Minimal 3D Test</h3>
              <p className="text-sm text-gray-400">Most basic Three.js test</p>
            </a>
            
            <a href="/basic-test" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
              <h3 className="font-medium text-cyan-400">Basic Canvas Test</h3>
              <p className="text-sm text-gray-400">2D Canvas functionality</p>
            </a>
            
            <a href="/webgl-test" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
              <h3 className="font-medium text-cyan-400">WebGL Test</h3>
              <p className="text-sm text-gray-400">WebGL rendering test</p>
            </a>
            
            <a href="/error-test" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
              <h3 className="font-medium text-cyan-400">Error Test</h3>
              <p className="text-sm text-gray-400">Error detection test</p>
            </a>
            
            <a href="/diagnostic" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
              <h3 className="font-medium text-cyan-400">Full Diagnostics</h3>
              <p className="text-sm text-gray-400">Complete system analysis</p>
            </a>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-cyan-400 mb-2">If all tests pass:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Return to the main page (/) and wait for the loading screen to disappear</li>
                <li>Check the browser console (F12) for any JavaScript errors</li>
                <li>Try the standalone demo (/demo.html) as an alternative</li>
                <li>If issues persist, try refreshing the page or using a different browser</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-cyan-400 mb-2">If tests fail:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Update your browser to the latest version</li>
                <li>Enable WebGL and hardware acceleration in browser settings</li>
                <li>Update your graphics drivers</li>
                <li>Try a different browser (Chrome, Firefox, Safari, Edge)</li>
                <li>Try a different device if available</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="flex flex-wrap gap-4">
            <a href="/" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded transition-colors">
              🏠 Main Application
            </a>
            <a href="/demo.html" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded transition-colors">
              🎬 Standalone Demo
            </a>
            <a href="/diagnostic" className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded transition-colors">
              🔍 Run Diagnostics
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}