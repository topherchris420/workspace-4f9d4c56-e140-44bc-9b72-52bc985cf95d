'use client'

import { useState, useEffect } from 'react'

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval)
          setTimeout(() => setIsVisible(false), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(loadingInterval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-500">
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
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        
        <p className="text-cyan-300 text-sm">
          Initializing electrogravitic field...
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
      </div>
    </div>
  )
}
