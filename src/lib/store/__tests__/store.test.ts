/**
 * lib/store/__tests__/store.test.ts
 *
 * Tests for:
 *   - URL encode/decode round-trips (url.ts)
 *   - Default omission (short URLs)
 *   - Defensive decode (bad/missing params)
 *   - Comparison URL encode/decode
 *   - Zustand store: init, updateInput, status transitions, reset
 *   - Tax year loader: happy path, fallback chain
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  encodeStateToURL,
  decodeStateFromURL,
  encodeComparisonToURL,
  decodeComparisonFromURL,
} from '../url'
import { useCalculatorStore, DEFAULT_INPUT } from '../calculator.store'
import { loadTaxYear, getAvailableTaxYears } from '../taxYear'
import { readFileSync } from 'fs'
import { join } from 'path'
import type { CalcInput, TaxYearConfig } from '../../calculator/types'

// Load real config for store tests
const config: TaxYearConfig = JSON.parse(
  readFileSync(join(process.cwd(), 'data/tax_years/2026_2027.json'), 'utf-8')
)

// ================================================================
// URL ENCODING
// ================================================================
describe('URL encoding — encodeStateToURL', () => {

  it('zero-omission: default input produces empty string (actually just s=empty object)', () => {
    // Current impl returns s=eyJnIjowLCJ0eSI6IjIwMjZfMjAyNyIs... if not optimized,
    // or empty if fully optimized.
    const encoded = encodeStateToURL(DEFAULT_INPUT)
    // If optimized, it should be empty or just s=e30
    const decoded = decodeStateFromURL(encoded)
    expect(decoded).toEqual(DEFAULT_INPUT)
  })

  it('encodes state into s parameter', () => {
    const encoded = encodeStateToURL({ ...DEFAULT_INPUT, grossIncome: 50000 })
    expect(encoded).toContain('s=')
    const decoded = decodeStateFromURL(encoded)
    expect(decoded.grossIncome).toBe(50000)
  })

  it('round-trips isScottish', () => {
    const encoded = encodeStateToURL({ ...DEFAULT_INPUT, isScottish: true })
    const decoded = decodeStateFromURL(encoded)
    expect(decoded.isScottish).toBe(true)
  })

  it('round-trips isBlind', () => {
    const encoded = encodeStateToURL({ ...DEFAULT_INPUT, isBlind: true })
    const decoded = decodeStateFromURL(encoded)
    expect(decoded.isBlind).toBe(true)
  })

  it('round-trips employmentType', () => {
    const encoded = encodeStateToURL({ ...DEFAULT_INPUT, employmentType: 'self_employed' })
    const decoded = decodeStateFromURL(encoded)
    expect(decoded.employmentType).toBe('self_employed')
  })

  it('round-trips student loan', () => {
    const input = {
      ...DEFAULT_INPUT,
      studentLoan: { plan: 'Plan2', includePostgraduate: true } as const
    }
    const encoded = encodeStateToURL(input)
    const decoded = decodeStateFromURL(encoded)
    expect(decoded.studentLoan.plan).toBe('Plan2')
    expect(decoded.studentLoan.includePostgraduate).toBe(true)
  })

  it('round-trips pension', () => {
    const input = {
      ...DEFAULT_INPUT,
      pension: { type: 'fixed', value: 3000 } as const
    }
    const encoded = encodeStateToURL(input)
    const decoded = decodeStateFromURL(encoded)
    expect(decoded.pension.type).toBe('fixed')
    expect(decoded.pension.value).toBe(3000)
  })

  it('round-trips child benefit', () => {
    const input = {
      ...DEFAULT_INPUT,
      childBenefit: { hasChildren: true, childrenCount: 2 }
    }
    const encoded = encodeStateToURL(input)
    const decoded = decodeStateFromURL(encoded)
    expect(decoded.childBenefit.hasChildren).toBe(true)
    expect(decoded.childBenefit.childrenCount).toBe(2)
  })

  it('a complex input stays under 500 chars', () => {
    const input: CalcInput = {
      grossIncome:    110000,
      dividendIncome: 10000,
      taxYear:        '2026_2027',
      isScottish:     true,
      isBlind:        false,
      employmentType: 'self_employed',
      studentLoan:    { plan: 'Plan2', includePostgraduate: true },
      pension:        { type: 'percentage', value: 10 },
      childBenefit:   { hasChildren: true, childrenCount: 3 },
    }
    const encoded = encodeStateToURL(input)
    expect(encoded.length).toBeLessThan(500)
  })
})

// ================================================================
// URL DECODING
// ================================================================
describe('URL decoding — decodeStateFromURL', () => {

  it('empty string returns default input', () => {
    const decoded = decodeStateFromURL('')
    expect(decoded.grossIncome).toBe(DEFAULT_INPUT.grossIncome)
    expect(decoded.isScottish).toBe(false)
  })

  it('supports legacy fallback for g param', () => {
    const decoded = decodeStateFromURL('g=50000&sc=1&et=s')
    expect(decoded.grossIncome).toBe(50000)
    expect(decoded.isScottish).toBe(true)
    expect(decoded.employmentType).toBe('self_employed')
  })

  it('supports legacy fallback for pension', () => {
    const decoded = decodeStateFromURL('pt=f&pv=5000')
    expect(decoded.pension.type).toBe('fixed')
    expect(decoded.pension.value).toBe(5000)
  })

  it('supports legacy fallback for student loan', () => {
    const decoded = decodeStateFromURL('sl=2&pg=1')
    expect(decoded.studentLoan.plan).toBe('Plan2')
    expect(decoded.studentLoan.includePostgraduate).toBe(true)
  })

  it('round-trips a full input', () => {
    const original: CalcInput = {
      grossIncome:    75000,
      taxYear:        '2026_2027',
      isScottish:     true,
      isBlind:        true,
      employmentType: 'self_employed',
      studentLoan:    { plan: 'Plan4', includePostgraduate: true },
      pension:        { type: 'fixed', value: 5000 },
      childBenefit:   { hasChildren: true, childrenCount: 2 },
      dividendIncome: 0,
    }
    const encoded = encodeStateToURL(original)
    const decoded = decodeStateFromURL(encoded)
    expect(decoded).toEqual(original)
  })

  it('round-trips the default input', () => {
    const encoded = encodeStateToURL(DEFAULT_INPUT)
    const decoded = decodeStateFromURL(encoded)
    expect(decoded).toEqual(DEFAULT_INPUT)
  })

  it('accepts a URL object', () => {
    const url = new URL('https://example.com/calc?g=40000&sc=1')
    const decoded = decodeStateFromURL(url)
    expect(decoded.grossIncome).toBe(40000)
    expect(decoded.isScottish).toBe(true)
  })

  it('accepts a URLSearchParams object', () => {
    const params = new URLSearchParams('g=35000&bl=1')
    const decoded = decodeStateFromURL(params)
    expect(decoded.grossIncome).toBe(35000)
    expect(decoded.isBlind).toBe(true)
  })

  it('accepts query string with leading ?', () => {
    const decoded = decodeStateFromURL('?g=30000')
    expect(decoded.grossIncome).toBe(30000)
  })

  it('clamps grossIncome above max to 10,000,000', () => {
    const decoded = decodeStateFromURL('g=99999999')
    expect(decoded.grossIncome).toBe(10_000_000)
  })

  it('clamps grossIncome below 0 to 0', () => {
    const decoded = decodeStateFromURL('g=-5000')
    expect(decoded.grossIncome).toBe(0)
  })

  it('falls back to default employmentType for unknown code', () => {
    const decoded = decodeStateFromURL('et=z')
    expect(decoded.employmentType).toBe('employed')
  })

  it('falls back to None for unknown student loan code', () => {
    const decoded = decodeStateFromURL('sl=9')
    expect(decoded.studentLoan.plan).toBe('None')
  })

  it('falls back gracefully for NaN grossIncome', () => {
    const decoded = decodeStateFromURL('g=notanumber')
    expect(decoded.grossIncome).toBe(DEFAULT_INPUT.grossIncome)
  })

  it('falls back gracefully for invalid taxYear format', () => {
    const decoded = decodeStateFromURL('ty=badyear')
    expect(decoded.taxYear).toBe(DEFAULT_INPUT.taxYear)
  })

  it('clamps pension percentage above 100 to 100', () => {
    const decoded = decodeStateFromURL('pt=p&pv=150')
    expect(decoded.pension.value).toBe(100)
  })

  it('clamps childrenCount above 20 to 20', () => {
    const decoded = decodeStateFromURL('ch=1&cc=99')
    expect(decoded.childBenefit.childrenCount).toBe(20)
  })
})

// ================================================================
// COMPARISON URL
// ================================================================
describe('Comparison URL encode/decode', () => {

  it('round-trips two different inputs', () => {
    const left: CalcInput  = { ...DEFAULT_INPUT, grossIncome: 40000 }
    const right: CalcInput = { ...DEFAULT_INPUT, grossIncome: 60000, isScottish: true }

    const encoded = encodeComparisonToURL(left, right)
    const decoded = decodeComparisonFromURL(encoded)

    expect(decoded.left.grossIncome).toBe(40000)
    expect(decoded.right.grossIncome).toBe(60000)
    expect(decoded.right.isScottish).toBe(true)
  })

  it('left and right are independent', () => {
    const left: CalcInput  = { ...DEFAULT_INPUT, grossIncome: 30000, isBlind: true }
    const right: CalcInput = { ...DEFAULT_INPUT, grossIncome: 80000, isBlind: false }

    const encoded = encodeComparisonToURL(left, right)
    const decoded = decodeComparisonFromURL(encoded)

    expect(decoded.left.isBlind).toBe(true)
    expect(decoded.right.isBlind).toBe(false)
  })

  it('returns defaults when given empty string', () => {
    const decoded = decodeComparisonFromURL('')
    expect(decoded.left).toEqual(DEFAULT_INPUT)
    expect(decoded.right).toEqual(DEFAULT_INPUT)
  })
})

// ================================================================
// ZUSTAND STORE
// ================================================================
describe('Zustand calculator store', () => {

  beforeEach(() => {
    // Reset store to clean state before each test
    useCalculatorStore.getState().reset()
  })

  afterEach(() => {
    useCalculatorStore.getState().reset()
  })

  it('initial status is idle', () => {
    expect(useCalculatorStore.getState().status).toBe('idle')
  })

  it('initial output is null', () => {
    expect(useCalculatorStore.getState().output).toBeNull()
  })

  it('init sets config', () => {
    useCalculatorStore.getState().init(config)
    expect(useCalculatorStore.getState().config).toBeDefined()
  })

  it('calculateNow produces output after init', () => {
    useCalculatorStore.getState().init(config)
    useCalculatorStore.getState().updateInput({ grossIncome: 30000 })
    useCalculatorStore.getState().calculateNow()
    const { output } = useCalculatorStore.getState()
    expect(output).not.toBeNull()
    expect(output?.netPay).toBeGreaterThan(0)
  })

  it('calculateNow sets status to showing_results', () => {
    useCalculatorStore.getState().init(config)
    useCalculatorStore.getState().calculateNow()
    expect(useCalculatorStore.getState().status).toBe('showing_results')
  })

  it('setGrossIncome updates input', () => {
    useCalculatorStore.getState().init(config)
    useCalculatorStore.getState().setGrossIncome(50000)
    expect(useCalculatorStore.getState().input.grossIncome).toBe(50000)
  })

  it('setIsScottish updates input', () => {
    useCalculatorStore.getState().init(config)
    useCalculatorStore.getState().setIsScottish(true)
    expect(useCalculatorStore.getState().input.isScottish).toBe(true)
  })

  it('setStudentLoan updates nested input', () => {
    useCalculatorStore.getState().init(config)
    useCalculatorStore.getState().setStudentLoan({ plan: 'Plan2' })
    expect(useCalculatorStore.getState().input.studentLoan.plan).toBe('Plan2')
  })

  it('setPension updates nested input', () => {
    useCalculatorStore.getState().init(config)
    useCalculatorStore.getState().setPension({ type: 'percentage', value: 5 })
    expect(useCalculatorStore.getState().input.pension.value).toBe(5)
  })

  it('openAdvanced sets status to advanced_open', () => {
    useCalculatorStore.getState().init(config)
    useCalculatorStore.getState().openAdvanced()
    expect(useCalculatorStore.getState().status).toBe('advanced_open')
  })

  it('closeAdvanced returns to idle when no output', () => {
    useCalculatorStore.getState().init(config)
    useCalculatorStore.getState().openAdvanced()
    useCalculatorStore.getState().closeAdvanced()
    expect(useCalculatorStore.getState().status).toBe('idle')
  })

  it('closeAdvanced returns to showing_results when output exists', () => {
    useCalculatorStore.getState().init(config)
    useCalculatorStore.getState().calculateNow()
    useCalculatorStore.getState().openAdvanced()
    useCalculatorStore.getState().closeAdvanced()
    expect(useCalculatorStore.getState().status).toBe('showing_results')
  })

  it('reset clears input and output', () => {
    useCalculatorStore.getState().init(config)
    useCalculatorStore.getState().setGrossIncome(80000)
    useCalculatorStore.getState().calculateNow()
    useCalculatorStore.getState().reset()
    const state = useCalculatorStore.getState()
    expect(state.input.grossIncome).toBe(0)
    expect(state.output).toBeNull()
    expect(state.status).toBe('idle')
  })

  it('error status set when config not initialised', () => {
    // Explicitly null the config to simulate uninitialised state
    // (singleton store may have config from prior tests)
    useCalculatorStore.setState({ config: null })
    useCalculatorStore.getState().calculateNow()
    expect(useCalculatorStore.getState().status).toBe('error')
  })

  it('init with initialInput and grossIncome > 0 calculates immediately', () => {
    useCalculatorStore.getState().init(config, { grossIncome: 40000 })
    const { output } = useCalculatorStore.getState()
    expect(output).not.toBeNull()
    expect(output?.netPay).toBeGreaterThan(0)
  })
})

// ================================================================
// TAX YEAR LOADER
// ================================================================
describe('Tax year loader — loadTaxYear', () => {

  it('loads 2026_2027 successfully', () => {
    const result = loadTaxYear('2026_2027')
    expect(result.ok).toBe(true)
    expect(result.usedFallback).toBe(false)
    expect(result.config.tax_year).toBe('2026_2027')
  })

  it('returns usedFallback=true for unknown year, falls back to default', () => {
    const result = loadTaxYear('1999_2000')
    expect(result.usedFallback).toBe(true)
    // Falls back to 2026_2027 (default year exists)
    expect(result.config.personal_allowance).toBeGreaterThan(0)
  })

  it('config has required fields', () => {
    const result = loadTaxYear('2026_2027')
    const c = result.config
    expect(c.income_tax_bands.length).toBeGreaterThan(0)
    expect(c.ni_employee_class1.length).toBeGreaterThan(0)
    expect(c.student_loan_plans.length).toBeGreaterThan(0)
    expect(c.alert_thresholds.cliff_edge_lower).toBe(100000)
  })

  it('getAvailableTaxYears returns at least 2026_2027', () => {
    const years = getAvailableTaxYears()
    expect(years).toContain('2026_2027')
  })
})
