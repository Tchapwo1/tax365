
'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface Post {
  id: number
  title: string
  category: string
  date: string
  author: string
  excerpt: string
  img: string
  slug: string
}

const postsData: Post[] = [
  {
    id: 1,
    title: "The 60% Tax Trap: How to avoid it in 2024/25",
    category: "Tax Tips",
    date: "April 15, 2024",
    author: "Sarah Jenkins, ACA",
    excerpt: "Earning over £100k? You might be paying an effective 60% tax rate. We break down how to mitigate this using pension contributions and other legal strategies.",
    img: "https://images.unsplash.com/photo-1554224155-1696413575b9?auto=format&fit=crop&q=80&w=600&h=400",
    slug: "60-percent-tax-trap"
  },
  {
    id: 2,
    title: "Self Assessment Deadline: Everything you need to file",
    category: "Guides",
    date: "January 10, 2024",
    author: "David Miller",
    excerpt: "Don't leave it until January 31st. Here is a definitive checklist of documents and information you need to file your tax return without the stress.",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600&h=400",
    slug: "self-assessment-checklist"
  },
  {
    id: 3,
    title: "MTD for Landlords: What changes in April 2026?",
    category: "Compliance",
    date: "March 22, 2024",
    author: "James Wilson",
    excerpt: "Making Tax Digital is coming for property income. Find out if you're affected and how to prepare your records for digital reporting.",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600&h=400",
    slug: "mtd-for-landlords-guide"
  },
  {
    id: 4,
    title: "Is your Side Hustle taxable? The £1,000 Allowance explained",
    category: "Small Business",
    date: "February 5, 2024",
    author: "Sarah Jenkins, ACA",
    excerpt: "Starting a business on the side? You might be eligible for the Trading Allowance. Learn when you need to register with HMRC.",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600&h=400",
    slug: "side-hustle-tax-allowance"
  }
]

const categories = ["All", "Tax Tips", "Guides", "Compliance", "Small Business"]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredPosts = activeCategory === "All" 
    ? postsData 
    : postsData.filter(p => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-background_primary pb-24">
      {/* Hero */}
      <section className="bg-background_surface py-24 border-b border-border_default">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col gap-8 max-w-4xl">
            <h1 className="text-5xl md:text-8xl font-black text-text_primary tracking-tighter leading-[0.9]">
              Expert <span className="text-accent_primary">Tax Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-text_primary font-medium leading-relaxed opacity-70">
              Actionable advice, regulatory updates, and expert guides from the UK's leading tax professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-sticky bg-white border-b border-border_default py-6 shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full font-black text-sm transition-all whitespace-nowrap border-2 ${activeCategory === cat ? 'bg-text_primary border-text_primary text-white' : 'border-border_default text-text_primary hover:border-accent_primary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.map(post => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-6"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-border_default">
                <img 
                  src={post.img} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-text_primary shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm font-bold text-text_primary opacity-40">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-text_primary tracking-tight leading-tight group-hover:text-accent_primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-lg font-medium text-text_primary opacity-60 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-accent_primary font-black text-sm uppercase tracking-widest mt-2">
                  Read more 
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-32 bg-text_primary rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl flex flex-col gap-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">Stay ahead of the taxman.</h2>
            <p className="text-xl font-medium opacity-80 leading-relaxed">
              Join 15,000+ UK taxpayers who receive our weekly breakdown of the most important tax news.
            </p>
            <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-4 text-lg outline-none focus:bg-white/20 transition-all placeholder:text-white/40"
              />
              <button className="bg-accent_primary text-white px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-lg">
                Subscribe
              </button>
            </form>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent_primary/10 to-transparent pointer-events-none" />
        </div>
      </section>
    </main>
  )
}
