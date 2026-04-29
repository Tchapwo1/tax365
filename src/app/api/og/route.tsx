/**
 * src/app/api/og/route.tsx
 */

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Dynamic params
    const year = searchParams.get('year')?.replace('_', '/') || '2026/27'
    const netPay = searchParams.get('net')
    const hasBaseline = searchParams.has('s1')

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#18181B', // Deep Slate
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Logo / Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#FF5A1F', // International Orange
                borderRadius: '8px',
                marginRight: '16px',
              }}
            />
            <span style={{ color: 'white', fontSize: 32, fontWeight: 900, letterSpacing: '-0.05em' }}>
              TaxCalculator365
            </span>
          </div>

          {/* Main Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span style={{ color: '#FF5A1F', fontSize: 24, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              UK Income Tax Calculator
            </span>
            <span
              style={{
                color: 'white',
                fontSize: 84,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.05em',
                marginTop: '10px',
              }}
            >
              Tax Year {year}
            </span>
          </div>

          {/* Dynamic Content */}
          {netPay && (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '60px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 24, fontWeight: 700 }}>
                Estimated Take-home Pay
              </span>
              <span style={{ color: 'white', fontSize: 64, fontWeight: 900 }}>
                £{netPay}
              </span>
            </div>
          )}

          {!netPay && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '60px', gap: '20px' }}>
              <div
                style={{
                  backgroundColor: 'white',
                  color: '#18181B',
                  padding: '20px 40px',
                  borderRadius: '100px',
                  fontSize: 24,
                  fontWeight: 900,
                }}
              >
                Calculate Now
              </div>
              {hasBaseline && (
                <span style={{ color: '#FF5A1F', fontSize: 24, fontWeight: 900 }}>
                  Comparing 2 Scenarios
                </span>
              )}
            </div>
          )}

          {/* Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, fontWeight: 700 }}>
              v2.1 Precision Engine
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, fontWeight: 700 }}>
              Authoritative Logic
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error(`[OG] Failed: ${e.message}`)
    return new Response(`Failed to generate image`, { status: 500 })
  }
}
