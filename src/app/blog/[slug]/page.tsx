
'use client'

import React from 'react'
import Link from 'next/link'

interface PageProps {
  params: { slug: string }
}

export default function BlogPostPage({ params }: PageProps) {
  // In a real app, we would fetch data based on the slug. 
  // For this high-fidelity demo, we'll show a single well-formatted post.
  
  return (
    <article className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-20 left-0 w-full h-1 z-sticky pointer-events-none">
        <div className="h-full bg-accent_primary w-1/3" />
      </div>

      {/* Hero Header */}
      <header className="bg-background_surface py-24 border-b border-border_default">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <span className="bg-accent_primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Tax Tips
              </span>
              <span className="text-sm font-bold text-text_primary opacity-40">10 min read</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-text_primary tracking-tighter leading-tight">
              The 60% Tax Trap: How to avoid it in 2024/25
            </h1>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-border_default overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Jenkins" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-text_primary">Sarah Jenkins, ACA</span>
                <span className="text-sm font-medium text-text_primary opacity-40">Chartered Accountant • April 15, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 max-w-7xl py-24">
        <div className="flex flex-col lg:flex-row gap-24">
          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            <div className="prose prose-xl prose-slate max-w-none text-text_primary">
              <p className="text-2xl font-bold leading-relaxed mb-12">
                If you earn between £100,000 and £125,140, your effective tax rate is much higher than you might expect. 
                In fact, for every £1 you earn in this bracket, you could be losing 60p to the taxman. Here's why—and how to keep it.
              </p>

              <h2 className="text-3xl font-black tracking-tight mb-6">Why does the 60% rate exist?</h2>
              <p className="mb-8 leading-relaxed opacity-80">
                Technically, there is no official "60% tax band" in the UK. The standard higher rate is 40%, and the additional rate is 45%. 
                However, the "trap" is created by the tapering of the <strong>Personal Allowance</strong>.
              </p>

              {/* Expert Callout */}
              <div className="bg-accent_light border-l-8 border-accent_primary p-8 rounded-r-[2rem] my-12">
                <h4 className="text-xs font-black uppercase tracking-widest mb-2 text-accent_primary">The Mechanics</h4>
                <p className="text-lg font-bold">
                  For every £2 you earn over £100,000, you lose £1 of your tax-free Personal Allowance. 
                  This effectively adds an extra 20% tax on top of your 40% higher rate, totaling 60%.
                </p>
              </div>

              <h2 className="text-3xl font-black tracking-tight mb-6">Strategy 1: Pension Contributions</h2>
              <p className="mb-8 leading-relaxed opacity-80">
                One of the most effective ways to lower your adjusted net income is to pay more into your pension. 
                Because pension contributions are deducted before your "adjusted net income" is calculated, 
                they can pull you back below the £100,000 threshold.
              </p>

              <div className="bg-background_surface p-12 rounded-[2rem] border border-border_default my-12">
                <h3 className="text-xl font-black mb-4">Example Scenario:</h3>
                <p className="text-lg font-medium opacity-80">
                  If you earn £110,000, you are £10,000 into the trap. By contributing £10,000 to your pension, 
                  you restore your full Personal Allowance and gain £4,000 in tax relief plus £2,000 in restored allowance.
                </p>
              </div>

              <h2 className="text-3xl font-black tracking-tight mb-6">Strategy 2: Charitable Donations</h2>
              <p className="mb-8 leading-relaxed opacity-80">
                Similar to pension contributions, Gift Aid donations reduce your adjusted net income. 
                If you were planning on making a significant donation anyway, doing so in a year where you're in the 
                60% trap is incredibly tax-efficient.
              </p>
            </div>
            
            {/* Share & Tags */}
            <div className="border-t border-border_default mt-16 pt-8 flex items-center justify-between">
              <div className="flex gap-4">
                <span className="text-sm font-bold text-text_primary opacity-40">TAGS:</span>
                <Link href="#" className="text-sm font-black text-text_primary hover:text-accent_primary underline underline-offset-4">TAX PLANNING</Link>
                <Link href="#" className="text-sm font-black text-text_primary hover:text-accent_primary underline underline-offset-4">PENSIONS</Link>
              </div>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-background_surface flex items-center justify-center hover:bg-accent_primary hover:text-white transition-all">𝕏</button>
                <button className="w-10 h-10 rounded-full bg-background_surface flex items-center justify-center hover:bg-accent_primary hover:text-white transition-all">in</button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-96 flex flex-col gap-12">
            {/* Tool CTA */}
            <div className="bg-text_primary rounded-[2rem] p-10 text-white flex flex-col gap-6 shadow-xl">
              <h3 className="text-2xl font-black tracking-tight">Check your own tax.</h3>
              <p className="text-lg opacity-80 font-medium leading-relaxed">
                Use our high-precision calculator to see exactly how these rules affect your take-home pay.
              </p>
              <Link href="/" className="bg-accent_primary text-white text-center py-4 rounded-full font-black text-lg hover:scale-105 transition-transform">
                Open Calculator
              </Link>
            </div>

            {/* Related Posts */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-black text-text_primary uppercase tracking-widest text-xs opacity-40">Related Articles</h3>
              <div className="flex flex-col gap-8">
                <Link href="#" className="flex flex-col gap-2 group">
                  <span className="text-xs font-black text-accent_primary uppercase tracking-widest">Compliance</span>
                  <h4 className="text-lg font-black text-text_primary group-hover:text-accent_primary transition-colors leading-tight">
                    MTD for Landlords: What changes in April 2026?
                  </h4>
                </Link>
                <Link href="#" className="flex flex-col gap-2 group">
                  <span className="text-xs font-black text-accent_primary uppercase tracking-widest">Guides</span>
                  <h4 className="text-lg font-black text-text_primary group-hover:text-accent_primary transition-colors leading-tight">
                    Self Assessment Deadline: Everything you need to file
                  </h4>
                </Link>
              </div>
            </div>

            {/* Sticky Scroll Help */}
            <div className="sticky top-32 bg-accent_light p-8 rounded-[2rem] border-2 border-dashed border-accent_primary/30 flex flex-col gap-4">
              <h3 className="text-lg font-black text-text_primary">Need professional help?</h3>
              <p className="text-sm font-medium text-text_primary opacity-70">
                Our network of accredited accountants can handle your filing for you.
              </p>
              <Link href="/accountants" className="text-accent_primary font-black text-sm underline decoration-2 underline-offset-4">
                Find an advisor →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
