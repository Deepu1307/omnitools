# OmniTools.io — High-Speed, Privacy-First Online Utilities

A modern, production-ready web application built with **Next.js 14 (App Router), TypeScript, Tailwind CSS, and Lucide Icons**. Designed to generate organic search traffic and monetize via display ads (Google AdSense / Mediavine / Raptive), partner affiliate placements, and donations.

---

## 🛠 Included Tools

All utilities are built **100% client-side**. No files or sensitive inputs ever leave the user's browser, eliminating hosting bandwidth costs while maximizing user privacy and speed:

1. **Exact Age & Milestone Calculator** (`/tools/age-calculator`)
   - Exact age in years, months, days, total hours, minutes, seconds.
   - Next birthday countdown, day of the week born, zodiac sign, 10,000-day milestone.
   - One-click "Share Results" summary.

2. **Image Resizer & Compressor** (`/tools/image-resizer`)
   - Resize by exact pixels or percentage with aspect ratio lock.
   - Real-time compression slider & format conversion (JPG, PNG, WebP).
   - Instant side-by-side comparison ("Saved 72%!") and one-click download.

3. **Instant Background Remover & Transparent PNG Maker** (`/tools/background-remover`)
   - Canvas-based color tolerance and edge feathering algorithm.
   - Point-and-click color sampling from original photo.
   - Real-time transparent preview on checkerboard background.

4. **PDF Splitter & Page Extractor** (`/tools/pdf-splitter`)
   - Powered by `pdf-lib` client-side execution.
   - Page count detection and range selection (`1-3, 5, 8`).
   - Downloads extracted subset with zero server uploads.

5. **Video Clipper & Trimmer** (`/tools/video-clipper`)
   - Visual start/end timestamp scrubbers.
   - Selection playback loop preview.
   - Browser MediaRecorder export without watermarks.

6. **JSON to Multi-Language Types** (`/tools/json-to-types`)
   - Converts JSON to TypeScript `interface`, Python `Pydantic BaseModel`, Go `struct`, and Rust `struct`.
   - Copy to clipboard & formatting tools.

7. **Cloud Storage & Egress Cost Estimator** (`/tools/cloud-cost-calculator`)
   - Compares AWS S3, Google Cloud Storage, Azure Blob, and Cloudflare R2.
   - Interactive storage and egress sliders with monthly savings indicators.

---

## 💰 Monetization Guide

### 1. Google AdSense
When your account is ready:
1. Open `src/app/layout.tsx`.
2. Uncomment the AdSense `<script>` and `<meta>` tags in `<head>`, replacing `ca-pub-XXXXXXXXXXXXXXXX` with your publisher ID.
3. Open `src/components/AdBanner.tsx` to insert your ad slot snippet.

### 2. High-Converting Affiliate Links
`src/components/AdBanner.tsx` includes an engaging partner banner pre-styled with high-CTR styling. You can replace the default referral links with:
- Hosting & Cloud credits (DigitalOcean, Vultr, AWS, Cloudflare)
- VPN services (NordVPN, Surfshark)
- Dev courses or SaaS tools

### 3. Deploy in 1 Click (Zero Hosting Cost)
Because all processing is client-side and pages are pre-rendered statically:
- **Vercel**: Import repository and deploy in 30 seconds.
- **Cloudflare Pages / Netlify**: Run `npm run build` with default settings.
- **Custom Domain**: Connect a short, catchy brand domain (e.g., `omnitools.dev`, `quickutil.io`).

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the platform.
