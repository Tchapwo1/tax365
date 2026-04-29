/**
 * src/app/get-started/page.tsx
 */

import React from 'react'
import Link from 'next/link'

export default function GetStartedPage() {
  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl text-center flex flex-col items-center gap-8">
        <span className="text-sm font-black text-accent_primary uppercase tracking-[0.2em]">
          Onboarding
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-text_primary tracking-tighter leading-tight">
          Let's sort your taxes
        </h1>
        <p className="text-xl font-medium text-text_secondary leading-relaxed max-w-2xl">
          Whether you're a freelancer, landlord, or company director, we'll pair you 
          with the right expert to handle your filing.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
          <Link href="/accountants" className="bg-background_surface p-8 rounded-[2rem] border border-border_default hover:border-accent_primary transition-all text-left group">
            <h3 className="text-xl font-black mb-2 group-hover:text-accent_primary">I need an accountant</h3>
            <p className="text-sm text-text_secondary">Expert filing and ongoing advice.</p>
          </Link>
          <Link href="/tax-returns" className="bg-background_surface p-8 rounded-[2rem] border border-border_default hover:border-accent_primary transition-all text-left group">
            <h3 className="text-xl font-black mb-2 group-hover:text-accent_primary">I just need to file</h3>
            <p className="text-sm text-text_secondary">One-off Self Assessment filing.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
