/**
 * src/components/layout/Navbar.tsx
 * 
 * Pixel-perfect Taxfix clone navbar.
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white border-b border-border_default sticky top-0 z-sticky h-20 flex items-center">
      <div className="container mx-auto px-6 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-3xl font-black text-text_primary tracking-tighter">
            taxcalculator365<span className="text-accent_primary">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/tax-returns" className="text-sm font-semibold text-text_primary hover:opacity-70 transition-opacity">Tax Returns</Link>
          <Link href="/accountants" className="text-sm font-semibold text-text_primary hover:opacity-70 transition-opacity">Find an Accountant</Link>
          <Link href="/blog" className="text-sm font-semibold text-text_primary hover:opacity-70 transition-opacity">Expert Blog</Link>
          <Link href="/mtd" className="text-sm font-semibold text-text_primary hover:opacity-70 transition-opacity">MTD</Link>
          <Link href="/advice" className="text-sm font-semibold text-text_primary hover:opacity-70 transition-opacity">Tax Advice</Link>
          <Link href="/guides" className="text-sm font-semibold text-text_primary hover:opacity-70 transition-opacity">Guides</Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/login" className="text-sm font-semibold text-text_primary hover:opacity-70 transition-opacity">Log in</Link>
          <Link 
            href="/get-started" 
            className="bg-accent_primary text-white px-6 py-3 rounded-full text-sm font-black hover:scale-105 transition-all shadow-sm"
          >
            Get started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-text_primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-t border-border_default p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-medium shadow-xl">
          <Link href="/tax-returns" className="text-lg font-bold text-text_primary">Tax Returns</Link>
          <Link href="/mtd" className="text-lg font-bold text-text_primary">Making Tax Digital (MTD)</Link>
          <Link href="/advice" className="text-lg font-bold text-text_primary">Tax Advice</Link>
          <Link href="/company-services" className="text-lg font-bold text-text_primary">Company services</Link>
          <Link href="/resources" className="text-lg font-bold text-text_primary">Resources</Link>
          <div className="h-px bg-border_default my-2" />
          <Link href="/login" className="text-lg font-bold text-text_primary">Log in</Link>
          <Link href="/get-started" className="bg-accent_primary text-white px-4 py-4 rounded-full text-center font-black">Get started</Link>
        </div>
      )}
    </header>
  )
}
