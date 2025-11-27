import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  
  try {
    // Ye raha apka Mock Data (Jo pehle frontend mein tha)
    const mockData = [
      {
        title: "Gangtok Classic",
        subtitle: "The vibrant capital and scenic spots of East Sikkim.",
        basePrice: 12499,
        img: "/g1.webp",
        rating: 4.8,
        nights: 3,
        location: "Gangtok, Sikkim",
        mapEmbedUrl: "https://www.google.com/maps/embed?...",
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
        inclusions: ["3 Nights Stay in Premium Hotel", "Daily Breakfast & Dinner", "All Transfers by Private Cab", "Permit Fees"],
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
          { day: 1, title: "Transfer to Lachung", details: "Travel from Gangtok to Lachung, enjoying waterfalls and scenic viewpoints en route." },
          { day: 2, title: "Yumthang Valley & Zero Point", details: "Visit the beautiful Yumthang Valley and optionally Zero Point." },
          { day: 3, title: "Return to Gangtok", details: "Check-out and return to Gangtok." },
          { day: 4, title: "Local Sightseeing", details: "Visit Tsomgo Lake and Baba Mandir." },
          { day: 5, title: "Departure", details: "Transfer back to Bagdogra/NJP." }
        ],
        inclusions: ["All 4 Nights Accommodation", "All Meals in North Sikkim", "Exclusive North Sikkim Permits", "Private Cab"],
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
          { day: 1, title: "Arrival in Pelling", details: "Check-in and enjoy the Kanchenjunga view." },
          { day: 2, title: "Pelling Sightseeing Tour", details: "Visit waterfalls, lake, monasteries & Skywalk." },
          { day: 3, title: "Departure", details: "Return to NJP/Bagdogra." },
        ],
        inclusions: ["2 Nights Stay", "Daily Breakfast", "Sightseeing Tour", "Private Transportation"],
        featured: true
      }
    ];

    // Purana data clear karo aur naya daalo
    await Tour.deleteMany({}); 
    await Tour.insertMany(mockData);

    return NextResponse.json({ success: true, message: "Database Seeded Successfully with Mock Data!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}