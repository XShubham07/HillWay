
import dbConnect from '@/lib/db';
import Page from '@/models/Page';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    try {
        if (slug) {
            // Normalize slug to lowercase (model stores as lowercase)
            const normalizedSlug = slug.toLowerCase().trim();

            // Fetch specific page by slug, populate tours
            const page = await Page.findOne({
                slug: normalizedSlug,
                isActive: true
            }).populate('selectedTours');

            if (!page) {
                // Debug: Check if page exists but is inactive
                const inactivePage = await Page.findOne({ slug: normalizedSlug });
                if (inactivePage) {
                    console.log(`⚠️ Page "${normalizedSlug}" exists but isActive: ${inactivePage.isActive}`);
                } else {
                    console.log(`❌ Page "${normalizedSlug}" does not exist in database`);
                }
                return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
            }

            return NextResponse.json({ success: true, data: page });
        } else {
            // Fetch all pages (for admin list)
            const pages = await Page.find({}).sort({ createdAt: -1 });
            return NextResponse.json({ success: true, data: pages });
        }

    } catch (error) {
        console.error("❌ API ERROR:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();

        // Ensure slug is unique
        const existingPage = await Page.findOne({ slug: body.slug });
        if (existingPage) {
            return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
        }

        const page = await Page.create(body);
        return NextResponse.json({ success: true, data: page }, { status: 201 });
    } catch (error) {
        console.error("❌ POST ERROR:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json({ success: false, error: 'Page ID is required' }, { status: 400 });
        }

        const page = await Page.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });

        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: page });
    } catch (error) {
        console.error("❌ PUT ERROR:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    try {
        const deletedPage = await Page.findByIdAndDelete(id);
        if (!deletedPage) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        console.error("❌ DELETE ERROR:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
