import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('agentId');

  // 1. Get Agent's Coupons
  const coupons = await Coupon.find({ agentId });
  const codes = coupons.map(c => c.code);

  // 2. Get Bookings made with those coupons
  const bookings = await Booking.find({ couponCode: { $in: codes } }).sort({ createdAt: -1 });

  // 3. Calculate Stats
  let confirmedCount = 0;
  let totalCommission = 0;

  bookings.forEach(b => {
    if(b.status === 'Confirmed') {
        confirmedCount++;
        totalCommission += (b.commissionAmount || 0);
    }
  });

  return NextResponse.json({ 
    success: true, 
    data: { coupons, bookings, stats: { confirmedCount, totalCommission } } 
  });
}