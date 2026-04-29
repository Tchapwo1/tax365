/**
 * src/lib/store/calculator.store.ts
 * 
 * Zustand store for the UK Tax Calculator.
 * Implements the atomic state machine from blueprint Part 4.
 * Aligned with test suite actions.
 */

import { create } from 'zustand'
import { calculate } from '../calculator'
import type { CalcInput, CalcOutput, TaxYearConfig } from '../calculator/types'

export type CalculatorStatus = 'idle' | 'editing' | 'calculating' | 'showing_results' | 'advanced_open' | 'error'

export const DEFAULT_INPUT: CalcInput = {
  grossIncome: 0,
  taxYear: '2026_2027',
  isScottish: false,
  isBlind: false,
  employmentType: 'employed',
  studentLoan: { plan: 'None', includePostgraduate: false },
  pension: { type: 'percentage', value: 0 },
  childBenefit: { hasChildren: false, childrenCount: 0 },
  dividendIncome: 0,
}

export interface CalculatorState {
  config: TaxYearConfig | null
  input: CalcInput
  output: CalcOutput | null
  
  // Comparison Mode
  baselineInput: CalcInput | null
  baselineOutput: CalcOutput | null
  
  status: CalculatorStatus
  _debounceTimer: ReturnType<typeof setTimeout> | null

  // Actions
  init: (config: TaxYearConfig, initialInput?: Partial<CalcInput>, initialBaseline?: CalcInput) => void
  updateInput: (patch: Partial<CalcInput>) => void
  
  // Comparison Actions
  setBaseline: () => void
  clearComparison: () => void
  swapComparison: () => void
  
  // Specific setters for test suite
  setGrossIncome: (val: number) => void
  setIsScottish: (val: boolean) => void
  setStudentLoan: (patch: Partial<CalcInput['studentLoan']>) => void
  setPension: (patch: Partial<CalcInput['pension']>) => void
  
  calculateNow: () => void
  openAdvanced: () => void
  closeAdvanced: () => void
  reset: () => void
}

const DEBOUNCE_MS = 300

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  config: null,
  input: DEFAULT_INPUT,
  output: null,
  baselineInput: null,
  baselineOutput: null,
  status: 'idle',
  _debounceTimer: null,

  init(config, initialInput, initialBaseline) {
    const input = { ...DEFAULT_INPUT, ...initialInput }
    
    let baselineOutput = null
    if (initialBaseline) {
      baselineOutput = calculate(initialBaseline, config)
    }

    set({ 
      config, 
      input, 
      baselineInput: initialBaseline || null,
      baselineOutput,
      status: 'idle', 
      output: null 
    })

    if (input.grossIncome > 0 || (input.dividendIncome && input.dividendIncome > 0)) {
      get().calculateNow()
    }
  },

  updateInput(patch) {
    const { _debounceTimer } = get()
    if (_debounceTimer) clearTimeout(_debounceTimer)

    const newInput = { ...get().input, ...patch }
    
    const timer = setTimeout(() => {
      set({ status: 'calculating' })
      get().calculateNow()
    }, DEBOUNCE_MS)

    set({ input: newInput, status: 'editing', _debounceTimer: timer })
  },

  setBaseline() {
    const { input, output } = get()
    if (!output) return
    set({ 
      baselineInput: { ...input },
      baselineOutput: { ...output }
    })
    // Sync URL with comparison
    if (typeof window !== 'undefined') {
      const s1 = btoa(JSON.stringify(input)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      window.history.replaceState({}, '', `?s1=${s1}&s2=${s1}`)
    }
  },

  clearComparison() {
    set({ baselineInput: null, baselineOutput: null })
    // Sync URL back to single
    const { input } = get()
    if (typeof window !== 'undefined') {
      const s = btoa(JSON.stringify(input)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      window.history.replaceState({}, '', `?s=${s}`)
    }
  },

  swapComparison() {
    const { input, output, baselineInput, baselineOutput } = get()
    if (!baselineInput || !baselineOutput) return
    set({
      input: baselineInput,
      output: baselineOutput,
      baselineInput: input,
      baselineOutput: output
    })
  },

  setGrossIncome(val) {
    get().updateInput({ grossIncome: val })
  },

  setIsScottish(val) {
    get().updateInput({ isScottish: val })
  },

  setStudentLoan(patch) {
    get().updateInput({ studentLoan: { ...get().input.studentLoan, ...patch } })
  },

  setPension(patch) {
    get().updateInput({ pension: { ...get().input.pension, ...patch } })
  },

  calculateNow() {
    const { config, input, baselineInput } = get()
    if (!config) {
      set({ status: 'error' })
      return
    }

    try {
      const output = calculate(input, config)
      
      let newBaselineOutput = get().baselineOutput
      if (baselineInput) {
        newBaselineOutput = calculate(baselineInput, config)
      }

      set({ 
        output, 
        baselineOutput: newBaselineOutput,
        status: 'showing_results', 
        _debounceTimer: null 
      })

      // Sync URL
      if (typeof window !== 'undefined') {
        if (baselineInput) {
          const s1 = btoa(JSON.stringify(baselineInput)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
          const s2 = btoa(JSON.stringify(input)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
          window.history.replaceState({}, '', `?s1=${s1}&s2=${s2}`)
        } else {
          const s = btoa(JSON.stringify(input)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
          window.history.replaceState({}, '', `?s=${s}`)
        }
      }

    } catch (err) {
      console.error('[CalculatorStore] Calculation failed:', err)
      set({ status: 'error', _debounceTimer: null })
    }
  },

  openAdvanced() {
    set({ status: 'advanced_open' })
  },

  closeAdvanced() {
    const { output } = get()
    set({ status: output ? 'showing_results' : 'idle' })
  },

  reset() {
    const { _debounceTimer } = get()
    if (_debounceTimer) clearTimeout(_debounceTimer)
    set({ 
      input: DEFAULT_INPUT, 
      output: null, 
      baselineInput: null, 
      baselineOutput: null, 
      status: 'idle', 
      _debounceTimer: null 
    })
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/')
    }
  }
}))
