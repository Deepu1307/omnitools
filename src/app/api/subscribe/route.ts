import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailTrimmed)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'subscribers.json');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let subscribers: Array<{ email: string; subscribedAt: string }> = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        subscribers = JSON.parse(fileContent);
      } catch (e) {
        subscribers = [];
      }
    }

    // Check if already subscribed
    const exists = subscribers.some((sub) => sub.email === emailTrimmed);
    if (!exists) {
      subscribers.push({
        email: emailTrimmed,
        subscribedAt: new Date().toISOString(),
      });
      fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! You are on the OmniTools update list.',
    });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving your subscription. Please try again.' },
      { status: 500 }
    );
  }
}