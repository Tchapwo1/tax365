/**
 * src/lib/calculator/breakdown.ts
 * 
 * Converts annual figures into yearly, monthly, and weekly breakdown rows.
 */

import type { BreakDownRow } from './types'

export function toBreakdownRow(label: string, annualValue: number): BreakDownRow {
  return {
    label,
    yearly:  annualValue,
    monthly: annualValue / 12,
    weekly:  annualValue / 52
  }
}

export function generateBreakdown(
  grossIncome: number,
  tax: number,
  ni: number,
  studentLoan: number,
  pension: number,
  childBenefitCharge: number,
  dividendTax: number,
  netPay: number
): { yearly: BreakDownRow[]; monthly: BreakDownRow[]; weekly: BreakDownRow[] } {
  
  const labels = [
    { label: 'Gross Income',    value: grossIncome },
    { label: 'Pension',         value: -pension },
    { label: 'Income Tax',      value: -tax },
    { label: 'Dividend Tax',     value: -dividendTax },
    { label: 'National Insurance', value: -ni },
    { label: 'Student Loan',    value: -studentLoan },
    { label: 'Child Benefit Charge', value: -childBenefitCharge },
    { label: 'Take Home Pay',   value: netPay }
  ]

  // Filter out rows with 0 value to keep table clean, except for Take Home
  const activeLabels = labels.filter(l => l.value !== 0 || l.label === 'Take Home Pay')

  const yearly  = activeLabels.map(l => {
    const row = toBreakdownRow(l.label, l.value)
    // Rule: Dividend tax is annual only, not prorated
    if (l.label === 'Dividend Tax') {
      return { ...row, monthly: 0, weekly: 0 }
    }
    return row
  })
  
  return {
    yearly,
    monthly: [], 
    weekly:  [] 
  }
}
