/**
 * src/app/guides/page.tsx
 */

import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UK Tax Guides & Scenario Modeling | TaxCalculator365',
  description: 'In-depth guides on UK tax bands, dividend taxation, self-employment, and PAYE modeling.',
}

const guides = [
  {
    title: 'Self-Employed Tax Guide',
    slug: 'self-employed-tax-uk',
    description: 'Learn how to calculate your self-employment tax, NI, and student loan repayments.',
    category: 'Self-Employment'
  },
  {
    title: 'Dividend Tax Explained',
    slug: 'dividend-tax-guide',
    description: 'How dividends are taxed in the UK and how they interact with your salary.',
    category: 'Investing'
  },
  {
    title: 'PAYE vs Dividends',
    slug: 'paye-vs-dividends',
    description: 'Modeling the most tax-efficient way to pay yourself from a limited company.',
    category: 'Planning'
  }
]

export default function GuidesPage() {
  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <h1 className="text-6xl md:text-8xl font-black text-text_primary tracking-tighter leading-[0.9] mb-12">
          UK Tax Guides
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Link 
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group bg-background_surface p-8 rounded-[2rem] border border-border_default hover:border-accent_primary transition-all shadow-sm flex flex-col gap-4"
            >
              <span className="text-[10px] font-black text-accent_primary uppercase tracking-widest">
                {guide.category}
              </span>
              <h2 className="text-2xl font-black text-text_primary group-hover:text-accent_primary transition-colors">
                {guide.title}
              </h2>
              <p className="text-md font-medium text-text_secondary leading-relaxed">
                {guide.description}
              </p>
              <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-black text-text_primary">
                Read Guide <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
