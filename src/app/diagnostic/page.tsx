'use client'

import { useEffect, useState } from 'react'

export default function DiagnosticPage() {
  const [results, setResults] = useState<Record<string, boolean | string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      const diagnostics: Record<string, boolean | string> = {}

      // Test 1: Basic JavaScript
      try {
        diagnostics['JavaScript'] = true
      } catch (e) {
        diagnostics['JavaScript'] = `Error: ${e}`
      }

      // Test 2: React
      try {
        if (typeof window !== 'undefined' && window.React) {
          diagnostics['React'] = true
        } else {
          diagnostics['React'] = 'React not found on window object'
        }
      } catch (e) {
        diagnostics['React'] = `Error: ${e}`
      }

      // Test 3: Three.js
      try {
        if (typeof window !== 'undefined') {
          const THREE = await import('three')
          diagnostics['Three.js'] = true
          console.log('Three.js version:', THREE.VERSION)
        } else {
          diagnostics['Three.js'] = 'Window object not available'
        }
      } catch (e) {
        diagnostics['Three.js'] = `Error: ${e}`
      }

      // Test 4: WebGL
      try {
        if (typeof window !== 'undefined') {
          const canvas = document.createElement('canvas')
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
          diagnostics['WebGL'] = !!gl
          if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
            if (debugInfo) {
              diagnostics['WebGL Renderer'] = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
              diagnostics['WebGL Vendor'] = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
            }
          }
        } else {
          diagnostics['WebGL'] = 'Window object not available'
        }
      } catch (e) {
        diagnostics['WebGL'] = `Error: ${e}`
      }

      // Test 5: React Three Fiber
      try {
        if (typeof window !== 'undefined') {
          const { Canvas } = await import('@react-three/fiber')
          diagnostics['React Three Fiber'] = true
        } else {
          diagnostics['React Three Fiber'] = 'Window object not available'
        }
      } catch (e) {
        diagnostics['React Three Fiber'] = `Error: ${e}`
      }

      // Test 6: Network connectivity
      try {
        const response = await fetch('/api/health', { method: 'HEAD' })
        diagnostics['Network'] = response.ok
      } catch (e) {
        diagnostics['Network'] = `Error: ${e}`
      }

      // Test 7: Canvas 2D
      try {
        if (typeof window !== 'undefined') {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          diagnostics['Canvas 2D'] = !!ctx
        } else {
          diagnostics['Canvas 2D'] = 'Window object not available'
        }
      } catch (e) {
        diagnostics['Canvas 2D'] = `Error: ${e}`
      }

      setResults(diagnostics)
      setLoading(false)
    }

    runDiagnostics()
  }, [])

  const getStatusColor = (result: boolean | string) => {
    if (result === true) return 'text-green-400'
    if (typeof result === 'string' && result.includes('Error')) return 'text-red-400'
    return 'text-yellow-400'
  }

  const getStatusIcon = (result: boolean | string) => {
    if (result === true) return '✅'
    if (typeof result === 'string' && result.includes('Error')) return '❌'
    return '⚠️'
  }

  return (
    <div className="w-full h-screen bg-black text-white p-8 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 R.A.I.N. Lab Diagnostics</h1>
      
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>Running diagnostics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">System Diagnostic Results</h2>
            <div className="space-y-3">
              {Object.entries(results).map(([test, result]) => (
                <div key={test} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                  <span className="font-medium">{test}:</span>
                  <span className={getStatusColor(result)}>
                    {getStatusIcon(result)} {typeof result === 'boolean' ? (result ? 'Pass' : 'Fail') : result}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-gray-800 rounded">
                <h3 className="font-medium text-cyan-400">If Three.js fails to load:</h3>
                <ul className="list-disc list-inside mt-2 text-gray-300">
                  <li>Check if your browser supports WebGL</li>
                  <li>Try updating your browser to the latest version</li>
                  <li>Check browser console for specific error messages</li>
                  <li>Try a different browser (Chrome, Firefox, Safari)</li>
                </ul>
              </div>
              
              <div className="p-3 bg-gray-800 rounded">
                <h3 className="font-medium text-cyan-400">If WebGL is not supported:</h3>
                <ul className="list-disc list-inside mt-2 text-gray-300">
                  <li>Enable WebGL in your browser settings</li>
                  <li>Update your graphics drivers</li>
                  <li>Try hardware acceleration in browser settings</li>
                  <li>Use a different device or browser</li>
                </ul>
              </div>
              
              <div className="p-3 bg-gray-800 rounded">
                <h3 className="font-medium text-cyan-400">If React Three Fiber fails:</h3>
                <ul className="list-disc list-inside mt-2 text-gray-300">
                  <li>Check if all dependencies are properly installed</li>
                  <li>Look for version conflicts between Three.js and React Three Fiber</li>
                  <li>Check browser console for React errors</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Pages</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <a href="/simple" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                <h3 className="font-medium text-cyan-400">Simple 3D Test</h3>
                <p className="text-sm text-gray-400">Basic React Three Fiber</p>
              </a>
              
              <a href="/minimal" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                <h3 className="font-medium text-cyan-400">Minimal 3D Test</h3>
                <p className="text-sm text-gray-400">Most basic Three.js</p>
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
                <p className="text-sm text-gray-400">Error detection</p>
              </a>
              
              <a href="/clipboard-test" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                <h3 className="font-medium text-cyan-400">Clipboard Test</h3>
                <p className="text-sm text-gray-400">Clipboard API functionality</p>
              </a>
              
              <a href="/demo.html" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                <h3 className="font-medium text-cyan-400">Standalone Demo</h3>
                <p className="text-sm text-gray-400">Pure Three.js demo</p>
              </a>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Browser Console</h2>
            <p className="text-gray-400 mb-4">
              Press F12 to open browser developer tools and check the Console tab for detailed error messages.
              Look for red error messages that might indicate what's going wrong.
            </p>
            <div className="bg-gray-800 p-4 rounded font-mono text-sm">
              <p className="text-green-400">Common things to look for:</p>
              <ul className="list-disc list-inside mt-2 text-gray-300">
                <li>Three.js loading errors</li>
                <li>WebGL context creation failures</li>
                <li>React component errors</li>
                <li>Network request failures</li>
                <li>JavaScript syntax errors</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}