/**
 * src/app/tax-returns/page.tsx
 */

import React from 'react'
import Link from 'next/link'

export default function TaxReturnsPage() {
  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl text-center flex flex-col items-center gap-8">
        <span className="text-sm font-black text-accent_primary uppercase tracking-[0.2em]">
          Professional Filing
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-text_primary tracking-tighter leading-tight">
          Hassle-Free Tax Returns
        </h1>
        <p className="text-xl font-medium text-text_secondary leading-relaxed max-w-2xl">
          File your UK Self Assessment with confidence. Our team of accredited accountants 
          ensure your return is accurate and optimized for tax efficiency.
        </p>
        <div className="flex gap-4">
          <Link href="/get-started" className="bg-text_primary text-white px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-lg">
            Start Your Return
          </Link>
          <Link href="/accountants" className="px-10 py-4 rounded-full font-black text-lg border border-border_default hover:bg-background_surface transition-colors">
            View Pricing
          </Link>
        </div>
      </div>
    </main>
  )
}
