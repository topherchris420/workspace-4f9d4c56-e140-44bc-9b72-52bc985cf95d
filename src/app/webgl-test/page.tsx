'use client'

import { useEffect, useRef, useState } from 'react'

export default function WebGLTestPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglStatus, setWebglStatus] = useState<string>('Testing...')

  useEffect(() => {
    if (!canvasRef.current) return

    try {
      const canvas = canvasRef.current
      
      // Test WebGL context
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      
      if (!gl) {
        setWebglStatus('❌ WebGL not supported')
        return
      }

      // Simple WebGL test
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      
      // Create a simple shader program
      const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `
      
      const fragmentShaderSource = `
        precision mediump float;
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `
      
      const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
      gl.shaderSource(vertexShader, vertexShaderSource)
      gl.compileShader(vertexShader)
      
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
      gl.shaderSource(fragmentShader, fragmentShaderSource)
      gl.compileShader(fragmentShader)
      
      const program = gl.createProgram()!
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Shader program failed to link')
      }
      
      gl.useProgram(program)
      
      // Create a simple triangle
      const vertices = new Float32Array([
        0.0,  0.5,
       -0.5, -0.5,
        0.5, -0.5
      ])
      
      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
      
      const positionLocation = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      
      setWebglStatus('✅ WebGL working correctly')
      console.log('WebGL test completed successfully')
      
    } catch (error) {
      console.error('WebGL test failed:', error)
      setWebglStatus(`❌ WebGL error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }, [])

  return (
    <div className="w-full h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">WebGL Test</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">WebGL Status:</h2>
        <p className={webglStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}>
          {webglStatus}
        </p>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">WebGL Canvas:</h2>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border border-white"
        />
        <p className="text-sm text-gray-400 mt-2">
          You should see a red triangle above if WebGL is working
        </p>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Test Links:</h2>
        <div className="space-y-2">
          <a href="/simple" className="block text-cyan-400 hover:text-cyan-300">
            → Simple 3D Test
          </a>
          <a href="/minimal" className="block text-cyan-400 hover:text-cyan-300">
            → Minimal 3D Test
          </a>
          <a href="/basic-test" className="block text-cyan-400 hover:text-cyan-300">
            → Basic Canvas Test
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