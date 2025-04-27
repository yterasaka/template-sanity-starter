import './globals.css'
import {IBM_Plex_Mono, Inter, PT_Serif} from 'next/font/google'

const serif = PT_Serif({
  variable: '--font-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})
const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})
const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{lang?: string}>
}) {
  const {lang} = await params

  return (
    <html lang={lang || 'en'} className={`${mono.variable} ${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
