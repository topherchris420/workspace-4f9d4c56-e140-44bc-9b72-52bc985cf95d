'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'

interface FluxCapacitorProps {
  constructionProgress: number
  fieldStrength: number
  voltageLevel: number
  resonanceLevel: number
}

export function FluxCapacitor({
  constructionProgress,
  fieldStrength,
  voltageLevel,
  resonanceLevel
}: FluxCapacitorProps) {
  const groupRef = useRef<Group>(null)
  const capacitorRef = useRef<Mesh>(null)
  const pulseRingsRef = useRef<Group>(null)
  const coreRef = useRef<Mesh>(null)
  const [pulsePhases, setPulsePhases] = useState([0, 0, 0])

  // Calculate mass fluctuation based on Woodward effect
  const calculateMassFluctuation = (time: number) => {
    // d²E/dt² relationship from Woodward-Nordtvedt effect
    const energyFlow = voltageLevel * fieldStrength
    const massFluctuation = Math.sin(time * 50) * energyFlow * 0.001 // Centigram scale
    return massFluctuation
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (groupRef.current) {
      // Pulsed discharge animation
      const pulseFrequency = 50000 // 50 kHz as mentioned in document
      const pulsePhase = (time * pulseFrequency) % 1
      
      // Resonance oscillation
      groupRef.current.rotation.y = time * resonanceLevel * 0.5
      groupRef.current.position.y = Math.sin(time * 2) * 0.1 * fieldStrength
    }

    // Capacitor core effects
    if (capacitorRef.current) {
      const massFluct = calculateMassFluctuation(time)
      const scale = 1 + massFluct
      capacitorRef.current.scale.setScalar(scale)
      
      // Voltage-based glow
      const glowIntensity = voltageLevel * fieldStrength
      const capacitorMaterial = Array.isArray(capacitorRef.current.material) 
        ? capacitorRef.current.material[0] 
        : capacitorRef.current.material
      if (capacitorMaterial && 'emissive' in capacitorMaterial) {
        (capacitorMaterial as any).emissive.setRGB(
          glowIntensity * 0.8,
          glowIntensity * 0.4,
          glowIntensity * 0.2
        )
      }
    }

    // Pulse ring effects
    if (pulseRingsRef.current) {
      pulseRingsRef.current.children.forEach((ring, index) => {
        const ringMesh = ring as Mesh
        const phaseOffset = index * 0.25
        const pulseIntensity = Math.sin(time * 10 + phaseOffset) * fieldStrength
        
        ringMesh.scale.setScalar(1 + pulseIntensity * 0.3)
        const ringMaterial = Array.isArray(ringMesh.material) 
          ? ringMesh.material[0] 
          : ringMesh.material
        if ('opacity' in ringMaterial) {
          ringMaterial.opacity = 0.3 + pulseIntensity * 0.4
        }
      })
    }

    // Core energy field
    if (coreRef.current) {
      const coreEnergy = Math.sin(time * 20) * fieldStrength
      const coreMaterial = Array.isArray(coreRef.current.material) 
        ? coreRef.current.material[0] 
        : coreRef.current.material
      if ('emissiveIntensity' in coreMaterial) {
        coreMaterial.emissiveIntensity = coreEnergy
      }
      coreRef.current.rotation.x = time * 2
      coreRef.current.rotation.z = time * 1.5
    }

    // Update pulse phases for energy spheres
    setPulsePhases(prev => prev.map((_, i) => (time * 5 + i) % 1))
  })

  // Construction animation
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(constructionProgress)
      groupRef.current.position.y = constructionProgress * 2
    }
  }, [constructionProgress])

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {/* Main capacitor disk */}
      <mesh ref={capacitorRef}>
        <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
        <meshStandardMaterial
          color="#ffaa00"
          metalness={0.9}
          roughness={0.1}
          emissive="#ff6600"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Barium titanate dielectric core */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.4, 16]} />
        <meshStandardMaterial
          color="#00ffaa"
          transparent
          opacity={0.6}
          emissive="#00ff88"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Pulse discharge rings */}
      <group ref={pulseRingsRef}>
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={i} position={[0, 0, i * 0.2 - 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2 + i * 0.2, 0.05, 8, 32]} />
            <meshStandardMaterial
              color="#00ffff"
              transparent
              opacity={0.3}
              emissive="#00ffff"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* High voltage terminals */}
      {constructionProgress > 0.6 && (
        <>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3]} />
            <meshStandardMaterial
              color="#ff0000"
              metalness={1}
              emissive="#ff0000"
              emissiveIntensity={voltageLevel * 0.5}
            />
          </mesh>
          
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3]} />
            <meshStandardMaterial
              color="#0000ff"
              metalness={1}
              emissive="#0000ff"
              emissiveIntensity={voltageLevel * 0.5}
            />
          </mesh>
        </>
      )}

      {/* Energy field visualization */}
      {fieldStrength > 0.2 && (
        <group>
          {/* Radial energy lines */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2
            return (
              <mesh
                key={i}
                position={[0, 0, 0]}
                rotation={[0, 0, angle]}
              >
                <boxGeometry args={[2, 0.02, 0.02]} />
                <meshStandardMaterial
                  color="#ffff00"
                  transparent
                  opacity={fieldStrength * 0.4}
                  emissive="#ffff00"
                  emissiveIntensity={fieldStrength * 0.6}
                />
              </mesh>
            )
          })}
          
          {/* Pulsed energy spheres */}
          {Array.from({ length: 3 }, (_, i) => {
            const radius = 2 + i * 0.5
            const pulsePhase = pulsePhases[i]
            return (
              <mesh
                key={i}
                scale={[pulsePhase, pulsePhase, pulsePhase]}
              >
                <sphereGeometry args={[radius, 16, 16]} />
                <meshStandardMaterial
                  color="#ff00ff"
                  transparent
                  opacity={fieldStrength * 0.1 * (1 - pulsePhase)}
                  wireframe
                />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Mass fluctuation indicator */}
      {fieldStrength > 0.4 && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={fieldStrength}
          />
        </mesh>
      )}

      {/* Force output visualization */}
      {fieldStrength > 0.3 && (
        <group position={[0, 0, 2]}>
          {/* Thrust vector */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.3, 1, 8]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={fieldStrength * 0.8}
            />
          </mesh>
          
          {/* Force magnitude rings */}
          {Array.from({ length: 3 }, (_, i) => (
            <mesh
              key={i}
              position={[0, 0, i * 0.3]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.2 + i * 0.1, 0.3 + i * 0.1, 16]} />
              <meshStandardMaterial
                color="#00ff00"
                transparent
                opacity={fieldStrength * 0.5 * (1 - i * 0.3)}
                emissive="#00ff00"
                emissiveIntensity={fieldStrength * 0.3}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}