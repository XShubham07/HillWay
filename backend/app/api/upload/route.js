import { NextResponse } from 'next/server';
import ImageKit from "imagekit";

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: buffer, // pass the buffer directly
      fileName: file.name || `upload_${Date.now()}.jpg`, // ImageKit requires a fileName
      folder: "/hillway_tours", // Optional: Organize in a folder
    });

    return NextResponse.json({ 
      success: true, 
      url: result.url // ImageKit returns the accessible URL here
    });

  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}