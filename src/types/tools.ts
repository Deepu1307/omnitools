export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: 'consumer' | 'media' | 'pdf' | 'developer' | 'calculator' | 'security';
  description: string;
  keywords: string[];
  icon: string;
  isPopular?: boolean;
  badge?: string;
}

export const TOOLS: Tool[] = [
  // Media & Consumer
  {
    id: 'image-resizer',
    name: 'Image Resizer & Compressor',
    slug: 'image-resizer',
    category: 'media',
    description: 'Resize, compress, and convert PNG, JPG, and WebP images instantly in your browser with zero quality loss and 100% privacy.',
    keywords: ['image resizer', 'compress image', 'convert webp to png', 'reduce photo size', 'client-side photo editor'],
    icon: 'ImageIcon',
    isPopular: true,
    badge: 'Popular',
  },
  {
    id: 'background-remover',
    name: 'Instant Background Remover',
    slug: 'background-remover',
    category: 'media',
    description: 'Remove background from photos and create transparent PNGs directly in your browser. No signup, no watermark.',
    keywords: ['remove background', 'transparent png', 'bg remover free', 'photo cutout'],
    icon: 'ScissorsIcon',
    isPopular: true,
    badge: 'AI / Canvas',
  },
  {
    id: 'qr-code-generator',
    name: 'Custom QR Code Studio',
    slug: 'qr-code-generator',
    category: 'consumer',
    description: 'Create high-resolution custom QR codes for websites, WiFi networks, vCards, and text. Download as PNG or SVG.',
    keywords: ['qr code generator', 'free qr code', 'wifi qr code', 'custom color qr code', 'svg qr code'],
    icon: 'QrCodeIcon',
    isPopular: true,
    badge: 'High Search',
  },
  {
    id: 'video-clipper',
    name: 'Video Clipper & Trimmer',
    slug: 'video-clipper',
    category: 'media',
    description: 'Trim and cut MP4 and WebM videos without watermarks. Set exact start/end timestamps and export in seconds.',
    keywords: ['video cutter', 'trim video online', 'video clipper', 'cut mp4 free'],
    icon: 'VideoIcon',
    isPopular: true,
    badge: 'No Watermark',
  },

  // PDF Suite
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter & Page Extractor',
    slug: 'pdf-splitter',
    category: 'pdf',
    description: 'Extract specific pages or split PDF documents into smaller files directly on your device. Fast, safe, and private.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages', 'cut pdf online'],
    icon: 'FileTextIcon',
    isPopular: true,
    badge: 'Private',
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger & Combiner',
    slug: 'pdf-merger',
    category: 'pdf',
    description: 'Merge multiple PDF files into a single organized document in seconds. Reorder pages with zero uploads.',
    keywords: ['merge pdf', 'combine pdf files', 'join pdfs online', 'merge pdf free'],
    icon: 'LayersIcon',
    isPopular: true,
    badge: 'New',
  },

  // Calculators & High-CPM Finance
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest & SIP Calculator',
    slug: 'compound-interest-calculator',
    category: 'calculator',
    description: 'Visualize your wealth growth over time with monthly compounding, recurring contributions, and inflation adjustments.',
    keywords: ['compound interest calculator', 'sip calculator', 'investment growth calculator', 'future value calculator'],
    icon: 'TrendingUpIcon',
    isPopular: true,
    badge: 'High CPM',
  },
  {
    id: 'age-calculator',
    name: 'Exact Age & Milestone Calculator',
    slug: 'age-calculator',
    category: 'calculator',
    description: 'Calculate your exact age in years, months, days, hours, and minutes. Track upcoming birthdays and life milestones.',
    keywords: ['age calculator', 'date of birth calculator', 'how old am i', 'days until birthday', 'life milestones'],
    icon: 'CalendarIcon',
    isPopular: true,
    badge: 'Viral',
  },
  {
    id: 'cloud-cost-calculator',
    name: 'Cloud Storage & Egress Estimator',
    slug: 'cloud-cost-calculator',
    category: 'calculator',
    description: 'Compare monthly storage and network egress costs between AWS S3, Google Cloud Storage, Cloudflare R2, and Azure Blob.',
    keywords: ['cloud storage pricing', 's3 egress cost calculator', 'cloudflare r2 vs s3', 'gcp storage pricing'],
    icon: 'CloudIcon',
    isPopular: false,
    badge: 'Cloud & B2B',
  },

  // Developer & Security
  {
    id: 'jwt-debugger',
    name: 'Private JWT Inspector & Decoder',
    slug: 'jwt-debugger',
    category: 'security',
    description: 'Decode and inspect JSON Web Tokens locally. Check header, payload claims, expiration timers, and structure without sending tokens to any server.',
    keywords: ['jwt decoder', 'jwt debugger', 'decode token', 'jwt expiration check', 'private jwt viewer'],
    icon: 'ShieldAlertIcon',
    isPopular: true,
    badge: 'Security',
  },
  {
    id: 'password-generator',
    name: 'Secure Password & Passphrase Generator',
    slug: 'password-generator',
    category: 'security',
    description: 'Generate cryptographically strong random passwords and multi-word passphrases with entropy score and crack-time estimation.',
    keywords: ['password generator', 'strong password maker', 'diceware passphrase generator', 'password entropy'],
    icon: 'KeyIcon',
    isPopular: false,
    badge: 'Crypto Secure',
  },
  {
    id: 'json-to-types',
    name: 'JSON to Multi-Language Types',
    slug: 'json-to-types',
    category: 'developer',
    description: 'Convert JSON objects into clean TypeScript interfaces, Python Pydantic models, Go structs, and Rust structs.',
    keywords: ['json to typescript', 'json to pydantic', 'json to go struct', 'json to rust'],
    icon: 'CodeIcon',
    isPopular: false,
    badge: 'Dev Stack',
  },
];
