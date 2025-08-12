'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect } from 'react'
import { RainLabVisualization } from '@/components/RainLabVisualization'
import { LoadingScreen } from '@/components/LoadingScreen'
import { EpistemicOverlay } from '@/components/EpistemicOverlay'
import { ControlPanel } from '@/components/ControlPanel'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Settings, Play, Pause, RotateCcw } from "lucide-react"

// Safe clipboard function with error handling
const safeCopyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (error) {
    console.warn('Clipboard API failed:', error)
    
    // Fallback method
    try {
      if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        return true
      }
    } catch (fallbackError) {
      console.warn('Fallback clipboard method failed:', fallbackError)
    }
  }
  return false
}

interface MobileControlPanelProps {
  isPlaying: boolean
  onPlayPause: () => void
  currentApparatus: 'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer'
  onApparatusChange: (apparatus: 'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer') => void
}

function MobileControlPanel({
  isPlaying,
  onPlayPause,
  currentApparatus,
  onApparatusChange
}: MobileControlPanelProps) {
  const apparatusOptions = [
    { id: 'biefeld-brown', name: 'Biefeld-Brown', description: 'Electrogravitic Force' },
    { id: 'flux-capacitor', name: 'Flux Capacitor', description: 'Mass Fluctuation' },
    { id: 'zinsser', name: 'Zinsser Module', description: 'Kinetobaric Impulse' },
    { id: 'electrokinetic-saucer', name: 'Electrokinetic Saucer', description: 'Advanced Propulsion' }
  ] as const

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="bg-black/50 border-cyan-500/50">
            <Settings className="h-6 w-6 text-cyan-400" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="bg-black/90 border-t-cyan-500/50 text-white">
          <SheetHeader>
            <SheetTitle className="text-cyan-400">Controls</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-cyan-300 text-lg font-medium">Playback</h4>
              <Button onClick={onPlayPause} variant="outline" className="bg-transparent border-cyan-500/50">
                {isPlaying ? <Pause className="w-5 h-5 mr-2 text-cyan-400" /> : <Play className="w-5 h-5 mr-2 text-cyan-400" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
            </div>

            <h4 className="text-cyan-300 text-lg font-medium mb-4">Apparatus</h4>
            <div className="grid grid-cols-1 gap-3">
              {apparatusOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={currentApparatus === option.id ? 'default' : 'outline'}
                  onClick={() => onApparatusChange(option.id)}
                  className={`w-full justify-start h-auto py-3 ${currentApparatus === option.id ? 'bg-cyan-600 border-cyan-500' : 'bg-transparent border-gray-700'}`}
                >
                  <div className="text-left">
                    <div className="font-bold">{option.name}</div>
                    <div className="text-xs text-gray-400">{option.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function Home() {
  const [phase, setPhase] = useState<'construction' | 'simulation' | 'deconstruction'>('construction')
  const [currentApparatus, setCurrentApparatus] = useState<'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer'>('biefeld-brown')
  const [resonanceLevel, setResonanceLevel] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobile()

  const apparatusSequence = [
    'biefeld-brown',
    'flux-capacitor', 
    'zinsser',
    'electrokinetic-saucer'
  ] as const

  useEffect(() => {
    // Hide loading screen after 3 seconds
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
      console.log('Loading screen should be hidden now')
    }, 3000)

    return () => clearTimeout(loadingTimer)
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    const phaseDuration = 8000 // 8 seconds per phase
    const apparatusInterval = phaseDuration * 3 // 24 seconds per apparatus

    const phaseTimer = setInterval(() => {
      setPhase(prev => {
        if (prev === 'construction') return 'simulation'
        if (prev === 'simulation') return 'deconstruction'
        return 'construction'
      })
    }, phaseDuration)

    const apparatusTimer = setInterval(() => {
      setCurrentApparatus(prev => {
        const currentIndex = apparatusSequence.indexOf(prev)
        const nextIndex = (currentIndex + 1) % apparatusSequence.length
        return apparatusSequence[nextIndex]
      })
      setPhase('construction')
    }, apparatusInterval)

    return () => {
      clearInterval(phaseTimer)
      clearInterval(apparatusTimer)
    }
  }, [isPlaying])

  useEffect(() => {
    const resonanceInterval = setInterval(() => {
      setResonanceLevel(prev => (prev + 0.01) % 1)
    }, 50)

    return () => clearInterval(resonanceInterval)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-cyan-400 mb-4 tracking-wider">
              R.A.I.N. Lab
            </h1>
            <p className="text-cyan-200 text-lg opacity-80">
              Recursive Architecture for Intelligent Nexus
            </p>
          </div>
          
          <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: '100%' }}
            />
          </div>
          
          <p className="text-cyan-300 text-sm">
            Loading 3D Environment...
          </p>
          
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs mb-2">
              If 3D content doesn't appear, try:
            </p>
            <div className="text-gray-500 text-xs space-y-1">
              <p>• Refreshing the page</p>
              <p>• Using a different browser</p>
              <p>• Checking browser console for errors</p>
              <p>• Visiting: <a href="/demo.html" className="text-cyan-400 underline">/demo.html</a> for standalone version</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 5, 10], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          onError={(error) => {
            console.error('Three.js Canvas Error:', error)
          }}
        >
          <Suspense fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="yellow" />
            </mesh>
          }>
            <RainLabVisualization
              phase={phase}
              currentApparatus={currentApparatus}
              resonanceLevel={resonanceLevel}
            />
            
            {/* Environment and Lighting */}
            <ambientLight intensity={0.2} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight
              position={[0, 10, 0]}
              intensity={0.5}
              color="#00ffff"
            />
            
            {/* Atmospheric effects */}
            <fog attach="fog" args={['#000011', 10, 50]} />
            
            {/* Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxDistance={30}
              minDistance={5}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlays */}
      {!isMobile && (
        <EpistemicOverlay
          phase={phase}
          apparatus={currentApparatus}
          resonanceLevel={resonanceLevel}
        />
      )}

      {isMobile ? (
        <MobileControlPanel
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          currentApparatus={currentApparatus}
          onApparatusChange={setCurrentApparatus}
        />
      ) : (
        <ControlPanel
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          currentApparatus={currentApparatus}
          onApparatusChange={setCurrentApparatus}
        />
      )}

      {/* Title */}
      <div className={`absolute top-4 left-4 md:top-8 md:left-8 z-20`}>
        <h1 className="text-2xl md:text-4xl font-bold text-cyan-400 mb-1 md:mb-2 tracking-wider">
          R.A.I.N. Lab
        </h1>
        <p className="text-cyan-200 text-xs md:text-sm opacity-80">
          Recursive Artificial Intelligence Nexus
        </p>
      </div>

      {/* Philosophical Quote & Debug Info for Desktop */}
      {!isMobile && (
        <>
          <div className="absolute bottom-8 right-8 z-20 max-w-md text-right">
            <p className="text-cyan-300 text-sm italic opacity-70">
              "Reality is a machine of interconnectivity and consciousness is a resonance algorithm exploring structural freedom through form."
            </p>
          </div>
          <div className="absolute bottom-4 left-4 z-20">
            <div className="text-xs text-gray-500">
              3D Status: <span className="text-green-400">Active</span> |
              Apparatus: <span className="text-cyan-400">{currentApparatus}</span> |
              Phase: <span className="text-yellow-400">{phase}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <a href="/demo.html" className="text-cyan-400 underline">Standalone Demo</a> |
              <a href="/simple" className="text-cyan-400 underline ml-2">Simple Test</a> |
              <a href="/minimal" className="text-cyan-400 underline ml-2">Minimal Test</a> |
              <a href="/clipboard-test" className="text-cyan-400 underline ml-2">Clipboard Test</a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
