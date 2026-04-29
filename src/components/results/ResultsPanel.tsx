/**
 * src/components/results/ResultsPanel.tsx
 */

'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import { SummaryCard } from './SummaryCard'
import { TaxBreakdownTable } from './TaxBreakdownTable'
import { AlertBanner } from './AlertBanner'
import { SankeyWrapper } from './SankeyWrapper'
import { ShareLink } from './ShareLink'
import { PaymentPlanner } from './PaymentPlanner'
import { ComparisonControls } from './ComparisonControls'
import { useCalculatorStore } from '@/lib/store/calculator.store'

const ComparisonTable = dynamic(() => import('./ComparisonTable').then(mod => mod.ComparisonTable), {
  loading: () => <div className="h-40 bg-background_surface animate-pulse rounded-[2.5rem] border border-border_default" />,
  ssr: false
})

export const ResultsPanel: React.FC = () => {
  const { status, output } = useCalculatorStore()

  const isEditing = status === 'editing' || status === 'calculating'

  const [showDetails, setShowDetails] = React.useState(false)

  return (
    <div className={`flex flex-col gap-space_8 transition-opacity duration-medium ${isEditing ? 'opacity-60' : 'opacity-100'}`}>
      <div className="flex flex-col gap-space_6">
        <ComparisonControls />
        <SummaryCard />
        
        {output && (
          <>
            <div className="flex justify-end">
              <ShareLink />
            </div>
            <AlertBanner />
            <PaymentPlanner />
            <SankeyWrapper />
            <ComparisonTable />
            
            <div className="bg-white rounded-2xl border border-border_default overflow-hidden">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-space_6 text-left hover:bg-background_surface transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-black text-text_primary tracking-tight">Calculation details</span>
                  <span className="text-xs font-bold text-text_secondary uppercase tracking-widest">See exactly how we calculated your tax</span>
                </div>
                <div className={`w-8 h-8 rounded-full border border-border_default flex items-center justify-center transition-transform ${showDetails ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4 text-text_secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </button>
              
              {showDetails && (
                <div className="border-t border-border_default p-space_6 animate-in slide-in-from-top-2 duration-medium">
                  <TaxBreakdownTable />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {!output && (
        <div className="p-space_10 bg-background_surface rounded-lg border border-dashed border-border_default flex flex-col items-center justify-center text-center">
          <svg className="w-12 h-12 text-border_default mb-space_4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="text-md font-bold text-text_primary">Ready to calculate</h3>
          <p className="text-sm text-text_secondary mt-space_1">Enter your details on the left to see your take-home pay breakdown.</p>
        </div>
      )}
    </div>
  )
}
