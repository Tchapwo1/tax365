/**
 * src/components/results/ComparisonControls.tsx
 */

'use client'

import React from 'react'
import { useCalculatorStore } from '@/lib/store/calculator.store'

export const ComparisonControls: React.FC = () => {
  const { output, baselineInput, setBaseline, clearComparison } = useCalculatorStore()

  if (!output) return null

  if (baselineInput) {
    return (
      <div className="flex items-center gap-4 bg-accent_primary/5 p-4 rounded-2xl border border-accent_primary/20">
        <div className="flex-1">
          <span className="text-sm font-bold text-accent_primary uppercase tracking-widest block">Comparison Mode Active</span>
          <span className="text-xs font-medium text-text_secondary">Comparing your current changes against the locked baseline.</span>
        </div>
        <button 
          onClick={clearComparison}
          className="px-6 py-2 bg-white border border-border_default rounded-full text-sm font-black text-text_primary hover:bg-background_surface transition-all shadow-sm"
        >
          Exit Comparison
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-border_default shadow-sm group hover:border-accent_primary/30 transition-all">
      <div className="flex flex-col gap-1">
        <span className="text-lg font-black text-text_primary tracking-tight">Compare Scenarios</span>
        <span className="text-xs font-bold text-text_secondary uppercase tracking-widest">Lock this result to compare with another setup</span>
      </div>
      <button 
        onClick={setBaseline}
        className="px-8 py-3 bg-text_primary text-white rounded-full font-black text-sm hover:scale-105 transition-all shadow-lg active:scale-95"
      >
        Lock & Compare
      </button>
    </div>
  )
}
