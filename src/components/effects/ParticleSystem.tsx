'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'

interface ParticleSystemProps {
  phase: 'construction' | 'simulation' | 'deconstruction'
  fieldStrength: number
  apparatusType: 'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer'
}

interface Particle {
  position: Vector3
  velocity: Vector3
  life: number
  maxLife: number
  size: number
  color: string
}

export function ParticleSystem({
  phase,
  fieldStrength,
  apparatusType
}: ParticleSystemProps) {
  const groupRef = useRef<Group>(null)
  
  // Generate particles based on apparatus type
  const particles = useMemo(() => {
    const particleArray: Particle[] = []
    const particleCount = phase === 'simulation' ? 200 : 50
    
    const getParticleColor = (type: string, random: number): string => {
      switch (type) {
        case 'biefeld-brown':
          return random > 0.5 ? '#ff6666' : '#6666ff'
        case 'flux-capacitor':
          return random > 0.5 ? '#ffaa00' : '#00aaff'
        case 'zinsser':
          return random > 0.5 ? '#00ff88' : '#0088ff'
        case 'electrokinetic-saucer':
          return random > 0.5 ? '#ff00ff' : '#00ffff'
        default:
          return '#ffffff'
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      const position = new Vector3()
      const velocity = new Vector3()
      
      switch (apparatusType) {
        case 'biefeld-brown':
          // Ion particles moving between plates
          position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
          )
          velocity.set(
            Math.random() * 0.02 - 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
          )
          break
          
        case 'flux-capacitor':
          // Energy particles in spiral motion
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * 2
          position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 2,
            Math.sin(angle) * radius
          )
          velocity.set(
            -Math.sin(angle) * 0.02,
            Math.random() * 0.02 - 0.01,
            Math.cos(angle) * 0.02
          )
          break
          
        case 'zinsser':
          // Water molecules and charge carriers
          position.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2
          )
          velocity.set(
            Math.random() * 0.01 - 0.005,
            Math.random() * 0.02 - 0.01,
            Math.random() * 0.01 - 0.005
          )
          break
          
        case 'electrokinetic-saucer':
          // Plasma particles around saucer
          const phi = Math.random() * Math.PI
          const theta = Math.random() * Math.PI * 2
          const r = 2 + Math.random() * 2
          position.set(
            Math.sin(phi) * Math.cos(theta) * r,
            Math.cos(phi) * r,
            Math.sin(phi) * Math.sin(theta) * r
          )
          velocity.set(
            (Math.random() - 0.5) * 0.02,
            Math.random() * 0.02,
            (Math.random() - 0.5) * 0.02
          )
          break
      }
      
      particleArray.push({
        position,
        velocity,
        life: Math.random(),
        maxLife: 1 + Math.random() * 2,
        size: 0.02 + Math.random() * 0.03,
        color: getParticleColor(apparatusType, Math.random())
      })
    }
    
    return particleArray
  }, [apparatusType, phase])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    
    if (groupRef.current && phase === 'simulation') {
      particles.forEach((particle, index) => {
        // Update particle life
        particle.life -= delta / particle.maxLife
        
        // Respawn particle if dead
        if (particle.life <= 0) {
          respawnParticle(particle, apparatusType)
        }
        
        // Apply field forces
        applyFieldForces(particle, fieldStrength, apparatusType, time)
        
        // Update position
        particle.position.add(particle.velocity)
        
        // Update particle mesh
        if (groupRef.current && index < groupRef.current.children.length) {
          const particleMesh = groupRef.current.children[index] as any
          if (particleMesh) {
            particleMesh.position.copy(particle.position)
            particleMesh.scale.setScalar(particle.life * particle.size * 50)
            particleMesh.material.opacity = particle.life * fieldStrength
          }
        }
      })
    }
  })

  const respawnParticle = (particle: Particle, type: string) => {
    particle.life = particle.maxLife
    
    switch (type) {
      case 'biefeld-brown':
        particle.position.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        )
        break
      case 'flux-capacitor':
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 2
        particle.position.set(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius
        )
        break
      case 'zinsser':
        particle.position.set(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 2
        )
        break
      case 'electrokinetic-saucer':
        const phi = Math.random() * Math.PI
        const theta = Math.random() * Math.PI * 2
        const r = 2 + Math.random() * 2
        particle.position.set(
          Math.sin(phi) * Math.cos(theta) * r,
          Math.cos(phi) * r,
          Math.sin(phi) * Math.sin(theta) * r
        )
        break
    }
  }

  const applyFieldForces = (
    particle: Particle, 
    strength: number, 
    type: string, 
    time: number
  ) => {
    const force = new Vector3()
    
    switch (type) {
      case 'biefeld-brown':
        // Electrogravitic force toward positive plate
        force.x = strength * 0.001
        force.y = Math.sin(time * 2 + particle.position.x) * strength * 0.0005
        break
        
      case 'flux-capacitor':
        // Spiral force field
        const distance = particle.position.length()
        const angle = Math.atan2(particle.position.z, particle.position.x)
        force.x = -Math.sin(angle) * strength * 0.001 / distance
        force.z = Math.cos(angle) * strength * 0.001 / distance
        force.y = Math.sin(time * 5) * strength * 0.0005
        break
        
      case 'zinsser':
        // Wave-based force field
        force.x = Math.sin(particle.position.x * 2 + time * 3) * strength * 0.0005
        force.y = Math.cos(particle.position.z * 2 + time * 2) * strength * 0.0005
        force.z = Math.sin(particle.position.y * 2 + time * 4) * strength * 0.0005
        break
        
      case 'electrokinetic-saucer':
        // Complex 3D force field
        const r = particle.position.length()
        if (r > 0.1) {
          force.copy(particle.position).normalize().multiplyScalar(-strength * 0.0005 / r)
          force.y += strength * 0.001 // Upward thrust
        }
        break
    }
    
    particle.velocity.add(force)
    
    // Apply damping
    particle.velocity.multiplyScalar(0.98)
  }

  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <mesh key={index}>
          <sphereGeometry args={[particle.size, 4, 4]} />
          <meshStandardMaterial
            color={particle.color}
            transparent
            opacity={0}
            emissive={particle.color}
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  )
}