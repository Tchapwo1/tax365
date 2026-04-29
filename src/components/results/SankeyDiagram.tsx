'use client'

import React, { useMemo } from 'react'
import { useCalculatorStore } from '@/lib/store/calculator.store'

const SankeyDiagram: React.FC = () => {
  const { output, input, baselineOutput, baselineInput } = useCalculatorStore()

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val)

  const prepareData = (out: typeof output, inp: typeof input) => {
    if (!out) return null
    const total = inp.grossIncome + (inp.dividendIncome || 0)
    if (total <= 0) return null

    return {
      total,
      flows: [
        { label: 'Income Tax', value: out.incomeTax, color: '#18181B' },
        { label: 'NI', value: out.nationalInsurance, color: '#18181BCC' },
        { label: 'Pension', value: out.pensionContribution, color: '#F59E0B' },
        { label: 'Student Loan', value: out.studentLoan, color: '#3B82F6' },
        { label: 'Dividend Tax', value: out.dividendTax || 0, color: '#8B5CF6' },
        { label: 'CB Charge', value: out.childBenefitCharge, color: '#DC2626' },
        { label: 'Net Pay', value: out.netPay, color: '#FF5A1F', isNet: true }
      ].filter(d => d.value > 0)
    }
  }

  const currentData = useMemo(() => prepareData(output, input), [output, input])
  const baselineData = useMemo(() => 
    (baselineOutput && baselineInput) ? prepareData(baselineOutput, baselineInput) : null, 
    [baselineOutput, baselineInput]
  )

  if (!currentData) return null

  // SVG Layout constants
  const width = 600
  const height = 400
  const nodeWidth = 16
  const padding = 40
  const col1 = 120
  const col2 = 440
  
  const scale = (height - padding * 2 - (currentData.flows.length - 1) * 16) / currentData.total

  return (
    <div className="w-full bg-white p-8 rounded-[2.5rem] border border-border_default shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-black text-text_primary tracking-tight">Financial Flow</h3>
          <p className="text-xs font-bold text-text_secondary uppercase tracking-widest">Visualizing your income distribution</p>
        </div>
        
        {baselineData && (
          <div className="flex items-center gap-4 px-4 py-2 bg-background_surface rounded-xl border border-border_default">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-text_secondary opacity-40 border-t-2 border-dashed border-text_secondary" />
              <span className="text-[10px] font-black text-text_secondary uppercase tracking-widest">Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-accent_primary rounded-sm" />
              <span className="text-[10px] font-black text-accent_primary uppercase tracking-widest">Current</span>
            </div>
          </div>
        )}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Gross Node */}
        <rect
          x={col1}
          y={padding}
          width={nodeWidth}
          height={currentData.total * scale + (currentData.flows.length - 1) * 16}
          fill="#18181B"
          rx={8}
        />
        <text
          x={col1 - 16}
          y={padding + (currentData.total * scale) / 2}
          textAnchor="end"
          dominantBaseline="middle"
          className="text-[14px] font-black fill-text_primary tracking-tighter"
        >
          Total Income
        </text>

        {/* Render Baseline Ghost Paths if comparison active */}
        {baselineData && baselineData.flows.map((item, i) => {
          const bScale = (height - padding * 2 - (baselineData.flows.length - 1) * 16) / baselineData.total
          const h = Math.max(2, item.value * bScale)
          const sy = padding + (i * 16) + (baselineData.flows.slice(0, i).reduce((sum, d) => sum + d.value, 0) * bScale)
          const y = padding + (i * 24) + (baselineData.flows.slice(0, i).reduce((sum, d) => sum + d.value, 0) * bScale) // Approximate Y positioning
          
          const x0 = col1 + nodeWidth
          const x1 = col2
          const xm = (x0 + x1) / 2
          
          return (
            <path 
              key={`baseline-${i}`}
              d={`M ${x0} ${sy + h/2} C ${xm} ${sy + h/2}, ${xm} ${y + h/2}, ${x1} ${y + h/2}`}
              fill="none"
              stroke={item.color}
              strokeWidth={h}
              strokeDasharray="4 4"
              opacity={0.15}
            />
          )
        })}

        {/* Current Links & Output Nodes */}
        {currentData.flows.map((item, i) => {
          const h = Math.max(2, item.value * scale)
          const sy = padding + (i * 16) + (currentData.flows.slice(0, i).reduce((sum, d) => sum + d.value, 0) * scale)
          const y = padding + (i * 24) + (currentData.flows.slice(0, i).reduce((sum, d) => sum + d.value, 0) * scale) // Match approximate spacing
          
          const x0 = col1 + nodeWidth
          const x1 = col2
          const xm = (x0 + x1) / 2
          
          const path = `
            M ${x0} ${sy}
            C ${xm} ${sy}, ${xm} ${y}, ${x1} ${y}
            L ${x1} ${y + h}
            C ${xm} ${y + h}, ${xm} ${sy + h}, ${x0} ${sy + h}
            Z
          `

          const bItem = baselineData?.flows.find(f => f.label === item.label)
          const diff = bItem ? item.value - bItem.value : 0

          return (
            <g key={`current-${i}`} className="group transition-all duration-300">
              <path 
                d={path} 
                fill={item.color} 
                opacity={0.2} 
                className="transition-opacity group-hover:opacity-40" 
              />
              <rect
                x={col2}
                y={y}
                width={nodeWidth}
                height={h}
                fill={item.color}
                rx={4}
                className="transition-all"
              />
              <text
                x={col2 + nodeWidth + 12}
                y={y + h / 2}
                dominantBaseline="middle"
                className={`text-[12px] font-bold ${item.isNet ? 'fill-accent_primary' : 'fill-text_secondary'}`}
              >
                {item.label}
              </text>
              
              {/* Scenario Context Tooltip */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <rect 
                  x={col2 + nodeWidth + 10} 
                  y={y + h / 2 + 10} 
                  width={180} 
                  height={baselineData ? 45 : 25} 
                  fill="white" 
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  rx={8}
                />
                <text
                  x={col2 + nodeWidth + 20}
                  y={y + h / 2 + 28}
                  className="text-[11px] font-black fill-text_primary"
                >
                  {baselineData ? `Current: ${formatCurrency(item.value)}` : formatCurrency(item.value)}
                </text>
                {baselineData && bItem && (
                  <text
                    x={col2 + nodeWidth + 20}
                    y={y + h / 2 + 43}
                    className={`text-[10px] font-bold ${diff > 0 ? 'fill-green-600' : diff < 0 ? 'fill-red-600' : 'fill-text_secondary'}`}
                  >
                    Baseline: {formatCurrency(bItem.value)} ({diff > 0 ? '+' : ''}{formatCurrency(diff)})
                  </text>
                )}
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default SankeyDiagram
