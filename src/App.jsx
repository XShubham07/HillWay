import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll"; 

import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetailsPage from "./pages/TourDetailsPage";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Packages from "./pages/Packages";
import Login from "./pages/Login"; 
import AgentDashboard from "./pages/AgentDashboard"; 
import BookingStatus from "./pages/BookingStatus"; // <-- Import

export default function App() {
  return (
    <SmoothScroll> 
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetailsPage />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* New Status Route */}
          <Route path="/status" element={<BookingStatus />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </SmoothScroll>
  );
}