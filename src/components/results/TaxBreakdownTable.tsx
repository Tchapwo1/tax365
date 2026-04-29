/**
 * src/components/results/TaxBreakdownTable.tsx
 * 
 * Detailed breakdown of yearly, monthly, and weekly figures.
 * strictly adhering to blueprint Part 5.
 */

'use client'

import React from 'react'
import { useCalculatorStore } from '@/lib/store/calculator.store'

export const TaxBreakdownTable: React.FC = () => {
  const { output } = useCalculatorStore()

  if (!output) return null

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP', 
      maximumFractionDigits: 0 
    }).format(Math.abs(val))

  const rows = output.breakdown.yearly

  return (
    <div className="flex flex-col gap-space_4">
      <h3 className="text-md font-bold text-text_primary">Detailed Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-border_default">
              <th className="py-space_3 pr-space_4 font-semibold text-text_secondary">Deduction</th>
              <th className="py-space_3 px-space_4 font-semibold text-text_secondary text-right">Yearly</th>
              <th className="py-space_3 px-space_4 font-semibold text-text_secondary text-right">Monthly</th>
              <th className="py-space_3 pl-space_4 font-semibold text-text_secondary text-right">Weekly</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border_default/50">
            {rows.map((row, i) => {
              const isTotal = row.label === 'Take Home Pay' || row.label === 'Gross Income'
              const isDeduction = row.yearly < 0
              
              return (
                <tr key={i} className={isTotal ? 'bg-background_surface/50 font-bold' : ''}>
                  <td className="py-space_3 pr-space_4 text-text_primary">
                    {row.label}
                  </td>
                  <td className={`py-space_3 px-space_4 text-right ${isDeduction ? 'text-deduction' : (row.label === 'Take Home Pay' ? 'text-net_profit' : 'text-text_primary')}`}>
                    {isDeduction ? '-' : ''}{formatCurrency(row.yearly)}
                  </td>
                  <td className={`py-space_3 px-space_4 text-right ${isDeduction ? 'text-deduction' : (row.label === 'Take Home Pay' ? 'text-net_profit' : 'text-text_primary')}`}>
                    {isDeduction ? '-' : ''}{formatCurrency(row.monthly)}
                  </td>
                  <td className={`py-space_3 pl-space_4 text-right ${isDeduction ? 'text-deduction' : (row.label === 'Take Home Pay' ? 'text-net_profit' : 'text-text_primary')}`}>
                    {isDeduction ? '-' : ''}{formatCurrency(row.weekly)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-text_secondary leading-relaxed">
        * Dividend tax is calculated annually and is not prorated monthly or weekly. 
        Income tax calculations assume dividends are the top-slice of your income.
      </p>
    </div>
  )
}
