import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    // Allow only PDF and ZIP files
    if (!filename.endsWith('.pdf') && !filename.endsWith('.zip')) {
      return NextResponse.json(
        { error: 'Only PDF and ZIP files are allowed' },
        { status: 400 }
      );
    }

    // Determine which folder based on file type
    const folder = filename.endsWith('.zip') ? 'GearShift' : 'Resume_and_Transcripts';
    const filePath = path.join(
      '/home/lcmiles/public',
      folder,
      filename
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath);

    // Determine content type
    const contentType = filename.endsWith('.zip') ? 'application/zip' : 'application/pdf';

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
