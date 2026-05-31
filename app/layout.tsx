import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hpgarage.ch'),
  title: {
    default: 'HP Garage – Autogarage Rudolfstetten | Service, Reparatur & MFK',
    template: '%s | HP Garage Rudolfstetten',
  },
  description:
    'HP Garage in Rudolfstetten-Friedlisberg, Aargau – Ihr Spezialist für Autoservice, Reparaturen, MFK-Vorbereitung, Klimaservice und Reifenmontage. Persönlich, fair und transparent.',
  keywords: [
    'Autogarage Rudolfstetten',
    'Garage Aargau',
    'Autoservice Rudolfstetten',
    'MFK Vorbereitung Aargau',
    'Reifenmontage Rudolfstetten',
    'Klimaservice Auto',
    'HP Garage',
    'Fahrzeugreparatur Aargau',
    'Auto Wartung Schweiz',
  ],
  authors: [{ name: 'HP Garage Rudolfstetten' }],
  creator: 'HP Garage',
  publisher: 'HP Garage',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_CH',
    url: 'https://www.hpgarage.ch',
    siteName: 'HP Garage Rudolfstetten',
    title: 'HP Garage – Autogarage Rudolfstetten',
    description:
      'Ihr Spezialist für Autoservice, Reparaturen und MFK in Rudolfstetten, Aargau. Persönlich, fair und professionell.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HP Garage Rudolfstetten – Ihre All-in-One Garage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HP Garage – Autogarage Rudolfstetten',
    description:
      'Autoservice, Reparaturen und MFK in Rudolfstetten, Aargau.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.hpgarage.ch',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de-CH" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AutoRepair',
              name: 'HP Garage',
              description:
                'Ihre All-in-One Garage für Technik, Performance & Pflege in Rudolfstetten.',
              url: 'https://www.hpgarage.ch',
              telephone: '+41 56 000 00 00',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Rudolfstetten',
                addressLocality: 'Rudolfstetten-Friedlisberg',
                addressRegion: 'Aargau',
                postalCode: '8964',
                addressCountry: 'CH',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 47.3674,
                longitude: 8.3507,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '07:30',
                  closes: '17:30',
                },
              ],
              sameAs: [
                'https://www.instagram.com/hpgarage.rudolfstetten',
                'https://www.facebook.com/hpgarage.rudolfstetten',
                'https://www.tiktok.com/@hpgarage.ch',
              ],
              priceRange: '$$',
              image: 'https://www.hpgarage.ch/logo.png',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
