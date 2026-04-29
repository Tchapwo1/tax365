/**
 * src/lib/calculator/index.ts
 * 
 * Main entry point for the UK Tax Calculator logic engine.
 * Assembles all sub-calculations into a single CalcOutput.
 * Strictly adhering to the execution order in blueprint Part 4.
 */

import type { CalcInput, CalcOutput, TaxYearConfig } from './types'
import { calculateIncomeTax, calculateAdjustedPersonalAllowance, calculateDividendTax } from './tax'
import { calculateNI } from './ni'
import { calculateStudentLoan } from './studentLoan'
import { calculatePension } from './pension'
import { calculateChildBenefitCharge } from './childBenefit'
import { generateAlerts } from './alerts'
import { generateBreakdown } from './breakdown'

export function calculate(input: CalcInput, config: TaxYearConfig): CalcOutput {
  const { grossIncome, studentLoan, pension, childBenefit, isScottish, isBlind, employmentType, dividendIncome = 0 } = input

  // 1. Adjusted Net Income (ANI) — include dividends for PA tapering
  const adjustedNetIncome = grossIncome + dividendIncome - (pension.type === 'percentage' ? (grossIncome * pension.value / 100) : pension.value)
  
  // Note: For pension logic, we need to know taxableAfterPension which is used for income tax calculation
  const { contribution: pensionContribution, taxableAfterPension } = calculatePension(
    grossIncome,
    pension.type,
    pension.value
  )

  // 2. Adjusted Personal Allowance (uses ANI)
  const adjustedPA = calculateAdjustedPersonalAllowance(
    adjustedNetIncome,
    config.personal_allowance,
    config.personal_allowance_taper_from,
    config.personal_allowance_taper_rate,
    isBlind,
    config.blind_persons_allowance
  )

  // 3. Income Tax (Salary/Pension)
  const incomeTax = calculateIncomeTax(
    taxableAfterPension,
    config.income_tax_bands,
    adjustedPA,
    isScottish,
    config.scottish_tax_bands,
    config.personal_allowance
  )

  // 4. Dividend Tax (Top Slice)
  // Non-dividend taxable income is salary after PA
  const nonDividendTaxableIncome = Math.max(0, taxableAfterPension - adjustedPA)
  const { dividendTax, taxableDividendIncome } = calculateDividendTax(
    dividendIncome,
    {
      dividend_allowance: config.dividend_allowance,
      dividend_tax_bands: config.dividend_tax_bands,
      dividend_allowance_consumes_band: config.dividend_allowance_consumes_band
    },
    nonDividendTaxableIncome
  )

  // 5. National Insurance
  const niInput = config.pension_rules.salary_sacrifice_reduces_ni ? taxableAfterPension : grossIncome
  const nationalInsurance = calculateNI(
    niInput,
    config.ni_employee_class1,
    employmentType,
    config.ni_self_employed_class4
  )

  // 6. Student Loan
  const slRepayment = calculateStudentLoan(
    grossIncome,
    studentLoan.plan,
    studentLoan.includePostgraduate,
    config.student_loan_plans
  )

  // 7. Child Benefit Charge
  const { charge: childBenefitCharge } = calculateChildBenefitCharge(
    grossIncome + dividendIncome, // HICBC uses ANI (simplified here to gross + dividends)
    childBenefit.hasChildren,
    childBenefit.childrenCount,
    config.child_benefit_rates
  )

  // 8. Assemble Net Pay
  const totalDeductions = incomeTax + nationalInsurance + slRepayment + pensionContribution + childBenefitCharge + dividendTax
  const totalGross = grossIncome + dividendIncome
  const netPay = Math.max(0, totalGross - totalDeductions)
  const effectiveTaxRate = totalGross > 0 ? (totalDeductions / totalGross) : 0

  // 9. Generate Alerts
  const outputDraft: Partial<CalcOutput> = {
    incomeTax,
    nationalInsurance,
    studentLoan: slRepayment,
    pensionContribution,
    childBenefitCharge,
    dividendTax,
    netPay,
    effectiveTaxRate
  }
  const alerts = generateAlerts(input, outputDraft, config)

  // 10. Generate Breakdown
  const { yearly, monthly, weekly } = generateBreakdown(
    totalGross,
    incomeTax,
    nationalInsurance,
    slRepayment,
    pensionContribution,
    childBenefitCharge,
    dividendTax,
    netPay
  )

  return {
    incomeTax,
    nationalInsurance,
    studentLoan: slRepayment,
    pensionContribution,
    childBenefitCharge,
    dividendTax,
    taxableDividendIncome,
    netPay,
    effectiveTaxRate,
    breakdown: { yearly, monthly, weekly },
    alerts,
    metadata: {
      taxYear: config.tax_year,
      verifiedAgainst: config.verified_against,
      calculationId: crypto.randomUUID()
    }
  }
}
