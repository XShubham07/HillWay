import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

// GET: Fetch ALL reviews from ALL tours (For Admin Dashboard & general fetching)
export async function GET() {
    await dbConnect();
    try {
        // Select title and reviews.
        const tours = await Tour.find({}, 'title reviews');

        let allReviews = [];
        tours.forEach(tour => {
            if (tour.reviews && tour.reviews.length > 0) {
                tour.reviews.forEach(review => {
                    allReviews.push({
                        _id: review._id,
                        tourId: tour._id,
                        tourTitle: tour.title,
                        title: review.title,
                        name: review.name,
                        email: review.email,
                        mobile: review.mobile,
                        rating: review.rating,
                        text: review.text,
                        date: review.date
                    });
                });
            }
        });

        // Sort by newest first
        return NextResponse.json({ success: true, data: allReviews.reverse() });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Add a review to a specific tour
export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();

        // 1. Destructure ALL fields including the optional date
        const { tourId, title, name, email, mobile, rating, text, date } = body;

        // 2. Validation
        if (!tourId || !name || !rating || !text) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // 3. Handle Date Format (DD MMM YYYY)
        let formattedDate;
        if (date) {
            const d = new Date(date);
            if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            } else {
                formattedDate = date; // Fallback if string is already formatted or invalid
            }
        } else {
            formattedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }

        // 4. Create Review Object
        const newReview = {
            title: title || "",
            name,
            email: email || "",
            mobile: mobile || "",
            rating: Number(rating),
            text,
            date: formattedDate
        };

        // 5. Push to Database
        const tour = await Tour.findByIdAndUpdate(
            tourId,
            { $push: { reviews: newReview } },
            { new: true }
        );

        if (!tour) return NextResponse.json({ success: false, error: "Tour not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: tour.reviews });
    } catch (error) {
        console.error("Review Post Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE: Delete a specific review (For Admin)
export async function DELETE(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');
    const reviewId = searchParams.get('reviewId');

    try {
        await Tour.findByIdAndUpdate(
            tourId,
            { $pull: { reviews: { _id: reviewId } } }
        );
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}