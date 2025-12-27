import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        // Double check allowed list (extra security)
        const allowedAdmins = ['Prakashabhay5@gmail.com', 'admin@hillway.in'];
        if (!allowedAdmins.includes(email)) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update or Create User
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, password: hashedPassword });
        } else {
            user.password = hashedPassword;
        }
        await user.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
