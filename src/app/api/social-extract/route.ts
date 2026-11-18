import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    const match = url.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid Instagram URL' }, { status: 400 });
    }

    const shortcode = match[1];
    const embedUrl = `https://www.instagram.com/reel/${shortcode}/embed/`;

    const res = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Instagram returned status ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    // Look for .mp4 stream link
    let videoUrl: string | null = null;
    const directMp4Match = html.match(/https:\/\/[^"'\\]+fbcdn\.net[^"'\\]+\.mp4[^"'\\]*/i);
    if (directMp4Match) {
      videoUrl = directMp4Match[0].replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
    } else {
      const vMatch = html.match(/<video[^>]*src="([^"]+)"/i) || html.match(/"video_url":"([^"]+)"/);
      if (vMatch) {
        videoUrl = vMatch[1].replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
      }
    }

    // Look for thumbnail / image link
    let posterUrl: string | null = null;
    const directJpgMatch = html.match(/https:\/\/[^"'\\]+cdninstagram\.com[^"'\\]+\.jpg[^"'\\]*/i);
    if (directJpgMatch) {
      posterUrl = directJpgMatch[0].replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
    }

    return NextResponse.json({
      success: true,
      shortcode,
      videoUrl,
      posterUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
