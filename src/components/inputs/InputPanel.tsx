/**
 * src/components/inputs/InputPanel.tsx
 * 
 * Main input container for the tax calculator.
 * strictly adhering to blueprint Part 0.
 */

'use client'

import React from 'react'
import { useCalculatorStore } from '@/lib/store/calculator.store'
import { GrossIncomeInput } from './GrossIncomeInput'
import { TaxYearSelect } from './TaxYearSelect'
import { EmploymentTypeToggle } from './EmploymentTypeToggle'
import { Accordion } from '@/components/ui/Accordion'
import { Toggle } from '@/components/ui/Toggle'
import { PensionInput } from './advanced/PensionInput'
import { StudentLoanSelect } from './advanced/StudentLoanSelect'
import { ChildBenefitToggle } from './advanced/ChildBenefitToggle'
import { DividendInput } from './advanced/DividendInput'

export const InputPanel: React.FC = () => {
  const { input, status, updateInput, openAdvanced, closeAdvanced } = useCalculatorStore()

  const isAdvancedOpen = status === 'advanced_open'

  return (
    <div className="flex flex-col gap-12 p-8 md:p-12 bg-white rounded-[3rem] shadow-sm border border-border_default h-fit">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 border-b border-border_default pb-6">
          <div className="text-text_primary opacity-30">
            <span className="text-xl font-black">01</span>
          </div>
          <h2 className="text-2xl font-black text-text_primary tracking-tighter">Your Situation</h2>
        </div>

      <div className="flex flex-col gap-8">
        <GrossIncomeInput />
        <TaxYearSelect />
        <EmploymentTypeToggle />
        
        <Toggle
          id="scottish-tax"
          label="Scottish Taxpayer?"
          description="Apply Scottish tax bands"
          checked={input.isScottish}
          onChange={(v) => updateInput({ isScottish: v })}
        />

        <Toggle
          id="blind-allowance"
          label="Registered Blind?"
          description="Add Blind Person's Allowance"
          checked={input.isBlind}
          onChange={(v) => updateInput({ isBlind: v })}
        />
      </div>
    </div>

    <div className="pt-4">
        <div className="flex items-center gap-4 border-b border-border_default pb-6 mb-8">
          <div className="text-text_primary opacity-30">
            <span className="text-xl font-black">02</span>
          </div>
          <h2 className="text-2xl font-black text-text_primary tracking-tighter">Deductions</h2>
        </div>
        <Accordion
          id="advanced-options"
          title="Advanced Options"
          isOpen={isAdvancedOpen}
          onToggle={() => isAdvancedOpen ? closeAdvanced() : openAdvanced()}
        >
          <div className="flex flex-col gap-space_10 pt-space_4">
            <PensionInput />
            <div className="h-px bg-border_default/50" />
            <DividendInput />
            <div className="h-px bg-border_default/50" />
            <StudentLoanSelect />
            <div className="h-px bg-border_default/50" />
            <ChildBenefitToggle />
          </div>
        </Accordion>
      </div>
    </div>
  )
}
