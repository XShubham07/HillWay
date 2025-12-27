import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import OTP from '../../../../models/Otp';
import { Resend } from 'resend';

// Initialize Resend with key if available, else usage will fail gracefully or log
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();

        const allowedAdmins = ['Prakashabhay5@gmail.com', 'admin@hillway.in'];
        if (!allowedAdmins.includes(email)) {
            return NextResponse.json({ success: false, error: 'Unauthorized email' }, { status: 401 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB (upsert)
        // First remove existing OTPs for this email to avoid clutter
        await OTP.deleteMany({ email });
        await OTP.create({ email, otp });

        console.log(`Sending OTP ${otp} to ${email}`);

        // Send Email via Resend
        try {
            if (process.env.RESEND_API_KEY) {
                await resend.emails.send({
                    from: 'HillWay Security <security@hillway.in>',
                    to: email,
                    subject: 'HillWay Admin Password Reset OTP',
                    html: `<p>Your OTP for resetting the HillWay Admin password is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`
                });
            } else {
                console.warn("RESEND_API_KEY missing. OTP logged to console only.");
            }
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // We might validly fail if API key is missing or limit reached. 
            // For dev, logging OTP is fine.
        }

        return NextResponse.json({ success: true, message: 'OTP sent (check console/email)' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
