'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'

interface ZinsserModuleProps {
  constructionProgress: number
  fieldStrength: number
  voltageLevel: number
  resonanceLevel: number
}

export function ZinsserModule({
  constructionProgress,
  fieldStrength,
  voltageLevel,
  resonanceLevel
}: ZinsserModuleProps) {
  const groupRef = useRef<Group>(null)
  const waterContainerRef = useRef<Mesh>(null)
  const electrodePlatesRef = useRef<Group>(null)
  const pulseGeneratorRef = useRef<Mesh>(null)
  const forceFieldRef = useRef<Group>(null)
  const [pulsePositions, setPulsePositions] = useState([0, 0, 0, 0, 0])
  const [wavePhases, setWavePhases] = useState([0, 0, 0])

  // Calculate kinetobaric driving impulse (6 Ns/W as per document)
  const calculateKinetobaricForce = (time: number) => {
    const pulseDuration = 1e-9 // Nanosecond pulses
    const energyInput = voltageLevel * fieldStrength
    const force = 6 * energyInput // 6 N/W from Peschka's calculation
    return force * Math.sin(time * 100) // High frequency pulsing
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (groupRef.current) {
      // Sustained force simulation (force continues after pulse off)
      const sustainedForce = calculateKinetobaricForce(time)
      groupRef.current.position.y = Math.sin(time * 0.5) * sustainedForce * 0.1
      
      // Resonance modulation
      groupRef.current.rotation.y = time * resonanceLevel * 0.3
    }

    // Water container effects
    if (waterContainerRef.current) {
      // Water dielectric constant (~80) effects
      const dielectricEffect = 1 + fieldStrength * 0.2
      waterContainerRef.current.scale.setScalar(dielectricEffect)
      
      // Water turbulence visualization
      const waterMaterial = Array.isArray(waterContainerRef.current.material) 
        ? waterContainerRef.current.material[0] 
        : waterContainerRef.current.material
      if ('opacity' in waterMaterial) {
        waterMaterial.opacity = 0.6 + Math.sin(time * 10) * 0.1 * fieldStrength
      }
    }

    // Electrode plate charging
    if (electrodePlatesRef.current) {
      electrodePlatesRef.current.children.forEach((plate, index) => {
        const plateMesh = plate as Mesh
        const chargePhase = (time * 20 + index * Math.PI) % (Math.PI * 2)
        const chargeIntensity = Math.sin(chargePhase) * voltageLevel * fieldStrength
        
        const plateMaterial = Array.isArray(plateMesh.material) 
          ? plateMesh.material[0] 
          : plateMesh.material
        if (plateMaterial && 'emissive' in plateMaterial) {
          (plateMaterial as any).emissive.setRGB(
            index === 0 ? chargeIntensity * 0.8 : chargeIntensity * 0.2,
            chargeIntensity * 0.4,
            index === 1 ? chargeIntensity * 0.8 : chargeIntensity * 0.2
          )
        }
      })
    }

    // Pulse generator effects
    if (pulseGeneratorRef.current) {
      const pulseRate = 100000 // 100 kHz operation
      const pulsePhase = (time * pulseRate) % 1
      const pulseIntensity = pulsePhase < 0.1 ? fieldStrength : 0
      
      const generatorMaterial = Array.isArray(pulseGeneratorRef.current.material) 
        ? pulseGeneratorRef.current.material[0] 
        : pulseGeneratorRef.current.material
      if ('emissiveIntensity' in generatorMaterial) {
        generatorMaterial.emissiveIntensity = pulseIntensity
      }
      pulseGeneratorRef.current.scale.setScalar(1 + pulseIntensity * 0.2)
    }

    // Force field visualization
    if (forceFieldRef.current) {
      const forceStrength = calculateKinetobaricForce(time)
      forceFieldRef.current.children.forEach((fieldLine, index) => {
        const fieldMesh = fieldLine as Mesh
        const phaseOffset = index * 0.2
        const fieldPhase = (time * 5 + phaseOffset) % 1
        
        fieldMesh.scale.y = 1 + forceStrength * Math.sin(fieldPhase * Math.PI * 2)
        const fieldMaterial = Array.isArray(fieldMesh.material) 
          ? fieldMesh.material[0] 
          : fieldMesh.material
        if ('opacity' in fieldMaterial) {
          fieldMaterial.opacity = 0.3 + forceStrength * 0.4
        }
      })
    }

    // Update pulse positions and wave phases
    setPulsePositions(prev => prev.map((_, i) => (time * 10 + i * 0.5) % 3))
    setWavePhases(prev => prev.map((_, i) => (time * 2 + i) % 1))
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
      {/* Water container with high dielectric constant */}
      <mesh ref={waterContainerRef}>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshStandardMaterial
          color="#0066cc"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Conductive electrode plates */}
      <group ref={electrodePlatesRef}>
        {/* Positive electrode */}
        <mesh position={[0.8, 0, 0]}>
          <boxGeometry args={[0.1, 1.3, 0.8]} />
          <meshStandardMaterial
            color="#ff4444"
            metalness={0.9}
            roughness={0.1}
            emissive="#ff0000"
            emissiveIntensity={0}
          />
        </mesh>
        
        {/* Negative electrode */}
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[0.1, 1.3, 0.8]} />
          <meshStandardMaterial
            color="#4444ff"
            metalness={0.9}
            roughness={0.1}
            emissive="#0000ff"
            emissiveIntensity={0}
          />
        </mesh>
      </group>

      {/* Quarter wavelength resonator design */}
      {constructionProgress > 0.4 && (
        <group>
          {Array.from({ length: 4 }, (_, i) => (
            <mesh
              key={i}
              position={[
                (i - 1.5) * 0.4,
                0,
                0.6
              ]}
            >
              <cylinderGeometry args={[0.05, 0.05, 0.3]} />
              <meshStandardMaterial
                color="#ffff00"
                metalness={0.8}
                emissive="#ffff00"
                emissiveIntensity={voltageLevel * 0.3}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Pulse generator */}
      {constructionProgress > 0.6 && (
        <mesh ref={pulseGeneratorRef} position={[0, -1.2, 0]}>
          <boxGeometry args={[1, 0.3, 0.5]} />
          <meshStandardMaterial
            color="#00ff00"
            metalness={0.7}
            roughness={0.3}
            emissive="#00ff00"
            emissiveIntensity={0}
          />
        </mesh>
      )}

      {/* Nanosecond pulse visualization */}
      {fieldStrength > 0.2 && (
        <group>
          {/* Pulse wave fronts */}
          {Array.from({ length: 5 }, (_, i) => {
            const pulsePosition = pulsePositions[i]
            return (
              <mesh
                key={i}
                position={[0, 0, pulsePosition - 1.5]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <ringGeometry args={[0.2, 0.8, 16]} />
                <meshStandardMaterial
                  color="#ff00ff"
                  transparent
                  opacity={fieldStrength * 0.3 * (1 - pulsePosition / 3)}
                  emissive="#ff00ff"
                  emissiveIntensity={fieldStrength * 0.5}
                />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Force field lines */}
      <group ref={forceFieldRef}>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const radius = 1.5
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
              rotation={[0, 0, angle]}
            >
              <cylinderGeometry args={[0.02, 0.02, 1]} />
              <meshStandardMaterial
                color="#00ffff"
                transparent
                opacity={0.3}
                emissive="#00ffff"
                emissiveIntensity={0.5}
              />
            </mesh>
          )
        })}
      </group>

      {/* Bacteriostasis and cytostasis effects visualization */}
      {fieldStrength > 0.3 && (
        <group>
          {/* Beneficial energy field */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.2, 16, 16]} />
            <meshStandardMaterial
              color="#00ff88"
              transparent
              opacity={fieldStrength * 0.1}
              emissive="#00ff88"
              emissiveIntensity={fieldStrength * 0.2}
              wireframe
            />
          </mesh>
          
          {/* Healing pulse waves */}
          {Array.from({ length: 3 }, (_, i) => {
            const waveRadius = 0.5 + i * 0.3
            const wavePhase = wavePhases[i]
            return (
              <mesh
                key={i}
                scale={[wavePhase, wavePhase, wavePhase]}
              >
                <sphereGeometry args={[waveRadius, 12, 12]} />
                <meshStandardMaterial
                  color="#88ff00"
                  transparent
                  opacity={fieldStrength * 0.2 * (1 - wavePhase)}
                  wireframe
                />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Force output indicator */}
      {fieldStrength > 0.4 && (
        <group position={[0, 1.5, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.2, 0.8, 6]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={fieldStrength}
            />
          </mesh>
          
          {/* Force magnitude indicator */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={fieldStrength * 0.8}
            />
          </mesh>
        </group>
      )}

      {/* Storage effect visualization */}
      {fieldStrength > 0.1 && (
        <mesh position={[0, 0, -1.5]}>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial
            color="#ffaa00"
            transparent
            opacity={fieldStrength * 0.5}
            emissive="#ffaa00"
            emissiveIntensity={fieldStrength * 0.3}
          />
        </mesh>
      )}
    </group>
  )
}