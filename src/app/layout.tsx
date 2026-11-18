import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PWAProvider from '@/components/PWAProvider';

export const metadata: Metadata = {
  title: {
    default: 'OmniTools.io — 100% Private Web Tools • Zero Uploads',
    template: '%s | OmniTools.io',
  },
  description: '100% free, private web tools for creators, professionals, and developers: image resizer, background remover, PDF splitter, age calculator, video clipper, and JSON converters. Fast, secure, and zero server uploads.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: '/favicon.svg',
  },
  keywords: [
    'free online tools',
    'image resizer',
    'background remover',
    'pdf splitter',
    'age calculator',
    'video clipper',
    'json to typescript',
    'cloud storage calculator',
    'privacy first tools'
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OmniTools',
  },
  authors: [{ name: 'OmniTools' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'OmniTools',
    title: 'OmniTools - Fast, Private Online Utilities',
    description: 'Instant client-side tools with zero file uploads and zero waiting.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="stylesheet" href="/styles.css" />
        {/* AdSense Verification Tag Placeholder (Replace ca-pub-XXXX with your publisher ID) */}
        {/* <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" /> */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <PWAProvider />
      </body>
    </html>
  );
}
