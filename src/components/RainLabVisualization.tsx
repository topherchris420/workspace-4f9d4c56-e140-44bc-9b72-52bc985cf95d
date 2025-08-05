'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, Vector3 } from 'three'
import { BiefeldBrownApparatus } from './apparatus/BiefeldBrownApparatus'
import { FluxCapacitor } from './apparatus/FluxCapacitor'
import { ZinsserModule } from './apparatus/ZinsserModule'
import { ElectrokineticSaucer } from './apparatus/ElectrokineticSaucer'
import { FieldVisualization } from './effects/FieldVisualization'
import { ParticleSystem } from './effects/ParticleSystem'
import { WaveformModulator } from './effects/WaveformModulator'

interface RainLabVisualizationProps {
  phase: 'construction' | 'simulation' | 'deconstruction'
  currentApparatus: 'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer'
  resonanceLevel: number
}

export function RainLabVisualization({ 
  phase, 
  currentApparatus, 
  resonanceLevel 
}: RainLabVisualizationProps) {
  const groupRef = useRef<Group>(null)
  const [constructionProgress, setConstructionProgress] = useState(0)
  const [fieldStrength, setFieldStrength] = useState(0)
  const [voltageLevel, setVoltageLevel] = useState(0)

  console.log('RainLabVisualization rendered:', { phase, currentApparatus, resonanceLevel })

  // Animation state management
  useEffect(() => {
    let animationFrame: number
    let startTime: number | null = null
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      
      switch (phase) {
        case 'construction':
          setConstructionProgress(prev => Math.min(prev + 0.02, 1))
          setFieldStrength(prev => prev * 0.95) // Decay field during construction
          setVoltageLevel(prev => Math.min(prev + 0.01, 1))
          break
        case 'simulation':
          setConstructionProgress(1)
          setFieldStrength(prev => {
            const target = 0.5 + Math.sin(elapsed * 0.001) * 0.3
            return prev + (target - prev) * 0.1
          })
          setVoltageLevel(prev => {
            const target = 0.8 + Math.sin(elapsed * 0.002) * 0.2
            return prev + (target - prev) * 0.05
          })
          break
        case 'deconstruction':
          setConstructionProgress(prev => Math.max(prev - 0.015, 0))
          setFieldStrength(prev => prev * 0.9)
          setVoltageLevel(prev => Math.max(prev - 0.02, 0))
          break
      }
      
      animationFrame = requestAnimationFrame(animate)
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [phase])

  // Biocentric waveform modulation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      const bioFrequency = 0.1 + resonanceLevel * 0.05 // 0.1-0.15 Hz (alpha brainwave range)
      
      // Subtle organic movement
      groupRef.current.rotation.y = Math.sin(time * bioFrequency) * 0.1
      groupRef.current.position.y = Math.sin(time * bioFrequency * 2) * 0.2
      
      // Resonance-based scaling
      const resonanceScale = 1 + Math.sin(time * bioFrequency * 3) * resonanceLevel * 0.1
      groupRef.current.scale.setScalar(resonanceScale)
    }
  })

  const renderApparatus = () => {
    const commonProps = {
      constructionProgress,
      fieldStrength,
      voltageLevel,
      resonanceLevel
    }

    switch (currentApparatus) {
      case 'biefeld-brown':
        return <BiefeldBrownApparatus {...commonProps} />
      case 'flux-capacitor':
        return <FluxCapacitor {...commonProps} />
      case 'zinsser':
        return <ZinsserModule {...commonProps} />
      case 'electrokinetic-saucer':
        return <ElectrokineticSaucer {...commonProps} />
      default:
        return <BiefeldBrownApparatus {...commonProps} />
    }
  }

  return (
    <group ref={groupRef}>
      {/* Debug test cube - should always be visible */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="magenta" />
      </mesh>

      {/* Ground plane for reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#001122" 
          transparent 
          opacity={0.3}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Main apparatus */}
      {renderApparatus()}

      {/* Field visualization */}
      {phase === 'simulation' && (
        <FieldVisualization
          apparatusType={currentApparatus}
          strength={fieldStrength}
          voltageLevel={voltageLevel}
          resonanceLevel={resonanceLevel}
        />
      )}

      {/* Particle effects */}
      <ParticleSystem
        phase={phase}
        fieldStrength={fieldStrength}
        apparatusType={currentApparatus}
      />

      {/* Waveform modulator */}
      <WaveformModulator
        active={phase === 'simulation'}
        resonanceLevel={resonanceLevel}
        frequency={0.1 + resonanceLevel * 0.05}
      />

      {/* Ambient energy field */}
      {phase === 'simulation' && (
        <mesh>
          <sphereGeometry args={[8, 32, 32]} />
          <meshStandardMaterial
            color="#00ffff"
            transparent
            opacity={0.05 * fieldStrength}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}