import React from "react";
import {
  FaCamera, FaUtensils, FaCoffee, FaSnowflake, FaWater, FaPrayingHands,
  FaStar, FaBinoculars, FaHiking, FaShoppingBag, FaLeaf, FaHistory,
  FaTrain, FaPlane, FaRoad, FaClock, FaTree, FaLandmark
} from "react-icons/fa";

// --- IMAGE PATH HELPERS ---
// 1. For Main Destination Hero Images
const getDestImg = (region, dest) => `/images/destinations/${region}/${dest}/1.webp`;

// 2. For Individual Attraction Images
const getAttrImg = (region, dest, attr) => `/images/attractions/${region}/${dest}/${attr}/1.webp`;

export const DESTINATION_DATA = [

  // ======================= EAST SIKKIM =======================
  {
    id: "gangtok",
    name: "Gangtok",
    region: "East Sikkim",
    tagline: "The Cosmopolitan Capital",
    img: getDestImg("east-sikkim", "gangtok"),
    stats: { alt: "5,410 ft", temp: "10°C – 25°C", best: "Mar–Jun, Sep–Dec" },
    overview:
      "Gangtok, the vibrant capital of Sikkim, is a mesmerizing mix of traditional Tibetan culture and modern urbanization. Perched on a steep mountain ridge, it offers spectacular views of the Kanchenjunga range. It is famous for its clean streets, disciplined traffic, and the lively MG Marg, which is India’s first litter-free and spit-free zone. It serves as the perfect base for exploring the rest of the state.",
    attractions: [
      { name: "Tsomgo Lake", type: "Lake", img: getAttrImg("east-sikkim", "gangtok", "tsomgo-lake"), desc: "A sacred glacial lake at 12,310 ft that changes color with seasons." },
      { name: "Nathula Pass", type: "Border Pass", img: getAttrImg("east-sikkim", "gangtok", "nathula-pass"), desc: "Historic Silk Route pass on the Indo-China border (Closed Mon/Tue)." },
      { name: "Rumtek Monastery", type: "Monastery", img: getAttrImg("east-sikkim", "gangtok", "rumtek-monastery"), desc: "The largest monastery in Sikkim, a masterpiece of Tibetan architecture." },
      { name: "Ban Jhakri Falls", type: "Waterfall", img: getAttrImg("east-sikkim", "gangtok", "ban-jhakri-falls"), desc: "A 100-foot waterfall located in a landscaped Shamanistic energy park." },
      { name: "Ganesh Tok", type: "Viewpoint", img: getAttrImg("east-sikkim", "gangtok", "ganesh-tok"), desc: "Small temple offering panoramic bird’s eye views of Gangtok city." },
      { name: "Tashi View Point", type: "Viewpoint", img: getAttrImg("east-sikkim", "gangtok", "tashi-view-point"), desc: "Famous for the best sunrise views of Mt. Kanchenjunga." }
    ],
    thingsToDo: [
      { text: "MG Marg Walk", detail: "Leisure stroll & dining.", icon: <FaShoppingBag /> },
      { text: "Ropeway Ride", detail: "Aerial view of city.", icon: <FaCamera /> },
      { text: "Casino Night", detail: "Visit Mayfair/Deltin.", icon: <FaStar /> }
    ],
    howToReach: {
      air: "Pakyong Airport (30 km) or Bagdogra (124 km).",
      rail: "NJP Station (120 km).",
      road: "NH-10 from Siliguri via Rangpo."
    }
  },
  {
    id: "zuluk",
    name: "Zuluk",
    region: "East Sikkim",
    tagline: "The Silk Route Village",
    img: getDestImg("east-sikkim", "zuluk"),
    stats: { alt: "9,400 ft", temp: "-5°C – 15°C", best: "Aug–Dec" },
    overview:
      "Zuluk is a high-altitude village famous for the 32-hairpin Zig Zag Road. Once a transit point for the historic Silk Route, it offers a chance to live above the clouds in rustic homestays. It is one of the few places where you can see the sunrise illuminating the Kanchenjunga range while the valley below is covered in a sea of clouds.",
    attractions: [
      { name: "Thambi View Point", type: "Viewpoint", img: getAttrImg("east-sikkim", "zuluk", "thambi-view-point"), desc: "Best spot to see the Zig Zag road and Kanchenjunga sunrise." },
      { name: "Nathang Valley", type: "Valley", img: getAttrImg("east-sikkim", "zuluk", "nathang-valley"), desc: "Known as the 'Ladakh of East Sikkim', covered in snow in winter." },
      { name: "Kupup Lake", type: "Lake", img: getAttrImg("east-sikkim", "zuluk", "kupup-lake"), desc: "Also known as Elephant Lake due to its unique shape." },
      { name: "Old Baba Mandir", type: "Shrine", img: getAttrImg("east-sikkim", "zuluk", "old-baba-mandir"), desc: "Original bunker of Baba Harbhajan Singh." }
    ],
    thingsToDo: [
      { text: "Sunrise View", detail: "At Thambi Point.", icon: <FaClock /> },
      { text: "Zig Zag Drive", detail: "Thrill ride.", icon: <FaRoad /> },
      { text: "Snow Experience", detail: "Heavy snow Jan-Mar.", icon: <FaSnowflake /> }
    ],
    howToReach: { road: "Permit required. Reach via Rongli." }
  },
  {
    id: "aritar",
    name: "Aritar",
    region: "East Sikkim",
    tagline: "Peaceful Lake Town",
    img: getDestImg("east-sikkim", "aritar"),
    stats: { alt: "4,600 ft", temp: "10°C – 28°C", best: "All Year" },
    overview:
      "Aritar is a serene destination known for Lampokhari Lake, the oldest natural lake in Sikkim. It is steeped in history with British-era bungalows and offers peaceful boating experiences away from the crowds. The surrounding lush green pine forests make it an ideal spot for nature walks.",
    attractions: [
      { name: "Lampokhari Lake", type: "Lake", img: getAttrImg("east-sikkim", "aritar", "lampokhari-lake"), desc: "Emerald green boot-shaped lake with boating facilities." },
      { name: "Mankhim View Point", type: "Viewpoint", img: getAttrImg("east-sikkim", "aritar", "mankhim-view-point"), desc: "Hilltop offering 360-degree views of Kanchenjunga." },
      { name: "Aritar Gumpa", type: 'Monastery', img: getAttrImg("east-sikkim", "aritar", "aritar-gumpa"), desc: 'Ancient monastery with traditional murals.' }
    ],
    thingsToDo: [
      { text: "Boating", detail: "Paddle boats.", icon: <FaWater /> },
      { text: "Nature Walk", detail: "To Dak Bungalow.", icon: <FaHiking /> }
    ],
    howToReach: { road: "4 hrs from Gangtok via Rangpo." }
  },

  // ======================= NORTH SIKKIM =======================
  {
    id: "lachung",
    name: "Lachung",
    region: "North Sikkim",
    tagline: "Gateway to Yumthang",
    img: getDestImg("north-sikkim", "lachung"),
    stats: { alt: "9,600 ft", temp: "-5°C – 15°C", best: "Apr–Jun" },
    overview:
      "A postcard-perfect mountain village surrounded by waterfalls and pine forests. Lachung serves as the gateway to the Valley of Flowers (Yumthang) and the snowy heights of Zero Point. The village retains its traditional wooden architecture and distinct culture.",
    attractions: [
      { name: "Yumthang Valley", type: "Valley", img: getAttrImg("north-sikkim", "lachung", "yumthang-valley"), desc: "Famous for Rhododendron flowers in spring." },
      { name: "Zero Point", type: "Snow Zone", img: getAttrImg("north-sikkim", "lachung", "zero-point"), desc: "Perpetual snow zone at 15,300 ft." },
      { name: "Mt. Katao", type: "Adventure", img: getAttrImg("north-sikkim", "lachung", "mt-katao"), desc: "Offbeat destination for snow activities." },
      { name: "Bhim Nala Falls", type: "Waterfall", img: getAttrImg("north-sikkim", "lachung", "bhim-nala-falls"), desc: "Tallest waterfall in Sikkim." }
    ],
    thingsToDo: [
      { text: "Snow Play", detail: "At Zero Point.", icon: <FaSnowflake /> },
      { text: "Hot Springs", detail: "Dip in sulphur springs.", icon: <FaWater /> }
    ],
    howToReach: { road: "6 hrs from Gangtok. Permit required." }
  },
  {
    id: "lachen",
    name: "Lachen",
    region: "North Sikkim",
    tagline: "Gateway to Gurudongmar",
    img: getDestImg("north-sikkim", "lachen"),
    stats: { alt: "8,800 ft", temp: "-10°C – 12°C", best: "Oct–May" },
    overview:
      "A remote high-altitude village that serves as the base for Gurudongmar Lake. It offers a raw, rugged, and spiritual experience, giving a glimpse into the simple life of the Lachenpas. It is the starting point for some of the toughest treks in Sikkim.",
    attractions: [
      { name: "Gurudongmar Lake", type: "Sacred Lake", img: getAttrImg("north-sikkim", "lachen", "gurudongmar-lake"), desc: "One of the highest lakes in the world at 17,800 ft." },
      { name: "Thangu Valley", type: "Plateau", img: getAttrImg("north-sikkim", "lachen", "thangu-valley"), desc: "High altitude alpine meadow." },
      { name: "Chopta Valley", type: "Valley", img: getAttrImg("north-sikkim", "lachen", "chopta-valley"), desc: "Famous for alpine flowers." }
    ],
    thingsToDo: [
      { text: "Lake Visit", detail: "Early morning drive.", icon: <FaStar /> },
      { text: "Monastery Visit", detail: "Lachen Monastery.", icon: <FaPrayingHands /> }
    ],
    howToReach: { road: "7 hrs from Gangtok." }
  },
  {
    id: "chungthang",
    name: "Chungthang",
    region: "North Sikkim",
    tagline: "River Confluence Town",
    img: getDestImg("north-sikkim", "chungthang"),
    stats: { alt: "5,900 ft", temp: "5°C – 20°C", best: "All Year" },
    overview:
      "A historical town at the confluence of the Lachen and Lachung rivers. It is believed to be blessed by Guru Padmasambhava and serves as a vital junction for North Sikkim travelers.",
    attractions: [
      { name: "River Confluence", type: "Scenic", img: getAttrImg("north-sikkim", "chungthang", "river-confluence"), desc: "Meeting point of two major rivers." },
      { name: "Guru Rock", type: "Legend", img: getAttrImg("north-sikkim", "chungthang", "guru-rock"), desc: "Rock with footprints of Guru Rinpoche." }
    ],
    thingsToDo: [
      { text: "Photography", detail: "Scenic river views.", icon: <FaCamera /> },
      { text: "Gurudwara", detail: "Visit Nanaklama Sahib.", icon: <FaPrayingHands /> }
    ],
    howToReach: { road: "Junction town for North Sikkim." }
  },

  // ======================= WEST SIKKIM =======================
  {
    id: "pelling",
    name: "Pelling",
    region: "West Sikkim",
    tagline: "Kanchenjunga Viewpoint",
    img: getDestImg("west-sikkim", "pelling"),
    stats: { alt: "7,200 ft", temp: "5°C – 25°C", best: "Sep–May" },
    overview:
      "Famous for offering the closest and most breathtaking views of the Kanchenjunga massif. Pelling is a hub of history, ancient ruins, and India’s first glass skywalk. It connects history, nature, and adrenaline in one destination.",
    attractions: [
      { name: "Skywalk", type: "Glass Bridge", img: getAttrImg("west-sikkim", "pelling", "skywalk"), desc: "Glass bridge with giant Chenrezig statue." },
      { name: "Rabdentse Ruins", type: "Historic Site", img: getAttrImg("west-sikkim", "pelling", "rabdentse-ruins"), desc: "Ruins of the second capital of Sikkim." },
      { name: "Khecheopalri Lake", type: "Sacred Lake", img: getAttrImg("west-sikkim", "pelling", "khecheopalri-lake"), desc: "Wish-fulfilling lake hidden in forest." },
      { name: "Pemayangtse", type: "Monastery", img: getAttrImg("west-sikkim", "pelling", "pemayangtse-monastery"), desc: "Premier monastery of West Sikkim." }
    ],
    thingsToDo: [
      { text: "Skywalk", detail: "Walk on glass.", icon: <FaCamera /> },
      { text: "Heritage Walk", detail: "Walk to the ruins.", icon: <FaHistory /> }
    ],
    howToReach: { road: "5 hrs from Siliguri/Gangtok." }
  },
  {
    id: "uttarey",
    name: "Uttarey",
    region: "West Sikkim",
    tagline: "The Last Village",
    img: getDestImg("west-sikkim", "uttarey"),
    stats: { alt: "6,600 ft", temp: "5°C – 20°C", best: "Mar–Jun" },
    overview:
      "A quiet village located at the Nepal border, serving as the base for the Singalila Range trek. It offers a serene retreat amidst nature and is close to the Singshore Bridge.",
    attractions: [
      { name: "Singshore Bridge", type: "Bridge", img: getAttrImg("west-sikkim", "uttarey", "singshore-bridge"), desc: "Asia's second highest suspension bridge." },
      { name: "Mainebass Falls", type: "Waterfall", img: getAttrImg("west-sikkim", "uttarey", "mainebass-falls"), desc: "Hidden waterfall in the forest." }
    ],
    thingsToDo: [
      { text: "Trekking", detail: "Short hikes to border.", icon: <FaHiking /> },
      { text: "Village Stay", detail: "Relax in nature.", icon: <FaLeaf /> }
    ],
    howToReach: { road: "1 hr from Pelling." }
  },

  // ======================= SOUTH SIKKIM =======================
  {
    id: "namchi",
    name: "Namchi",
    region: "South Sikkim",
    tagline: "Spiritual Capital",
    img: getDestImg("south-sikkim", "namchi"),
    stats: { alt: "4,300 ft", temp: "8°C – 28°C", best: "All Year" },
    overview:
      "The cultural and religious heart of South Sikkim. Famous for its gigantic statues that dominate the skyline, including the world’s largest statue of Padmasambhava at Samdruptse.",
    attractions: [
      { name: "Char Dham", type: "Temple Complex", img: getAttrImg("south-sikkim", "namchi", "char-dham"), desc: "Replica of 4 holy shrines on Solophok hill." },
      { name: "Samdruptse", type: "Statue", img: getAttrImg("south-sikkim", "namchi", "samdruptse"), desc: "Gigantic statue of Guru Rinpoche." },
      { name: "Temi Tea Garden", type: "Tea Estate", img: getAttrImg("south-sikkim", "namchi", "temi-tea-garden"), desc: "Only tea garden in Sikkim." }
    ],
    thingsToDo: [
      { text: "Pilgrimage", detail: "Visit the shrines.", icon: <FaPrayingHands /> },
      { text: "Sightseeing", detail: "Ropeway ride.", icon: <FaCamera /> }
    ],
    howToReach: { road: "3 hrs from Siliguri." }
  },
  {
    id: "ravangla",
    name: "Ravangla",
    region: "South Sikkim",
    tagline: "Buddha Park Town",
    img: getDestImg("south-sikkim", "ravangla"),
    stats: { alt: "7,000 ft", temp: "5°C – 20°C", best: "Mar–Jun" },
    overview:
      "A peaceful hill town situated between Maenam and Tendong Hill. It is famous for the massive golden Buddha Park and as a birdwatcher’s paradise.",
    attractions: [
      { name: "Buddha Park", type: "Iconic Statue", img: getAttrImg("south-sikkim", "ravangla", "buddha-park"), desc: "130ft Buddha statue in an eco-park." },
      { name: "Ralang Monastery", type: "Monastery", img: getAttrImg("south-sikkim", "ravangla", "ralang-monastery"), desc: "Authentic Tibetan architecture." }
    ],
    thingsToDo: [
      { text: "Meditation", detail: "Inside the Buddha statue.", icon: <FaStar /> },
      { text: "Nature Walk", detail: "Bird watching trails.", icon: <FaHiking /> }
    ],
    howToReach: { road: "2.5 hrs from Namchi." }
  },

  // ======================= DARJEELING =======================
  {
    id: "darjeeling",
    name: "Darjeeling",
    region: "Darjeeling",
    tagline: "Queen of the Hills",
    img: getDestImg("darjeeling", "darjeeling"),
    stats: { alt: "6,700 ft", temp: "2°C – 20°C", best: "Oct–Jun" },
    overview:
      "The quintessential hill station known for its colonial charm, world-class tea, and the UNESCO heritage Toy Train. It offers panoramic views of Mt. Everest and Kanchenjunga.",
    attractions: [
      { name: "Tiger Hill", type: "Sunrise View", img: getAttrImg("darjeeling", "darjeeling", "tiger-hill"), desc: "Famous sunrise over Mt. Everest & Kanchenjunga." },
      { name: "Batasia Loop", type: "Heritage", img: getAttrImg("darjeeling", "darjeeling", "batasia-loop"), desc: "Spiral railway loop with War Memorial." },
      { name: "Himalayan Zoo", type: "Wildlife", img: getAttrImg("darjeeling", "darjeeling", "himalayan-zoo"), desc: "Home to Red Panda and Snow Leopard." },
      { name: "Happy Valley Tea", type: "Tea Garden", img: getAttrImg("darjeeling", "darjeeling", "happy-valley-tea"), desc: "Historic tea estate walk." }
    ],
    thingsToDo: [
      { text: "Toy Train Ride", detail: "UNESCO World Heritage ride.", icon: <FaTrain /> },
      { text: "Mall Road", detail: "Shopping & Dining.", icon: <FaShoppingBag /> },
      { text: "Tea Tasting", detail: "Sip authentic Darjeeling tea.", icon: <FaCoffee /> }
    ],
    howToReach: {
      air: "Bagdogra (65 km)",
      rail: "NJP (70 km)",
      road: "3 hrs from Siliguri via Rohini"
    }
  }
];