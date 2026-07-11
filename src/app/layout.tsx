import type { Metadata } from 'next'
import { Bricolage_Grotesque, Manrope, Piazzolla } from 'next/font/google'
import { MotionConfig } from 'motion/react'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const piazzolla = Piazzolla({
  subsets: ['latin'],
  variable: '--font-piazzolla',
  display: 'swap',
  style: ['italic'],
  weight: ['500', '600'],
})

export const metadata: Metadata = {
  title: 'Omar Saad: Web Developer',
  description:
    'Web developer building websites for businesses in North America and the Middle East. Next.js, React, full-stack, from brief to deployment.',
  openGraph: {
    title: 'Omar Saad: Web Developer',
    description:
      'Web developer building websites for businesses in North America and the Middle East.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${manrope.variable} ${piazzolla.variable}`}>
      <body>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  )
}
