'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'

interface WaveformModulatorProps {
  active: boolean
  resonanceLevel: number
  frequency: number
}

export function WaveformModulator({
  active,
  resonanceLevel,
  frequency
}: WaveformModulatorProps) {
  const groupRef = useRef<Group>(null)
  const [animationTime, setAnimationTime] = useState(0)
  
  // Generate biocentric waveform geometry
  const waveformGeometry = useMemo(() => {
    const points: Vector3[] = []
    const segments = 100
    const radius = 8
    
    // Create complex biocentric waveform
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 4
      const alpha = (i / segments) * Math.PI * 2
      
      // Multiple frequency components for biocentric complexity
      const primaryWave = Math.sin(t * frequency)
      const secondaryWave = Math.sin(t * frequency * 2.618) * 0.382 // Golden ratio
      const tertiaryWave = Math.sin(t * frequency * 1.414) * 0.207 // Square root of 2
      
      const combinedWave = primaryWave + secondaryWave + tertiaryWave
      const modulation = 1 + resonanceLevel * combinedWave * 0.3
      
      const x = Math.cos(alpha) * radius * modulation
      const y = combinedWave * 2
      const z = Math.sin(alpha) * radius * modulation
      
      points.push(new Vector3(x, y, z))
    }
    
    return points
  }, [frequency, resonanceLevel])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    setAnimationTime(time)
    
    if (groupRef.current && active) {
      // Rotate the waveform modulator
      groupRef.current.rotation.y = time * 0.1
      groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.1
      
      // Pulsing based on resonance
      const pulseScale = 1 + Math.sin(time * frequency * 2) * resonanceLevel * 0.2
      groupRef.current.scale.setScalar(pulseScale)
      
      // Update waveform points for dynamic modulation
      updateWaveformPoints(time)
    }
  })

  const updateWaveformPoints = (time: number) => {
    if (!groupRef.current) return
    
    const line = groupRef.current.children[0] as any
    if (!line || !line.geometry) return
    
    const positions = line.geometry.attributes.position.array
    const segments = positions.length / 3 - 1
    
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 4
      const alpha = (i / segments) * Math.PI * 2
      
      // Time-varying biocentric waveform
      const primaryWave = Math.sin(t * frequency + time)
      const secondaryWave = Math.sin(t * frequency * 2.618 + time * 1.618) * 0.382
      const tertiaryWave = Math.sin(t * frequency * 1.414 + time * 0.618) * 0.207
      
      const combinedWave = primaryWave + secondaryWave + tertiaryWave
      const modulation = 1 + resonanceLevel * combinedWave * 0.3
      
      const radius = 8
      const x = Math.cos(alpha + time * 0.1) * radius * modulation
      const y = combinedWave * 2
      const z = Math.sin(alpha + time * 0.1) * radius * modulation
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
    
    line.geometry.attributes.position.needsUpdate = true
  }

  if (!active) return null

  return (
    <group ref={groupRef}>
      {/* Primary biocentric waveform */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(waveformGeometry.flatMap(p => [p.x, p.y, p.z])), 3]}
            count={waveformGeometry.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.6}
          linewidth={3}
        />
      </line>
      
      {/* Secondary harmonic waveform */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(waveformGeometry.flatMap((p, i) => [
              p.x * 0.8,
              p.y * 0.6 + Math.sin(i * 0.1) * 0.5,
              p.z * 0.8
            ])), 3]}
            count={waveformGeometry.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ff00ff"
          transparent
          opacity={0.4}
          linewidth={2}
        />
      </line>
      
      {/* Tertiary harmonic waveform */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(waveformGeometry.flatMap((p, i) => [
              p.x * 0.6,
              p.y * 0.4 + Math.cos(i * 0.15) * 0.3,
              p.z * 0.6
            ])), 3]}
            count={waveformGeometry.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffff00"
          transparent
          opacity={0.3}
          linewidth={1}
        />
      </line>
      
      {/* Resonance nodes */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 6
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={resonanceLevel}
            />
          </mesh>
        )
      })}
      
      {/* Energy flow indicators */}
      {resonanceLevel > 0.5 && (
        <group>
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2
            const radius = 4 + Math.sin(animationTime * 2 + i) * 2
            
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(animationTime * 3 + i * 0.5) * 0.5,
                  Math.sin(angle) * radius
                ]}
              >
                <sphereGeometry args={[0.05, 4, 4]} />
                <meshStandardMaterial
                  color="#00ff88"
                  emissive="#00ff88"
                  emissiveIntensity={resonanceLevel * 0.8}
                />
              </mesh>
            )
          })}
        </group>
      )}
      
      {/* Central consciousness field */}
      <mesh>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={resonanceLevel * 0.1}
          emissive="#ffffff"
          emissiveIntensity={resonanceLevel * 0.3}
        />
      </mesh>
    </group>
  )
}