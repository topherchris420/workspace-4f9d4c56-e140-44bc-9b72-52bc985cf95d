'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, BufferGeometry, BufferAttribute } from 'three'

interface FieldVisualizationProps {
  apparatusType: 'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer'
  strength: number
  voltageLevel: number
  resonanceLevel: number
}

export function FieldVisualization({
  apparatusType,
  strength,
  voltageLevel,
  resonanceLevel
}: FieldVisualizationProps) {
  const groupRef = useRef<Group>(null)
  const [animationTime, setAnimationTime] = useState(0)
  
  // Generate field line geometry based on apparatus type
  const fieldGeometry = useMemo(() => {
    const geometry = new BufferGeometry()
    const positions: number[] = []
    const colors: number[] = []
    
    switch (apparatusType) {
      case 'biefeld-brown':
        // Radial field lines from capacitor plates
        for (let i = 0; i < 50; i++) {
          const angle = (i / 50) * Math.PI * 2
          const radius = 1 + Math.random() * 3
          
          for (let j = 0; j < 20; j++) {
            const t = j / 19
            const x = Math.cos(angle) * radius * t
            const y = (Math.random() - 0.5) * 2
            const z = Math.sin(angle) * radius * t
            
            positions.push(x, y, z)
            colors.push(0, 1, 1) // Cyan
          }
        }
        break
        
      case 'flux-capacitor':
        // Spiral field lines for flux capacitor
        for (let i = 0; i < 30; i++) {
          const phaseOffset = (i / 30) * Math.PI * 2
          
          for (let j = 0; j < 40; j++) {
            const t = j / 39
            const angle = phaseOffset + t * Math.PI * 4
            const radius = 0.5 + t * 2
            const x = Math.cos(angle) * radius
            const y = t * 2 - 1
            const z = Math.sin(angle) * radius
            
            positions.push(x, y, z)
            colors.push(1, 0.5, 0) // Orange
          }
        }
        break
        
      case 'zinsser':
        // Wave field lines for water dielectric
        for (let i = 0; i < 40; i++) {
          const xOffset = (i / 40) * 4 - 2
          
          for (let j = 0; j < 30; j++) {
            const zOffset = (j / 30) * 3 - 1.5
            const y = Math.sin(xOffset * 2 + zOffset * 2) * 0.5
            
            positions.push(xOffset, y, zOffset)
            colors.push(0, 1, 0.5) // Green-cyan
          }
        }
        break
        
      case 'electrokinetic-saucer':
        // Complex 3D field for saucer
        for (let i = 0; i < 60; i++) {
          const phi = (i / 60) * Math.PI
          
          for (let j = 0; j < 60; j++) {
            const theta = (j / 60) * Math.PI * 2
            const radius = 2 + Math.sin(phi * 3) * 0.5
            
            const x = Math.sin(phi) * Math.cos(theta) * radius
            const y = Math.cos(phi) * radius
            const z = Math.sin(phi) * Math.sin(theta) * radius
            
            positions.push(x, y, z)
            colors.push(1, 0, 1) // Magenta
          }
        }
        break
    }
    
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
    geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
    
    return geometry
  }, [apparatusType])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    setAnimationTime(time)
    
    if (groupRef.current) {
      // Animate field intensity based on resonance and voltage
      const fieldIntensity = strength * voltageLevel * (1 + Math.sin(time * resonanceLevel * 2) * 0.3)
      groupRef.current.visible = fieldIntensity > 0.1
      
      // Rotate field based on apparatus type
      switch (apparatusType) {
        case 'biefeld-brown':
          groupRef.current.rotation.y = time * 0.5
          break
        case 'flux-capacitor':
          groupRef.current.rotation.y = time * 2
          groupRef.current.rotation.z = time * 0.5
          break
        case 'zinsser':
          groupRef.current.rotation.x = time * 0.3
          break
        case 'electrokinetic-saucer':
          groupRef.current.rotation.y = time * 1
          groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2
          break
      }
      
      // Pulsing effect
      const pulseScale = 1 + Math.sin(time * 5) * 0.1 * fieldIntensity
      groupRef.current.scale.setScalar(pulseScale)
    }
  })

  const getFieldColor = () => {
    switch (apparatusType) {
      case 'biefeld-brown': return '#00ffff'
      case 'flux-capacitor': return '#ff8800'
      case 'zinsser': return '#00ff88'
      case 'electrokinetic-saucer': return '#ff00ff'
      default: return '#00ffff'
    }
  }

  return (
    <group ref={groupRef}>
      {/* Field lines */}
      <lineSegments geometry={fieldGeometry}>
        <lineBasicMaterial
          color={getFieldColor()}
          transparent
          opacity={0.6 * strength}
          linewidth={2}
        />
      </lineSegments>
      
      {/* Field intensity spheres */}
      {strength > 0.3 && (
        <group>
          {Array.from({ length: 5 }, (_, i) => {
            const radius = 1 + i * 0.8
            const pulsePhase = (animationTime * 3 + i) % 1
            
            return (
              <mesh key={i} scale={[pulsePhase, pulsePhase, pulsePhase]}>
                <sphereGeometry args={[radius, 16, 16]} />
                <meshStandardMaterial
                  color={getFieldColor()}
                  transparent
                  opacity={strength * 0.1 * (1 - pulsePhase)}
                  wireframe
                />
              </mesh>
            )
          })}
        </group>
      )}
      
      {/* Voltage field distortion */}
      {voltageLevel > 0.7 && (
        <mesh>
          <sphereGeometry args={[6, 24, 24]} />
          <meshStandardMaterial
            color={getFieldColor()}
            transparent
            opacity={voltageLevel * strength * 0.05}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}