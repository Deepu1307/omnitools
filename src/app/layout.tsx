import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'OmniTools - Free Online Image, PDF, Media & Developer Utilities',
  description: '100% free, client-side tools for everyday users and developers: image resizer, background remover, PDF splitter, age calculator, video clipper, and JSON converters. Fast, secure, and private.',
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
      </body>
    </html>
  );
}
