'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'
import { RoundedBox } from '@react-three/drei'

interface BiefeldBrownApparatusProps {
  constructionProgress: number
  fieldStrength: number
  voltageLevel: number
  resonanceLevel: number
}

export function BiefeldBrownApparatus({
  constructionProgress,
  fieldStrength,
  voltageLevel,
  resonanceLevel
}: BiefeldBrownApparatusProps) {
  const groupRef = useRef<Group>(null)
  const positivePlateRef = useRef<Mesh>(null)
  const negativePlateRef = useRef<Mesh>(null)
  const dielectricRef = useRef<Mesh>(null)
  const fieldLinesRef = useRef<Group>(null)

  // Physics calculations based on the document
  const calculateForce = () => {
    // F ≈ Vm1m2/r² (from Brown's experimental formula)
    const baseVoltage = 150000 + voltageLevel * 100000 // 150-250 kV range
    const mass1 = 20 // kg (approximate mass of first plate)
    const mass2 = 20 // kg (approximate mass of second plate)
    const distance = 0.5 // meters between plates
    
    const force = (baseVoltage * mass1 * mass2) / (distance * distance)
    return force / 1000000 // Scale down for visualization
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (groupRef.current) {
      // Electrogravitic force simulation
      const force = calculateForce()
      const displacement = Math.sin(time * 2) * force * fieldStrength * 0.1
      
      // Movement toward positive charge (as per Brown's findings)
      groupRef.current.position.x = displacement
      
      // Resonance-based oscillation
      groupRef.current.rotation.z = Math.sin(time * resonanceLevel * 5) * 0.05
    }

    // Plate charging effects
    if (positivePlateRef.current && negativePlateRef.current) {
      const glowIntensity = voltageLevel * fieldStrength
      
      // Positive plate glow
      const positiveMaterial = Array.isArray(positivePlateRef.current.material) 
        ? positivePlateRef.current.material[0] 
        : positivePlateRef.current.material
      if (positiveMaterial && 'emissive' in positiveMaterial) {
        (positiveMaterial as any).emissive.setRGB(
          glowIntensity * 0.3,
          glowIntensity * 0.1,
          glowIntensity * 0.8
        )
      }
      
      // Negative plate glow
      const negativeMaterial = Array.isArray(negativePlateRef.current.material) 
        ? negativePlateRef.current.material[0] 
        : negativePlateRef.current.material
      if (negativeMaterial && 'emissive' in negativeMaterial) {
        (negativeMaterial as any).emissive.setRGB(
          glowIntensity * 0.8,
          glowIntensity * 0.1,
          glowIntensity * 0.3
        )
      }
    }

    // Dielectric field interaction
    if (dielectricRef.current) {
      const fieldCompression = 1 + fieldStrength * 0.1
      dielectricRef.current.scale.y = fieldCompression
    }
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
      {/* Positive plate (leading) */}
      <mesh
        ref={positivePlateRef}
        position={[1, 0, 0]}
        rotation={[0, 0, Math.PI / 6]}
      >
        <RoundedBox args={[0.1, 3, 2]} radius={0.02} smoothness={4}>
          <meshStandardMaterial
            color="#aa2222"
            metalness={0.9}
            roughness={0.3}
            emissive="#ff0000"
            emissiveIntensity={0}
            toneMapped={false}
          />
        </RoundedBox>
      </mesh>

      {/* Dielectric material */}
      <mesh
        ref={dielectricRef}
        position={[0, 0, 0]}
      >
        <RoundedBox args={[0.3, 2.8, 1.8]} radius={0.05} smoothness={4}>
          <meshPhysicalMaterial
            color="#88aaff"
            metalness={0.1}
            roughness={0.1}
            transmission={1.0}
            thickness={1.0}
            transparent
            opacity={0.3}
          />
        </RoundedBox>
      </mesh>

      {/* Negative plate (trailing) */}
      <mesh
        ref={negativePlateRef}
        position={[-1, 0, 0]}
        rotation={[0, 0, -Math.PI / 6]}
      >
        <RoundedBox args={[0.1, 3, 2]} radius={0.02} smoothness={4}>
          <meshStandardMaterial
            color="#2222aa"
            metalness={0.9}
            roughness={0.3}
            emissive="#0000ff"
            emissiveIntensity={0}
            toneMapped={false}
          />
        </RoundedBox>
      </mesh>

      {/* High voltage connections */}
      {constructionProgress > 0.5 && (
        <>
          {/* Positive connection */}
          <mesh position={[1.5, 1.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1]} />
            <meshStandardMaterial color="#b87333" metalness={0.9} roughness={0.2} />
          </mesh>
          
          {/* Negative connection */}
          <mesh position={[-1.5, -1.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
          </mesh>
        </>
      )}

      {/* Field lines visualization */}
      {fieldStrength > 0.1 && (
        <group ref={fieldLinesRef}>
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const radius = 1.5
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle) * 0.5,
                  Math.sin(angle) * radius
                ]}
              >
                <cylinderGeometry args={[0.005, 0.005, 2]} />
                <meshStandardMaterial
                  color="#00ffff"
                  transparent
                  opacity={fieldStrength * 0.3}
                  emissive="#00ffff"
                  emissiveIntensity={fieldStrength * 0.5}
                />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Ion cloud visualization */}
      {fieldStrength > 0.2 && (
        <group>
          {/* Positive ion cloud (front) */}
          <mesh position={[2, 0, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial
              color="#ff6666"
              transparent
              opacity={fieldStrength * 0.2}
              emissive="#ff0000"
              emissiveIntensity={fieldStrength * 0.3}
            />
          </mesh>
          
          {/* Negative ion cloud (back) */}
          <mesh position={[-2, 0, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial
              color="#6666ff"
              transparent
              opacity={fieldStrength * 0.2}
              emissive="#0000ff"
              emissiveIntensity={fieldStrength * 0.3}
            />
          </mesh>
        </group>
      )}

      {/* Force direction indicator */}
      {fieldStrength > 0.3 && (
        <mesh position={[3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.2, 1, 8]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={fieldStrength * 0.8}
          />
        </mesh>
      )}
    </group>
  )
}