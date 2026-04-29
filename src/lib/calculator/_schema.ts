/**
 * src/lib/calculator/_schema.ts
 * 
 * Zod schema for validating tax year JSON data at build time.
 * Strictly adhering to blueprint Part 3.
 */

import { z } from 'zod'

const TaxBandSchema = z.object({
  band: z.string().optional(),
  from: z.number().min(0),
  to: z.number().nullable(),
  rate: z.number().min(0).max(1)
})

export const TaxYearDataSchema = z.object({
  tax_year: z.string().regex(/^\d{4}_\d{4}$/),
  verified_against: z.string(),
  personal_allowance: z.number().min(0),
  personal_allowance_taper_from: z.number().min(0),
  personal_allowance_taper_rate: z.number().min(0).max(1),
  blind_persons_allowance: z.number().min(0),

  income_tax_bands: z.array(TaxBandSchema),
  scottish_tax_bands: z.array(TaxBandSchema),

  ni_employee_class1: z.array(TaxBandSchema),
  ni_self_employed_class4: z.array(TaxBandSchema),

  dividend_allowance: z.number().min(0),
  dividend_tax_bands: z.array(TaxBandSchema),
  dividend_allowance_consumes_band: z.boolean(),

  starting_rate_for_savings: z.number().min(0),
  personal_savings_allowance_basic: z.number().min(0),
  personal_savings_allowance_higher: z.number().min(0),
  personal_savings_allowance_additional: z.number().min(0),

  student_loan_plans: z.array(z.object({
    plan: z.enum(['Plan1', 'Plan2', 'Plan4', 'Plan5', 'Postgraduate', 'None']),
    annual_threshold: z.number().min(0),
    rate: z.number().min(0).max(1)
  })),

  child_benefit_rates: z.object({
    first_child_weekly: z.number().min(0),
    additional_child_weekly: z.number().min(0),
    hicbc_threshold: z.number().min(0),
    hicbc_taper_per_pound: z.number().min(0).max(1)
  }),

  pension_rules: z.object({
    annual_allowance: z.number().min(0),
    tapered_allowance_floor: z.number().min(0),
    tapered_threshold: z.number().min(0),
    salary_sacrifice_reduces_ni: z.boolean()
  }),

  alert_thresholds: z.object({
    cliff_edge_lower: z.number().min(0),
    cliff_edge_upper: z.number().min(0),
    child_benefit_charge: z.number().min(0),
    allowance_fully_withdrawn: z.number().min(0)
  })
})
