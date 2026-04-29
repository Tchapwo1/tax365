/**
 * src/lib/calculator/types.ts
 * 
 * Core type definitions for the UK Tax Calculator logic engine.
 * strictly adhering to blueprint Part 3.
 */

export type StudentLoanPlan = 'Plan1' | 'Plan2' | 'Plan4' | 'Plan5' | 'Postgraduate' | 'None'

export type PensionInputType = 'percentage' | 'fixed'

export type EmploymentType = 'employed' | 'self_employed' | 'mixed'

export interface CalcInput {
  grossIncome: number
  taxYear: string
  isScottish: boolean
  isBlind: boolean
  studentLoan: {
    plan: StudentLoanPlan
    includePostgraduate: boolean
  }
  pension: {
    type: PensionInputType
    value: number
  }
  childBenefit: {
    hasChildren: boolean
    childrenCount: number
  }
  employmentType: EmploymentType
  dividendIncome: number
}

export type ScenarioState = CalcInput

export interface BreakDownRow {
  label: string
  yearly: number
  monthly: number
  weekly: number
}

export interface CalcOutput {
  incomeTax: number
  nationalInsurance: number
  studentLoan: number
  pensionContribution: number
  childBenefitCharge: number
  dividendTax: number
  taxableDividendIncome: number
  netPay: number
  effectiveTaxRate: number
  breakdown: {
    yearly: BreakDownRow[]
    monthly: BreakDownRow[]
    weekly: BreakDownRow[]
  }
  alerts: Alert[]
  metadata: {
    taxYear: string
    verifiedAgainst: string
    calculationId: string
  }
}

export type AlertType = 'cliff_edge' | 'child_benefit' | 'allowance_loss' | 'info'
export type AlertSeverity = 'info' | 'warning' | 'critical'

export interface Alert {
  type: AlertType
  severity: AlertSeverity
  message: string
  threshold: number | null
}

export interface TaxBand {
  band?: string
  from: number
  to: number | null
  rate: number
}

export interface TaxYearConfig {
  tax_year: string
  verified_against: string
  personal_allowance: number
  personal_allowance_taper_from: number
  personal_allowance_taper_rate: number
  blind_persons_allowance: number
  
  income_tax_bands: TaxBand[]
  scottish_tax_bands: TaxBand[]
  
  ni_employee_class1: TaxBand[]
  ni_self_employed_class4: TaxBand[]
  
  dividend_allowance: number
  dividend_tax_bands: TaxBand[]
  dividend_allowance_consumes_band: boolean
  
  starting_rate_for_savings: number
  personal_savings_allowance_basic: number
  personal_savings_allowance_higher: number
  personal_savings_allowance_additional: number
  
  student_loan_plans: Array<{
    plan: StudentLoanPlan
    annual_threshold: number
    rate: number
  }>
  
  child_benefit_rates: {
    first_child_weekly: number
    additional_child_weekly: number
    hicbc_threshold: number
    hicbc_taper_per_pound: number
  }
  
  pension_rules: {
    annual_allowance: number
    tapered_allowance_floor: number
    tapered_threshold: number
    salary_sacrifice_reduces_ni: boolean
  }
  
  alert_thresholds: {
    cliff_edge_lower: number
    cliff_edge_upper: number
    child_benefit_charge: number
    allowance_fully_withdrawn: number
  }
}
