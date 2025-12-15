import dbConnect from '@/lib/db';
import Enquiry from '@/models/Enquiry';
import { sendEnquiryConfirmation, sendAdminEnquiryAlert } from '@/lib/email';
import { NextResponse } from 'next/server';

// POST: Create new enquiry
export async function POST(request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const { name, email, contact, destination, duration, notes } = body;

    // Validation
    if (!name || !email || !contact || !destination || !duration) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Create enquiry
    const enquiry = await Enquiry.create({
      name,
      email,
      contact,
      destination,
      duration,
      notes: notes || ''
    });

    // Send emails in background
    try {
      await Promise.all([
        sendEnquiryConfirmation(enquiry),
        sendAdminEnquiryAlert(enquiry)
      ]);
    } catch (emailError) {
      console.error('Failed to send enquiry emails:', emailError);
    }

    return NextResponse.json(
      { success: true, data: enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enquiry creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// GET: Fetch all enquiries
export async function GET() {
  await dbConnect();
  
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update enquiry status and notes
export async function PUT(request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Enquiry ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete enquiry
export async function DELETE(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Enquiry ID is required' },
        { status: 400 }
      );
    }

    await Enquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}