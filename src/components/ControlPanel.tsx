'use client'

import { Play, Pause, RotateCcw, Settings } from 'lucide-react'

interface ControlPanelProps {
  isPlaying: boolean
  onPlayPause: () => void
  currentApparatus: 'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer'
  onApparatusChange: (apparatus: 'biefeld-brown' | 'flux-capacitor' | 'zinsser' | 'electrokinetic-saucer') => void
}

export function ControlPanel({
  isPlaying,
  onPlayPause,
  currentApparatus,
  onApparatusChange
}: ControlPanelProps) {
  const apparatusOptions = [
    { id: 'biefeld-brown', name: 'Biefeld-Brown', description: 'Electrogravitic Force' },
    { id: 'flux-capacitor', name: 'Flux Capacitor', description: 'Mass Fluctuation' },
    { id: 'zinsser', name: 'Zinsser Module', description: 'Kinetobaric Impulse' },
    { id: 'electrokinetic-saucer', name: 'Electrokinetic Saucer', description: 'Advanced Propulsion' }
  ] as const

  return (
    <div className="absolute bottom-8 left-8 z-20">
      <div className="bg-black/80 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/30 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-cyan-400 font-bold text-lg">R.A.I.N. Controls</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onPlayPause}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
            </button>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Apparatus Selection */}
        <div className="mb-6">
          <h4 className="text-cyan-300 text-sm font-medium mb-3">Apparatus Selection</h4>
          <div className="grid grid-cols-2 gap-2">
            {apparatusOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onApparatusChange(option.id)}
                className={`p-3 rounded-lg text-left transition-all ${
                  currentApparatus === option.id
                    ? 'bg-cyan-600/30 border border-cyan-500'
                    : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                <div className="font-medium text-white text-sm mb-1">{option.name}</div>
                <div className="text-gray-400 text-xs">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-cyan-300 text-sm">System Status</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs">Operational</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-cyan-300 text-sm">Field Stability</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-400 text-xs">Optimizing</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-cyan-300 text-sm">Resonance Mode</span>
            <span className="text-purple-400 text-xs">Biocentric</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <RotateCcw className="w-4 h-4 text-gray-300 mx-auto" />
            </button>
            <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-300 text-xs">
              Reset
            </button>
            <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-300 text-xs">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-2 text-center">
        <p className="text-gray-500 text-xs">
          Press SPACE to play/pause • Click and drag to rotate view
        </p>
      </div>
    </div>
  )
}