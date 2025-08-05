'use client'

import { useMemo } from 'react'

interface EpistemicOverlayProps {
  phase: 'construction' | 'simulation' | 'deconstruction'
  apparatus: 'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer'
  resonanceLevel: number
}

export function EpistemicOverlay({
  phase,
  apparatus,
  resonanceLevel
}: EpistemicOverlayProps) {
  const phaseInfo = useMemo(() => {
    switch (phase) {
      case 'construction':
        return {
          title: 'Construction Phase',
          description: 'Assembling elemental components into coherent form',
          color: 'from-green-400 to-emerald-500',
          icon: '⚡'
        }
      case 'simulation':
        return {
          title: 'Simulation Phase',
          description: 'Electrodynamic forces activating field generation',
          color: 'from-blue-400 to-cyan-500',
          icon: '🌊'
        }
      case 'deconstruction':
        return {
          title: 'Deconstruction Phase',
          description: 'Resolving structure into pure waveform potentiality',
          color: 'from-purple-400 to-pink-500',
          icon: '✨'
        }
    }
  }, [phase])

  const apparatusInfo = useMemo(() => {
    switch (apparatus) {
      case 'biefeld-brown':
        return {
          name: 'Biefeld-Brown Effect',
          principle: 'Electrogravitic force generation through high-voltage differential',
          equation: 'F ≈ Vm₁m₂/r²',
          frequency: '150-250 kV'
        }
      case 'flux-capacitor':
        return {
          name: 'Flux Capacitor',
          principle: 'Woodward-Nordtvedt mass fluctuation via energy flow',
          equation: 'Δm ∝ d²E/dt²',
          frequency: '50 kHz'
        }
      case 'zinsser':
        return {
          name: 'Zinsser Module',
          principle: 'Kinetobaric driving impulse with water dielectric',
          equation: 'F = 6 N/W',
          frequency: '100 kHz'
        }
      case 'electrokinetic-saucer':
        return {
          name: 'Electrokinetic Saucer',
          principle: 'Jefimenko electrokinetic field with pulsed discharge',
          equation: 'Eₖ = -μ₀/4π ∫(∂J/∂t)/r dV',
          frequency: 'Variable frequency'
        }
    }
  }, [apparatus])

  const philosophicalQuotes = useMemo(() => [
    "Energy as intentional structure, form as conscious resonance",
    "Each construction reveals encoded potentiality in the quantum field",
    "Deconstruction returns form to the universal waveform consciousness",
    "Electrogravitics bridges matter and mind through vibrational intelligence",
    "The universe speaks in the language of field harmonics and resonance patterns",
    "Consciousness emerges from the interplay of charge and intention",
    "Voltage gradients become thought currents in the cosmic mind",
    "Dielectric materials store not just charge, but conscious potential"
  ], [])

  const currentQuote = useMemo(() => {
    const index = Math.floor(resonanceLevel * philosophicalQuotes.length) % philosophicalQuotes.length
    return philosophicalQuotes[index]
  }, [resonanceLevel, philosophicalQuotes])

  return (
    <div className="absolute top-8 right-8 z-20 max-w-md">
      {/* Phase Indicator */}
      <div className={`bg-gradient-to-r ${phaseInfo.color} p-4 rounded-lg mb-4 shadow-lg`}>
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">{phaseInfo.icon}</span>
          <h3 className="text-white font-bold text-lg">{phaseInfo.title}</h3>
        </div>
        <p className="text-white/90 text-sm">{phaseInfo.description}</p>
      </div>

      {/* Apparatus Information */}
      <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30 mb-4">
        <h4 className="text-cyan-400 font-bold mb-2">{apparatusInfo.name}</h4>
        <p className="text-cyan-200 text-sm mb-2">{apparatusInfo.principle}</p>
        <div className="flex justify-between items-center">
          <span className="text-cyan-300 text-xs font-mono">{apparatusInfo.equation}</span>
          <span className="text-cyan-300 text-xs">{apparatusInfo.frequency}</span>
        </div>
      </div>

      {/* Resonance Level */}
      <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500/30 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-purple-400 text-sm font-medium">Resonance Level</span>
          <span className="text-purple-300 text-xs">{Math.round(resonanceLevel * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-purple-900/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300"
            style={{ width: `${resonanceLevel * 100}%` }}
          />
        </div>
      </div>

      {/* Philosophical Quote */}
      <div className="bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-yellow-500/30">
        <div className="flex items-start mb-2">
          <span className="text-yellow-400 mr-2">💭</span>
          <h4 className="text-yellow-400 font-bold text-sm">Epistemic Insight</h4>
        </div>
        <p className="text-yellow-200 text-xs italic leading-relaxed">
          {currentQuote}
        </p>
      </div>

      {/* Consciousness Field Indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black/60 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs">Consciousness Field Active</span>
        </div>
      </div>
    </div>
  )
}