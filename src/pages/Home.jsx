// src/pages/Home.jsx

import { useNavigate } from "react-router-dom"; 
import Hero from "../components/Hero";
import PackageGrid from "../components/PackageGrid";
import ReviewsCarousel from "../components/ReviewsCarousel";
import FAQ from "../components/FAQ";
import Features from "../components/Features";
import { tourData } from "../data/mockTours"; // <-- Import full data

export default function Home(){
  const navigate = useNavigate(); 

  // Featured packages ko mockTours se nikal rahe hain
  // Hum pehle teen packages ko featured bana rahe hain
  const featured = tourData.slice(0, 3).map(tour => ({
    id: tour.id,
    title: tour.title.split(' - ')[0], // Title ko chota kar diya
    subtitle: tour.subtitle,
    basePrice: tour.basePrice,
    img: tour.img
  }));
  
  function onView(p){ 
    navigate(`/tours/${p.id}`); // Correct navigation
  }

  // ... (rest of the component is same as before) ...
  return (
    <>
      <Hero />
      
      {/* Features Section from previous step */}
      <Features />

      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[var(--dark)]">Trending Packages</h2>
            <p className="text-gray-600 mt-1">Most loved trips by our travelers</p>
          </div>
          <button 
            onClick={() => navigate('/tours')}
            className="hidden md:block text-[var(--p1)] font-semibold hover:underline"
          >
            View All Tours →
          </button>
        </div>
        {/* Updated list prop to use the new featured data */}
        <PackageGrid list={featured} onView={onView} /> 
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-20">
        <h2 className="text-3xl font-bold mb-6 text-center text-[var(--dark)]">Traveler Stories</h2>
        <ReviewsCarousel />
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-20 mb-24">
        <h2 className="text-3xl font-bold mb-6 text-center text-[var(--dark)]">Common Questions</h2>
        <FAQ />
      </section>
    </>
  );
}