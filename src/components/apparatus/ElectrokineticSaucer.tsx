'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'

interface ElectrokineticSaucerProps {
  constructionProgress: number
  fieldStrength: number
  voltageLevel: number
  resonanceLevel: number
}

export function ElectrokineticSaucer({
  constructionProgress,
  fieldStrength,
  voltageLevel,
  resonanceLevel
}: ElectrokineticSaucerProps) {
  const groupRef = useRef<Group>(null)
  const saucerBodyRef = useRef<Mesh>(null)
  const distributorRef = useRef<Mesh>(null)
  const capacitorSectionsRef = useRef<Group>(null)
  const [dischargeAngles, setDischargeAngles] = useState([0, 0, 0, 0, 0, 0])
  const [dischargePhases, setDischargePhases] = useState([0, 0, 0, 0, 0, 0])
  const [pulsePhases, setPulsePhases] = useState([0, 0, 0])
  const [fieldStrengthVars, setFieldStrengthVars] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [fieldLinePositions, setFieldLinePositions] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [thrustParticles, setThrustParticles] = useState<Array<{angle: number, radius: number, speed: number}>>([])

  // Initialize thrust particles
  useEffect(() => {
    const particles = Array.from({ length: 20 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 0.8,
      speed: 2 + Math.random() * 2
    }))
    setThrustParticles(particles)
  }, [])

  // Calculate electrokinetic force based on Jefimenko's equations
  const calculateElectrokineticForce = (time: number) => {
    // Ek = -μ₀/4π ∫(∂J/∂t)/r dV (from Jefimenko's electrokinetic field equation)
    const currentChangeRate = voltageLevel * fieldStrength * 1000 // High dI/dt
    const permeability = 4 * Math.PI * 1e-7 // μ₀
    const force = (permeability * currentChangeRate) / (4 * Math.PI)
    return force * Math.sin(time * 30) // Pulsed operation
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (groupRef.current) {
      // Advanced propulsion simulation
      const electrokineticForce = calculateElectrokineticForce(time)
      
      // Hovering motion
      groupRef.current.position.y = 3 + Math.sin(time * 0.5) * 0.5 * fieldStrength
      
      // Lateral movement from electrokinetic force
      groupRef.current.position.x = Math.sin(time * 0.3) * electrokineticForce * 2
      
      // Banking during turns
      groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.2
      
      // Resonance-based stabilization
      groupRef.current.rotation.y = time * resonanceLevel * 0.2
    }

    // Saucer body effects
    if (saucerBodyRef.current) {
      const energyLevel = voltageLevel * fieldStrength
      const saucerMaterial = Array.isArray(saucerBodyRef.current.material) 
        ? saucerBodyRef.current.material[0] 
        : saucerBodyRef.current.material
      if (saucerMaterial && 'emissive' in saucerMaterial) {
        (saucerMaterial as any).emissive.setRGB(
          energyLevel * 0.2,
          energyLevel * 0.4,
          energyLevel * 0.8
        )
      }
      
      // Structural integrity field
      const fieldCompression = 1 + energyLevel * 0.05
      saucerBodyRef.current.scale.setScalar(fieldCompression)
    }

    // Rotating distributor cap
    if (distributorRef.current) {
      distributorRef.current.rotation.y = time * 10 // High speed rotation
      
      // Pulsed discharge timing
      const dischargePhase = (time * 30) % 1
      const dischargeIntensity = dischargePhase < 0.1 ? fieldStrength : 0
      const distributorMaterial = Array.isArray(distributorRef.current.material) 
        ? distributorRef.current.material[0] 
        : distributorRef.current.material
      if ('emissiveIntensity' in distributorMaterial) {
        distributorMaterial.emissiveIntensity = dischargeIntensity
      }
    }

    // Capacitor section charging
    if (capacitorSectionsRef.current) {
      capacitorSectionsRef.current.children.forEach((section, index) => {
        const sectionMesh = section as Mesh
        const chargeDelay = index * 0.1 // Sequential charging
        const chargePhase = ((time * 5 + chargeDelay) % 1)
        const chargeIntensity = Math.sin(chargePhase * Math.PI) * voltageLevel * fieldStrength
        
        const sectionMaterial = Array.isArray(sectionMesh.material) 
          ? sectionMesh.material[0] 
          : sectionMesh.material
        if (sectionMaterial && 'emissive' in sectionMaterial) {
          (sectionMaterial as any).emissive.setRGB(
            chargeIntensity * 0.8,
            chargeIntensity * 0.4,
            chargeIntensity * 0.2
          )
        }
        
        // Section activation pulse
        if (chargePhase > 0.8 && chargePhase < 0.9) {
          sectionMesh.scale.setScalar(1.1)
        } else {
          sectionMesh.scale.setScalar(1)
        }
      })
    }

    // Update animation states
    setDischargeAngles(prev => prev.map((_, i) => (i / 6) * Math.PI * 2 + time * 2))
    setDischargePhases(prev => prev.map((_, i) => (time * 30 + i) % 1))
    setPulsePhases(prev => prev.map((_, i) => (time * 3 + i) % 1))
    setFieldStrengthVars(prev => prev.map((_, i) => Math.sin(time * 5 + i * 0.5) * fieldStrength))
    setFieldLinePositions(prev => prev.map((_, i) => Math.sin(time * 2 + i) * 0.5))
  })

  // Construction animation
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(constructionProgress)
      groupRef.current.position.y = constructionProgress * 3
    }
  }, [constructionProgress])

  return (
    <group ref={groupRef} position={[0, 3, 0]}>
      {/* Main saucer body */}
      <mesh ref={saucerBodyRef}>
        <cylinderGeometry args={[3, 2, 0.8, 32]} />
        <meshStandardMaterial
          color="#444466"
          metalness={0.8}
          roughness={0.2}
          emissive="#0066ff"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Central dome */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#666688"
          metalness={0.9}
          roughness={0.1}
          emissive="#0088ff"
          emissiveIntensity={voltageLevel * 0.3}
        />
      </mesh>

      {/* Rotating distributor cap */}
      <mesh ref={distributorRef} position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
        <meshStandardMaterial
          color="#ffaa00"
          metalness={1}
          roughness={0}
          emissive="#ffaa00"
          emissiveIntensity={0}
        />
      </mesh>

      {/* Radial capacitor sections */}
      <group ref={capacitorSectionsRef}>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const radius = 1.5
          return (
            <group key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
              {/* Metal plate */}
              <mesh rotation={[0, 0, angle]}>
                <boxGeometry args={[0.8, 0.6, 0.05]} />
                <meshStandardMaterial
                  color="#888888"
                  metalness={0.9}
                  roughness={0.1}
                  emissive="#444444"
                  emissiveIntensity={0}
                />
              </mesh>
              
              {/* Dielectric layer */}
              <mesh position={[0, 0, 0.03]} rotation={[0, 0, angle]}>
                <boxGeometry args={[0.7, 0.5, 0.02]} />
                <meshStandardMaterial
                  color="#0066cc"
                  transparent
                  opacity={0.6}
                  emissive="#0044aa"
                  emissiveIntensity={0}
                />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* High voltage bus bars */}
      {constructionProgress > 0.5 && (
        <group>
          {Array.from({ length: 3 }, (_, i) => {
            const angle = (i / 3) * Math.PI * 2
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 2.2,
                  0,
                  Math.sin(angle) * 2.2
                ]}
                rotation={[0, 0, angle]}
              >
                <cylinderGeometry args={[0.05, 0.05, 1]} />
                <meshStandardMaterial
                  color="#ffaa00"
                  metalness={1}
                  emissive="#ffaa00"
                  emissiveIntensity={voltageLevel * 0.5}
                />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Pulsed discharge visualization */}
      {fieldStrength > 0.2 && (
        <group>
          {/* Discharge arcs */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = dischargeAngles[i]
            const dischargePhase = dischargePhases[i]
            
            if (dischargePhase < 0.1) {
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * 2.5,
                    0,
                    Math.sin(angle) * 2.5
                  ]}
                >
                  <cylinderGeometry args={[0.02, 0.1, 1]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={fieldStrength}
                  />
                </mesh>
              )
            }
            return null
          })}
          
          {/* Energy pulse rings */}
          {Array.from({ length: 3 }, (_, i) => {
            const pulseRadius = 3 + i * 0.5
            const pulsePhase = pulsePhases[i]
            return (
              <mesh
                key={i}
                position={[0, 0, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[pulsePhase, pulsePhase, pulsePhase]}
              >
                <ringGeometry args={[pulseRadius - 0.1, pulseRadius, 32]} />
                <meshStandardMaterial
                  color="#00ffff"
                  transparent
                  opacity={fieldStrength * 0.3 * (1 - pulsePhase)}
                  emissive="#00ffff"
                  emissiveIntensity={fieldStrength * 0.5}
                />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Electrokinetic field visualization */}
      {fieldStrength > 0.3 && (
        <group>
          {/* Field lines */}
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2
            const fieldStrengthVar = fieldStrengthVars[i]
            const fieldLinePosition = fieldLinePositions[i]
            
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 4,
                  fieldLinePosition,
                  Math.sin(angle) * 4
                ]}
                rotation={[0, 0, angle]}
              >
                <cylinderGeometry args={[0.01, 0.01, 2]} />
                <meshStandardMaterial
                  color="#ff00ff"
                  transparent
                  opacity={fieldStrengthVar * 0.4}
                  emissive="#ff00ff"
                  emissiveIntensity={fieldStrengthVar * 0.6}
                />
              </mesh>
            )
          })}
          
          {/* Force field bubble */}
          <mesh>
            <sphereGeometry args={[5, 24, 24]} />
            <meshStandardMaterial
              color="#ff00ff"
              transparent
              opacity={fieldStrength * 0.05}
              wireframe
            />
          </mesh>
        </group>
      )}

      {/* Thrust vector visualization */}
      {fieldStrength > 0.4 && (
        <group position={[0, -1, 0]}>
          {/* Main thrust cone */}
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[1, 2, 12]} />
            <meshStandardMaterial
              color="#00ff00"
              transparent
              opacity={0.6}
              emissive="#00ff00"
              emissiveIntensity={fieldStrength * 0.8}
            />
          </mesh>
          
          {/* Thrust particles */}
          {Array.from({ length: 20 }, (_, i) => {
            const particle = thrustParticles[i]
            if (!particle) return null
            
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(particle.angle) * particle.radius,
                  -i * 0.15, // Fixed spacing instead of random
                  Math.sin(particle.angle) * particle.radius
                ]}
              >
                <sphereGeometry args={[0.05, 4, 4]} />
                <meshStandardMaterial
                  color="#00ff88"
                  emissive="#00ff88"
                  emissiveIntensity={fieldStrength}
                />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Navigation lights */}
      <group>
        <mesh position={[3.2, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.8}
          />
        </mesh>
        
        <mesh position={[-3.2, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </group>
  )
}