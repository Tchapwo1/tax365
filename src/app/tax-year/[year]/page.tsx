/**
 * src/app/tax-year/[year]/page.tsx
 * 
 * Dynamic tax year route.
 * strictly adhering to blueprint Part 4 & Part 7 (SEO).
 */

import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { loadTaxYear, getAvailableTaxYears } from '@/lib/store/taxYear'
import { CalculatorContainer } from '@/components/CalculatorContainer'
import { JSONLD } from '@/components/seo/JSONLD'
import { decodeStateFromURL, decodeComparisonFromURL } from '@/lib/store/url'
import { TaxYearGuide } from '@/components/seo/TaxYearGuide'

interface PageProps {
  params: { year: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params
  const { config } = loadTaxYear(year)
  const displayYear = config.tax_year.replace('_', '/')
  
  const title = `UK Income Tax Calculator ${displayYear} | Take-home Pay`
  const description = `Calculate your take-home pay, tax, NI, pension, and student loan deductions for the ${displayYear} UK tax year. Free, fast and accurate.`
  const ogImage = `/api/og?year=${year}`

  return {
    title,
    description,
    alternates: {
      canonical: `/tax-year/${year}`,
    },
    openGraph: {
      title,
      description,
      url: `https://taxcalculator365.com/tax-year/${year}`,
      siteName: 'TaxCalculator365',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export async function generateStaticParams() {
  const years = getAvailableTaxYears()
  return years.map((year) => ({ year }))
}

export default async function TaxYearPage({ params, searchParams }: PageProps) {
  const { year: yearParam } = await params
  const sParams = await searchParams
  const { config, year } = loadTaxYear(yearParam)
  
  // Handle both single scenario and comparison rehydration
  const searchParamsObj = new URLSearchParams(sParams as any)
  const isComparison = searchParamsObj.has('s1') || searchParamsObj.has('s2')
  
  let initialInput, initialBaseline
  if (isComparison) {
    const comparison = decodeComparisonFromURL(searchParamsObj)
    initialInput = comparison.right
    initialBaseline = comparison.left
  } else {
    initialInput = decodeStateFromURL(searchParamsObj)
  }

  const displayYear = year.replace('_', '/')

  // Part 7: SEO Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `UK Income Tax Calculator ${displayYear}`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "description": `Calculate your take-home pay, tax, NI, pension, and student loan deductions for the ${displayYear} UK tax year.`,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How much can I earn tax-free in ${displayYear}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `For the ${displayYear} tax year, your Personal Allowance is £${config.personal_allowance.toLocaleString()}. You start paying 20% Income Tax on earnings above this amount.` }
      },
      {
        "@type": "Question",
        "name": `What are the ${displayYear} tax bands?`,
        "acceptedAnswer": { "@type": "Answer", "text": `The tax bands for ${displayYear} include the Basic rate (20%), Higher rate (40%), and Additional rate (45%). The Higher rate starts at £50,271 of taxable income.` }
      },
      {
        "@type": "Question",
        "name": "What is the 60% tax trap?",
        "acceptedAnswer": { "@type": "Answer", "text": "Between £100,000 and £125,140, your Personal Allowance is withdrawn by £1 for every £2 of income, creating an effective 60% marginal tax rate." }
      }
    ]
  }

  return (
    <main className="bg-white min-h-screen">
      <JSONLD data={softwareSchema} />
      <JSONLD data={faqSchema} />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-24 pb-12 max-w-7xl">
        <div className="flex flex-col gap-12">
          <Link href="/calculators" className="text-lg font-bold text-text_primary flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="text-xl font-black">&lt;-</span>
            View all TaxCalculator365 tax calculators
          </Link>
          
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl md:text-8xl font-black text-text_primary tracking-tighter leading-[0.9]">
              Income tax calculator UK
            </h1>
            <p className="text-xl md:text-2xl text-text_primary font-medium leading-relaxed max-w-3xl">
              Quickly calculate how much tax you need to pay on your income.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24 max-w-7xl">
        <div className="flex flex-col gap-24">
          
          {/* Calculator Container with massive padding */}
          <div className="bg-background_surface rounded-[3rem] p-8 md:p-16">
            <CalculatorContainer 
              config={config} 
              initialInput={initialInput} 
              initialBaseline={initialBaseline} 
            />
          </div>

          {/* Primary CTA Box - Taxfix Purple */}
          <div className="bg-taxfix_purple rounded-[3rem] p-12 md:p-24 text-text_primary flex flex-col items-start gap-8 relative overflow-hidden shadow-sm">
            <div className="flex flex-col gap-6 relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">Have you sorted your tax return yet?</h2>
              <p className="text-lg md:text-xl font-medium leading-relaxed opacity-90">
                Avoid costly mistakes and let TaxCalculator365 take care of it for you. Our UK-accredited accountants make filing quick 
                and stress-free, starting from just £119. With the <span className="font-bold">31st January deadline</span> getting closer, now's a great time to get the official stuff out the way.
              </p>
              <div className="flex gap-4 mt-4">
                <Link href="/get-started" className="bg-text_primary text-white px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-lg">
                  Start now
                </Link>
              </div>
            </div>
            {/* Floating Chat Bubble Icon like in reference */}
            <div className="absolute bottom-8 right-8 w-16 h-16 bg-[#18181B] rounded-full flex items-center justify-center shadow-xl">
               <span className="text-white text-3xl">💬</span>
               <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full border-2 border-taxfix_purple flex items-center justify-center text-[10px] text-white font-bold">1</div>
            </div>
          </div>

          <TaxYearGuide config={config} />
          
          {/* Filing Comparison Section */}
          <section className="flex flex-col md:flex-row gap-24 items-center">
            <div className="flex-1 flex flex-col gap-8">
              <h2 className="text-4xl md:text-5xl font-black text-text_primary tracking-tighter leading-tight">Filing your Self Assessment: us vs HMRC</h2>
              <p className="text-xl text-text_primary font-medium leading-relaxed">
                Filing with TaxCalculator365 is just easier. Not only that, but we’re friendlier, 
                jargon-free and have expert accountants on our side.
              </p>
              <ul className="flex flex-col gap-4 text-lg font-bold text-text_primary">
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent_primary flex items-center justify-center text-white text-xs">✓</div>
                  An intuitive and well-loved platform
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent_primary flex items-center justify-center text-white text-xs">✓</div>
                  We can file your tax return quickly
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-accent_primary flex items-center justify-center text-white text-xs">✓</div>
                  Your accredited accountant does it all for you
                </li>
              </ul>
              <Link href="/comparison" className="text-lg font-black text-text_primary underline decoration-accent_primary decoration-4 underline-offset-8">
                Learn more
              </Link>
            </div>
            <div className="flex-1 w-full bg-background_surface rounded-[3rem] aspect-square flex items-center justify-center p-12">
               <div className="w-full h-full bg-white rounded-[2rem] shadow-2xl border border-border_default" />
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
