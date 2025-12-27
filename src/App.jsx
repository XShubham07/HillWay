import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import ChristmasPopup from "./components/ChristmasPopup";

import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetailsPage from "./pages/TourDetailsPage";
import Blogs from "./pages/Blogs";
import BlogsPost from "./pages/BlogsPost";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AgentDashboard from "./pages/AgentDashboard";
import BookingStatus from "./pages/BookingStatus";
import AllReviews from "./pages/AllReviews";
import Destinations from "./pages/Destinations";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import Policy from "./pages/Policy"

// Popup wrapper - shows once per session on any page
function PromoPopupWrapper() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenPromoPopup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("hasSeenPromoPopup", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return <ChristmasPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />;
}

export default function App() {
  const [showLaunch, setShowLaunch] = useState(true);

  return (
    <BrowserRouter>
      <SmoothScroll>
        <Navbar />
        <PromoPopupWrapper />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetailsPage />} />
          <Route path="/destinations" element={<Destinations />} />

          {/* Blogs Routes */}
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogsPost />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/status" element={<BookingStatus />} />
          <Route path="/reviews" element={<AllReviews />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy-policy" element={<Policy />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
        </Routes>
        <Footer />
      </SmoothScroll>
    </BrowserRouter>
  );
}