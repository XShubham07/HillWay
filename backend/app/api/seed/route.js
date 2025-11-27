import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  
  try {
    // Tumhara Asli Mock Data
    const mockData = [
      {
        title: "Gangtok Classic - 3N/4D",
        subtitle: "The vibrant capital and scenic spots of East Sikkim.",
        basePrice: 12499,
        img: "/g1.webp",
        rating: 4.8,
        nights: 3,
        location: "Gangtok, Sikkim",
        pricing: {
          mealPerPerson: 450, teaPerPerson: 60,
          room: { standard: 1800, panoramic: 2600 },
          personalCab: { rate: 3200, capacity: 4 },
          tourManagerFee: 6000,
        },
        itinerary: [
          { day: 1, title: "Arrival in Gangtok", details: "Arrive at Bagdogra/NJP, transfer to Gangtok. Check-in. Visit M.G. Marg." },
          { day: 2, title: "Tsomgo Lake & Baba Mandir", details: "Full day trip to the sacred Tsomgo Lake and Baba Harbhajan Singh Mandir." },
          { day: 3, title: "North Sikkim Highlights", details: "Visit Rumtek Monastery, Dro-dul Chorten, and Ganesh Tok." },
          { day: 4, title: "Departure", details: "Transfer back to Bagdogra/NJP." }
        ],
        inclusions: ["3 Nights Stay", "Breakfast & Dinner", "Private Cab", "Permits"],
        featured: true
      },
      {
        title: "Lachung & Yumthang Valley",
        subtitle: "Experience the Himalayan wonderland of North Sikkim.",
        basePrice: 17000,
        img: "/g4.webp",
        rating: 4.9,
        nights: 4,
        location: "Lachung, North Sikkim",
        pricing: {
          mealPerPerson: 450, teaPerPerson: 60,
          room: { standard: 1600, panoramic: 2400 },
          personalCab: { rate: 3500, capacity: 4 },
          tourManagerFee: 7000,
        },
        itinerary: [
          { day: 1, title: "Transfer to Lachung", details: "Scenic drive with waterfalls." },
          { day: 2, title: "Yumthang Valley", details: "Visit the valley of flowers." },
          { day: 3, title: "Return to Gangtok", details: "Drive back to capital." },
          { day: 4, title: "Sightseeing", details: "Local sightseeing." }
        ],
        inclusions: ["All Meals", "Accommodation", "Permits", "Transport"],
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
        pricing: {
          mealPerPerson: 400, teaPerPerson: 50,
          room: { standard: 1500, panoramic: 2200 },
          personalCab: { rate: 3000, capacity: 4 },
          tourManagerFee: 5000,
        },
        itinerary: [
          { day: 1, title: "Arrival in Pelling", details: "Check-in and sunset view." },
          { day: 2, title: "Sightseeing", details: "Visit Skywalk and Monastery." },
          { day: 3, title: "Departure", details: "Transfer to station." }
        ],
        inclusions: ["Breakfast", "Stay", "Transport"],
        featured: true
      }
    ];

    // Clear Old Data & Insert New
    await Tour.deleteMany({}); 
    await Tour.insertMany(mockData);

    return NextResponse.json({ success: true, message: "Database Reset & Seeded!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}