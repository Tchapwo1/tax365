/**
 * src/lib/calculator/tax.ts
 * 
 * Calculates Income Tax based on provided bands and personal allowance.
 * Includes Personal Allowance tapering and Scottish bands.
 */

import type { TaxBand } from './types'

export function calculateIncomeTax(
  grossIncome: number,
  bands: TaxBand[],
  personalAllowance: number,
  isScottish: boolean,
  scottishBands: TaxBand[],
  baseAllowance: number
): number {
  const activeBands = isScottish ? scottishBands : bands
  const shift = personalAllowance - baseAllowance
  let totalTax = 0

  activeBands.forEach(band => {
    // Shift the band boundaries
    const shiftedFrom = band.from + shift
    const shiftedTo = band.to === null ? null : band.to + shift

    if (grossIncome > shiftedFrom) {
      const upperLimit = shiftedTo === null ? grossIncome : Math.min(grossIncome, shiftedTo)
      const amountInBand = upperLimit - shiftedFrom
      if (amountInBand > 0) {
        totalTax += amountInBand * band.rate
      }
    }
  })

  return totalTax
}

/**
 * Calculates the adjusted personal allowance based on gross income.
 * PA is reduced by £1 for every £2 earned above the threshold.
 */
export function calculateAdjustedPersonalAllowance(
  grossIncome: number,
  baseAllowance: number,
  threshold: number,
  taperRate: number,
  isBlind: boolean,
  blindAllowance: number
): number {
  let adjustedPA = baseAllowance

  if (grossIncome > threshold) {
    const excess = grossIncome - threshold
    const reduction = excess * taperRate
    adjustedPA = Math.max(0, baseAllowance - reduction)
  }

  if (isBlind) {
    adjustedPA += blindAllowance
  }

  return adjustedPA
}

export type DividendTaxResult = {
  dividendTax: number
  taxableDividendIncome: number
}

/**
 * Calculates dividend tax using top-slice logic.
 * Dividends sit above salary/pension income in the tax bands.
 */
export function calculateDividendTax(
  dividendIncome: number,
  config: {
    dividend_allowance: number
    dividend_tax_bands: TaxBand[]
    dividend_allowance_consumes_band: boolean
  },
  nonDividendTaxableIncome: number
): DividendTaxResult {
  if (!dividendIncome || dividendIncome <= 0) {
    return {
      dividendTax: 0,
      taxableDividendIncome: 0
    }
  }

  const {
    dividend_allowance,
    dividend_tax_bands,
    dividend_allowance_consumes_band
  } = config

  // 1. Determine remaining capacity in each dividend tax band
  // Dividend bands share thresholds with standard income tax bands
  const remainingBands = dividend_tax_bands.map(band => {
    const bandSize = band.to === null ? Infinity : band.to - band.from
    const usedInBand = Math.max(0, Math.min(Math.max(nonDividendTaxableIncome - band.from, 0), bandSize))
    const remainingInBand = band.to === null ? Infinity : Math.max(bandSize - usedInBand, 0)

    return {
      ...band,
      remaining: remainingInBand
    }
  })

  let remainingDividend = dividendIncome
  let taxableDividendIncome = 0
  let totalDividendTax = 0

  // 2. Apply Dividend Allowance (Nil-Rate Band)
  let allowanceLeft = dividend_allowance

  if (allowanceLeft > 0) {
    for (let i = 0; i < remainingBands.length && allowanceLeft > 0; i++) {
      const band = remainingBands[i]
      if (band.remaining <= 0) continue

      const allowanceInThisBand = Math.min(band.remaining, allowanceLeft, remainingDividend)
      if (allowanceInThisBand <= 0) continue

      if (dividend_allowance_consumes_band) {
        band.remaining -= allowanceInThisBand
      }

      remainingDividend -= allowanceInThisBand
      allowanceLeft -= allowanceInThisBand
    }
  }

  if (remainingDividend <= 0) {
    return { dividendTax: 0, taxableDividendIncome: 0 }
  }

  // 3. Allocate remaining dividends into bands
  for (let i = 0; i < remainingBands.length && remainingDividend > 0; i++) {
    const band = remainingBands[i]
    if (band.remaining <= 0) continue

    const amountInBand = Math.min(band.remaining, remainingDividend)
    if (amountInBand <= 0) continue

    taxableDividendIncome += amountInBand
    totalDividendTax += amountInBand * band.rate
    remainingDividend -= amountInBand
  }

  return {
    dividendTax: totalDividendTax,
    taxableDividendIncome
  }
}
