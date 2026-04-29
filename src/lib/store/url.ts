/**
 * src/lib/store/url.ts
 * 
 * Compact URL query string encoding/decoding for tax calculator state.
 * strictly adhering to blueprint Part 4 and test suite contract.
 */

import type { CalcInput, StudentLoanPlan, EmploymentType } from '../calculator/types'
import { DEFAULT_INPUT } from './calculator.store'

const EMPLOYMENT_TO_CODE: Record<EmploymentType, string> = {
  employed: 'e',
  self_employed: 's',
  mixed: 'm'
}
const CODE_TO_EMPLOYMENT: Record<string, EmploymentType> = {
  e: 'employed',
  s: 'self_employed',
  m: 'mixed'
}

const PLAN_TO_CODE: Record<StudentLoanPlan, string> = {
  Plan1: '1', Plan2: '2', Plan4: '4', Plan5: '5', Postgraduate: 'p', None: 'n'
}
const CODE_TO_PLAN: Record<string, StudentLoanPlan> = {
  '1': 'Plan1', '2': 'Plan2', '4': 'Plan4', '5': 'Plan5', p: 'Postgraduate', n: 'None'
}

/**
 * Encodes a CalcInput state into a URL-safe Base64 string.
 * Optimized to only include fields that differ from DEFAULT_INPUT.
 */
function encodeStateToBase64(input: CalcInput): string {
  try {
    const diff: Partial<CalcInput> = {}
    
    // Simple top-level diff
    if (input.grossIncome !== DEFAULT_INPUT.grossIncome) diff.grossIncome = input.grossIncome
    if (input.dividendIncome !== DEFAULT_INPUT.dividendIncome) diff.dividendIncome = input.dividendIncome
    if (input.taxYear !== DEFAULT_INPUT.taxYear) diff.taxYear = input.taxYear
    if (input.isScottish !== DEFAULT_INPUT.isScottish) diff.isScottish = input.isScottish
    if (input.isBlind !== DEFAULT_INPUT.isBlind) diff.isBlind = input.isBlind
    if (input.employmentType !== DEFAULT_INPUT.employmentType) diff.employmentType = input.employmentType
    
    // Nested diffs
    if (JSON.stringify(input.studentLoan) !== JSON.stringify(DEFAULT_INPUT.studentLoan)) {
      diff.studentLoan = input.studentLoan
    }
    if (JSON.stringify(input.pension) !== JSON.stringify(DEFAULT_INPUT.pension)) {
      diff.pension = input.pension
    }
    if (JSON.stringify(input.childBenefit) !== JSON.stringify(DEFAULT_INPUT.childBenefit)) {
      diff.childBenefit = input.childBenefit
    }

    const json = JSON.stringify(diff)
    const b64 = btoa(json)
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch (e) {
    console.error('[URL] Encoding failed:', e)
    return ''
  }
}

/**
 * Decodes a CalcInput state from a URL-safe Base64 string.
 */
function decodeStateFromBase64(s: string): CalcInput | null {
  try {
    // Restore base64 padding and characters
    let b64 = s.replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) b64 += '='
    const json = atob(b64)
    const decoded = JSON.parse(json)
    // Merge with defaults to handle schema drift
    return { ...DEFAULT_INPUT, ...decoded }
  } catch (e) {
    return null
  }
}

export function encodeStateToURL(input: CalcInput): string {
  const params = new URLSearchParams()
  const s = encodeStateToBase64(input)
  if (s) params.set('s', s)
  return params.toString()
}

export function decodeStateFromURL(source: string | URL | URLSearchParams): CalcInput {
  let params: URLSearchParams
  
  if (typeof source === 'string') {
    const q = source.startsWith('?') ? source.substring(1) : source
    params = new URLSearchParams(q)
  } else if (source instanceof URL) {
    params = source.searchParams
  } else {
    params = source
  }
  
  // 1. Try modern 's' parameter
  const s = params.get('s')
  if (s) {
    const decoded = decodeStateFromBase64(s)
    if (decoded) return decoded
  }

  // 2. Fallback to legacy parameters
  const get = (key: string) => params.get(key)
  
  // If no params at all, return default
  if (params.size === 0) return DEFAULT_INPUT

  let grossIncome = Number(get('g'))
  if (isNaN(grossIncome) || get('g') === null) grossIncome = DEFAULT_INPUT.grossIncome
  grossIncome = Math.max(0, Math.min(10_000_000, grossIncome))

  let dividendIncome = Number(get('di'))
  if (isNaN(dividendIncome)) dividendIncome = DEFAULT_INPUT.dividendIncome
  dividendIncome = Math.max(0, Math.min(10_000_000, dividendIncome))

  const taxYear = get('ty')
  const finalTaxYear = (taxYear && /^\d{4}_\d{4}$/.test(taxYear)) ? taxYear : DEFAULT_INPUT.taxYear

  let pensionValue = Number(get('pv')) || 0
  const pensionType = get('pt') === 'f' ? 'fixed' : 'percentage'
  if (pensionType === 'percentage') pensionValue = Math.min(100, pensionValue)

  let childrenCount = Number(get('cc')) || 0
  childrenCount = Math.min(20, childrenCount)

  return {
    grossIncome,
    dividendIncome,
    taxYear: finalTaxYear,
    isScottish: get('sc') === '1',
    isBlind: get('bl') === '1',
    employmentType: CODE_TO_EMPLOYMENT[get('et') || 'e'] || 'employed',
    studentLoan: {
      plan: CODE_TO_PLAN[get('sl') || 'n'] || 'None',
      includePostgraduate: get('pg') === '1'
    },
    pension: {
      type: pensionType,
      value: pensionValue
    },
    childBenefit: {
      hasChildren: get('ch') === '1',
      childrenCount
    }
  }
}

/**
 * Comparison URL format: ?s1={base64_1}&s2={base64_2}
 */
export function encodeComparisonToURL(left: CalcInput, right: CalcInput): string {
  const params = new URLSearchParams()
  params.set('s1', encodeStateToBase64(left))
  params.set('s2', encodeStateToBase64(right))
  return params.toString()
}

export function decodeComparisonFromURL(source: string | URL | URLSearchParams): { left: CalcInput; right: CalcInput } {
  let params: URLSearchParams
  
  if (typeof source === 'string') {
    const q = source.startsWith('?') ? source.substring(1) : source
    params = new URLSearchParams(q)
  } else if (source instanceof URL) {
    params = source.searchParams
  } else {
    params = source
  }

  const s1 = params.get('s1')
  const s2 = params.get('s2')

  return {
    left: s1 ? (decodeStateFromBase64(s1) || DEFAULT_INPUT) : decodeStateFromURL(params),
    right: s2 ? (decodeStateFromBase64(s2) || DEFAULT_INPUT) : DEFAULT_INPUT
  }
}
