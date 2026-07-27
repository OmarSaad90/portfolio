import type { Metadata } from 'next'
import { Bricolage_Grotesque, Manrope, Piazzolla } from 'next/font/google'
import { MotionConfig } from 'motion/react'
import CosmicBackdrop from '@/components/CosmicBackdrop'
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Omar Saad | Freelance Web Developer in Lebanon',
  description:
    'Freelance web developer and designer based in Lebanon, offering web design and development for businesses across Lebanon, the Middle East, Canada, and the US. Next.js, React, full-stack, from brief to launch.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Omar Saad | Freelance Web Developer in Lebanon',
    description:
      'Freelance web developer and designer based in Lebanon, offering web design and development for businesses across Lebanon, the Middle East, Canada, and the US.',
    type: 'website',
    url: siteUrl,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Saad | Freelance Web Developer in Lebanon',
    description:
      'Freelance web developer and designer based in Lebanon, offering web design and development for businesses worldwide.',
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Omar Saad',
  jobTitle: 'Web Developer & Designer',
  url: siteUrl,
  email: 'mailto:omar.saad1998.os@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'LB',
  },
  areaServed: ['Lebanon', 'Middle East', 'Canada', 'United States', 'Worldwide'],
  knowsAbout: ['Web Development', 'Web Design', 'Next.js', 'React', 'TypeScript', 'SEO'],
  sameAs: ['https://www.linkedin.com/in/omar-saad-879995221/'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${manrope.variable} ${piazzolla.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <CosmicBackdrop />
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  )
}
