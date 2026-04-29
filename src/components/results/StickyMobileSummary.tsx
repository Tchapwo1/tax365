/**
 * src/components/results/StickyMobileSummary.tsx
 */

'use client'

import React from 'react'
import { useCalculatorStore } from '@/lib/store/calculator.store'

export const StickyMobileSummary: React.FC = () => {
  const { output, baselineOutput } = useCalculatorStore()

  if (!output) return null

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val)

  const netDiff = baselineOutput ? output.netPay - baselineOutput.netPay : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-in slide-in-from-bottom duration-500">
      {/* Safe Area Backdrop */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-border_default shadow-[0_-10px_40px_rgba(0,0,0,0.1)]" />
      
      <div className="relative px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-text_secondary uppercase tracking-widest">Monthly Take-home</span>
          <span className="text-xl font-black text-text_primary tracking-tighter">
            {formatCurrency(output.netPay / 12)}
          </span>
        </div>

        {baselineOutput && netDiff !== 0 && (
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] font-black text-text_secondary uppercase tracking-widest">vs Baseline</span>
            <div className={`flex items-center gap-1 font-black text-sm ${netDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netDiff > 0 ? '↑' : '↓'}
              {formatCurrency(Math.abs(netDiff / 12))}
            </div>
          </div>
        )}

        <button 
          onClick={() => {
            const el = document.getElementById('share-button')
            if (el) el.click()
            else {
              // Fallback share if button not found
              const url = window.location.href
              navigator.clipboard.writeText(url)
              alert('Link copied!')
            }
          }}
          className="bg-text_primary text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          Share
        </button>
      </div>
    </div>
  )
}
