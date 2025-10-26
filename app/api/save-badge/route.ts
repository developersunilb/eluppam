import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { imageData, badgeId } = await req.json();

    if (!imageData || !badgeId) {
      return NextResponse.json({ message: 'Missing imageData or badgeId' }, { status: 400 });
    }

    // Extract base64 data from data URL
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const filename = `${badgeId}.png`;
    const filePath = path.join(process.cwd(), 'public', 'badges', filename);

    // Ensure the directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const uint8Array = new Uint8Array(buffer);
    await fs.writeFile(filePath, uint8Array);

    return NextResponse.json({ message: 'Badge saved successfully', filePath: `/badges/${filename}` });
  } catch (error) {
    console.error('Error saving badge:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Failed to save badge', error: errorMessage }, { status: 500 });
  }
}
