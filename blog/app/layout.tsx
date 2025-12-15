import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })

export const metadata: Metadata = {
  title: 'HillWay Blog - Travel Stories & Himalayan Adventures',
  description: 'Explore the Himalayas through our travel stories, destination guides, trekking tips, and local insights. Your ultimate guide to mountain adventures.',
  keywords: ['travel blog', 'himalayan travel', 'trekking guides', 'mountain adventures', 'uttarakhand tourism', 'travel tips'],
  authors: [{ name: 'HillWay Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blog.hillway.in',
    siteName: 'HillWay Blog',
    title: 'HillWay Blog - Travel Stories & Himalayan Adventures',
    description: 'Explore the Himalayas through our travel stories and destination guides',
    images: [{
      url: 'https://blog.hillway.in/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'HillWay Blog'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HillWay Blog',
    description: 'Travel stories and Himalayan adventures',
    images: ['https://blog.hillway.in/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}