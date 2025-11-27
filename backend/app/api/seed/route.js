import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  
  try {
    // Clear old data
    await Tour.deleteMany({});

    // Insert 3 Fresh Tours
    await Tour.insertMany([
      {
        title: "Gangtok Classic",
        subtitle: "The vibrant capital and scenic spots of East Sikkim.",
        basePrice: 12499,
        img: "/g1.webp",
        rating: 4.8,
        nights: 3,
        location: "Gangtok, Sikkim",
        description: "Experience the charm of Gangtok with premium stays and exclusive sightseeing.",
        pricing: {
          mealPerPerson: 450,
          teaPerPerson: 60,
          room: { standard: 1800, panoramic: 2600 },
          personalCab: { rate: 3200, capacity: 4 },
          tourManagerFee: 6000
        },
        inclusions: ["3 Nights Stay", "Daily Breakfast", "Private Cab", "Permits"],
        itinerary: [
          { day: 1, title: "Arrival in Gangtok", details: "Pickup from Bagdogra/NJP. Check-in and rest." },
          { day: 2, title: "Tsomgo Lake & Baba Mandir", details: "Full day excursion to the high-altitude lake." },
          { day: 3, title: "Local Sightseeing", details: "Visit Monasteries, Viewpoints and Handicraft center." },
          { day: 4, title: "Departure", details: "Drop to airport/station." }
        ],
        featured: true
      },
      {
        title: "Lachung & Yumthang",
        subtitle: "Experience the Himalayan wonderland of North Sikkim.",
        basePrice: 17000,
        img: "/g4.webp",
        rating: 4.9,
        nights: 4,
        location: "Lachung, North Sikkim",
        description: "A journey to the valley of flowers and snow-capped peaks.",
        pricing: {
          mealPerPerson: 500,
          teaPerPerson: 50,
          room: { standard: 2000, panoramic: 3000 },
          personalCab: { rate: 4000, capacity: 4 },
          tourManagerFee: 7000
        },
        inclusions: ["All Meals", "Transport", "Permits", "Hotel Stay"],
        itinerary: [
            { day: 1, title: "Transfer to Lachung", details: "Scenic 6-hour drive with waterfalls." },
            { day: 2, title: "Yumthang Valley", details: "Visit the valley of flowers and hot springs." }
        ],
        featured: true
      },
      {
        title: "Pelling Scenic Escape",
        subtitle: "Stunning Kanchenjunga views and historical monasteries.",
        basePrice: 9999,
        img: "/g3.webp",
        rating: 4.7,
        nights: 2,
        location: "Pelling, West Sikkim",
        description: "Relax in the serene hills of West Sikkim.",
        pricing: {
          mealPerPerson: 400,
          teaPerPerson: 40,
          room: { standard: 1500, panoramic: 2200 },
          personalCab: { rate: 3000, capacity: 4 },
          tourManagerFee: 5000
        },
        inclusions: ["Breakfast", "Transport", "Sightseeing"],
        itinerary: [
            { day: 1, title: "Arrival", details: "Welcome to Pelling." },
            { day: 2, title: "Skywalk & Monastery", details: "Visit the famous glass skywalk." }
        ],
        featured: true
      }
    ]);

    return NextResponse.json({ success: true, message: "✅ Database Seeded with 3 Tours!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}