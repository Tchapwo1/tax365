/**
 * src/components/results/ComparisonTable.tsx
 */

'use client'

import React from 'react'
import { useCalculatorStore } from '@/lib/store/calculator.store'

export const ComparisonTable: React.FC = () => {
  const { output, input, baselineOutput, baselineInput } = useCalculatorStore()

  if (!output || !baselineOutput || !baselineInput) return null

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val)

  const rows = [
    { label: 'Gross Income', baseline: baselineInput.grossIncome + (baselineInput.dividendIncome || 0), current: input.grossIncome + (input.dividendIncome || 0), lowerIsBetter: false },
    { label: 'Net Take-home', baseline: baselineOutput.netPay, current: output.netPay, lowerIsBetter: false },
    { label: 'Income Tax', baseline: baselineOutput.incomeTax, current: output.incomeTax, lowerIsBetter: true },
    { label: 'National Insurance', baseline: baselineOutput.nationalInsurance, current: output.nationalInsurance, lowerIsBetter: true },
    { label: 'Dividend Tax', baseline: baselineOutput.dividendTax || 0, current: output.dividendTax || 0, lowerIsBetter: true },
    { label: 'Pension Contribution', baseline: baselineOutput.pensionContribution, current: output.pensionContribution, lowerIsBetter: false },
    { label: 'Student Loan', baseline: baselineOutput.studentLoan, current: output.studentLoan, lowerIsBetter: true },
  ]

  return (
    <div className="bg-white rounded-[2rem] border border-border_default overflow-hidden shadow-sm">
      <div className="p-8 border-b border-border_default flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-text_primary tracking-tighter">Comparison Breakdown</h3>
          <p className="text-sm font-bold text-text_secondary uppercase tracking-widest mt-1">Side-by-side scenario analysis</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-text_secondary uppercase tracking-widest">Baseline</span>
            <span className="text-sm font-bold text-text_primary">Scenario A</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-accent_primary uppercase tracking-widest">Current</span>
            <span className="text-sm font-bold text-text_primary">Scenario B</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background_surface/50">
              <th className="p-6 text-xs font-black text-text_secondary uppercase tracking-widest">Metric</th>
              <th className="p-6 text-xs font-black text-text_secondary uppercase tracking-widest text-right">Baseline</th>
              <th className="p-6 text-xs font-black text-text_secondary uppercase tracking-widest text-right">Current</th>
              <th className="p-6 text-xs font-black text-text_secondary uppercase tracking-widest text-right">Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border_default">
            {rows.map((row) => {
              const diff = row.current - row.baseline
              const isBetter = row.lowerIsBetter ? diff < 0 : diff > 0
              const isNeutral = diff === 0
              const percentChange = (Math.abs(diff) / (row.baseline || 1))
              const isSignificant = percentChange > 0.05
              
              return (
                <tr key={row.label} className={`hover:bg-background_surface/30 transition-colors group ${isSignificant ? 'bg-accent_primary/[0.02]' : ''}`}>
                  <td className="p-4 md:p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text_primary group-hover:text-accent_primary transition-colors">{row.label}</span>
                      {isSignificant && (
                        <span className="text-[10px] font-black text-accent_primary uppercase tracking-widest mt-0.5">Significant Change</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 md:p-6 text-right">
                    <span className="text-sm font-medium text-text_secondary">{formatCurrency(row.baseline)}</span>
                  </td>
                  <td className="p-4 md:p-6 text-right">
                    <span className="text-sm font-black text-text_primary">{formatCurrency(row.current)}</span>
                  </td>
                  <td className="p-4 md:p-6 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                      isNeutral ? 'bg-background_surface text-text_secondary' :
                      isBetter ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {diff > 0 ? '↑' : diff < 0 ? '↓' : ''}
                      {formatCurrency(Math.abs(diff))}
                      {!isNeutral && (
                        <span className="opacity-60 ml-0.5 hidden sm:inline">
                          ({(percentChange * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-background_surface/50 border-t border-border_default">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-text_primary">Net Impact on Take-home</span>
          <div className="text-right">
            <span className={`text-xl font-black ${
              (output.netPay - baselineOutput.netPay) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(output.netPay - baselineOutput.netPay) >= 0 ? '+' : ''}
              {formatCurrency(output.netPay - baselineOutput.netPay)}
            </span>
            <span className="text-xs font-bold text-text_secondary block uppercase tracking-widest mt-1">per year</span>
          </div>
        </div>
      </div>
    </div>
  )
}
