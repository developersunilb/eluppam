import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const updatedMaps = await req.json();
    const filePath = path.join(process.cwd(), 'public', 'game-maps.json');

    await fs.writeFile(filePath, JSON.stringify(updatedMaps, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Game maps saved successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Failed to save game maps:', error);
    return NextResponse.json({ message: 'Failed to save game maps.' }, { status: 500 });
  }
}
