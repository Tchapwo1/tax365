/**
 * src/lib/calculator/__tests__/dividend.test.ts
 */

import { describe, it, expect } from 'vitest'
import { calculateDividendTax } from '../tax'
import { TaxBand } from '../types'

const dividend_tax_bands: TaxBand[] = [
  { band: 'basic', from: 0, to: 37700, rate: 0.1075 },
  { band: 'higher', from: 37700, to: 112570, rate: 0.3575 },
  { band: 'additional', from: 112570, to: null, rate: 0.3935 }
]

const config = {
  dividend_allowance: 500,
  dividend_tax_bands,
  dividend_allowance_consumes_band: true
}

describe('Dividend Tax Logic', () => {
  it('Case 4: Salary £40k, Dividends £10k (Straddle Higher Band)', () => {
    // Salary £40k is basic rate, but Higher Rate starts at £37,700 (taxable after PA)
    // Actually, thresholds in config are relative to 0.
    // Basic Rate Band: 0 to 37700
    // Higher Rate Band: 37700 to 125140 (thresholds are usually inclusive of PA in UI, but in JSON they are taxable income bands)
    
    // In our engine, nonDividendTaxableIncome is salary AFTER PA.
    // If salary = £40,000, PA = £12,570, taxableNonDividend = £27,430.
    // Dividends £10,000 sitting on top of £27,430.
    // Total taxable income = £37,430.
    // All £37,430 is below Higher Rate Threshold (£37,700).
    
    const result = calculateDividendTax(10000, config, 27430)
    
    // Dividend Allowance: £500 (taxed at 0%)
    // Remaining Dividends: £9,500
    // Capacity in Basic Band: £37,700 - £27,430 = £10,270
    // Allowance consumes band: £10,270 - £500 = £9,770
    // All £9,500 fits in Basic Band.
    // Tax = £9,500 * 10.75% = £1,021.25
    
    expect(result.dividendTax).toBeCloseTo(1021.25)
    expect(result.taxableDividendIncome).toBe(9500)
  })

  it('Case 5: Salary £100k, Dividends £10k (Trigger PA Taper via ANI)', () => {
    // Note: calculateDividendTax doesn't calculate PA taper, it receives taxable income.
    // If salary = £100,000, and Dividends = £10,000, ANI = £110,000.
    // PA reduction = (£110,000 - £100,000) / 2 = £5,000.
    // New PA = £12,570 - £5,000 = £7,570.
    // taxableNonDividend = £100,000 - £7,570 = £92,430.
    
    const result = calculateDividendTax(10000, config, 92430)
    
    // Non-dividend income £92,430 is already in Higher Band (£37,700 to £112,570).
    // Dividend Allowance: £500 (consumes Higher band capacity).
    // Remaining Dividends: £9,500.
    // Capacity in Higher Band: £112,570 - £92,430 = £20,140.
    // All £9,500 fits in Higher Band.
    // Tax = £9,500 * 35.75% = £3,396.25
    
    expect(result.dividendTax).toBeCloseTo(3396.25)
  })

  it('Case 6: Dividends £500 (Allowance covered)', () => {
    const result = calculateDividendTax(500, config, 20000)
    expect(result.dividendTax).toBe(0)
    expect(result.taxableDividendIncome).toBe(0)
  })

  it('Case 7: Zero Dividends', () => {
    const result = calculateDividendTax(0, config, 50000)
    expect(result.dividendTax).toBe(0)
  })
})
