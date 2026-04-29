/**
 * src/app/guides/[slug]/page.tsx
 */

import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Guide {
  title: string
  slug: string
  content: string
  category: string
}

const guides: Record<string, Guide> = {
  'dividend-tax-guide': {
    title: 'Dividend Tax Explained',
    slug: 'dividend-tax-guide',
    category: 'Investing',
    content: `
      <h2>How are dividends taxed?</h2>
      <p>Dividends are taxed differently from salary. You get a tax-free Dividend Allowance each year. For 2024/25 and 2025/26, this is £500.</p>
      <h3>Dividend Tax Bands</h3>
      <ul>
        <li>Basic Rate: 8.75%</li>
        <li>Higher Rate: 33.75%</li>
        <li>Additional Rate: 39.35%</li>
      </ul>
      <p>Our calculator uses the "Top Slicing" method to ensure your dividends are correctly layered over your non-dividend income.</p>
    `
  },
  'self-employed-tax-uk': {
    title: 'Self-Employed Tax Guide',
    slug: 'self-employed-tax-uk',
    category: 'Self-Employment',
    content: `
      <h2>The Self-Employed Tax Trap</h2>
      <p>When you're self-employed, you pay Class 4 National Insurance and Income Tax. You also need to account for Payments on Account.</p>
      <p>Use our comparison tool to model the difference between being a Sole Trader vs a Limited Company Director.</p>
    `
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params
  const guide = guides[slug]
  if (!guide) return { title: 'Guide Not Found' }

  return {
    title: `${guide.title} | TaxCalculator365 Guide`,
    description: `Expert guide on ${guide.title.toLowerCase()}. Learn how it works with our interactive UK tax models.`,
  }
}

export async function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({ slug }))
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const guide = guides[slug]
  
  if (!guide) notFound()

  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/guides" className="text-sm font-black text-accent_primary uppercase tracking-widest mb-8 block hover:opacity-70">
          ← Back to Guides
        </Link>
        
        <span className="text-sm font-black text-text_secondary uppercase tracking-[0.2em] block mb-2">
          {guide.category}
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-text_primary tracking-tighter leading-tight mb-12">
          {guide.title}
        </h1>
        
        <div 
          className="prose prose-xl prose-slate max-w-none 
            prose-h2:text-3xl prose-h2:font-black prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-6
            prose-p:text-lg prose-p:font-medium prose-p:text-text_secondary prose-p:leading-relaxed
            prose-ul:list-disc prose-ul:pl-6 prose-li:text-lg prose-li:text-text_secondary"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />
        
        <div className="mt-24 p-12 bg-background_surface rounded-[3rem] border border-border_default flex flex-col items-center text-center gap-6">
          <h3 className="text-3xl font-black text-text_primary">Ready to model your scenario?</h3>
          <p className="text-lg font-medium text-text_secondary max-w-xl">
            See exactly how these rules apply to your specific income level using our precision modeling tool.
          </p>
          <Link href="/tax-year/2026_2027" className="bg-text_primary text-white px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-lg">
            Try the Calculator
          </Link>
        </div>
      </div>
    </main>
  )
}
