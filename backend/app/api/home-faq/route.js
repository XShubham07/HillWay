import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import HomeFaq from '@/models/HomeFaq';

export async function GET() {
    await dbConnect();
    try {
        const faqs = await HomeFaq.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: faqs });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const faq = await HomeFaq.create(body);
        return NextResponse.json({ success: true, data: faq }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        const faq = await HomeFaq.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!faq) {
            return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: faq });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const faq = await HomeFaq.findByIdAndDelete(id);
        if (!faq) {
            return NextResponse.json({ success: false, error: 'FAQ not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'FAQ deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
