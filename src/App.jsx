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
import BookingStatus from "./pages/BookingStatus";
import AllReviews from "./pages/AllReviews";
import Destinations from "./pages/Destinations";
import About from "./pages/About"; // <--- 1. Import the component

export default function App() {
  return (
    <BrowserRouter>
      {/* SmoothScroll must be INSIDE BrowserRouter because it uses useLocation */}
      <SmoothScroll>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> {/* <--- 2. Add the Route */}
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetailsPage />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/status" element={<BookingStatus />} />
          <Route path="/reviews" element={<AllReviews />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
        </Routes>
        <Footer />
      </SmoothScroll>
    </BrowserRouter>
  );
}