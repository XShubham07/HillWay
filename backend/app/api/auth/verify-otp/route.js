import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import OTP from '../../../../models/Otp';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        const record = await OTP.findOne({ email, otp });

        if (!record) {
            return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 });
        }

        // OTP is valid. We can delete it now or let it expire. 
        // Deleting it prevents reuse.
        await OTP.deleteOne({ _id: record._id });

        return NextResponse.json({ success: true, message: 'OTP Verified' });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
