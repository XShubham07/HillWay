import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";

import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetailsPage from "./pages/TourDetailsPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AgentDashboard from "./pages/AgentDashboard";
import BookingStatus from "./pages/BookingStatus";
import AllReviews from "./pages/AllReviews";
import Destinations from "./pages/Destinations";
import About from "./pages/About";
import Terms from "./pages/Terms";

export default function App() {
  return (
    <BrowserRouter>
      {/* SmoothScroll must be INSIDE BrowserRouter because it uses useLocation */}
      <SmoothScroll>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetailsPage />} />
          <Route path="/destinations" element={<Destinations />} />
          
          {/* Blog Routes */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          
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