'use client'

import { useState, useEffect } from 'react'

export default function ClipboardTestPage() {
  const [clipboardStatus, setClipboardStatus] = useState<string>('Unknown')
  const [copiedText, setCopiedText] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Check if Clipboard API is available
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      setClipboardStatus('Available')
    } else {
      setClipboardStatus('Not Available')
    }
  }, [])

  const testClipboard = async () => {
    try {
      const testText = 'R.A.I.N. Lab Clipboard Test'
      await navigator.clipboard.writeText(testText)
      setCopiedText(testText)
      setError('')
    } catch (err) {
      console.error('Clipboard error:', err)
      setError(err instanceof Error ? err.message : 'Unknown clipboard error')
      
      // Fallback: try using document.execCommand
      try {
        const textArea = document.createElement('textarea')
        textArea.value = 'R.A.I.N. Lab Fallback Test'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopiedText('R.A.I.N. Lab Fallback Test')
        setError('Used fallback method')
      } catch (fallbackErr) {
        setError('Both clipboard methods failed')
      }
    }
  }

  return (
    <div className="w-full h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">📋 Clipboard API Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Clipboard Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Clipboard API:</span>
              <span className={clipboardStatus === 'Available' ? 'text-green-400' : 'text-red-400'}>
                {clipboardStatus}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Last Copied Text:</span>
              <span className="text-cyan-400">{copiedText || 'None'}</span>
            </div>
            
            {error && (
              <div className="p-3 bg-red-900/20 rounded">
                <span className="text-red-400">Error: {error}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-3">
            <button
              onClick={testClipboard}
              className="w-full p-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
            >
              Test Clipboard Copy
            </button>
            
            <button
              onClick={() => {
                setCopiedText('')
                setError('')
              }}
              className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Clear Results
            </button>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Information</h2>
          <div className="space-y-3 text-sm text-gray-400">
            <p>
              The Clipboard API may be blocked due to browser security policies. 
              This is common in non-secure contexts (HTTP) or when the browser 
              has strict permissions settings.
            </p>
            <p>
              If the Clipboard API fails, the system will attempt to use the 
              legacy document.execCommand('copy') method as a fallback.
            </p>
            <p>
              Common reasons for Clipboard API blocking:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Page is served over HTTP instead of HTTPS</li>
              <li>Browser security policies</li>
              <li>Permissions policy applied to the document</li>
              <li>Non-secure context restrictions</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
              <h3 className="text-cyan-400 font-medium">Main Application</h3>
              <p className="text-gray-400 text-sm">Return to R.A.I.N. Lab</p>
            </a>
            
            <a href="/diagnostic" className="block p-4 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
              <h3 className="text-cyan-400 font-medium">Diagnostics</h3>
              <p className="text-gray-400 text-sm">System diagnostic tests</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}