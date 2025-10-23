import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file found' });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const recordedAudioDir = path.join(process.cwd(), 'public', 'audio', 'malayalam', 'recorded');

  if (!fs.existsSync(recordedAudioDir)) {
    fs.mkdirSync(recordedAudioDir, { recursive: true });
  }

  const filePath = path.join(recordedAudioDir, `recorded_audio_${new Date().toISOString().replace(/:/g, '-')}.mp3`);

  try {
    fs.writeFileSync(filePath, buffer);
    return NextResponse.json({ success: true, filePath });
  } catch (error) {
    console.error('Error saving audio file:', error);
    return NextResponse.json({ success: false, error: 'Error saving audio file' });
  }
}
