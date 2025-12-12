// src/data/mockTours.js

export const tourData = [
  {
    id: "pkg-gangtok",
    title: "Gangtok Classic - ",
    subtitle: "The vibrant capital and scenic spots of East Sikkim.",
    basePrice: 12499,
    img: "/g1.webp",
    rating: 4.8,
    nights: 3,
    location: "Gangtok, Sikkim",

    pricing: {
      mealPerPerson: 450,
      teaPerPerson: 60,
      room: {
        standard: 1800,
        panoramic: 2600,
      },
      personalCab: {
        rate: 3200,
        capacity: 4,
      },
      tourManagerFee: 6000,
    },

    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115450.41846958442!2d88.5492211477794!3d27.33230985220387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e6a56a5805e26b%3A0x4095e783e7a7029e!2sGangtok%2C%20Sikkim!5e0!3m2!1sen!2sin!4v1700685600000!5m2!1sen!2sin",

    itinerary: [
      {
        day: 1,
        title: "Arrival in Gangtok & Local Sightseeing",
        details:
          "Arrive at Bagdogra/NJP, transfer to Gangtok. Check-in. Visit M.G. Marg in the evening.",
      },
      {
        day: 2,
        title: "Tsomgo Lake & Baba Mandir Excursion",
        details:
          "Full day trip to the sacred Tsomgo Lake (Changu Lake) and Baba Harbhajan Singh Mandir.",
      },
      {
        day: 3,
        title: "North Sikkim Highlights",
        details:
          "Visit Rumtek Monastery, Dro-dul Chorten, and Ganesh Tok for panoramic views.",
      },
      {
        day: 4,
        title: "Departure",
        details:
          "Transfer back to Bagdogra/NJP for your onward journey.",
      },
    ],

    inclusions: [
      "3 Nights Stay in Premium Hotel",
      "Daily Breakfast & Dinner",
      "All Transfers by Private Cab",
      "Permit Fees",
    ],
  },

  {
    id: "pkg-lachung",
    title: "Lachung & Yumthang Valley",
    subtitle: "Experience the Himalayan wonderland of North Sikkim.",
    basePrice: 17000,
    img: "/g4.webp",
    rating: 4.9,
    nights: 4,
    location: "Lachung, North Sikkim",

    pricing: {
      mealPerPerson: 450,
      teaPerPerson: 60,
      room: {
        standard: 1600,
        panoramic: 2400,
      },
      personalCab: {
        rate: 3500,
        capacity: 4,
      },
      tourManagerFee: 7000,
    },

    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.0461623190867!2d88.63666017502474!3d27.683057176189913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e55952c4233771%3A0xf639a04f981e9f1a!2sYumthang%20Valley!5e0!3m2!1sen!2sin!4v1700685600000!5m2!1sen!2sin",

    itinerary: [
      { day: 1, title: "Transfer to Lachung", details: "Travel from Gangtok to Lachung, enjoying waterfalls and scenic viewpoints en route." },
      { day: 2, title: "Yumthang Valley & Zero Point", details: "Visit the beautiful Yumthang Valley and optionally Zero Point." },
      { day: 3, title: "Return to Gangtok", details: "Check-out and return to Gangtok." },
      { day: 4, title: "Local Sightseeing in Gangtok", details: "Visit Tsomgo Lake and Baba Mandir." },
      { day: 5, title: "Departure", details: "Transfer back to Bagdogra/NJP." },
    ],

    inclusions: [
      "All 4 Nights Accommodation",
      "All Meals in North Sikkim",
      "Exclusive North Sikkim Permits",
      "Private Cab (Gangtok to Gangtok)",
    ],
  },

  {
    id: "pkg-pelling",
    title: "Pelling Scenic Escape - 2 Nights / 3 Days",
    subtitle: "Stunning Kanchenjunga views and historical monasteries.",
    basePrice: 9999,
    img: "/g3.webp",
    rating: 4.7,
    nights: 2,
    location: "Pelling, West Sikkim",

    pricing: {
      mealPerPerson: 400,
      teaPerPerson: 50,
      room: {
        standard: 1500,
        panoramic: 2200,
      },
      personalCab: {
        rate: 3000,
        capacity: 4,
      },
      tourManagerFee: 5000,
    },

    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14193.07684074844!2d88.24921935!3d27.32356565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e6a982928172c7%3A0x4f7f63d1a8c62b48!2sPelling%2C%20Sikkim!5e0!3m2!1sen!2sin!4v1700685600000!5m2!1sen!2sin",

    itinerary: [
      { day: 1, title: "Arrival in Pelling", details: "Check-in and enjoy the Kanchenjunga view." },
      { day: 2, title: "Pelling Sightseeing Tour", details: "Visit waterfalls, lake, monasteries & Skywalk." },
      { day: 3, title: "Departure", details: "Return to NJP/Bagdogra." },
    ],

    inclusions: [
      "2 Nights Stay",
      "Daily Breakfast",
      "Sightseeing Tour",
      "Private Transportation",
    ],
  }
];

// Export hotels separately
export const hotels = [
  {
    name: "The Himalayan Retreat",
    location: "Manali",
    rating: 4.7,
    price: "3500",
    img: "/hotels/h1.jpg",
    amenities: "Free WiFi, Breakfast, Mountain View, Heated Rooms",
  },
  {
    name: "Snow Peak Resort",
    location: "Solang Valley",
    rating: 4.5,
    price: "4200",
    img: "/hotels/h2.jpg",
    amenities: "Pool, Spa, Restaurant, Parking",
  },
];

export const getTourById = (id) => tourData.find((t) => t.id === id);
