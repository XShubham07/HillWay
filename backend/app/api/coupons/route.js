import dbConnect from '@/lib/db';
import Coupon from '../../../models/Coupon';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  try {
    if (code) {
      // Find active coupon by code
      const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
      
      if (!coupon) return NextResponse.json({ success: false, error: "Invalid Code" }, { status: 404 });
      if (new Date() > new Date(coupon.expiryDate)) return NextResponse.json({ success: false, error: "Coupon Expired" }, { status: 400 });
      if (coupon.usedCount >= coupon.usageLimit) return NextResponse.json({ success: false, error: "Usage Limit Reached" }, { status: 400 });

      return NextResponse.json({ success: true, data: coupon });
    } else {
      // Fetch all coupons and populate agent name if possible (requires ref in schema)
      // If you haven't set up 'ref' in Schema properly, populate might fail, so we'll just fetch raw
      const coupons = await Coupon.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: coupons });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    if (!body.code || !body.discountValue || !body.expiryDate) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }
    // Ensure code is uppercase
    body.code = body.code.toUpperCase();
    
    const coupon = await Coupon.create(body);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) return NextResponse.json({ success: false, error: "Code exists" }, { status: 400 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// NEW: PUT Method to update coupon (e.g., assign agent)
export async function PUT(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, agentId } = body;

    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id, 
      { agentId: agentId || null }, // Set or unset agent
      { new: true }
    );

    if (!updatedCoupon) return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedCoupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  try {
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}