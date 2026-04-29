/**
 * src/app/mtd/page.tsx
 */

import React from 'react'
import Link from 'next/link'

export default function MTDPage() {
  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl text-center flex flex-col items-center gap-8">
        <span className="text-sm font-black text-accent_primary uppercase tracking-[0.2em]">
          Coming Soon
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-text_primary tracking-tighter leading-tight">
          MTD for Landlords & Sole Traders
        </h1>
        <p className="text-xl font-medium text-text_secondary leading-relaxed max-w-2xl">
          We're building a seamless Making Tax Digital (MTD) experience. 
          File your quarterly updates directly from TaxCalculator365.
        </p>
        <div className="flex gap-4">
          <Link href="/accountants" className="bg-text_primary text-white px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-lg">
            Speak to an Accountant
          </Link>
          <Link href="/" className="px-10 py-4 rounded-full font-black text-lg border border-border_default hover:bg-background_surface transition-colors">
            Back to Calculator
          </Link>
        </div>
      </div>
    </main>
  )
}
