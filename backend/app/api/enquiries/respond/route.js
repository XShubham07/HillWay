import dbConnect from '@/lib/db';
import Enquiry from '@/models/Enquiry';
import { sendEnquiryResponse } from '@/lib/email';
import { NextResponse } from 'next/server';

/**
 * POST /api/enquiries/respond
 * Send a custom email response to an enquiry
 */
export async function POST(request) {
  await dbConnect();
  
  try {
    const { id, message } = await request.json();

    if (!id || !message) {
      return NextResponse.json(
        { success: false, error: 'Enquiry ID and message are required' },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.findById(id);
    
    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    // Send email response
    await sendEnquiryResponse(enquiry, message);

    // Update status to 'Contacted' if it's 'New'
    if (enquiry.status === 'New') {
      enquiry.status = 'Contacted';
      await enquiry.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Response sent successfully',
      data: enquiry
    });

  } catch (error) {
    console.error('Enquiry response error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send response' },
      { status: 500 }
    );
  }
}