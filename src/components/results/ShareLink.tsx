/**
 * src/components/results/ShareLink.tsx
 */

'use client'

import React, { useState } from 'react'
import { useCalculatorStore } from '@/lib/store/calculator.store'
import { encodeStateToURL } from '@/lib/store/url'

export const ShareLink: React.FC = () => {
  const { input } = useCalculatorStore()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const url = window.location.href
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className={`
        flex items-center gap-space_2 px-space_4 py-space_2 rounded-md border text-sm font-medium transition-all
        ${copied 
          ? 'bg-net_profit/10 border-net_profit text-net_profit' 
          : 'bg-background_primary border-border_default text-text_primary hover:border-action hover:text-action'
        }
      `}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {copied ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        )}
      </svg>
      {copied ? 'Link Copied!' : 'Share Calculation'}
    </button>
  )
}
