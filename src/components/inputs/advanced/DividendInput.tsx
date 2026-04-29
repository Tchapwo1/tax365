/**
 * src/components/inputs/advanced/DividendInput.tsx
 */

'use client'

import React from 'react'
import { useCalculatorStore } from '@/lib/store/calculator.store'
import { InputField } from '@/components/ui/InputField'

export const DividendInput: React.FC = () => {
  const { input, updateInput } = useCalculatorStore()

  const handleValueChange = (v: number) => {
    updateInput({ dividendIncome: v })
  }

  return (
    <div className="flex flex-col gap-space_2">
      <InputField
        id="dividend-income"
        label="Annual Dividend Income"
        type="currency"
        value={input.dividendIncome}
        onChange={handleValueChange}
        placeholder="e.g. 5000"
      />
      <div className="flex gap-2 items-start">
        <svg className="w-4 h-4 text-accent_primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-text_secondary leading-relaxed">
          Dividends are taxed separately from salary using UK-wide bands and have a £500 nil-rate allowance.
        </p>
      </div>
    </div>
  )
}
