// src/data/mockTours.js

export const tourData = [
  {
    id: "pkg-gangtok",
    title: "Gangtok Classic - 3 Nights / 4 Days",
    subtitle: "The vibrant capital and scenic spots of East Sikkim.",
    basePrice: 12500,
    img: "/g1.webp",
    rating: 4.8,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11270.439097746403!2d88.5973752!3d27.3387827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e6a575a6390a13%3A0x6b8017c53bb4d566!2sGangtok%2C%20Sikkim!5e0!3m2!1sen!2sin!4v1700688000000!5m2!1sen!2sin",
    itinerary: [
      { day: 1, title: "Arrival in Gangtok & Local Sightseeing", details: "Arrive at Bagdogra/NJP, transfer to Gangtok. Check-in. Visit M.G. Marg in the evening." },
      { day: 2, title: "Tsomgo Lake & Baba Mandir Excursion", details: "Full day trip to the sacred Tsomgo Lake (Changu Lake) and Baba Harbhajan Singh Mandir." },
      { day: 3, title: "North Sikkim Highlights", details: "Visit Rumtek Monastery, Dro-dul Chorten, and Ganesh Tok for panoramic views." },
      { day: 4, title: "Departure", details: "Transfer back to Bagdogra/NJP for your onward journey." },
    ],
    inclusions: ["3 Nights Stay in Premium Hotel", "Daily Breakfast & Dinner", "All Transfers by Private Cab", "Permit Fees"],
  },
  {
    id: "pkg-lachung",
    title: "Lachung & Yumthang Valley - 4 Nights / 5 Days",
    subtitle: "Experience the Himalayan wonderland of North Sikkim.",
    basePrice: 17000,
    img: "/g2.webp",
    rating: 4.9,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.046897217319!2d88.7565158!3d27.6811453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e407e780497529%3A0x4426d1d491f0f089!2sLachung%2C%20Sikkim!5e0!3m2!1sen!2sin!4v1700688000000!5m2!1sen!2sin",
    itinerary: [
      { day: 1, title: "Transfer to Lachung", details: "Travel from Gangtok to Lachung, enjoying waterfalls and scenic viewpoints en route." },
      { day: 2, title: "Yumthang Valley & Zero Point", details: "Visit the beautiful Yumthang Valley (Valley of Flowers) and optionally Zero Point (snow area)." },
      { day: 3, title: "Return to Gangtok", details: "Check-out from Lachung and return journey to Gangtok." },
      { day: 4, title: "Tsomgo Lake Excursion", details: "Day trip to Tsomgo Lake (Changu Lake) and Baba Mandir." },
      { day: 5, title: "Departure", details: "Transfer to Bagdogra/NJP." },
    ],
    inclusions: ["All 4 Nights Accommodation", "All Meals in North Sikkim", "Exclusive North Sikkim Permits", "Private Cab (Gangtok to Gangtok)"],
  },
  {
    id: "pkg-pelling",
    title: "Pelling Scenic Escape - 2 Nights / 3 Days",
    subtitle: "Stunning Kanchenjunga views and historical monasteries in West Sikkim.",
    basePrice: 9999,
    img: "/g3.webp",
    rating: 4.7,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.9829288764893!2d88.2291418!3d27.2882823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e6aa877d9c882d%3A0x19a0f7c225a66a1a!2sPelling%2C%20Sikkim!5e0!3m2!1sen!2sin!4v1700688000000!5m2!1sen!2sin",
    itinerary: [
      { day: 1, title: "Arrival in Pelling & Local Drive", details: "Arrive at Pelling. Check-in. Explore local area and enjoy the sunset view of Kanchenjunga." },
      { day: 2, title: "Pelling Sightseeing Tour", details: "Visit Kanchenjunga Falls, Khecheopalri Lake, Skywalk, and Pemayangtse Monastery." },
      { day: 3, title: "Departure", details: "Transfer back to Bagdogra/NJP." },
    ],
    inclusions: ["2 Nights Stay in Homestay/Hotel", "Daily Breakfast", "West Sikkim Sightseeing Tour", "Private Transportation"],
  },
];

export const getTourById = (id) => tourData.find(tour => tour.id === id);