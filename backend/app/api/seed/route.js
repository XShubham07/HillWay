import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  
  try {
    const mockData = [
      {
        title: "Gangtok Classic",
        subtitle: "The vibrant capital and scenic spots of East Sikkim.",
        basePrice: 12499,
        img: "/g1.webp",
        rating: 4.8,
        nights: 3,
        location: "Gangtok, Sikkim",
        mapEmbedUrl: "",
        pricing: {
          mealPerPerson: 450, teaPerPerson: 60,
          room: { standard: 1800, panoramic: 2600 },
          personalCab: { rate: 3200, capacity: 4 },
          tourManagerFee: 6000,
        },
        itinerary: [
          { day: 1, title: "Arrival in Gangtok", details: "Arrive at Bagdogra/NJP, transfer to Gangtok.", meals: ["Dinner"] },
          { day: 2, title: "Tsomgo Lake", details: "Full day trip to the sacred Tsomgo Lake.", meals: ["Breakfast", "Dinner"] },
          { day: 3, title: "Local Sightseeing", details: "Visit Rumtek Monastery and viewpoints.", meals: ["Breakfast", "Dinner"] },
          { day: 4, title: "Departure", details: "Transfer back to Bagdogra/NJP.", meals: ["Breakfast"] }
        ],
        inclusions: ["3 Nights Stay", "Daily Breakfast & Dinner", "Private Cab", "Permits"],
        featured: true
      },
      // Add other tours similarly if needed...
      {
         title: "Lachung & Yumthang",
         subtitle: "Snow valley adventure",
         basePrice: 17000,
         img: "/g4.webp",
         rating: 4.9,
         nights: 4,
         location: "Lachung",
         pricing: { mealPerPerson: 500, teaPerPerson: 50, room: { standard: 2000, panoramic: 3000 }, personalCab: { rate: 4000, capacity: 4 }, tourManagerFee: 7000 },
         itinerary: [
             { day: 1, title: "Transfer", details: "Drive to Lachung.", meals: ["Dinner"] },
             { day: 2, title: "Yumthang Valley", details: "Valley of flowers.", meals: ["Breakfast", "Lunch", "Dinner"] }
         ],
         featured: true
       }
    ];

    await Tour.deleteMany({}); 
    await Tour.insertMany(mockData);

    return NextResponse.json({ success: true, message: "Database Seeded with Daily Meals!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}