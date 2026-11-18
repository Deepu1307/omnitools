export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: 'consumer' | 'media' | 'pdf' | 'developer' | 'calculator';
  description: string;
  keywords: string[];
  icon: string;
  isPopular?: boolean;
  badge?: string;
}

export const TOOLS: Tool[] = [
  {
    id: 'image-resizer',
    name: 'Image Resizer & Compressor',
    slug: 'image-resizer',
    category: 'media',
    description: 'Resize, compress, and convert PNG, JPG, and WebP images instantly in your browser with zero quality loss and 100% privacy.',
    keywords: ['image resizer', 'compress image', 'convert webp to png', 'reduce photo size', 'client-side photo editor'],
    icon: 'ImageIcon',
    isPopular: true,
    badge: 'Privacy First',
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
    badge: '100% Free',
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter & Page Extractor',
    slug: 'pdf-splitter',
    category: 'pdf',
    description: 'Extract specific pages or split PDF documents into smaller files directly on your device. Fast, safe, and private.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages', 'cut pdf online'],
    icon: 'FileTextIcon',
    isPopular: true,
    badge: 'No File Uploads',
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
  {
    id: 'json-to-types',
    name: 'JSON to Multi-Language Types',
    slug: 'json-to-types',
    category: 'developer',
    description: 'Convert JSON objects into clean TypeScript interfaces, Python Pydantic models, Go structs, and Rust structs.',
    keywords: ['json to typescript', 'json to pydantic', 'json to go struct', 'json to rust'],
    icon: 'CodeIcon',
    isPopular: true,
    badge: 'Developer Favorite',
  },
  {
    id: 'cloud-cost-calculator',
    name: 'Cloud Storage & Egress Cost Estimator',
    slug: 'cloud-cost-calculator',
    category: 'calculator',
    description: 'Compare monthly storage and network egress costs between AWS S3, Google Cloud Storage, Cloudflare R2, and Azure Blob.',
    keywords: ['cloud storage pricing', 's3 egress cost calculator', 'cloudflare r2 vs s3', 'gcp storage pricing'],
    icon: 'CloudIcon',
    isPopular: true,
    badge: 'High CPM Niche',
  },
];
