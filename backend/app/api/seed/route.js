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
        description: "Experience the charm of Gangtok with premium stays...",
        pricing: {
          mealPerPerson: 450, 
          teaPerPerson: 60,
          // ADDED MISSING FIELDS
          bonfire: 500,
          tourGuide: 1000,
          comfortSeat: 800,
          
          room: { standard: 1800, panoramic: 2600 },
          personalCab: { rate: 3200, capacity: 4 },
          tourManagerFee: 6000,
        },
        itinerary: [
          { day: 1, title: "Arrival in Gangtok", details: "Arrive at Bagdogra...", meals: ["Dinner"] },
          { day: 2, title: "Tsomgo Lake", details: "Full day trip...", meals: ["Breakfast", "Dinner"] },
          { day: 3, title: "Local Sightseeing", details: "Visit Rumtek...", meals: ["Breakfast", "Dinner"] },
          { day: 4, title: "Departure", details: "Transfer back...", meals: ["Breakfast"] }
        ],
        inclusions: ["3 Nights Stay", "Daily Breakfast & Dinner", "Private Cab", "Permits"],
        featured: true,
        faqs: [
            { q: "Is this safe for kids?", a: "Yes, absolutely safe and comfortable." },
            { q: "Can we customize?", a: "Yes, contact us for customization." }
        ],
        reviews: [
            { name: "Rahul S.", rating: 5, text: "Amazing experience!", date: "12 Oct 2024" },
            { name: "Priya M.", rating: 4, text: "Good hotels, smooth travel.", date: "10 Nov 2024" }
        ]
      },
      {
         title: "Lachung & Yumthang",
         subtitle: "Snow valley adventure",
         basePrice: 17000,
         img: "/g4.webp",
         rating: 4.9,
         nights: 4,
         location: "Lachung",
         pricing: { 
           mealPerPerson: 500, 
           teaPerPerson: 50, 
           // ADDED MISSING FIELDS
           bonfire: 500,
           tourGuide: 1200,
           comfortSeat: 900,

           room: { standard: 2000, panoramic: 3000 }, 
           personalCab: { rate: 4000, capacity: 4 }, 
           tourManagerFee: 7000 
         },
         itinerary: [
             { day: 1, title: "Transfer", details: "Drive to Lachung.", meals: ["Dinner"] },
             { day: 2, title: "Yumthang Valley", details: "Valley of flowers.", meals: ["Breakfast", "Lunch", "Dinner"] }
         ],
         featured: true,
         inclusions: ["Stay", "Meals", "Transport"],
         faqs: [{ q: "Is heater available?", a: "Yes, in premium rooms." }],
         reviews: [{ name: "Amit K.", rating: 5, text: "Snow was beautiful!", date: "15 Dec 2024" }]
       }
    ];

    await Tour.deleteMany({}); 
    await Tour.insertMany(mockData);

    return NextResponse.json({ success: true, message: "Database Seeded with Full Data!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}